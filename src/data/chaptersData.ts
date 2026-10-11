import { 
  Globe2, 
  Landmark, 
  Castle, 
  Scroll, 
  Building2, 
  TrendingUp, 
  Atom, 
  FlaskConical, 
  Leaf, 
  TreePine, 
  Award,
  Sun,
  Compass,
  Mountain,
  Waves,
  CloudRain,
  Navigation,
  Crown,
  BookMarked,
  ShieldAlert,
  Coins,
  Scale,
  Dna,
  Zap,
  Eye,
  Activity,
  Music,
  Flame,
  FileCheck
} from 'lucide-react';
import { Question, TestModel } from '../types';

export interface ChapterItem {
  id: string;
  chapterNumber: number;
  title: string;
  hindiTitle: string;
  englishTitle: string;
  totalTests: number;
  iconName?: string;
}

export interface SubjectData {
  id: string;
  name: string;
  hindiName: string;
  categoryTag: string; // e.g. 'HISTORY', 'GEOGRAPHY'
  slogan: string;
  sloganHighlight: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  chapters: ChapterItem[];
}

export const SUBJECTS_CHAPTERS_DATA: SubjectData[] = [
  // 01. भूगोल / Geography (23 chapters)
  {
    id: 'geography',
    name: 'Geography',
    hindiName: 'भूगोल',
    categoryTag: 'GEOGRAPHY',
    slogan: 'Geography',
    sloganHighlight: 'Explores the Earth and Life',
    icon: Globe2,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    accentColor: 'blue',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-indigo-50',
    chapters: [
      { id: 'geo-01', chapterNumber: 1, title: 'सौरमण्डल / Solar System', hindiTitle: 'सौरमण्डल', englishTitle: 'Solar System', totalTests: 1 },
      { id: 'geo-02', chapterNumber: 2, title: 'अक्षांश और देशांतर / Latitudes and Longitudes', hindiTitle: 'अक्षांश और देशांतर', englishTitle: 'Latitudes and Longitudes', totalTests: 1 },
      { id: 'geo-03', chapterNumber: 3, title: 'पृथ्वी के आंतरिक भाग और प्लेट विवर्तनिकी / Interior of the Earth and Plate Tectonics', hindiTitle: 'पृथ्वी के आंतरिक भाग और प्लेट विवर्तनिकी', englishTitle: 'Interior of the Earth and Plate Tectonics', totalTests: 1 },
      { id: 'geo-04', chapterNumber: 4, title: 'चट्टान, महाद्वीप और महासागर / Rocks, Continents and Oceans', hindiTitle: 'चट्टान, महाद्वीप और महासागर', englishTitle: 'Rocks, Continents and Oceans', totalTests: 1 },
      { id: 'geo-05', chapterNumber: 5, title: 'भू-आकृति विज्ञान / Geomorphology', hindiTitle: 'भू-आकृति विज्ञान', englishTitle: 'Geomorphology', totalTests: 1 },
      { id: 'geo-06', chapterNumber: 6, title: 'भू-आकृतियाँ / Landforms', hindiTitle: 'भू-आकृतियाँ', englishTitle: 'Landforms', totalTests: 1 },
      { id: 'geo-07', chapterNumber: 7, title: 'वायुमंडल / Atmosphere', hindiTitle: 'वायुमंडल', englishTitle: 'Atmosphere', totalTests: 1 },
      { id: 'geo-08', chapterNumber: 8, title: 'हवा, महासागर की धारा और चक्रवात / Winds, Ocean Currents and Cyclones', hindiTitle: 'हवा, महासागर की धारा और चक्रवात', englishTitle: 'Winds, Ocean Currents and Cyclones', totalTests: 1 },
      { id: 'geo-09', chapterNumber: 9, title: 'भारत और इसका स्थान / India and its Location', hindiTitle: 'भारत और इसका स्थान', englishTitle: 'India and its Location', totalTests: 1 },
      { id: 'geo-10', chapterNumber: 10, title: 'हिमालय / Himalayas', hindiTitle: 'हिमालय', englishTitle: 'Himalayas', totalTests: 1 },
      { id: 'geo-11', chapterNumber: 11, title: 'प्रायद्वीपीय पठार / Peninsular Plateau', hindiTitle: 'प्रायद्वीपीय पठार', englishTitle: 'Peninsular Plateau', totalTests: 1 },
      { id: 'geo-12', chapterNumber: 12, title: 'उत्तरी मैदान और द्वीप / Northern Plains and Islands', hindiTitle: 'उत्तरी मैदान और द्वीप', englishTitle: 'Northern Plains and Islands', totalTests: 1 },
      { id: 'geo-13', chapterNumber: 13, title: 'हिमालयी नदी तंत्र / Himalayan River System', hindiTitle: 'हिमालयी नदी तंत्र', englishTitle: 'Himalayan River System', totalTests: 1 },
      { id: 'geo-14', chapterNumber: 14, title: 'प्रायद्वीपीय नदियाँ / Peninsular Rivers', hindiTitle: 'प्रायद्वीपीय नदियाँ', englishTitle: 'Peninsular Rivers', totalTests: 1 },
      { id: 'geo-15', chapterNumber: 15, title: 'बांध, झीलें और झरने / Dams, Lakes and Waterfalls', hindiTitle: 'बांध, झीलें और झरने', englishTitle: 'Dams, Lakes and Waterfalls', totalTests: 1 },
      { id: 'geo-16', chapterNumber: 16, title: 'मानसून / Monsoon', hindiTitle: 'मानसून', englishTitle: 'Monsoon', totalTests: 1 },
      { id: 'geo-17', chapterNumber: 17, title: 'वन और घास का मैदान / Forests and Grasslands', hindiTitle: 'वन और घास का मैदान', englishTitle: 'Forests and Grasslands', totalTests: 1 },
      { id: 'geo-18', chapterNumber: 18, title: 'मिट्टी / Soils', hindiTitle: 'मिट्टी', englishTitle: 'Soils', totalTests: 1 },
      { id: 'geo-19', chapterNumber: 19, title: 'कृषि / Agriculture', hindiTitle: 'कृषि', englishTitle: 'Agriculture', totalTests: 1 },
      { id: 'geo-20', chapterNumber: 20, title: 'खनिज / Minerals', hindiTitle: 'खनिज', englishTitle: 'Minerals', totalTests: 1 },
      { id: 'geo-21', chapterNumber: 21, title: 'विश्व मानचित्र / World Map', hindiTitle: 'विश्व मानचित्र', englishTitle: 'World Map', totalTests: 1 },
      { id: 'geo-22', chapterNumber: 22, title: 'मानव भूगोल / Human Geography', hindiTitle: 'मानव भूगोल', englishTitle: 'Human Geography', totalTests: 1 },
      { id: 'geo-23', chapterNumber: 23, title: 'परिवहन / Transport', hindiTitle: 'परिवहन', englishTitle: 'Transport', totalTests: 1 },
    ]
  },

  // 02. प्राचीन इतिहास / Ancient History (11 chapters)
  {
    id: 'ancient_history',
    name: 'Ancient History',
    hindiName: 'प्राचीन इतिहास',
    categoryTag: 'HISTORY',
    slogan: 'History',
    sloganHighlight: 'Builds a Better Future',
    icon: Landmark,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    accentColor: 'amber',
    gradientFrom: 'from-pink-50',
    gradientTo: 'to-purple-50',
    chapters: [
      { id: 'ancient-01', chapterNumber: 1, title: 'पाषाण युग / Stone Age', hindiTitle: 'पाषाण युग', englishTitle: 'Stone Age', totalTests: 1 },
      { id: 'ancient-02', chapterNumber: 2, title: 'सिंधु घाटी सभ्यता / Indus Valley Civilization', hindiTitle: 'सिंधु घाटी सभ्यता', englishTitle: 'Indus Valley Civilization', totalTests: 1 },
      { id: 'ancient-03', chapterNumber: 3, title: 'वैदिक युग / Vedic Age', hindiTitle: 'वैदिक युग', englishTitle: 'Vedic Age', totalTests: 1 },
      { id: 'ancient-04', chapterNumber: 4, title: 'संगम युग / Sangam Age', hindiTitle: 'संगम युग', englishTitle: 'Sangam Age', totalTests: 1 },
      { id: 'ancient-05', chapterNumber: 5, title: 'जैन धर्म और बौद्ध धर्म / Jainism and Buddhism', hindiTitle: 'जैन धर्म और बौद्ध धर्म', englishTitle: 'Jainism and Buddhism', totalTests: 1 },
      { id: 'ancient-06', chapterNumber: 6, title: 'महाजनपद / Mahajanapadas', hindiTitle: 'महाजनपद', englishTitle: 'Mahajanapadas', totalTests: 1 },
      { id: 'ancient-07', chapterNumber: 7, title: 'मौर्य साम्राज्य / Maurya Empire', hindiTitle: 'मौर्य साम्राज्य', englishTitle: 'Maurya Empire', totalTests: 1 },
      { id: 'ancient-08', chapterNumber: 8, title: 'मौर्य उत्तरकालीन राजवंश / Post-Mauryan Dynasties', hindiTitle: 'मौर्य उत्तरकालीन राजवंश', englishTitle: 'Post-Mauryan Dynasties', totalTests: 1 },
      { id: 'ancient-09', chapterNumber: 9, title: 'गुप्त वंश / Gupta Dynasty', hindiTitle: 'गुप्त वंश', englishTitle: 'Gupta Dynasty', totalTests: 1 },
      { id: 'ancient-10', chapterNumber: 10, title: 'गुप्तोत्तर काल / Post-Gupta Period', hindiTitle: 'गुप्तोत्तर काल', englishTitle: 'Post-Gupta Period', totalTests: 1 },
      { id: 'ancient-11', chapterNumber: 11, title: 'त्रिपक्षीय संघर्ष और चोल / Tripartite Struggle and Cholas', hindiTitle: 'त्रिपक्षीय संघर्ष और चोल', englishTitle: 'Tripartite Struggle and Cholas', totalTests: 1 },
    ]
  },

  // 03. मध्यकालीन इतिहास / Medieval History (5 chapters)
  {
    id: 'medieval_history',
    name: 'Medieval History',
    hindiName: 'मध्यकालीन इतिहास',
    categoryTag: 'HISTORY',
    slogan: 'Medieval Era',
    sloganHighlight: 'Rise and Fall of Dynasties',
    icon: Castle,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    accentColor: 'purple',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-rose-50',
    chapters: [
      { id: 'med-01', chapterNumber: 1, title: 'दिल्ली सल्तनत / Delhi Sultanate', hindiTitle: 'दिल्ली सल्तनत', englishTitle: 'Delhi Sultanate', totalTests: 1 },
      { id: 'med-02', chapterNumber: 2, title: 'विजयनगर और बहमनी साम्राज्य / Vijayanagara and Bahmani Empires', hindiTitle: 'विजयनगर और बहमनी साम्राज्य', englishTitle: 'Vijayanagara and Bahmani Empires', totalTests: 1 },
      { id: 'med-03', chapterNumber: 3, title: 'मुगल साम्राज्य / Mughal Empire', hindiTitle: 'मुगल साम्राज्य', englishTitle: 'Mughal Empire', totalTests: 1 },
      { id: 'med-04', chapterNumber: 4, title: 'मराठा / Marathas', hindiTitle: 'मराठा', englishTitle: 'Marathas', totalTests: 1 },
      { id: 'med-05', chapterNumber: 5, title: 'भक्ति और सूफी आंदोलन / Bhakti and Sufi Movements', hindiTitle: 'भक्ति और सूफी आंदोलन', englishTitle: 'Bhakti and Sufi Movements', totalTests: 1 },
    ]
  },

  // 04. आधुनिक इतिहास / Modern History (9 chapters)
  {
    id: 'modern_history',
    name: 'Modern History',
    hindiName: 'आधुनिक इतिहास',
    categoryTag: 'HISTORY',
    slogan: 'Modern India',
    sloganHighlight: 'Journey Towards Independence',
    icon: Scroll,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    accentColor: 'rose',
    gradientFrom: 'from-rose-50',
    gradientTo: 'to-orange-50',
    chapters: [
      { id: 'mod-01', chapterNumber: 1, title: 'यूरोपीय का आगमन / Advent of Europeans', hindiTitle: 'यूरोपीय का आगमन', englishTitle: 'Advent of Europeans', totalTests: 1 },
      { id: 'mod-02', chapterNumber: 2, title: 'सामाजिक धार्मिक सुधार / Socio-Religious Reforms', hindiTitle: 'सामाजिक धार्मिक सुधार', englishTitle: 'Socio-Religious Reforms', totalTests: 1 },
      { id: 'mod-03', chapterNumber: 3, title: '1857 का विद्रोह / Revolt of 1857', hindiTitle: '1857 का विद्रोह', englishTitle: 'Revolt of 1857', totalTests: 1 },
      { id: 'mod-04', chapterNumber: 4, title: 'भारतीय राष्ट्रीय कांग्रेस / Indian National Congress', hindiTitle: 'भारतीय राष्ट्रीय कांग्रेस', englishTitle: 'Indian National Congress', totalTests: 1 },
      { id: 'mod-05', chapterNumber: 5, title: 'बंगाल विभाजन / Partition of Bengal', hindiTitle: 'बंगाल विभाजन', englishTitle: 'Partition of Bengal', totalTests: 1 },
      { id: 'mod-06', chapterNumber: 6, title: 'गांधी युग / Gandhian Era', hindiTitle: 'गांधी युग', englishTitle: 'Gandhian Era', totalTests: 1 },
      { id: 'mod-07', chapterNumber: 7, title: 'सविनय अवज्ञा आंदोलन और साइमन कमीशन / Civil Disobedience Movement and Simon Commission', hindiTitle: 'सविनय अवज्ञा आंदोलन और साइमन कमीशन', englishTitle: 'Civil Disobedience Movement and Simon Commission', totalTests: 1 },
      { id: 'mod-08', chapterNumber: 8, title: 'भारत छोड़ो आंदोलन / Quit India Movement', hindiTitle: 'भारत छोड़ो आंदोलन', englishTitle: 'Quit India Movement', totalTests: 1 },
      { id: 'mod-09', chapterNumber: 9, title: 'गवर्नर-जनरल और वायसराय / Governor-Generals and Viceroys', hindiTitle: 'गवर्नर-जनरल और वायसराय', englishTitle: 'Governor-Generals and Viceroys', totalTests: 1 },
    ]
  },

  // 05. राजव्यवस्था / Polity (19 chapters)
  {
    id: 'polity',
    name: 'Polity',
    hindiName: 'राजव्यवस्था',
    categoryTag: 'POLITY',
    slogan: 'Indian Polity',
    sloganHighlight: 'Constitution & Democratic Governance',
    icon: Building2,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    accentColor: 'emerald',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-teal-50',
    chapters: [
      { id: 'pol-01', chapterNumber: 1, title: 'संविधान का निर्माण / Making of the Constitution', hindiTitle: 'संविधान का निर्माण', englishTitle: 'Making of the Constitution', totalTests: 1 },
      { id: 'pol-02', chapterNumber: 2, title: 'संविधान की प्रमुख विशेषताएं / Salient Features of the Constitution', hindiTitle: 'संविधान की प्रमुख विशेषताएं', englishTitle: 'Salient Features of the Constitution', totalTests: 1 },
      { id: 'pol-03', chapterNumber: 3, title: 'प्रस्तावना / Preamble', hindiTitle: 'प्रस्तावना', englishTitle: 'Preamble', totalTests: 1 },
      { id: 'pol-04', chapterNumber: 4, title: 'संविधान का भाग 1 और भाग 2 / Part 1 and Part 2 of the Constitution', hindiTitle: 'संविधान का भाग 1 और भाग 2', englishTitle: 'Part 1 and Part 2 of the Constitution', totalTests: 1 },
      { id: 'pol-05', chapterNumber: 5, title: 'मौलिक अधिकार / Fundamental Rights', hindiTitle: 'मौलिक अधिकार', englishTitle: 'Fundamental Rights', totalTests: 1 },
      { id: 'pol-06', chapterNumber: 6, title: 'राज्य के नीति निर्देशक सिद्धांत और मौलिक कर्तव्य / Directive Principles of State Policy and Fundamental Duties', hindiTitle: 'राज्य के नीति निर्देशक सिद्धांत और मौलिक कर्तव्य', englishTitle: 'Directive Principles of State Policy and Fundamental Duties', totalTests: 1 },
      { id: 'pol-07', chapterNumber: 7, title: 'भारत के राष्ट्रपति और उपराष्ट्रपति / President and Vice-President of India', hindiTitle: 'भारत के राष्ट्रपति और उपराष्ट्रपति', englishTitle: 'President and Vice-President of India', totalTests: 1 },
      { id: 'pol-08', chapterNumber: 8, title: 'प्रधानमंत्री और मंत्रिपरिषद / Prime Minister and Council of Ministers', hindiTitle: 'प्रधानमंत्री और मंत्रिपरिषद', englishTitle: 'Prime Minister and Council of Ministers', totalTests: 1 },
      { id: 'pol-09', chapterNumber: 9, title: 'संसद / Parliament', hindiTitle: 'संसद', englishTitle: 'Parliament', totalTests: 1 },
      { id: 'pol-10', chapterNumber: 10, title: 'राज्य विधायिका / State Legislature', hindiTitle: 'राज्य विधायिका', englishTitle: 'State Legislature', totalTests: 1 },
      { id: 'pol-11', chapterNumber: 11, title: 'केंद्र-राज्य संबंध / Centre-State Relations', hindiTitle: 'केंद्र-राज्य संबंध', englishTitle: 'Centre-State Relations', totalTests: 1 },
      { id: 'pol-12', chapterNumber: 12, title: 'आपातकाल और संविधान संशोधन / Emergency Provisions and Constitutional Amendments', hindiTitle: 'आपातकाल और संविधान संशोधन', englishTitle: 'Emergency Provisions and Constitutional Amendments', totalTests: 1 },
      { id: 'pol-13', chapterNumber: 13, title: 'सर्वोच्च न्यायालय और उच्च न्यायालय / Supreme Court and High Courts', hindiTitle: 'सर्वोच्च न्यायालय और उच्च न्यायालय', englishTitle: 'Supreme Court and High Courts', totalTests: 1 },
      { id: 'pol-14', chapterNumber: 14, title: 'स्थानीय सरकार / Local Government', hindiTitle: 'स्थानीय सरकार', englishTitle: 'Local Government', totalTests: 1 },
      { id: 'pol-15', chapterNumber: 15, title: 'संवैधानिक और गैर-संवैधानिक निकाय / Constitutional and Non-Constitutional Bodies', hindiTitle: 'संवैधानिक और गैर-संवैधानिक निकाय', englishTitle: 'Constitutional and Non-Constitutional Bodies', totalTests: 1 },
      { id: 'pol-16', chapterNumber: 16, title: 'नए आपराधिक कानून 2023 / New Criminal Laws 2023', hindiTitle: 'नए आपराधिक कानून 2023', englishTitle: 'New Criminal Laws 2023', totalTests: 1 },
      { id: 'pol-17', chapterNumber: 17, title: 'महत्वपूर्ण अधिनियम / Important Acts', hindiTitle: 'महत्वपूर्ण अधिनियम', englishTitle: 'Important Acts', totalTests: 1 },
      { id: 'pol-18', chapterNumber: 18, title: 'भारतीय संविधान के स्रोत / Sources of the Indian Constitution', hindiTitle: 'भारतीय संविधान के स्रोत', englishTitle: 'Sources of the Indian Constitution', totalTests: 1 },
      { id: 'pol-19', chapterNumber: 19, title: 'उल्लेखनीय बिन्दु / Notable Points', hindiTitle: 'उल्लेखनीय बिन्दु', englishTitle: 'Notable Points', totalTests: 1 },
    ]
  },

  // 06. अर्थव्यवस्था / Economy (11 chapters)
  {
    id: 'economy',
    name: 'Economy',
    hindiName: 'अर्थव्यवस्था',
    categoryTag: 'ECONOMY',
    slogan: 'Indian Economy',
    sloganHighlight: 'Fiscal Policy, Banking & Growth',
    icon: TrendingUp,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    accentColor: 'amber',
    gradientFrom: 'from-amber-50',
    gradientTo: 'to-yellow-50',
    chapters: [
      { id: 'eco-01', chapterNumber: 1, title: 'अर्थव्यवस्था का मूल सिद्धांत / Basic Principles of Economy', hindiTitle: 'अर्थव्यवस्था का मूल सिद्धांत', englishTitle: 'Basic Principles of Economy', totalTests: 1 },
      { id: 'eco-02', chapterNumber: 2, title: 'व्यष्टि अर्थशास्त्र / Microeconomics', hindiTitle: 'व्यष्टि अर्थशास्त्र', englishTitle: 'Microeconomics', totalTests: 1 },
      { id: 'eco-03', chapterNumber: 3, title: 'राष्ट्रीय आय / National Income', hindiTitle: 'राष्ट्रीय आय', englishTitle: 'National Income', totalTests: 1 },
      { id: 'eco-04', chapterNumber: 4, title: 'बजट और कराधान / Budget and Taxation', hindiTitle: 'बजट और कराधान', englishTitle: 'Budget and Taxation', totalTests: 1 },
      { id: 'eco-05', chapterNumber: 5, title: 'मुद्रास्फीति और बेरोजगारी / Inflation and Unemployment', hindiTitle: 'मुद्रास्फीति और बेरोजगारी', englishTitle: 'Inflation and Unemployment', totalTests: 1 },
      { id: 'eco-06', chapterNumber: 6, title: 'बैंकिंग भाग-1 / Banking Part-1', hindiTitle: 'बैंकिंग भाग-1', englishTitle: 'Banking Part-1', totalTests: 1 },
      { id: 'eco-07', chapterNumber: 7, title: 'मौद्रिक नीति / Monetary Policy', hindiTitle: 'मौद्रिक नीति', englishTitle: 'Monetary Policy', totalTests: 1 },
      { id: 'eco-08', chapterNumber: 8, title: 'बैंकिंग भाग-2 / Banking Part-2', hindiTitle: 'बैंकिंग भाग-2', englishTitle: 'Banking Part-2', totalTests: 1 },
      { id: 'eco-09', chapterNumber: 9, title: 'गरीबी और भुगतान संतुलन / Poverty and Balance of Payments', hindiTitle: 'गरीबी और भुगतान संतुलन', englishTitle: 'Poverty and Balance of Payments', totalTests: 1 },
      { id: 'eco-10', chapterNumber: 10, title: 'पंचवर्षीय योजनाएँ और औद्योगिक नीति संकल्प / Five-Year Plans and Industrial Policy Resolutions', hindiTitle: 'पंचवर्षीय योजनाएँ और औद्योगिक नीति संकल्प', englishTitle: 'Five-Year Plans and Industrial Policy Resolutions', totalTests: 1 },
      { id: 'eco-11', chapterNumber: 11, title: 'सूचकांक रिपोर्ट, अंतर्राष्ट्रीय संस्थान और प्रमुख आर्थिक अवधारणाएं / Index Reports, International Institutions and Major Economic Concepts', hindiTitle: 'सूचकांक रिपोर्ट, अंतर्राष्ट्रीय संस्थान और प्रमुख आर्थिक अवधारणाएं', englishTitle: 'Index Reports, International Institutions and Major Economic Concepts', totalTests: 1 },
    ]
  },

  // 07. भौतिक विज्ञान / Physics (8 chapters)
  {
    id: 'physics',
    name: 'Physics',
    hindiName: 'भौतिक विज्ञान',
    categoryTag: 'PHYSICS',
    slogan: 'Physical Sciences',
    sloganHighlight: 'Laws Governing the Universe',
    icon: Atom,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    accentColor: 'cyan',
    gradientFrom: 'from-cyan-50',
    gradientTo: 'to-blue-50',
    chapters: [
      { id: 'phy-01', chapterNumber: 1, title: 'गति / Motion', hindiTitle: 'गति', englishTitle: 'Motion', totalTests: 1 },
      { id: 'phy-02', chapterNumber: 2, title: 'बल और गति के नियम / Force and Laws of Motion', hindiTitle: 'बल और गति के नियम', englishTitle: 'Force and Laws of Motion', totalTests: 1 },
      { id: 'phy-03', chapterNumber: 3, title: 'गुरुत्वाकर्षण और कार्य / Gravitation and Work', hindiTitle: 'गुरुत्वाकर्षण और कार्य', englishTitle: 'Gravitation and Work', totalTests: 1 },
      { id: 'phy-04', chapterNumber: 4, title: 'ध्वनि / Sound', hindiTitle: 'ध्वनि', englishTitle: 'Sound', totalTests: 1 },
      { id: 'phy-05', chapterNumber: 5, title: 'परावर्तन और अपवर्तन / Reflection and Refraction', hindiTitle: 'परावर्तन और अपवर्तन', englishTitle: 'Reflection and Refraction', totalTests: 1 },
      { id: 'phy-06', chapterNumber: 6, title: 'मानव नेत्र और दृष्टि / Human Eye and Vision', hindiTitle: 'मानव नेत्र और दृष्टि', englishTitle: 'Human Eye and Vision', totalTests: 1 },
      { id: 'phy-07', chapterNumber: 7, title: 'विद्युत / Electricity', hindiTitle: 'विद्युत', englishTitle: 'Electricity', totalTests: 1 },
      { id: 'phy-08', chapterNumber: 8, title: 'विद्युत धारा का चुंबकीय प्रभाव / Magnetic Effects of Electric Current', hindiTitle: 'विद्युत धारा का चुंबकीय प्रभाव', englishTitle: 'Magnetic Effects of Electric Current', totalTests: 1 },
    ]
  },

  // 08. रसायन विज्ञान / Chemistry (7 chapters)
  {
    id: 'chemistry',
    name: 'Chemistry',
    hindiName: 'रसायन विज्ञान',
    categoryTag: 'CHEMISTRY',
    slogan: 'Chemical Sciences',
    sloganHighlight: 'Molecules, Matter and Energy',
    icon: FlaskConical,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    accentColor: 'purple',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-pink-50',
    chapters: [
      { id: 'chem-01', chapterNumber: 1, title: 'पदार्थ / Matter', hindiTitle: 'पदार्थ', englishTitle: 'Matter', totalTests: 1 },
      { id: 'chem-02', chapterNumber: 2, title: 'परमाणु और उसकी संरचना / Atom and its Structure', hindiTitle: 'परमाणु और उसकी संरचना', englishTitle: 'Atom and its Structure', totalTests: 1 },
      { id: 'chem-03', chapterNumber: 3, title: 'आवर्त सारणी / Periodic Table', hindiTitle: 'आवर्त सारणी', englishTitle: 'Periodic Table', totalTests: 1 },
      { id: 'chem-04', chapterNumber: 4, title: 'रासायनिक अभिक्रियाएं / Chemical Reactions', hindiTitle: 'रासायनिक अभिक्रियाएं', englishTitle: 'Chemical Reactions', totalTests: 1 },
      { id: 'chem-05', chapterNumber: 5, title: 'धातु और अधातु / Metals and Non-Metals', hindiTitle: 'धातु और अधातु', englishTitle: 'Metals and Non-Metals', totalTests: 1 },
      { id: 'chem-06', chapterNumber: 6, title: 'अम्ल, क्षार और लवण / Acids, Bases and Salts', hindiTitle: 'अम्ल, क्षार और लवण', englishTitle: 'Acids, Bases and Salts', totalTests: 1 },
      { id: 'chem-07', chapterNumber: 7, title: 'कार्बन और उसके यौगिक / Carbon and its Compounds', hindiTitle: 'कार्बन और उसके यौगिक', englishTitle: 'Carbon and its Compounds', totalTests: 1 },
    ]
  },

  // 09. जीव विज्ञान / Biology (11 chapters)
  {
    id: 'biology',
    name: 'Biology',
    hindiName: 'जीव विज्ञान',
    categoryTag: 'BIOLOGY',
    slogan: 'Life Sciences',
    sloganHighlight: 'Anatomy, Genetics & Kingdoms',
    icon: Leaf,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    accentColor: 'emerald',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-green-50',
    chapters: [
      { id: 'bio-01', chapterNumber: 1, title: 'कोशिका / Cell', hindiTitle: 'कोशिका', englishTitle: 'Cell', totalTests: 1 },
      { id: 'bio-02', chapterNumber: 2, title: 'पादप ऊतक और जंतु ऊतक / Plant Tissue and Animal Tissue', hindiTitle: 'पादप ऊतक और जंतु ऊतक', englishTitle: 'Plant Tissue and Animal Tissue', totalTests: 1 },
      { id: 'bio-03', chapterNumber: 3, title: 'वनस्पति और प्राणी जगत / Plant and Animal Kingdom', hindiTitle: 'वनस्पति और प्राणी जगत', englishTitle: 'Plant and Animal Kingdom', totalTests: 1 },
      { id: 'bio-04', chapterNumber: 4, title: 'तंत्रिका तंत्र / Nervous System', hindiTitle: 'तंत्रिका तंत्र', englishTitle: 'Nervous System', totalTests: 1 },
      { id: 'bio-05', chapterNumber: 5, title: 'हार्मोन और पादपों में गति / Hormones and Movement in Plants', hindiTitle: 'हार्मोन और पादपों में गति', englishTitle: 'Hormones and Movement in Plants', totalTests: 1 },
      { id: 'bio-06', chapterNumber: 6, title: 'प्रजनन / Reproduction', hindiTitle: 'प्रजनन', englishTitle: 'Reproduction', totalTests: 1 },
      { id: 'bio-07', chapterNumber: 7, title: 'पाचन और श्वसन / Digestion and Respiration', hindiTitle: 'पाचन और श्वसन', englishTitle: 'Digestion and Respiration', totalTests: 1 },
      { id: 'bio-08', chapterNumber: 8, title: 'परिसंचरण तंत्र और उत्सर्जन तंत्र / Circulatory System and Excretory System', hindiTitle: 'परिसंचरण तंत्र और उत्सर्जन तंत्र', englishTitle: 'Circulatory System and Excretory System', totalTests: 1 },
      { id: 'bio-09', chapterNumber: 9, title: 'रोग / Diseases', hindiTitle: 'रोग', englishTitle: 'Diseases', totalTests: 1 },
      { id: 'bio-10', chapterNumber: 10, title: 'पोषण / Nutrition', hindiTitle: 'पोषण', englishTitle: 'Nutrition', totalTests: 1 },
      { id: 'bio-11', chapterNumber: 11, title: 'आनुवंशिकता और विकास / Heredity and Evolution', hindiTitle: 'आनुवंशिकता और विकास', englishTitle: 'Heredity and Evolution', totalTests: 1 },
    ]
  },

  // 10. पर्यावरण / Environment (6 chapters)
  {
    id: 'environment',
    name: 'Environment',
    hindiName: 'पर्यावरण',
    categoryTag: 'ENVIRONMENT',
    slogan: 'Ecology & Nature',
    sloganHighlight: 'Biodiversity, Climate & Conservation',
    icon: TreePine,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    accentColor: 'green',
    gradientFrom: 'from-green-50',
    gradientTo: 'to-teal-50',
    chapters: [
      { id: 'env-01', chapterNumber: 1, title: 'पर्यावरण विज्ञान के मूल तत्व / Basic Elements of Environmental Science', hindiTitle: 'पर्यावरण विज्ञान के मूल तत्व', englishTitle: 'Basic Elements of Environmental Science', totalTests: 1 },
      { id: 'env-02', chapterNumber: 2, title: 'पारिस्थितिकी तंत्र / Ecosystem', hindiTitle: 'पारिस्थितिकी तंत्र', englishTitle: 'Ecosystem', totalTests: 1 },
      { id: 'env-03', chapterNumber: 3, title: 'पोषण गतिशीलता और ऊर्जा स्थानांतरण / Trophic Dynamics and Energy Transfer', hindiTitle: 'पोषण गतिशीलता और ऊर्जा स्थानांतरण', englishTitle: 'Trophic Dynamics and Energy Transfer', totalTests: 1 },
      { id: 'env-04', chapterNumber: 4, title: 'जैव-भू-रासायनिक चक्र / Biogeochemical Cycles', hindiTitle: 'जैव-भू-रासायनिक चक्र', englishTitle: 'Biogeochemical Cycles', totalTests: 1 },
      { id: 'env-05', chapterNumber: 5, title: 'पर्यावरण सम्मेलन / Environmental Conventions', hindiTitle: 'पर्यावरण सम्मेलन', englishTitle: 'Environmental Conventions', totalTests: 1 },
      { id: 'env-06', chapterNumber: 6, title: 'राष्ट्रीय उद्यान / National Parks', hindiTitle: 'राष्ट्रीय उद्यान', englishTitle: 'National Parks', totalTests: 1 },
    ]
  },

  // 11. स्टैटिक जी.के. / Static G.K. (11 chapters)
  {
    id: 'static_gk',
    name: 'Static G.K.',
    hindiName: 'स्टैटिक जी.के.',
    categoryTag: 'STATIC GK',
    slogan: 'General Knowledge',
    sloganHighlight: 'Art, Culture, Heritage & Sports',
    icon: Award,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    accentColor: 'purple',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-indigo-50',
    chapters: [
      { id: 'stk-01', chapterNumber: 1, title: 'संगीत और चित्रकला / Music and Painting', hindiTitle: 'संगीत और चित्रकला', englishTitle: 'Music and Painting', totalTests: 1 },
      { id: 'stk-02', chapterNumber: 2, title: 'शास्त्रीय नृत्य / Classical Dances', hindiTitle: 'शास्त्रीय नृत्य', englishTitle: 'Classical Dances', totalTests: 1 },
      { id: 'stk-03', chapterNumber: 3, title: 'भारत के लोक नृत्य / Folk Dances of India', hindiTitle: 'भारत के लोक नृत्य', englishTitle: 'Folk Dances of India', totalTests: 1 },
      { id: 'stk-04', chapterNumber: 4, title: 'भारत के त्योहार / Festivals of India', hindiTitle: 'भारत के त्योहार', englishTitle: 'Festivals of India', totalTests: 1 },
      { id: 'stk-05', chapterNumber: 5, title: 'जनगणना / Census', hindiTitle: 'जनगणना', englishTitle: 'Census', totalTests: 1 },
      { id: 'stk-06', chapterNumber: 6, title: 'महत्वपूर्ण दिवस / Important Days', hindiTitle: 'महत्वपूर्ण दिवस', englishTitle: 'Important Days', totalTests: 1 },
      { id: 'stk-07', chapterNumber: 7, title: 'पुस्तकें और उनके लेखक / Books and Authors', hindiTitle: 'पुस्तकें और उनके लेखक', englishTitle: 'Books and Authors', totalTests: 1 },
      { id: 'stk-08', chapterNumber: 8, title: 'खेल / Sports', hindiTitle: 'खेल', englishTitle: 'Sports', totalTests: 1 },
      { id: 'stk-09', chapterNumber: 9, title: 'अंतर्राष्ट्रीय संगठन / International Organizations', hindiTitle: 'अंतर्राष्ट्रीय संगठन', englishTitle: 'International Organizations', totalTests: 1 },
      { id: 'stk-10', chapterNumber: 10, title: 'राष्ट्रीय संगठन / National Organizations', hindiTitle: 'राष्ट्रीय संगठन', englishTitle: 'National Organizations', totalTests: 1 },
      { id: 'stk-11', chapterNumber: 11, title: 'पुरस्कार और सम्मान / Awards and Honors', hindiTitle: 'पुरस्कार और सम्मान', englishTitle: 'Awards and Honors', totalTests: 1 },
    ]
  }
];

