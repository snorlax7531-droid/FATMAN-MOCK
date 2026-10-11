import { TestModel, Question } from '../types';

export const INITIAL_TESTS: (TestModel & { questions: Question[] })[] = [
  {
    id: 'test-history-ancient-01',
    title: 'Ancient India - Indus Valley & Vedic Period Mock 01',
    subject: 'History',
    chapter: 'Ancient India',
    category: 'chapter_wise',
    dayNumber: 1,
    durationMinutes: 15,
    totalMarks: 20,
    positiveMarks: 2,
    negativeMarks: 0.5,
    questionCount: 10,
    instructions: 'Each question carries 2 marks. 0.5 negative marks for each wrong answer. Language can be toggled between English and Hindi during the test.',
    createdAt: '2026-03-01T10:00:00Z',
    questions: [
      {
        id: 'q1',
        questionNumber: 1,
        questionText: 'The Great Bath of the Indus Valley Civilization was discovered at which of the following sites?',
        questionTextHindi: 'सिंधु घाटी सभ्यता का विशाल स्नानागार निम्नलिखित में से किस स्थल पर खोजा गया था?',
        options: ['Harappa', 'Mohenjo-daro', 'Kalibangan', 'Lothal'],
        optionsHindi: ['हड़प्पा', 'मोहनजोदड़ो', 'कालीबंगा', 'लोथल'],
        correctOptionIndex: 1,
        explanation: 'Mohenjo-daro (Mound of the Dead) in Sindh, Pakistan, contains the Great Bath, an imposing rectangular structure lined with finely fitted bricks set in bitumen gypsum mortar.',
        explanationHindi: 'सिंध, पाकिस्तान में मोहनजोदड़ो में विशाल स्नानागार स्थित है, जो जिप्सम और बिटुमेन से जलरोधी बनाई गई ईंटों की संरचना है।',
        topic: 'Indus Valley Civilization',
        difficulty: 'Easy'
      },
      {
        id: 'q2',
        questionNumber: 2,
        questionText: 'Which Indus Valley site is famous for having an artificial dockyard connected to the Sabarmati river?',
        questionTextHindi: 'कौन सा सिंधु स्थल साबरमती नदी से जुड़े कृत्रिम डॉकयार्ड (गोदीबाड़ा) के लिए प्रसिद्ध है?',
        options: ['Dholavira', 'Lothal', 'Surkotada', 'Rakhigarhi'],
        optionsHindi: ['धौलावीरा', 'लोथल', 'सुरकोटदा', 'राखीगढ़ी'],
        correctOptionIndex: 1,
        explanation: 'Lothal in Gujarat was a prominent port city with a massive tidal dockyard facilitating maritime trade with Mesopotamia.',
        explanationHindi: 'गुजरात में लोथल एक प्रमुख बंदरगाह शहर था जिसमें मेसोपोटामिया के साथ समुद्री व्यापार की सुविधा वाला विशाल गोदीबाड़ा था।',
        topic: 'Indus Valley Civilization',
        difficulty: 'Easy'
      },
      {
        id: 'q3',
        questionNumber: 3,
        questionText: 'The famous "Gayatri Mantra" is dedicated to which Vedic deity and found in which Mandala of Rigveda?',
        questionTextHindi: 'प्रसिद्ध "गायत्री मंत्र" किस वैदिक देवता को समर्पित है और ऋग्वेद के किस मंडल में मिलता है?',
        options: ['Indra, Mandala 2', 'Savitr, Mandala 3', 'Varuna, Mandala 7', 'Agni, Mandala 9'],
        optionsHindi: ['इंद्र, द्वितीय मंडल', 'सवितृ (सूर्य), तृतीय मंडल', 'वरुण, सप्तम मंडल', 'अग्नि, नवम मंडल'],
        correctOptionIndex: 1,
        explanation: 'Gayatri Mantra was composed by Sage Vishvamitra and is addressed to the solar deity Savitr. It is found in Rigveda Mandala 3.',
        explanationHindi: 'गायत्री मंत्र की रचना ऋषि विश्वामित्र ने की थी और यह सवितृ देवता को समर्पित है। यह ऋग्वेद के तीसरे मंडल में है।',
        topic: 'Vedic Age',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        questionNumber: 4,
        questionText: 'Which Rigvedic river is identified with the modern day river Ravi?',
        questionTextHindi: 'ऋग्वैदिक नदी "परुष्णी" की पहचान आधुनिक समय की किस नदी से की जाती है?',
        options: ['Jhelum (Vitasta)', 'Chenab (Asikni)', 'Ravi (Parushni)', 'Beas (Vipasa)'],
        optionsHindi: ['झेलम (वितस्ता)', 'चिनाब (असिकनी)', 'रावी (परुष्णी)', 'ब्यास (विपाशा)'],
        correctOptionIndex: 2,
        explanation: 'The Battle of Ten Kings (Dasrajan War) mentioned in Rigveda Mandala 7 was fought on the banks of river Parushni (modern Ravi).',
        explanationHindi: 'दशराज्ञ युद्ध ऋग्वेद के 7वें मंडल के अनुसार परुष्णी (रावी) नदी के तट पर लड़ा गया था।',
        topic: 'Vedic Age',
        difficulty: 'Medium'
      },
      {
        id: 'q5',
        questionNumber: 5,
        questionText: 'Which site is known for having a unique tripartite division of city and an advanced water harvesting system?',
        questionTextHindi: 'कौन सा हड़प्पा स्थल नगर के त्रिस्तरीय विभाजन और उन्नत जल संचयन प्रणाली के लिए जाना जाता है?',
        options: ['Banawali', 'Dholavira', 'Chanhudaro', 'Alamgirpur'],
        optionsHindi: ['बनावली', 'धौलावीरा', 'चन्हुदड़ो', 'आलमगीरपुर'],
        correctOptionIndex: 1,
        explanation: 'Dholavira in the Rann of Kutch (UNESCO World Heritage Site) is divided into Citadel, Middle Town, and Lower Town, with remarkable water reservoirs.',
        explanationHindi: 'कच्छ के रण में स्थित धौलावीरा तीन भागों (दुर्ग, मध्यम नगर, निचला नगर) में विभाजित था और उत्कृष्ट जल संचयन जलाशयों के लिए प्रसिद्ध है।',
        topic: 'Indus Valley Civilization',
        difficulty: 'Medium'
      },
      {
        id: 'q6',
        questionNumber: 6,
        questionText: 'Which Harappan site provided the earliest evidence of ploughed agricultural fields?',
        questionTextHindi: 'किस हड़प्पा स्थल से जुते हुए खेतों का प्राचीनतम साक्ष्य प्राप्त हुआ है?',
        options: ['Kalibangan', 'Ropar', 'Kot Diji', 'Sutkagan Dor'],
        optionsHindi: ['कालीबंगा', 'रोपड़', 'कोट दीजी', 'सुत्कागेनदोर'],
        correctOptionIndex: 0,
        explanation: 'Kalibangan (Rajasthan) on the Ghaggar river yielded furrowed ploughed fields and fire altars (Havan Kundas).',
        explanationHindi: 'कालीबंगा (राजस्थान) में घग्घर नदी के किनारे जुते हुए खेत तथा अग्निकुंड के प्रमाण मिले हैं।',
        topic: 'Indus Valley Civilization',
        difficulty: 'Easy'
      },
      {
        id: 'q7',
        questionNumber: 7,
        questionText: 'In Vedic society, what was the term used for the head of a family (household)?',
        questionTextHindi: 'वैदिक समाज में परिवार (गृह) के मुखिया के लिए किस शब्द का प्रयोग किया जाता था?',
        options: ['Gramani', 'Kulapa / Grihapati', 'Senani', 'Vrajapati'],
        optionsHindi: ['ग्रामणी', 'कुलप / गृहपति', 'सेनानी', 'व्राजपति'],
        correctOptionIndex: 1,
        explanation: 'Kulapa was the eldest male head of the Kula (family), exercising patriarchal authority.',
        explanationHindi: 'कुलप अथवा गृहपति कुल (परिवार) का मुखिया होता था।',
        topic: 'Vedic Society',
        difficulty: 'Medium'
      },
      {
        id: 'q8',
        questionNumber: 8,
        questionText: 'The Upanishads are primarily concerned with which aspect of ancient Indian thought?',
        questionTextHindi: 'उपनिषद मुख्य रूप से प्राचीन भारतीय विचार के किस पहलू से संबंधित हैं?',
        options: ['Religious rituals & sacrifices', 'Philosophy and Metaphysics', 'Warfare strategies', 'Astronomy and Medicine'],
        optionsHindi: ['धार्मिक अनुष्ठान और यज्ञ', 'दर्शन और तत्वमीमांसा (वेदांत)', 'युद्ध रणनीतियाँ', 'खगोलशास्त्र और चिकित्सा'],
        correctOptionIndex: 1,
        explanation: 'The Upanishads, also called Vedanta (end of Vedas), focus on philosophical inquiry into Brahman (ultimate reality) and Atman (individual self).',
        explanationHindi: 'उपनिषद (वेदांत) ब्रह्म और आत्मा की दार्शनिक मीमांसा पर केंद्रित हैं।',
        topic: 'Vedic Literature',
        difficulty: 'Easy'
      },
      {
        id: 'q9',
        questionNumber: 9,
        questionText: 'The famous bronze statue of the "Dancing Girl" was discovered in:',
        questionTextHindi: 'प्रसिद्ध कांस्य "नर्तकी की मूर्ति" किस स्थल से प्राप्त हुई थी?',
        options: ['Harappa', 'Mohenjo-daro', 'Lothal', 'Banawali'],
        optionsHindi: ['हड़प्पा', 'मोहनजोदड़ो', 'लोथल', 'बनावली'],
        correctOptionIndex: 1,
        explanation: 'The Dancing Girl is a prehistoric bronze sculpture made using the lost-wax casting technique (cire perdue), excavated in Mohenjo-daro.',
        explanationHindi: 'मोम-सांचा (Lost-wax) तकनीक से बनी नर्तकी की कांस्य प्रतिमा मोहनजोदड़ो से मिली थी।',
        topic: 'Indus Valley Art',
        difficulty: 'Easy'
      },
      {
        id: 'q10',
        questionNumber: 10,
        questionText: 'Which Brahmana text describes the famous story of King Videha Madhava travelling eastward across the Sadanira river?',
        questionTextHindi: 'किस ब्राह्मण ग्रंथ में राजा विदेह माधव के सदानीरा (गंडक) नदी के पार पूर्व दिशा में जाने की कथा मिलती है?',
        options: ['Aitareya Brahmana', 'Shatapatha Brahmana', 'Taittiriya Brahmana', 'Gopatha Brahmana'],
        optionsHindi: ['ऐतरेय ब्राह्मण', 'शतपथ ब्राह्मण', 'तैत्तिरीय ब्राह्मण', 'गोपथ ब्राह्मण'],
        correctOptionIndex: 1,
        explanation: 'Shatapatha Brahmana of the Shukla Yajurveda recounts the eastward Aryanization story of Videha Madhava accompanied by Rishi Gautama Rahugana.',
        explanationHindi: 'शतपथ ब्राह्मण में विदेह माधव और ऋषि गौतम राहुगण द्वारा आर्य संस्कृति के पूर्व दिशा में प्रसार का वर्णन है।',
        topic: 'Vedic Literature',
        difficulty: 'Hard'
      }
    ]
  },
  {
    id: 'test-polity-preamble-01',
    title: 'Indian Polity - Preamble & Constitutional Framework Mock',
    subject: 'Polity',
    chapter: 'Indian Polity',
    category: 'subject_wise',
    dayNumber: 2,
    durationMinutes: 15,
    totalMarks: 20,
    positiveMarks: 2,
    negativeMarks: 0.5,
    questionCount: 8,
    instructions: 'Timed test on Constitution of India. 2 marks per question with 0.5 negative mark.',
    createdAt: '2026-03-02T10:00:00Z',
    questions: [
      {
        id: 'qp1',
        questionNumber: 1,
        questionText: 'Which Constitutional Amendment Act added the terms "Socialist", "Secular", and "Integrity" to the Preamble of India?',
        questionTextHindi: 'किस संविधान संशोधन अधिनियम द्वारा भारतीय प्रस्तावना में "समाजवादी", "पंथनिरपेक्ष" और "अखंडता" शब्द जोड़े गए?',
        options: ['42nd Amendment Act, 1976', '44th Amendment Act, 1978', '52nd Amendment Act, 1985', '86th Amendment Act, 2002'],
        optionsHindi: ['42वां संशोधन अधिनियम, 1976', '44वां संशोधन अधिनियम, 1978', '52वां संशोधन अधिनियम, 1985', '86वां संशोधन अधिनियम, 2002'],
        correctOptionIndex: 0,
        explanation: 'The 42nd Constitutional Amendment Act, 1976 (known as the Mini-Constitution) amended the Preamble to introduce Socialist, Secular, and Integrity.',
        explanationHindi: '42वें संविधान संशोधन 1976 द्वारा प्रस्तावना में समाजवादी, पंथनिरपेक्ष तथा अखंडता शब्द जोड़े गए।',
        topic: 'Preamble',
        difficulty: 'Easy'
      },
      {
        id: 'qp2',
        questionNumber: 2,
        questionText: 'In which landmark case did the Supreme Court hold that the Preamble is an integral part of the Constitution and can be amended under Article 368 without altering the Basic Structure?',
        questionTextHindi: 'किस ऐतिहासिक मामले में सर्वोच्च न्यायालय ने माना कि प्रस्तावना संविधान का अभिन्न अंग है और मूल ढांचे को बदले बिना अनुच्छेद 368 के तहत संशोधित की जा सकती है?',
        options: ['Berubari Union Case (1960)', 'Kesavananda Bharati Case (1973)', 'Minerva Mills Case (1980)', 'Golaknath Case (1967)'],
        optionsHindi: ['बेरुबारी यूनियन वाद (1960)', 'केशवानंद भारती वाद (1973)', 'मिनर्वा मिल्स वाद (1980)', 'गोलकनाथ वाद (1967)'],
        correctOptionIndex: 1,
        explanation: 'In Kesavananda Bharati v. State of Kerala (1973), the 13-judge constitutional bench ruled that the Preamble is an integral part of the Constitution and subject to the doctrine of Basic Structure.',
        explanationHindi: 'केशवानंद भारती वाद (1973) में सर्वोच्च न्यायालय ने फैसला सुनाया कि प्रस्तावना संविधान का अभिन्न अंग है।',
        topic: 'Basic Structure',
        difficulty: 'Medium'
      },
      {
        id: 'qp3',
        questionNumber: 3,
        questionText: 'The concept of "Directive Principles of State Policy" (DPSP) in the Indian Constitution was borrowed from which country?',
        questionTextHindi: 'भारतीय संविधान में "राज्य के नीति निर्देशक तत्व" (DPSP) किस देश के संविधान से लिए गए हैं?',
        options: ['United Kingdom', 'Ireland', 'United States', 'Australia'],
        optionsHindi: ['यूनाइटेड किंगडम', 'आयरलैंड', 'संयुक्त राज्य अमेरिका', 'ऑस्ट्रेलिया'],
        correctOptionIndex: 1,
        explanation: 'DPSP (Part IV, Articles 36-51) was borrowed from the Irish Constitution of 1937, which had copied it from the Spanish Constitution.',
        explanationHindi: 'DPSP आयरलैंड के संविधान से लिया गया है। यह भाग IV में अनुच्छेद 36 से 51 तक वर्णित है।',
        topic: 'Sources of Constitution',
        difficulty: 'Easy'
      },
      {
        id: 'qp4',
        questionNumber: 4,
        questionText: 'Under Article 32, how many types of Writs can be issued by the Supreme Court of India?',
        questionTextHindi: 'अनुच्छेद 32 के तहत सर्वोच्च न्यायालय कितने प्रकार की रिट (Writs) जारी कर सकता है?',
        options: ['3', '4', '5', '6'],
        optionsHindi: ['3', '4', '5', '6'],
        correctOptionIndex: 2,
        explanation: 'The Supreme Court can issue 5 types of writs: Habeas Corpus, Mandamus, Prohibition, Certiorari, and Quo-Warranto.',
        explanationHindi: 'अनुच्छेद 32 के तहत 5 प्रकार की रिट: बंदी प्रत्यक्षीकरण, परमादेश, प्रतिषेध, उत्प्रेषण, और अधिकार-पृच्छा जारी की जाती हैं।',
        topic: 'Fundamental Rights',
        difficulty: 'Easy'
      },
      {
        id: 'qp5',
        questionNumber: 5,
        questionText: 'Which Article of the Indian Constitution provides for the "Abolition of Untouchability"?',
        questionTextHindi: 'भारतीय संविधान का कौन सा अनुच्छेद "अस्पृश्यता के उन्मूलन" का प्रावधान करता है?',
        options: ['Article 14', 'Article 17', 'Article 19', 'Article 21'],
        optionsHindi: ['अनुच्छेद 14', 'अनुच्छेद 17', 'अनुच्छेद 19', 'अनुच्छेद 21'],
        correctOptionIndex: 1,
        explanation: 'Article 17 abolishes "Untouchability" and forbids its practice in any form. The enforcement of any disability arising out of untouchability is punishable by law.',
        explanationHindi: 'अनुच्छेद 17 अस्पृश्यता के उन्मूलन का प्रावधान करता है।',
        topic: 'Fundamental Rights',
        difficulty: 'Easy'
      },
      {
        id: 'qp6',
        questionNumber: 6,
        questionText: 'Who was the permanent President of the Constituent Assembly of India?',
        questionTextHindi: 'भारत की संविधान सभा के स्थायी अध्यक्ष कौन थे?',
        options: ['Dr. Sachchidananda Sinha', 'Dr. Rajendra Prasad', 'Dr. B.R. Ambedkar', 'Jawaharlal Nehru'],
        optionsHindi: ['डॉ. सच्चिदानंद सिन्हा', 'डॉ. राजेन्द्र प्रसाद', 'डॉ. बी.आर. अम्बेडकर', 'जवाहरलाल नेहरू'],
        correctOptionIndex: 1,
        explanation: 'Dr. Sachchidananda Sinha was the temporary president on 9 Dec 1946. On 11 Dec 1946, Dr. Rajendra Prasad was elected permanent President.',
        explanationHindi: '11 दिसंबर 1946 को डॉ. राजेन्द्र प्रसाद संविधान सभा के स्थायी अध्यक्ष निर्वाचित हुए थे।',
        topic: 'Constituent Assembly',
        difficulty: 'Easy'
      },
      {
        id: 'qp7',
        questionNumber: 7,
        questionText: 'The ideal of "Liberty, Equality and Fraternity" mentioned in the Preamble was inspired by which revolution?',
        questionTextHindi: 'प्रस्तावना में उल्लिखित "स्वतंत्रता, समता और बंधुत्व" का आदर्श किस क्रांति से प्रेरित था?',
        options: ['Russian Revolution (1917)', 'French Revolution (1789)', 'American Revolution (1776)', 'Glorious Revolution (1688)'],
        optionsHindi: ['रूसी क्रांति (1917)', 'फ्रांसीसी क्रांति (1789)', 'अमेरिकी क्रांति (1776)', 'गौरवपूर्ण क्रांति (1688)'],
        correctOptionIndex: 1,
        explanation: 'The ideals of Liberty, Equality and Fraternity in our Preamble have been taken from the French Revolution (1789-1799).',
        explanationHindi: 'स्वतंत्रता, समता और बंधुत्व के आदर्श फ्रांसीसी क्रांति (1789) से लिए गए हैं।',
        topic: 'Preamble',
        difficulty: 'Medium'
      },
      {
        id: 'qp8',
        questionNumber: 8,
        questionText: 'Which Schedule of the Indian Constitution contains the list of 22 Official Languages recognized by the Constitution?',
        questionTextHindi: 'भारतीय संविधान की कौन सी अनुसूची में संविधान द्वारा मान्यता प्राप्त 22 आधिकारिक भाषाओं की सूची है?',
        options: ['Seventh Schedule', 'Eighth Schedule', 'Ninth Schedule', 'Tenth Schedule'],
        optionsHindi: ['सातवीं अनुसूची', 'आठवीं अनुसूची', 'नौवीं अनुसूची', 'दसवीं अनुसूची'],
        correctOptionIndex: 1,
        explanation: 'The Eighth Schedule lists the 22 official languages of India. Originally there were 14 languages.',
        explanationHindi: 'आठवीं अनुसूची में भारत की 22 आधिकारिक भाषाएँ सूचीबद्ध हैं।',
        topic: 'Schedules',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'test-geography-physiography-01',
    title: 'Geography - Indian Physiography & Drainage System',
    subject: 'Geography',
    chapter: 'World Geography',
    category: 'subject_wise',
    dayNumber: 3,
    durationMinutes: 15,
    totalMarks: 16,
    positiveMarks: 2,
    negativeMarks: 0.5,
    questionCount: 8,
    instructions: 'High-yield SSC geography questions on mountains, passes, and river systems.',
    createdAt: '2026-03-03T10:00:00Z',
    questions: [
      {
        id: 'qg1',
        questionNumber: 1,
        questionText: 'Which mountain pass connects Srinagar to Leh and is located on National Highway 1D?',
        questionTextHindi: 'कौन सा पर्वतीय दर्रा श्रीनगर को लेह से जोड़ता है और राष्ट्रीय राजमार्ग 1D पर स्थित है?',
        options: ['Rohtang Pass', 'Zoji La Pass', 'Nathu La Pass', 'Shipki La Pass'],
        optionsHindi: ['रोहतांग दर्रा', 'ज़ोजिला दर्रा', 'नाथू ला दर्रा', 'शिपकी ला दर्रा'],
        correctOptionIndex: 1,
        explanation: 'Zoji La is a high mountain pass in Ladakh that connects the Kashmir Valley with Dras and Suru valleys (Srinagar to Leh).',
        explanationHindi: 'ज़ोजिला दर्रा श्रीनगर को लेह से जोड़ता है।',
        topic: 'Himalayan Passes',
        difficulty: 'Easy'
      },
      {
        id: 'qg2',
        questionNumber: 2,
        questionText: 'Which river flows through a rift valley between the Vindhya and Satpura mountain ranges?',
        questionTextHindi: 'विंध्य और सतपुड़ा पर्वत श्रृंखलाओं के बीच भ्रंश घाटी (Rift Valley) से होकर कौन सी नदी बहती है?',
        options: ['Godavari', 'Narmada', 'Mahanadi', 'Krishna'],
        optionsHindi: ['गोदावरी', 'नर्मदा', 'महानदी', 'कृष्णा'],
        correctOptionIndex: 1,
        explanation: 'The Narmada river flows westward through a linear rift valley between Vindhyas (north) and Satpuras (south) into the Arabian Sea.',
        explanationHindi: 'नर्मदा नदी उत्तर में विंध्य और दक्षिण में सतपुड़ा के बीच भ्रंश घाटी से होकर पश्चिम की ओर बहती है।',
        topic: 'Indian Drainage System',
        difficulty: 'Easy'
      },
      {
        id: 'qg3',
        questionNumber: 3,
        questionText: 'Majuli, the largest inhabited riverine island in the world, is located in which river?',
        questionTextHindi: 'माजुली, विश्व का सबसे बड़ा आबाद नदी द्वीप, किस नदी में स्थित है?',
        options: ['Ganga', 'Brahmaputra', 'Indus', 'Yamuna'],
        optionsHindi: ['गंगा', 'ब्रह्मपुत्र', 'सिंधु', 'यमुना'],
        correctOptionIndex: 1,
        explanation: 'Majuli is a river island in the Brahmaputra River, Assam, and was declared the first island district of India in 2016.',
        explanationHindi: 'माजुली असम में ब्रह्मपुत्र नदी में स्थित विश्व का सबसे बड़ा आबाद नदी द्वीप है।',
        topic: 'Physiography of India',
        difficulty: 'Easy'
      },
      {
        id: 'qg4',
        questionNumber: 4,
        questionText: 'The "Ten Degree Channel" separates which two island groups in the Bay of Bengal?',
        questionTextHindi: '"दस डिग्री चैनल" बंगाल की खाड़ी में किन दो द्वीप समूहों को अलग करता है?',
        options: ['Lakshadweep and Maldives', 'Andaman and Nicobar', 'South Andaman and Little Andaman', 'Minicoy and Maldives'],
        optionsHindi: ['लक्षद्वीप और मालदीव', 'अंडमान और निकोबार', 'दक्षिण अंडमान और लघु अंडमान', 'मिनिकॉय और मालदीव'],
        correctOptionIndex: 1,
        explanation: 'The 10 Degree Channel separates Little Andaman from Car Nicobar in the Bay of Bengal along the 10°N parallel of latitude.',
        explanationHindi: '10 डिग्री चैनल अंडमान द्वीप समूह को निकोबार द्वीप समूह से अलग करता है।',
        topic: 'Islands of India',
        difficulty: 'Medium'
      },
      {
        id: 'qg5',
        questionNumber: 5,
        questionText: 'Which is the highest peak in the Western Ghats (Sahyadri) and South India?',
        questionTextHindi: 'पश्चिमी घाट (सह्याद्रि) और दक्षिण भारत की सबसे ऊँची चोटी कौन सी है?',
        options: ['Doddabetta', 'Anamudi', 'Mahendragiri', 'Kalsubai'],
        optionsHindi: ['डोडाबेटा', 'अनामुडी', 'महेंद्रगिरि', 'कलसूबाई'],
        correctOptionIndex: 1,
        explanation: 'Anamudi (2,695 metres) located in the Anaimalai Hills in Kerala is the highest peak in South India and the Western Ghats.',
        explanationHindi: 'अनामुडी (2695 मीटर) केरल के अनाईमलाई पहाड़ियों में दक्षिण भारत की सर्वोच्च चोटी है।',
        topic: 'Peninsular Plateau',
        difficulty: 'Easy'
      },
      {
        id: 'qg6',
        questionNumber: 6,
        questionText: 'Which state in India shares the longest international border with Bangladesh?',
        questionTextHindi: 'भारत का कौन सा राज्य बांग्लादेश के साथ सबसे लंबी अंतरराष्ट्रीय सीमा साझा करता है?',
        options: ['Assam', 'Tripura', 'Meghalaya', 'West Bengal'],
        optionsHindi: ['असम', 'त्रिपुरा', 'मेघालय', 'पश्चिम बंगाल'],
        correctOptionIndex: 3,
        explanation: 'West Bengal shares the longest border with Bangladesh, spanning approximately 2,217 km out of India\'s total 4,096.7 km border with Bangladesh.',
        explanationHindi: 'पश्चिम बंगाल बांग्लादेश के साथ सर्वाधिक लंबी सीमा (लगभग 2,217 किमी) साझा करता है।',
        topic: 'Indian Geography',
        difficulty: 'Medium'
      },
      {
        id: 'qg7',
        questionNumber: 7,
        questionText: 'The Tropic of Cancer (23.5° N) passes through how many Indian states?',
        questionTextHindi: 'कर्क रेखा (23.5° N) भारत के कितने राज्यों से होकर गुजरती है?',
        options: ['6', '7', '8', '9'],
        optionsHindi: ['6', '7', '8', '9'],
        correctOptionIndex: 2,
        explanation: 'The Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.',
        explanationHindi: 'कर्क रेखा 8 राज्यों से गुजरती है: गुजरात, राजस्थान, मध्य प्रदेश, छत्तीसगढ़, झारखंड, पश्चिम बंगाल, त्रिपुरा और मिजोरम।',
        topic: 'Indian Geography Basics',
        difficulty: 'Easy'
      },
      {
        id: 'qg8',
        questionNumber: 8,
        questionText: 'Which waterfall in India, formed by the Sharavathi River in Karnataka, is also known as Gersoppa Falls?',
        questionTextHindi: 'कर्नाटक में शरावती नदी पर स्थित कौन सा जलप्रपात "गेरसोप्पा जलप्रपात" के नाम से भी जाना जाता है?',
        options: ['Jog Falls', 'Dudhsagar Falls', 'Shivanasamudra Falls', 'Hogenakkal Falls'],
        optionsHindi: ['जोग जलप्रपात', 'दूधसागर जलप्रपात', 'शिवनसमुद्र जलप्रपात', 'होगेनक्कल जलप्रपात'],
        correctOptionIndex: 0,
        explanation: 'Jog Falls (Gersoppa Falls) is created by the Sharavathi River dropping 253 m in Shimoga district, Karnataka.',
        explanationHindi: 'जोग जलप्रपात (गेरसोप्पा) कर्नाटक में शरावती नदी पर स्थित है।',
        topic: 'Rivers and Waterfalls',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'test-economy-monetary-01',
    title: 'Economy - RBI, Monetary Policy & Banking Structure',
    subject: 'Economy',
    chapter: 'Indian Economy',
    category: 'subject_wise',
    dayNumber: 4,
    durationMinutes: 15,
    totalMarks: 16,
    positiveMarks: 2,
    negativeMarks: 0.5,
    questionCount: 8,
    instructions: 'Test on Indian financial system, RBI monetary policy instruments, and inflation.',
    createdAt: '2026-03-04T10:00:00Z',
    questions: [
      {
        id: 'qe1',
        questionNumber: 1,
        questionText: 'On the recommendation of which commission was the Reserve Bank of India (RBI) established?',
        questionTextHindi: 'भारतीय रिज़र्व बैंक (RBI) की स्थापना किस आयोग की सिफारिश पर हुई थी?',
        options: ['Chamberlain Commission', 'Hilton Young Commission', 'Kothari Commission', 'Muddiman Commission'],
        optionsHindi: ['चेम्बरलेन आयोग', 'हिल्टन यंग आयोग (रॉयल कमीशन)', 'कोठारी आयोग', 'मडीमैन आयोग'],
        correctOptionIndex: 1,
        explanation: 'The Hilton Young Commission (Royal Commission on Indian Currency and Finance) recommended the setting up of the Reserve Bank of India in 1926. RBI was established on April 1, 1935.',
        explanationHindi: 'हिल्टन यंग आयोग (1926) की सिफारिशों के आधार पर 1 अप्रैल 1935 को RBI की स्थापना की गई थी।',
        topic: 'RBI & Banking',
        difficulty: 'Easy'
      },
      {
        id: 'qe2',
        questionNumber: 2,
        questionText: 'What is the rate at which the Reserve Bank of India lends money to commercial banks against government securities for short-term needs called?',
        questionTextHindi: 'वह दर क्या कहलाती है जिस पर RBI वाणिज्यिक बैंकों को अल्पकालिक आवश्यकताओं के लिए सरकारी प्रतिभूतियों के बदले ऋण देता है?',
        options: ['Reverse Repo Rate', 'Repo Rate', 'Bank Rate', 'Cash Reserve Ratio'],
        optionsHindi: ['रिवर्स रेपो रेट', 'रेपो रेट', 'बैंक दर', 'नकद आरक्षित अनुपात'],
        correctOptionIndex: 1,
        explanation: 'Repo Rate (Repurchase Option rate) is the interest rate at which the central bank lends money to commercial banks for short periods against collateral securities.',
        explanationHindi: 'रेपो रेट वह ब्याज दर है जिस पर केंद्रीय बैंक अल्पकाल के लिए वाणिज्यिक बैंकों को धन उधार देता है।',
        topic: 'Monetary Policy',
        difficulty: 'Easy'
      },
      {
        id: 'qe3',
        questionNumber: 3,
        questionText: 'Under the inflation targeting framework in India, what is the Consumer Price Index (CPI) target assigned to the RBI Monetary Policy Committee?',
        questionTextHindi: 'भारत में मुद्रास्फीति लक्ष्यीकरण ढांचे के तहत RBI की मौद्रिक नीति समिति (MPC) को क्या लक्ष्य सौंपा गया है?',
        options: ['2% with +/- 1%', '4% with +/- 2%', '5% with +/- 1%', '6% with +/- 2%'],
        optionsHindi: ['2% (+/- 1%)', '4% (+/- 2%)', '5% (+/- 1%)', '6% (+/- 2%)'],
        correctOptionIndex: 1,
        explanation: 'Under Section 45ZA of the RBI Act, the target is 4% CPI inflation with an upper tolerance limit of 6% and a lower tolerance limit of 2% (4% +/- 2%).',
        explanationHindi: 'RBI मौद्रिक नीति समिति का मुद्रास्फीति लक्ष्य 4% है, जिसकी सहनशीलता सीमा +/- 2% (अर्थात 2% से 6%) है।',
        topic: 'Inflation & Monetary Policy',
        difficulty: 'Medium'
      },
      {
        id: 'qe4',
        questionNumber: 4,
        questionText: 'When was the Reserve Bank of India nationalised by the Government of India?',
        questionTextHindi: 'भारत सरकार द्वारा भारतीय रिज़र्व बैंक का राष्ट्रीयकरण कब किया गया था?',
        options: ['1 January 1947', '1 January 1949', '15 August 1947', '26 January 1950'],
        optionsHindi: ['1 जनवरी 1947', '1 जनवरी 1949', '15 अगस्त 1947', '26 जनवरी 1950'],
        correctOptionIndex: 1,
        explanation: 'The RBI was nationalised on 1st January 1949 under the Reserve Bank (Transfer to Public Ownership) Act, 1948.',
        explanationHindi: '1 जनवरी 1949 को भारतीय रिज़र्व बैंक का राष्ट्रीयकरण किया गया था।',
        topic: 'Banking History',
        difficulty: 'Easy'
      },
      {
        id: 'qe5',
        questionNumber: 5,
        questionText: 'What term describes a situation in an economy where high inflation coexists with stagnant economic growth and high unemployment?',
        questionTextHindi: 'अर्थव्यवस्था की उस स्थिति को क्या कहा जाता है जहां उच्च मुद्रास्फीति के साथ-साथ सुस्त आर्थिक विकास और उच्च बेरोजगारी विद्यमान रहती है?',
        options: ['Hyperinflation', 'Stagflation', 'Deflation', 'Reflation'],
        optionsHindi: ['अतिमुद्रास्फीति (Hyperinflation)', 'स्टैगफ्लेशन (गतिहीन स्फीति)', 'अपस्फीति (Deflation)', 'रिफ्लेशन'],
        correctOptionIndex: 1,
        explanation: 'Stagflation is a portmanteau of stagnation and inflation, indicating a toxic economic condition of stagnant output, high unemployment, and rising prices.',
        explanationHindi: 'स्टैगफ्लेशन में उच्च मुद्रास्फीति, धीमी आर्थिक विकास दर और उच्च बेरोजगारी एक साथ होती है।',
        topic: 'Macroeconomics',
        difficulty: 'Medium'
      },
      {
        id: 'qe6',
        questionNumber: 6,
        questionText: 'Which Five Year Plan in India was based on the Harrod-Domar growth model?',
        questionTextHindi: 'भारत में कौन सी पंचवर्षीय योजना हैरोड-डोमर समृद्धि मॉडल पर आधारित थी?',
        options: ['First Five Year Plan (1951-56)', 'Second Five Year Plan (1956-61)', 'Third Five Year Plan (1961-66)', 'Fourth Five Year Plan (1969-74)'],
        optionsHindi: ['प्रथम पंचवर्षीय योजना (1951-56)', 'द्वितीय पंचवर्षीय योजना (1956-61)', 'तृतीय पंचवर्षीय योजना (1961-66)', 'चतुर्थ पंचवर्षीय योजना (1969-74)'],
        correctOptionIndex: 0,
        explanation: 'The First Five-Year Plan (1951-1956) was based on the Harrod-Domar model and focused heavily on agriculture, irrigation, and dam construction.',
        explanationHindi: 'प्रथम पंचवर्षीय योजना (1951-56) हैरोड-डोमर मॉडल पर आधारित थी और मुख्य रूप से कृषि और सिंचाई पर केंद्रित थी।',
        topic: 'Five Year Plans',
        difficulty: 'Easy'
      },
      {
        id: 'qe7',
        questionNumber: 7,
        questionText: 'Goods and Services Tax (GST) was introduced in India through which Constitutional Amendment Act?',
        questionTextHindi: 'वस्तु एवं सेवा कर (GST) भारत में किस संविधान संशोधन अधिनियम के माध्यम से लागू किया गया था?',
        options: ['99th Amendment Act', '100th Amendment Act', '101st Amendment Act', '103rd Amendment Act'],
        optionsHindi: ['99वां संशोधन अधिनियम', '100वां संशोधन अधिनियम', '101वां संशोधन अधिनियम', '103वां संशोधन अधिनियम'],
        correctOptionIndex: 2,
        explanation: 'The 101st Constitutional Amendment Act, 2016 paved the way for the nationwide rollout of GST with effect from 1st July 2017.',
        explanationHindi: '101वें संविधान संशोधन अधिनियम 2016 द्वारा 1 जुलाई 2017 से GST लागू किया गया था।',
        topic: 'Fiscal Policy & Taxation',
        difficulty: 'Easy'
      },
      {
        id: 'qe8',
        questionNumber: 8,
        questionText: 'Who calculates and releases the National Income and GDP estimates in India?',
        questionTextHindi: 'भारत में राष्ट्रीय आय और GDP के अनुमानों की गणना एवं प्रकाशन कौन करता है?',
        options: ['NITI Aayog', 'National Statistical Office (NSO)', 'Reserve Bank of India', 'Ministry of Finance'],
        optionsHindi: ['नीति आयोग', 'राष्ट्रीय सांख्यिकी कार्यालय (NSO)', 'भारतीय रिज़र्व बैंक', 'वित्त मंत्रालय'],
        correctOptionIndex: 1,
        explanation: 'The National Statistical Office (NSO) under the Ministry of Statistics and Programme Implementation (MoSPI) compiles and releases National Income estimates.',
        explanationHindi: 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI) के तहत राष्ट्रीय सांख्यिकी कार्यालय (NSO) GDP का संकलन करता है।',
        topic: 'National Income',
        difficulty: 'Medium'
      }
    ]
  },
  {
    id: 'test-staticgk-classical-dances-01',
    title: 'Static GK - Classical Dances, UNESCO Sites & Festivals',
    subject: 'Static GK',
    chapter: 'Static GK',
    category: 'subject_wise',
    dayNumber: 5,
    durationMinutes: 15,
    totalMarks: 16,
    positiveMarks: 2,
    negativeMarks: 0.5,
    questionCount: 8,
    instructions: 'High frequency SSC Static GK mock covering art, culture, dances and monuments.',
    createdAt: '2026-03-05T10:00:00Z',
    questions: [
      {
        id: 'qs1',
        questionNumber: 1,
        questionText: 'Sattriya classical dance form was introduced in the 15th century by which great Vaishnavite reformer and saint?',
        questionTextHindi: 'सत्रिया शास्त्रीय नृत्य शैली 15वीं शताब्दी में किस महान वैष्णव सुधारक और संत द्वारा शुरू की गई थी?',
        options: ['Chaitanya Mahaprabhu', 'Srimanta Sankaradeva', 'Vallabhacharya', 'Tulsidas'],
        optionsHindi: ['चैतन्य महाप्रभु', 'श्रीमंत शंकरदेव', 'वल्लभाचार्य', 'तुलसीदास'],
        correctOptionIndex: 1,
        explanation: 'Sattriya dance of Assam was created by the great Vaishnava saint and reformer Mahapurusha Srimanta Sankaradeva in the 15th century as an accompaniment to Ankiya Nat.',
        explanationHindi: 'असम का सत्रिया नृत्य 15वीं शताब्दी में महान वैष्णव संत श्रीमंत शंकरदेव द्वारा विकसित किया गया था।',
        topic: 'Classical Dances',
        difficulty: 'Medium'
      },
      {
        id: 'qs2',
        questionNumber: 2,
        questionText: 'The famous Hornbill Festival is annually celebrated in which North Eastern state of India?',
        questionTextHindi: 'प्रसिद्ध हॉर्नबिल महोत्सव वार्षिक रूप से भारत के किस पूर्वोत्तर राज्य में मनाया जाता है?',
        options: ['Manipur', 'Nagaland', 'Mizoram', 'Arunachal Pradesh'],
        optionsHindi: ['मणिपुर', 'नागालैंड', 'मिजोरम', 'अरुणाचल प्रदेश'],
        correctOptionIndex: 1,
        explanation: 'The Hornbill Festival, celebrated from 1 to 10 December in Kisama near Kohima, Nagaland, is known as the "Festival of Festivals".',
        explanationHindi: 'हॉर्नबिल महोत्सव नागालैंड में प्रतिवर्ष 1 से 10 दिसंबर तक मनाया जाता है। इसे "त्योहारों का त्योहार" भी कहते हैं।',
        topic: 'Folk Festivals',
        difficulty: 'Easy'
      },
      {
        id: 'qs3',
        questionNumber: 3,
        questionText: 'Which temple in Odisha is famously referred to as the "Black Pagoda"?',
        questionTextHindi: 'ओडिशा के किस मंदिर को "ब्लैक पैगोडा" (Black Pagoda) के नाम से जाना जाता है?',
        options: ['Jagannath Temple, Puri', 'Konark Sun Temple', 'Lingaraj Temple, Bhubaneswar', 'Rajarani Temple'],
        optionsHindi: ['जगन्नाथ मंदिर, पुरी', 'कोणार्क सूर्य मंदिर', 'लिंगराज मंदिर, भुवनेश्वर', 'राजारानी मंदिर'],
        correctOptionIndex: 1,
        explanation: 'Konark Sun Temple built in the 13th century by King Narasimhadeva I of Eastern Ganga Dynasty was called Black Pagoda by European sailors.',
        explanationHindi: 'कोणार्क का सूर्य मंदिर पूर्वी गंग वंश के राजा नरसिंहदेव प्रथम द्वारा निर्मित हुआ और इसे यूरोपीय नाविकों द्वारा ब्लैक पैगोडा कहा जाता था।',
        topic: 'Monuments & UNESCO Sites',
        difficulty: 'Easy'
      },
      {
        id: 'qs4',
        questionNumber: 4,
        questionText: 'How many classical dances of India are recognized by the Sangeet Natak Akademi?',
        questionTextHindi: 'संगीत नाटक अकादमी द्वारा भारत के कितने शास्त्रीय नृत्यों को मान्यता दी गई है?',
        options: ['6', '7', '8', '9'],
        optionsHindi: ['6', '7', '8', '9'],
        correctOptionIndex: 2,
        explanation: 'Sangeet Natak Akademi officially recognizes 8 classical dance forms: Bharatanatyam, Kathak, Kathakali, Kuchipudi, Odissi, Manipuri, Mohiniyattam, and Sattriya.',
        explanationHindi: 'संगीत नाटक अकादमी 8 शास्त्रीय नृत्यों को मान्यता देती है (भरतनाट्यम, कथक, कथकली, कुचिपुड़ी, ओडिसी, मणिपुरी, मोहिनीअट्टम, सत्रिया)।',
        topic: 'Classical Dances',
        difficulty: 'Easy'
      },
      {
        id: 'qs5',
        questionNumber: 5,
        questionText: 'Rani ki Vav (The Queen\'s Stepwell), a UNESCO World Heritage site, is featured on the reverse of which Indian currency banknote?',
        questionTextHindi: 'यूनेस्को विश्व धरोहर स्थल "रानी की वाव" किस भारतीय मुद्रा नोट के पृष्ठ भाग पर चित्रित है?',
        options: ['₹50 note', '₹100 note', '₹200 note', '₹500 note'],
        optionsHindi: ['₹50 नोट', '₹100 नोट', '₹200 नोट', '₹500 नोट'],
        correctOptionIndex: 1,
        explanation: 'Rani ki Vav in Patan, Gujarat is depicted on the reverse side of the lavender-colored ₹100 banknote issued in 2018.',
        explanationHindi: 'गुजरात के पाटन में स्थित रानी की वाव नए ₹100 के नोट के पीछे चित्रित है।',
        topic: 'Indian Currency & Heritage',
        difficulty: 'Medium'
      },
      {
        id: 'qs6',
        questionNumber: 6,
        questionText: 'Pandit Birju Maharaj was a legendary exponent of which classical dance form?',
        questionTextHindi: 'पंडित बिरजू महाराज किस शास्त्रीय नृत्य शैली के महान प्रतिपादक थे?',
        options: ['Kathakali', 'Kathak', 'Odissi', 'Kuchipudi'],
        optionsHindi: ['कथकली', 'कथक', 'ओडिसी', 'कुचिपुड़ी'],
        correctOptionIndex: 1,
        explanation: 'Pandit Birju Maharaj (Brijmohan Nath Mishra) was the doyen of Lucknow Kalka-Bindadin Gharana of Kathak dance.',
        explanationHindi: 'पंडित बिरजू महाराज कथक नृत्य के लखनऊ कालका-बिंदादीन घराने के प्रमुख उस्ताद थे।',
        topic: 'Folk Artists & Dancers',
        difficulty: 'Easy'
      },
      {
        id: 'qs7',
        questionNumber: 7,
        questionText: 'Bihu is the most prominent folk festival of which Indian state?',
        questionTextHindi: 'बिहू किस भारतीय राज्य का सबसे प्रमुख लोक उत्सव है?',
        options: ['West Bengal', 'Assam', 'Odisha', 'Tripura'],
        optionsHindi: ['पश्चिम बंगाल', 'असम', 'ओडिशा', 'त्रिपुरा'],
        correctOptionIndex: 1,
        explanation: 'Bihu is celebrated in Assam in three seasons: Rongali / Bohag Bihu (Spring), Kongali / Kati Bihu (Autumn), and Bhogali / Magh Bihu (Winter harvest).',
        explanationHindi: 'बिहू असम का प्रमुख त्योहार है जो तीन रूपों (रोंगाली, कोंगाली, भोगाली) में मनाया जाता है।',
        topic: 'State Festivals',
        difficulty: 'Easy'
      },
      {
        id: 'qs8',
        questionNumber: 8,
        questionText: 'Who was the first Indian woman to win the Nobel Prize?',
        questionTextHindi: 'नोबेल पुरस्कार जीतने वाली पहली भारतीय महिला कौन थीं?',
        options: ['Sarojini Naidu', 'Mother Teresa', 'Indira Gandhi', 'Kalpana Chawla'],
        optionsHindi: ['सरोजिनी नायडू', 'मदर टेरेसा', 'इंदिरा गांधी', 'कल्पना चावला'],
        correctOptionIndex: 1,
        explanation: 'Mother Teresa was awarded the Nobel Peace Prize in 1979 for her humanitarian work in Kolkata.',
        explanationHindi: 'मदर टेरेसा को 1979 में नोबेल शांति पुरस्कार से सम्मानित किया गया था।',
        topic: 'First in India',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'test-ca-monthly-01',
    title: 'Current Affairs - National & International Summit Mock',
    subject: 'Current Affairs',
    chapter: 'Current Affairs',
    category: 'subject_wise',
    dayNumber: 6,
    durationMinutes: 10,
    totalMarks: 12,
    positiveMarks: 2,
    negativeMarks: 0.5,
    questionCount: 6,
    instructions: 'Timed Current Affairs booster for SSC CGL, CHSL, CPO and MTS.',
    createdAt: '2026-03-06T10:00:00Z',
    questions: [
      {
        id: 'qc1',
        questionNumber: 1,
        questionText: 'Which country hosted the G20 Leaders Summit under the theme "Vasudhaiva Kutumbakam" (One Earth, One Family, One Future)?',
        questionTextHindi: '"वसुधैव कुटुम्बकम्" (एक पृथ्वी, एक परिवार, एक भविष्य) विषय के तहत किस देश ने G20 नेताओं के शिखर सम्मेलन की मेजबानी की?',
        options: ['Brazil', 'India', 'South Africa', 'Indonesia'],
        optionsHindi: ['ब्राजील', 'भारत', 'दक्षिण अफ्रीका', 'इंडोनेशिया'],
        correctOptionIndex: 1,
        explanation: 'India held the G20 presidency from Dec 1, 2022 to Nov 30, 2023, culminating in the New Delhi G20 Summit at Bharat Mandapam.',
        explanationHindi: 'भारत ने भारत मंडपम नई दिल्ली में ऐतिहासिक G20 शिखर सम्मेलन की मेजबानी की।',
        topic: 'Summits & Conferences',
        difficulty: 'Easy'
      },
      {
        id: 'qc2',
        questionNumber: 2,
        questionText: 'Chandrayaan-3 achieved a historic soft landing near which region of the Moon?',
        questionTextHindi: 'चंद्रयान-3 ने चंद्रमा के किस क्षेत्र के पास ऐतिहासिक सॉफ्ट लैंडिंग हासिल की?',
        options: ['North Pole', 'South Pole', 'Equator', 'Sea of Tranquility'],
        optionsHindi: ['उत्तरी ध्रुव', 'दक्षिणी ध्रुव', 'भूमध्य रेखा', 'शांति का सागर'],
        correctOptionIndex: 1,
        explanation: 'On August 23, 2023, India became the first country in the world to achieve a soft landing on the lunar South Pole. August 23 was declared National Space Day.',
        explanationHindi: '23 अगस्त 2023 को भारत चंद्रमा के दक्षिणी ध्रुव पर उतरने वाला विश्व का पहला देश बना।',
        topic: 'Science & Technology',
        difficulty: 'Easy'
      },
      {
        id: 'qc3',
        questionNumber: 3,
        questionText: 'What is the landing point of Chandrayaan-3\'s Vikram Lander named by the Government of India?',
        questionTextHindi: 'भारत सरकार द्वारा चंद्रयान-3 के विक्रम लैंडर के लैंडिंग पॉइंट का क्या नाम रखा गया है?',
        options: ['Tiranga Point', 'Shiv Shakti Point', 'Kalam Point', 'Vande Point'],
        optionsHindi: ['तिरंगा पॉइंट', 'शिव शक्ति पॉइंट', 'कलाम पॉइंट', 'वंदे पॉइंट'],
        correctOptionIndex: 1,
        explanation: 'Prime Minister Narendra Modi announced that the Chandrayaan-3 touchdown point on the Moon is named "Shiv Shakti Point", while the Chandrayaan-2 crash site is "Tiranga Point".',
        explanationHindi: 'चंद्रयान-3 लैंडिंग स्थल का नाम "शिव शक्ति पॉइंट" रखा गया।',
        topic: 'Science & Technology',
        difficulty: 'Easy'
      },
      {
        id: 'qc4',
        questionNumber: 4,
        questionText: 'Which Indian city was officially inscribed as UNESCO "City of Literature" in 2023?',
        questionTextHindi: '2023 में किस भारतीय शहर को आधिकारिक तौर पर यूनेस्को "साहित्य का शहर" घोषित किया गया?',
        options: ['Kozhikode', 'Gwalior', 'Varanasi', 'Jaipur'],
        optionsHindi: ['कोझिकोड', 'ग्वालियर', 'वाराणसी', 'जयपुर'],
        correctOptionIndex: 0,
        explanation: 'Kozhikode in Kerala became the first Indian city to be named UNESCO City of Literature. In the same declaration, Gwalior was named UNESCO City of Music.',
        explanationHindi: 'केरल के कोझिकोड को यूनेस्को साहित्य का शहर और ग्वालियर को संगीत का शहर घोषित किया गया।',
        topic: 'Awards & Honors',
        difficulty: 'Medium'
      },
      {
        id: 'qc5',
        questionNumber: 5,
        questionText: 'Who became the youngest player to win the FIDE Candidates Tournament at age 17 in 2024?',
        questionTextHindi: '2024 में 17 वर्ष की आयु में FIDE कैंडिडेट्स शतरंज टूर्नामेंट जीतने वाले सबसे युवा खिलाड़ी कौन बने?',
        options: ['R. Praggnanandhaa', 'D. Gukesh', 'Arjun Erigaisi', 'Nihal Sarin'],
        optionsHindi: ['आर. प्रज्ञानानंद', 'डी. गुकेश', 'अर्जुन एरिगैसी', 'निहाल सरीन'],
        correctOptionIndex: 1,
        explanation: 'Grandmaster Dommaraju Gukesh (D. Gukesh) created history by winning the FIDE Candidates in Toronto, Canada, at age 17 to become the youngest World Championship Challenger.',
        explanationHindi: 'डी. गुकेश ने 17 वर्ष की उम्र में टोरंटो में कैंडिडेट्स टूर्नामेंट जीतकर इतिहास रचा।',
        topic: 'Sports Current Affairs',
        difficulty: 'Easy'
      },
      {
        id: 'qc6',
        questionNumber: 6,
        questionText: 'What is the full form of the UPI interface developed by NPCI?',
        questionTextHindi: 'NPCI द्वारा विकसित UPI का पूर्ण रूप क्या है?',
        options: ['Unified Payments Interface', 'Universal Private Interface', 'United Protocol Interlink', 'Unique Pay Instrument'],
        optionsHindi: ['Unified Payments Interface', 'Universal Private Interface', 'United Protocol Interlink', 'Unique Pay Instrument'],
        correctOptionIndex: 0,
        explanation: 'UPI stands for Unified Payments Interface, an instant real-time payment system developed by the National Payments Corporation of India (NPCI).',
        explanationHindi: 'UPI का पूर्ण रूप Unified Payments Interface है।',
        topic: 'Banking & Economy',
        difficulty: 'Easy'
      }
    ]
  }
];

// 60-Day Study Plan Topic Structure
export interface StudyDay {
  dayNumber: number;
  subject: string;
  topicTitle: string;
  subtopics: string[];
  testId?: string;
}

export const STUDY_PLAN_60_DAYS: StudyDay[] = [
  { dayNumber: 1, subject: 'History', topicTitle: 'Indus Valley Civilization & Vedic Period', subtopics: ['Harappan Sites & Seals', 'Town Planning', 'Rigvedic Deities & Mandalas', 'Later Vedic Society'], testId: 'test-history-ancient-01' },
  { dayNumber: 2, subject: 'Polity', topicTitle: 'Preamble & Making of Indian Constitution', subtopics: ['Constituent Assembly Debates', 'Key Amendments (42nd, 44th)', 'Borrowed Features', 'Schedules 1-12'], testId: 'test-polity-preamble-01' },
  { dayNumber: 3, subject: 'Geography', topicTitle: 'Physiography of India & Himalayan Ranges', subtopics: ['Major Himalayan Peaks & Passes', 'Northern Plains & Doabs', 'Peninsular Plateaus', 'Coastal Plains & Islands'], testId: 'test-geography-physiography-01' },
  { dayNumber: 4, subject: 'Economy', topicTitle: 'RBI, Monetary Policy & Banking System', subtopics: ['Repo, Reverse Repo, MSF', 'Inflation Targeting Framework', 'History of RBI & Nationalisation', 'Priority Sector Lending'], testId: 'test-economy-monetary-01' },
  { dayNumber: 5, subject: 'Static GK', topicTitle: 'Classical Dances & Folk Traditions', subtopics: ['8 Classical Dance Forms', 'Prominent Exponents & Gharanas', 'State Folk Dances (Chhau, Bihu, Lavani)', 'Musical Instruments'], testId: 'test-staticgk-classical-dances-01' },
  { dayNumber: 6, subject: 'Current Affairs', topicTitle: 'National Summits, Chandrayaan & Space Missions', subtopics: ['G20 & BRICS Outcomes', 'ISRO Moon & Sun Missions', 'UNESCO Inscriptions', 'Key Appointments'], testId: 'test-ca-monthly-01' },
  { dayNumber: 7, subject: 'History', topicTitle: 'Buddhism, Jainism & Mahajanapadas', subtopics: ['Four Buddhist Councils', 'Tripitakas & Jatakas', '24 Tirthankaras', '16 Mahajanapadas & Magadha Rise'] },
  { dayNumber: 8, subject: 'Polity', topicTitle: 'Fundamental Rights (Articles 12 to 35)', subtopics: ['Right to Equality (14-18)', 'Right to Freedom (19-22)', 'Writs under Article 32', 'Reasonable Restrictions'] },
  { dayNumber: 9, subject: 'Geography', topicTitle: 'Drainage Systems & River Basins of India', subtopics: ['Indus, Ganga, Brahmaputra', 'Peninsular Rivers & East/West Flow', 'Major Dams & Multipurpose Projects', 'Waterfalls & Lakes'] },
  { dayNumber: 10, subject: 'Economy', topicTitle: 'National Income, GDP & Fiscal Policy', subtopics: ['GDP, GNP, NNP calculations', 'Direct vs Indirect Taxes & GST', 'Fiscal Deficit & Revenue Deficit', 'Union Budget Terminology'] },
  { dayNumber: 11, subject: 'Static GK', topicTitle: 'UNESCO World Heritage Sites & Monuments', subtopics: ['42+ UNESCO Sites in India', 'Forts of Rajasthan', 'Dholavira & Santiniketan', 'Sun Temple Konark & Khajuraho'] },
  { dayNumber: 12, subject: 'Science', topicTitle: 'Physics: Units, Motion & Gravitation', subtopics: ['SI Units & Dimensions', 'Newton\'s Laws & Momentum', 'Gravitational Force & Escape Velocity', 'Archimedes Principle'] },
  { dayNumber: 13, subject: 'History', topicTitle: 'Mauryan Empire & Ashokan Inscriptions', subtopics: ['Chandragupta Maurya & Chanakya', 'Major & Minor Rock Edicts of Ashoka', 'Dhamma & Administration', 'Decline of Mauryas'] },
  { dayNumber: 14, subject: 'Polity', topicTitle: 'DPSP (Part IV) & Fundamental Duties (Part IVA)', subtopics: ['Socialistic, Gandhian & Liberal Principles', 'Article 51A (11 Duties)', 'Swaran Singh Committee', 'Conflict between FR and DPSP'] },
  { dayNumber: 15, subject: 'Geography', topicTitle: 'Indian Climate, Monsoons & El Niño', subtopics: ['Southwest Monsoon Mechanisms', 'Retreating Monsoon & Coromandel Rain', 'Köppen Climate Classification', 'Western Disturbances'] },
  { dayNumber: 16, subject: 'Economy', topicTitle: 'Five Year Plans & NITI Aayog', subtopics: ['1st to 12th Plan Objectives', 'Mahalanobis Model', 'Planning Commission vs NITI Aayog', 'Atal Innovation Mission'] },
  { dayNumber: 17, subject: 'Static GK', topicTitle: 'National Parks, Wildlife Sanctuaries & Biosphere Reserves', subtopics: ['Kaziranga, Jim Corbett, Ranthambore', 'Project Tiger & Cheetah Reintroduction', 'Ramsar Wetland Sites', 'Endangered Species (IUCN)'] },
  { dayNumber: 18, subject: 'Current Affairs', topicTitle: 'Major Sports Events, Awards & Olympics', subtopics: ['Asian Games & Commonwealth', 'Major Dhyan Chand Khel Ratna', 'Grand Slam Champions', 'Chess Olympiad'] },
  { dayNumber: 19, subject: 'History', topicTitle: 'Gupta Age, Harsha & Southern Dynasties', subtopics: ['Golden Age Architecture & Literature', 'Samudragupta\'s Prayag Prashasti', 'Kannauj Assembly of Harsha', 'Chola Navy & Temple Bronzes'] },
  { dayNumber: 20, subject: 'Polity', topicTitle: 'President, Vice President & Prime Minister', subtopics: ['Electoral College of President', 'Ordinance Making (Art 123)', 'Pardoning Powers (Art 72)', 'Council of Ministers (Art 74, 75)'] },
  // Days 21 to 60 structured consistently
  ...Array.from({ length: 40 }, (_, i) => {
    const day = 21 + i;
    const subjects = ['History', 'Polity', 'Geography', 'Economy', 'Static GK', 'Science', 'Current Affairs'];
    const subj = subjects[i % subjects.length];
    const titles = [
      'Delhi Sultanate: Slave, Khilji & Tughlaq Dynasties',
      'Supreme Court & High Courts Jurisdictions',
      'Soils of India & Agriculture Crop Seasons',
      'Inflation, Index Numbers & Financial Markets',
      'Famous Books, Authors & Literary Awards',
      'Chemistry: Metals, Non-Metals & Periodic Table',
      'Defense Exercises, Missiles & Naval Ships',
      'Mughal Architecture, Paintings & Revenue Systems',
      'Parliament: Lok Sabha, Rajya Sabha & Bills',
      'Minerals, Energy Resources & Industries in India',
      'Poverty, Unemployment & Govt Welfare Schemes',
      'Biosphere Reserves & Wildlife Conservation Acts',
      'Biology: Human Physiology, Vitamins & Diseases',
      'Governor Powers, State Legislature & Panchayats',
      '1857 Revolt & Socio-Religious Reform Movements',
      'Emergency Provisions (Articles 352, 356, 360)',
      'World Geography: Straits, Oceans & Volcanoes',
      'Stock Exchanges, SEBI & Balance of Payments',
      'First in India & World, Superlatives & Flags',
      'Indian National Congress Sessions (1885-1947)',
      'Constitutional & Non-Constitutional Bodies (CAG, Election Commission)',
      'World Climatic Regions & Vegetation',
      'Full Syllabus Mega Revision Mock 1',
      'Full Syllabus Mega Revision Mock 2'
    ];
    const title = titles[i % titles.length] || `Day ${day} GK/GS Comprehensive Revision`;
    return {
      dayNumber: day,
      subject: subj,
      topicTitle: `${title}`,
      subtopics: ['Concept Drills', 'Previous Year Questions', 'Speed Revision Notes', 'Timed Practice Mock']
    };
  })
];

// Sample CSV content template for administrators to download or examine (Full Bilingual Support)
export const SAMPLE_CSV_CONTENT = `question,optionA,optionAHindi,optionB,optionBHindi,optionC,optionCHindi,optionD,optionDHindi,correctOption,explanation,topic,difficulty,questionHindi,explanationHindi
"Which Viceroy of India passed the Vernacular Press Act in 1878?","Lord Ripon","लॉर्ड रिपन","Lord Lytton","लॉर्ड लिटन","Lord Curzon","लॉर्ड कर्जन","Lord Dalhousie","लॉर्ड डलहौजी","B","Lord Lytton enacted the Vernacular Press Act in 1878 to stifle nationalist vernacular newspapers. It was later repealed by Lord Ripon in 1882.","Modern India","Medium","1878 में भारत के किस वायसराय ने वर्नाक्युलर प्रेस एक्ट पारित किया था?","लॉर्ड लिटन ने 1878 में वर्नाक्युलर प्रेस एक्ट पारित किया था जिसे 1882 में लॉर्ड रिपन द्वारा निरस्त किया गया।"
"Which Article of Indian Constitution is known as 'Heart and Soul of the Constitution' according to Dr. B.R. Ambedkar?","Article 19","अनुच्छेद 19","Article 21","अनुच्छेद 21","Article 32","अनुच्छेद 32","Article 14","अनुच्छेद 14","C","Dr. B.R. Ambedkar referred to Article 32 (Right to Constitutional Remedies) as the very soul of the Constitution and the very heart of it.","Fundamental Rights","Easy","डॉ. बी.आर. अम्बेडकर के अनुसार किस अनुच्छेद को 'संविधान का हृदय और आत्मा' कहा गया है?","अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार) को संविधान की आत्मा और हृदय कहा गया है।"
"Which is the longest National Highway in India connecting Srinagar to Kanyakumari?","NH 44","NH 44","NH 48","NH 48","NH 27","NH 27","NH 19","NH 19","A","NH 44 is India's longest highway, running from Srinagar in Jammu and Kashmir to Kanyakumari in Tamil Nadu, covering 4,112 km.","Transport & Infrastructure","Easy","श्रीनगर से कन्याकुमारी को जोड़ने वाला भारत का सबसे लंबा राष्ट्रीय राजमार्ग कौन सा है?","NH 44 भारत का सबसे लंबा राष्ट्रीय राजमार्ग है जिसकी लंबाई लगभग 4,112 किमी है।"`;

// Sample text for Paste MCQ format (Supports Full Bilingual English + Hindi formats)
export const SAMPLE_PASTE_TEXT = `Q1: किस ग्रह पर जल चक्र (Water Cycle) और जीवन की उपस्थिति पाई जाती है? / On which planet is the Water Cycle and life present?
A) मंगल / Mars
B) शुक्र / Venus
C) पृथ्वी / Earth
D) बृहस्पति / Jupiter
Correct: C
Sol: 
* पृथ्वी (Earth) सौरमंडल का एकमात्र ज्ञात ग्रह है जहाँ जीवन और जल चक्र मौजूद है। / Earth is the only known planet with life and an active water cycle.
* इसकी सतह का लगभग 71% भाग जल से ढका हुआ है। / Approximately 71% of its surface is covered by liquid water.
* इसके वायुमंडल में 78% नाइट्रोजन और 21% ऑक्सीजन गैस मौजूद है। / Its atmosphere contains 78% Nitrogen and 21% Oxygen gas.
* यह सूर्य से सही दूरी (Habitable Zone/Goldilocks Zone) में स्थित है। / It lies within the circumstellar Habitable/Goldilocks Zone.
* पृथ्वी अपने अक्ष पर 23.5° झुकी हुई है, जिससे ऋतु परिवर्तन होता है। / Earth's 23.5° axial tilt causes seasonal changes.

Q2: चंद्रमा का प्रकाश पृथ्वी तक पहुँचने में कितना समय लेता है? / How much time does moonlight take to reach the Earth?
A) 8 मिनट 20 सेकंड / 8 minutes 20 seconds
B) 1.3 सेकंड / 1.3 seconds
C) 500 सेकंड / 500 seconds
D) 2.5 सेकंड / 2.5 seconds
Correct: B
Sol: 
* चंद्रमा से परावर्तित प्रकाश को पृथ्वी तक पहुँचने में लगभग 1.3 सेकंड का समय लगता है। / Moonlight takes approximately 1.3 seconds to reach Earth.
* चंद्रमा स्वयं प्रकाश उत्पन्न नहीं करता, यह सूर्य के प्रकाश को परावर्तित करता है। / The Moon shines by reflecting sunlight.
* पृथ्वी और चंद्रमा के बीच की औसत दूरी लगभग 3,84,400 किमी है। / Average distance between Earth and Moon is ~384,400 km.
* सूर्य का प्रकाश पहुँचने में 500 सेकंड (8 मिनट 20 सेकंड) लगते हैं। / Sunlight takes 500 seconds (8 min 20 sec) to reach Earth.
* यह दूरी चंद्रमा की कक्षा के अनुसार (Apogee/Perigee) बदलती रहती है। / This distance varies along the Moon's elliptical orbit.

Q3: भारतीय संविधान का कौन सा अनुच्छेद 'समान नागरिक संहिता' (Uniform Civil Code) से संबंधित है? / Which Article of the Indian Constitution deals with the Uniform Civil Code?
A) अनुच्छेद 40 / Article 40
B) अनुच्छेद 44 / Article 44
C) अनुच्छेद 48 / Article 48
D) अनुच्छेद 50 / Article 50
Correct: B
Sol: 
* भारतीय संविधान का अनुच्छेद 44 (राज्य के नीति निदेशक तत्व - भाग IV) पूरे भारत में समान नागरिक संहिता (UCC) को सुरक्षित करने का प्रयास करता है। / Article 44 (DPSP - Part IV) directs the State to secure a Uniform Civil Code for all citizens throughout India.
* गोवा भारत का एकमात्र ऐसा राज्य है जहाँ 1961 से समान नागरिक संहिता (गोवा सिविल कोड) लागू है। / Goa is the first state in India having a functioning Uniform Civil Code since 1961.
* हाल ही में उत्तराखंड विधानसभा ने 2024 में समान नागरिक संहिता विधेयक पारित किया। / Recently Uttarakhand passed the Uniform Civil Code Bill in 2024.`;
