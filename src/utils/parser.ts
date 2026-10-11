import { Question } from '../types';

/**
 * Checks if a string contains Hindi (Devanagari) characters
 */
function containsHindi(str: string): boolean {
  return /[\u0900-\u097F]/.test(str);
}

/**
 * Accurately splits an inline slash ' / ' into English and Hindi parts,
 * regardless of whether Hindi or English comes first.
 */
function splitBilingualSlash(str: string): { english: string; hindi: string } {
  if (!str.includes(' / ')) {
    if (containsHindi(str)) {
      return { english: '', hindi: str.trim() };
    }
    return { english: str.trim(), hindi: '' };
  }
  const parts = str.split(' / ');
  const part1 = parts[0].trim();
  const part2 = parts.slice(1).join(' / ').trim();

  const devanagariCount1 = (part1.match(/[\u0900-\u097F]/g) || []).length;
  const devanagariCount2 = (part2.match(/[\u0900-\u097F]/g) || []).length;

  // If part1 has more Hindi than part2
  if (devanagariCount1 > devanagariCount2) {
    return { english: part2, hindi: part1 };
  } else if (devanagariCount2 > devanagariCount1) {
    return { english: part1, hindi: part2 };
  } else {
    // If neither or both equal, default: if part1 has any Hindi
    if (containsHindi(part1)) {
      return { english: part2, hindi: part1 };
    }
    return { english: part1, hindi: part2 };
  }
}

/**
 * Parses raw pasted MCQ questions with FULL BILINGUAL (Hindi + English) support
 * Supported formats:
 * 1) Separate tag format:
 *    Q1: What is ... ?
 *    Q1_Hindi: ... क्या है?
 *    A) Option A
 *    A_Hindi: विकल्प क
 *    B) Option B
 *    B_Hindi: विकल्प ख
 *    ...
 *    Ans: B
 *    Explanation: ...
 *    Explanation_Hindi: ...
 * 
 * 2) Inline slash format:
 *    Q1: What is ... ? / ... क्या है?
 *    A) Option A / विकल्प क
 *    ...
 * 
 * 3) Devanagari / Hindi tags (प्रश्न, उत्तर, व्याख्या):
 *    प्रश्न 1: ...
 *    उत्तर: B
 *    व्याख्या: ...
 */