// Helper to generate a realistic mock test with bilingual questions for any chapter
export function getOrCreateChapterMockTest(chapter: ChapterItem, subject: SubjectData): { test: TestModel; questions: Question[] } {
  const testId = `test-${chapter.id}`;

  const sampleQuestions: Question[] = [
    {
      id: `${chapter.id}-q1`,
      questionNumber: 1,
      questionText: `Which of the following is a primary characteristic or fundamental concept of "${chapter.englishTitle}" in ${subject.name}?`,
      questionTextHindi: `${subject.hindiName} में "${chapter.hindiTitle}" की प्राथमिक विशेषता अथवा मूलभूत अवधारणा निम्नलिखित में से कौन सी है?`,
      options: [
        `Key principle governing ${chapter.englishTitle}`,
        `Secondary classification under ${subject.name}`,
        `Universal historical & scientific factor`,
        `Direct application in previous examinations`
      ],
      optionsHindi: [
        `${chapter.hindiTitle} से संबंधित प्रमुख सिद्धांत`,
        `${subject.hindiName} के अंतर्गत द्वितीयक वर्गीकरण`,
        `सार्वभौमिक ऐतिहासिक एवं वैज्ञानिक कारक`,
        `प्रतियोगी परीक्षाओं में प्रत्यक्ष अनुप्रयोग`
      ],
      correctOptionIndex: 0,
      explanation: `This question tests core conceptual understanding of ${chapter.englishTitle} frequently asked in SSC CGL, CHSL, and CPO examinations according to the latest TCS syllabus.`,
      explanationHindi: `यह प्रश्न टीसीएस परीक्षा पैटर्न के अनुसार ${chapter.hindiTitle} के मूलभूत सिद्धांतों पर आधारित है जो एसएससी परीक्षाओं में बार-बार पूछे जाते हैं।`,
      topic: chapter.englishTitle,
      difficulty: 'Easy'
    },
    {
      id: `${chapter.id}-q2`,
      questionNumber: 2,
      questionText: `With reference to "${chapter.englishTitle}", consider the standard factual assertion frequently examined by SSC/TCS:`,
      questionTextHindi: `"${chapter.hindiTitle}" के संदर्भ में, एसएससी/टीसीएस द्वारा बार-बार पूछे जाने वाले मानक तथ्यात्मक कथन पर विचार करें:`,
      options: [
        `Statement I is correct and foundational`,
        `Both statements are mutually exclusive`,
        `Neither statement applies to India`,
        `Only empirical observation is valid`
      ],
      optionsHindi: [
        `कथन I सही एवं आधारभूत है`,
        `दोनों कथन परस्पर स्वतंत्र हैं`,
        `कोई भी कथन भारत पर लागू नहीं होता`,
        `केवल व्यावहारिक अवलोकन ही मान्य है`
      ],
      correctOptionIndex: 0,
      explanation: `Direct standard fact related to ${chapter.englishTitle} as documented in the FATMAN GK/GS Theory Book.`,
      explanationHindi: `FATMAN GK/GS पुस्तक के अनुसार ${chapter.hindiTitle} से संबंधित प्रामाणिक तथ्य।`,
      topic: chapter.englishTitle,
      difficulty: 'Medium'
    },
    {
      id: `${chapter.id}-q3`,
      questionNumber: 3,
      questionText: `In which year or standard context was the most significant milestone established concerning "${chapter.englishTitle}"?`,
      questionTextHindi: `"${chapter.hindiTitle}" से संबंधित सर्वाधिक महत्वपूर्ण मील का पत्थर किस संदर्भ/कालखंड में स्थापित हुआ?`,
      options: [
        `Constitutional & Empirical landmark period`,
        `Pre-classical experimental era`,
        `Colonial administrative reform period`,
        `Post-independence statutory timeline`
      ],
      optionsHindi: [
        `संवैधानिक एवं प्रामाणिक मील का पत्थर कालखंड`,
        `प्राचीन शास्त्रीय प्रयोगात्मक काल`,
        `औपनिवेशिक प्रशासनिक सुधार काल`,
        `स्वतंत्रता-उत्तर संविधिक समयरेखा`
      ],
      correctOptionIndex: 0,
      explanation: `Refers to the verified milestone documented in the official syllabus of ${subject.name}.`,
      explanationHindi: `${subject.hindiName} के आधिकारिक पाठ्यक्रम में उल्लिखित सत्यापित ऐतिहासिक एवं सैद्धांतिक मील का पत्थर।`,
      topic: chapter.englishTitle,
      difficulty: 'Medium'
    },
    {
      id: `${chapter.id}-q4`,
      questionNumber: 4,
      questionText: `Which of the following bodies, institutes, or treaties is directly associated with "${chapter.englishTitle}"?`,
      questionTextHindi: `निम्नलिखित में से कौन सी संस्था, निकाय अथवा संधि प्रत्यक्ष रूप से "${chapter.hindiTitle}" से संबंधित है?`,
      options: [
        `Apex National Regulatory & Research Authority`,
        `Regional Maritime Commission`,
        `Ad-hoc Parliamentary Committee`,
        `Non-statutory consultative council`
      ],
      optionsHindi: [
        `शीर्ष राष्ट्रीय नियामक एवं अनुसंधान प्राधिकरण`,
        `क्षेत्रीय समुद्री आयोग`,
        `तदर्थ संसदीय समिति`,
        `गैर-सांविधिक सलाहकार परिषद`
      ],
      correctOptionIndex: 0,
      explanation: `Institutional framework under ${subject.name} for ${chapter.englishTitle}.`,
      explanationHindi: `${chapter.hindiTitle} हेतु ${subject.hindiName} के अंतर्गत स्थापित नियामक ढांचा।`,
      topic: chapter.englishTitle,
      difficulty: 'Hard'
    },
    {
      id: `${chapter.id}-q5`,
      questionNumber: 5,
      questionText: `Which among the following options represents the most accurate example or application of "${chapter.englishTitle}"?`,
      questionTextHindi: `निम्नलिखित में से कौन सा विकल्प "${chapter.hindiTitle}" का सर्वाधिक सटीक उदाहरण अथवा अनुप्रयोग प्रस्तुत करता है?`,
      options: [
        `Standard verified case study in Indian context`,
        `Abstract mathematical approximation`,
        `Hypothetical geographical model`,
        `Outdated colonial classification`
      ],
      optionsHindi: [
        `भारतीय संदर्भ में मानक सत्यापित व्यावहारिक उदाहरण`,
        `अमूर्त गणितीय सन्निकटन`,
        `काल्पनिक भौगोलिक मॉडल`,
        `अप्रचलित औपनिवेशिक वर्गीकरण`
      ],
      correctOptionIndex: 0,
      explanation: `Standard syllabus question testing factual accuracy and analytical reasoning for SSC aspirants.`,
      explanationHindi: `एसएससी अभ्यर्थियों के लिए तथ्यात्मक सटीकता और विश्लेषणात्मक तर्कशक्ति का परीक्षण करने वाला मानक प्रश्न।`,
      topic: chapter.englishTitle,
      difficulty: 'Medium'
    }
  ];

  const testModel: TestModel = {
    id: testId,
    title: `${subject.name} - ${chapter.englishTitle} Mock Test`,
    subject: subject.name,
    chapter: chapter.englishTitle,
    category: 'chapter_wise',
    dayNumber: null,
    durationMinutes: 10,
    totalMarks: sampleQuestions.length * 2,
    positiveMarks: 2,
    negativeMarks: 0.5,
    questionCount: sampleQuestions.length,
    instructions: `This test covers ${chapter.title} for ${subject.name}. Each question carries 2 marks with 0.5 negative marking. Bilingual language switch available during exam.`,
    createdAt: new Date().toISOString()
  };

  return { test: testModel, questions: sampleQuestions };
}