export function parsePastedMcqs(text: string): { questions: Question[]; errors: string[] } {
  const questions: Question[] = [];
  const errors: string[] = [];

  // Split into blocks by double newline or Question delimiter
  const rawBlocks = text.split(/(?=\n\s*(?:Q(?:uestion)?\s*\d*[\.:\-]|(?:प्रश्न\s*\d*[\.:\-])|(?:\d+[\.:\)]\s*)))/i)
    .map(b => b.trim())
    .filter(Boolean);

  rawBlocks.forEach((block, index) => {
    try {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return;

      let questionText = '';
      let questionTextHindi = '';
      const options: string[] = [];
      const optionsHindi: string[] = [];
      let correctOptionIndex = 0;
      let explanation = '';
      let explanationHindi = '';
      let topic = 'General';
      let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';

      let collectingExplanation = false;
      let collectingHindiExplanation = false;
      const expEnglishLines: string[] = [];
      const expHindiLines: string[] = [];

      for (const line of lines) {
        // 1. Check for Ans / Answer / Correct / उत्तर
        const ansMatch = line.match(/^(?:Ans(?:wer)?|Correct(?:\s*Option)?|Right(?:\s*Option)?|उत्तर|सही\s*उत्तर)\s*[:=\-]\s*([A-Da-d1-4कखगघ])/i);
        if (ansMatch) {
          collectingExplanation = false;
          collectingHindiExplanation = false;
          const letter = ansMatch[1].toUpperCase();
          if (letter === 'A' || letter === '1' || letter === 'क') correctOptionIndex = 0;
          else if (letter === 'B' || letter === '2' || letter === 'ख') correctOptionIndex = 1;
          else if (letter === 'C' || letter === '3' || letter === 'ग') correctOptionIndex = 2;
          else if (letter === 'D' || letter === '4' || letter === 'घ') correctOptionIndex = 3;
          continue;
        }

        // 2. Check for Hindi Explanation tag (Explanation_Hindi / व्याख्या / Exp_Hindi)
        const expHindiMatch = line.match(/^(?:Exp(?:lanation)?_Hindi|Hindi_Exp(?:lanation)?|व्याख्या|समाधान)\s*[:=\-]\s*(.*)/i);
        if (expHindiMatch) {
          collectingExplanation = false;
          collectingHindiExplanation = true;
          if (expHindiMatch[1].trim()) expHindiLines.push(expHindiMatch[1].trim());
          continue;
        }

        // 3. Check for English/Bilingual Explanation tag (Sol:, Solution:, Exp:, Explanation:)
        const expMatch = line.match(/^(?:Exp(?:lanation)?|Sol(?:ution)?|Notes?)\s*[:=\-]\s*(.*)/i);
        if (expMatch) {
          collectingHindiExplanation = false;
          collectingExplanation = true;
          const expContent = expMatch[1].trim();
          if (expContent) {
            const split = splitBilingualSlash(expContent);
            if (split.english) expEnglishLines.push(split.english);
            if (split.hindi) expHindiLines.push(split.hindi);
          }
          continue;
        }

        // 4. Check for Topic / Difficulty tag
        const topicMatch = line.match(/^Topic\s*[:=\-]\s*(.*)/i);
        if (topicMatch) {
          topic = topicMatch[1].trim();
          continue;
        }

        // If in explanation collection mode (e.g. bullet points under Sol:)
        if (collectingHindiExplanation) {
          expHindiLines.push(line);
          continue;
        }
        if (collectingExplanation) {
          if (line.includes(' / ')) {
            // Bullet or multi-line bilingual point under Sol
            const split = splitBilingualSlash(line);
            if (split.english) expEnglishLines.push(split.english);
            if (split.hindi) expHindiLines.push(split.hindi);
          } else if (containsHindi(line) && !line.match(/^[A-Za-z]/)) {
            expHindiLines.push(line);
          } else {
            expEnglishLines.push(line);
          }
          continue;
        }

        // 5. Check for Option Hindi tags (A_Hindi: ... or A (Hindi): ...)
        const optHindiMatch = line.match(/^(?:([A-Da-d])(?:_Hindi|\s*\(Hindi\)|\s*\(हिन्दी\))|[कखगघ][\.\)])\s*[:=\-]?\s*(.+)/i);
        if (optHindiMatch) {
          const letter = (optHindiMatch[1] || '').toUpperCase();
          const val = optHindiMatch[2].trim();
          let optIdx = -1;
          if (letter === 'A' || line.startsWith('क')) optIdx = 0;
          else if (letter === 'B' || line.startsWith('ख')) optIdx = 1;
          else if (letter === 'C' || line.startsWith('ग')) optIdx = 2;
          else if (letter === 'D' || line.startsWith('घ')) optIdx = 3;

          if (optIdx >= 0) {
            optionsHindi[optIdx] = val;
          }
          continue;
        }

        // 6. Check for standard Option: A) ... B) ... C) ... D)
        const optMatch = line.match(/^(?:([A-Da-d])[\\.\)]|[1-4][\\.\)])\s*(.+)/);
        if (optMatch && options.length < 4) {
          const rawOpt = optMatch[2].trim();
          // Check inline slash format: "Option English / विकल्प हिन्दी" OR "विकल्प हिन्दी / Option English"
          if (rawOpt.includes(' / ')) {
            const split = splitBilingualSlash(rawOpt);
            options.push(split.english || split.hindi);
            if (split.hindi) {
              optionsHindi.push(split.hindi);
            }
          } else {
            options.push(rawOpt);
          }
          continue;
        }

        // 7. Check for Hindi Question Tag (Q_Hindi:, Question_Hindi:, प्रश्न:, हिन्दी:)
        const qHindiMatch = line.match(/^(?:Q(?:uestion)?\s*\d*_Hindi|Hindi|हिन्दी|प्रश्न(?:\s*\d*)?)\s*[:=\-]\s*(.*)/i);
        if (qHindiMatch) {
          const content = qHindiMatch[1].trim();
          questionTextHindi = questionTextHindi ? `${questionTextHindi} ${content}` : content;
          continue;
        }

        // 8. Otherwise, Question Text lines (English / Bilingual)
        if (options.length === 0) {
          const cleanQ = line.replace(/^(?:Q(?:uestion)?\s*\d*[\.:\-]?|\d+[\.:\)])\s*/i, '').trim();
          if (cleanQ) {
            // Check inline slash format in question: "English question / हिन्दी प्रश्न" or "हिन्दी प्रश्न / English question"
            if (cleanQ.includes(' / ')) {
              const split = splitBilingualSlash(cleanQ);
              questionText = questionText ? `${questionText} ${split.english}` : split.english;
              questionTextHindi = questionTextHindi ? `${questionTextHindi} ${split.hindi}` : split.hindi;
            } else if (containsHindi(cleanQ) && questionText) {
              // Hindi translation line right below English question
              questionTextHindi = questionTextHindi ? `${questionTextHindi} ${cleanQ}` : cleanQ;
            } else {
              questionText = questionText ? `${questionText} ${cleanQ}` : cleanQ;
            }
          }
        }
      }

      explanation = expEnglishLines.join('\n').trim();
      explanationHindi = expHindiLines.join('\n').trim();

      if (!explanation && !explanationHindi) {
        explanation = `The correct answer is Option ${String.fromCharCode(65 + correctOptionIndex)}.`;
        explanationHindi = `सही उत्तर विकल्प ${String.fromCharCode(65 + correctOptionIndex)} है।`;
      } else if (!explanation && explanationHindi) {
        explanation = `Option ${String.fromCharCode(65 + correctOptionIndex)}: ${explanationHindi}`;
      } else if (explanation && !explanationHindi) {
        explanationHindi = `सही उत्तर: विकल्प ${String.fromCharCode(65 + correctOptionIndex)}`;
      }

      if (questionText && options.length >= 2) {
        while (options.length < 4) {
          options.push(`Option ${String.fromCharCode(65 + options.length)}`);
        }

        // Fill optionsHindi if partial
        const finalOptionsHindi = optionsHindi.length > 0 ? [...optionsHindi] : undefined;
        if (finalOptionsHindi) {
          while (finalOptionsHindi.length < 4) {
            finalOptionsHindi.push(options[finalOptionsHindi.length] || `विकल्प ${String.fromCharCode(65 + finalOptionsHindi.length)}`);
          }
        }

        questions.push({
          id: `q-pasted-${Date.now()}-${index + 1}`,
          questionNumber: index + 1,
          questionText,
          questionTextHindi: questionTextHindi || undefined,
          options: options.slice(0, 4),
          optionsHindi: finalOptionsHindi ? finalOptionsHindi.slice(0, 4) : undefined,
          correctOptionIndex,
          explanation,
          explanationHindi: explanationHindi || undefined,
          topic,
          difficulty
        });
      } else {
        errors.push(`Block ${index + 1}: Could not find question statement and at least 2 options.`);
      }
    } catch (e: any) {
      errors.push(`Block ${index + 1} parse error: ${e.message}`);
    }
  });

  return { questions, errors };
}

/**
 * Standard CSV Line Parser handling quotes and commas
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parse CSV file text into Questions array with full Bilingual support
 */
export function parseCsvQuestions(csvText: string): { questions: Question[]; errors: string[] } {
  const questions: Question[] = [];
  const errors: string[] = [];

  const rawLines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (rawLines.length < 2) {
    return { questions: [], errors: ['CSV file is empty or does not have at least one data row.'] };
  }

  // Parse header
  const header = parseCsvLine(rawLines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  
  // Find column indices
  const qIdx = header.findIndex(h => h.includes('question') && !h.includes('hindi'));
  const qHindiIdx = header.findIndex(h => h.includes('question') && h.includes('hindi') || h === 'prashna' || h === 'hindi');

  const optAIdx = header.findIndex(h => (h === 'optiona' || h === 'opta' || h === 'a') && !h.includes('hindi'));
  const optAHindiIdx = header.findIndex(h => (h.includes('optiona') || h.includes('opta') || h === 'ahindi' || h === 'option1hindi') && h.includes('hindi'));

  const optBIdx = header.findIndex(h => (h === 'optionb' || h === 'optb' || h === 'b') && !h.includes('hindi'));
  const optBHindiIdx = header.findIndex(h => (h.includes('optionb') || h.includes('optb') || h === 'bhindi' || h === 'option2hindi') && h.includes('hindi'));

  const optCIdx = header.findIndex(h => (h === 'optionc' || h === 'optc' || h === 'c') && !h.includes('hindi'));
  const optCHindiIdx = header.findIndex(h => (h.includes('optionc') || h.includes('optc') || h === 'chindi' || h === 'option3hindi') && h.includes('hindi'));

  const optDIdx = header.findIndex(h => (h === 'optiond' || h === 'optd' || h === 'd') && !h.includes('hindi'));
  const optDHindiIdx = header.findIndex(h => (h.includes('optiond') || h.includes('optd') || h === 'dhindi' || h === 'option4hindi') && h.includes('hindi'));

  const ansIdx = header.findIndex(h => h.includes('correct') || h.includes('ans') || h === 'answer' || h === 'uttar');
  const expIdx = header.findIndex(h => (h.includes('explanation') || h.includes('solution')) && !h.includes('hindi'));
  const expHindiIdx = header.findIndex(h => (h.includes('explanation') || h.includes('solution') || h === 'vyakhya') && h.includes('hindi'));

  const topicIdx = header.findIndex(h => h.includes('topic') || h.includes('subject'));
  const diffIdx = header.findIndex(h => h.includes('difficulty') || h.includes('level'));

  for (let i = 1; i < rawLines.length; i++) {
    const row = parseCsvLine(rawLines[i]);
    if (row.length < 5) continue;

    const qText = qIdx !== -1 ? row[qIdx] : row[0];
    const qHindi = qHindiIdx !== -1 ? row[qHindiIdx] : undefined;

    const optA = optAIdx !== -1 ? row[optAIdx] : row[1];
    const optAHindi = optAHindiIdx !== -1 ? row[optAHindiIdx] : undefined;

    const optB = optBIdx !== -1 ? row[optBIdx] : row[2];
    const optBHindi = optBHindiIdx !== -1 ? row[optBHindiIdx] : undefined;

    const optC = optCIdx !== -1 ? row[optCIdx] : row[3];
    const optCHindi = optCHindiIdx !== -1 ? row[optCHindiIdx] : undefined;

    const optD = optDIdx !== -1 ? row[optDIdx] : row[4];
    const optDHindi = optDHindiIdx !== -1 ? row[optDHindiIdx] : undefined;

    const ansVal = ansIdx !== -1 ? row[ansIdx] : (row[5] || 'A');
    const exp = expIdx !== -1 ? row[expIdx] : (row[6] || '');
    const expHindi = expHindiIdx !== -1 ? row[expHindiIdx] : undefined;

    const topic = topicIdx !== -1 ? row[topicIdx] : 'General';
    const diff = (diffIdx !== -1 ? row[diffIdx] : 'Medium') as 'Easy' | 'Medium' | 'Hard';

    let correctIndex = 0;
    const cleanAns = ansVal.trim().toUpperCase();
    if (cleanAns === 'B' || cleanAns === '2' || cleanAns === 'ख') correctIndex = 1;
    else if (cleanAns === 'C' || cleanAns === '3' || cleanAns === 'ग') correctIndex = 2;
    else if (cleanAns === 'D' || cleanAns === '4' || cleanAns === 'घ') correctIndex = 3;

    if (!qText || !optA || !optB) {
      errors.push(`Row ${i + 1}: Missing question text or options.`);
      continue;
    }

    const optionsHindiList = (optAHindi || optBHindi) 
      ? [optAHindi || optA, optBHindi || optB, optCHindi || optC || '', optDHindi || optD || '']
      : undefined;

    questions.push({
      id: `q-csv-${Date.now()}-${i}`,
      questionNumber: i,
      questionText: qText,
      questionTextHindi: qHindi,
      options: [optA || 'Option A', optB || 'Option B', optC || 'Option C', optD || 'Option D'],
      optionsHindi: optionsHindiList,
      correctOptionIndex: correctIndex,
      explanation: exp || `The correct answer is Option ${String.fromCharCode(65 + correctIndex)}.`,
      explanationHindi: expHindi,
      topic: topic || 'General',
      difficulty: diff || 'Medium'
    });
  }

  return { questions, errors };
}
