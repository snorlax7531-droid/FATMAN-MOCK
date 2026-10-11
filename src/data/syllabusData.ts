export interface ChapterItem {
  nameEn: string;
  nameHi: string;
}

export interface SubjectSyllabus {
  subjectEn: string;
  subjectHi: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  descriptionEn: string;
  descriptionHi: string;
  chapters: ChapterItem[];
}

export const SYLLABUS_DATA: SubjectSyllabus[] = [
  {
    subjectEn: 'Geography',
    subjectHi: 'भूगोल',
    iconName: 'Globe2',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50/80',
    borderColor: 'border-blue-100',
    descriptionEn: 'Indian Physiography, Rivers & World Geography',
    descriptionHi: 'भारतीय भू-आकृति विज्ञान, नदियाँ और विश्व भूगोल',
    chapters: [
      { nameEn: 'Solar System', nameHi: 'सौरमण्डल' },
      { nameEn: 'Latitudes and Longitudes', nameHi: 'अक्षांश और देशांतर' },
      { nameEn: 'Interior of the Earth and Plate Tectonics', nameHi: 'पृथ्वी के आंतरिक भाग और प्लेट विवर्तनिकी' },
      { nameEn: 'Rocks, Continents and Oceans', nameHi: 'चट्टान, महाद्वीप और महासागर' },
      { nameEn: 'Geomorphology', nameHi: 'भू-आकृति विज्ञान' },
      { nameEn: 'Landforms', nameHi: 'भू-आकृतियाँ' },
      { nameEn: 'Atmosphere', nameHi: 'वायुमंडल' },
      { nameEn: 'Winds, Ocean Currents and Cyclones', nameHi: 'हवा, महासागर की धारा और चक्रवात' },
      { nameEn: 'India and its Location', nameHi: 'भारत और इसका स्थान' },
      { nameEn: 'Himalayas', nameHi: 'हिमालय' },
      { nameEn: 'Peninsular Plateau', nameHi: 'प्रायद्वीपीय पठार' },
      { nameEn: 'Northern Plains and Islands', nameHi: 'उत्तरी मैदान और द्वीप' },
      { nameEn: 'Himalayan River System', nameHi: 'हिमालयी नदी तंत्र' },
      { nameEn: 'Peninsular Rivers', nameHi: 'प्रायद्वीपीय नदियाँ' },
      { nameEn: 'Dams, Lakes and Waterfalls', nameHi: 'बांध, झीलें और झरने' },
      { nameEn: 'Monsoon', nameHi: 'मानसून' },
      { nameEn: 'Forests and Grasslands', nameHi: 'वन और घास का मैदान' },
      { nameEn: 'Soils', nameHi: 'मिट्टी' },
      { nameEn: 'Agriculture', nameHi: 'कृषि' },
      { nameEn: 'Minerals', nameHi: 'खनिज' },
      { nameEn: 'World Map', nameHi: 'विश्व मानचित्र' },
      { nameEn: 'Human Geography', nameHi: 'मानव भूगोल' },
      { nameEn: 'Transport', nameHi: 'परिवहन' }
    ]
  },
  {
    subjectEn: 'Ancient History',
    subjectHi: 'प्राचीन इतिहास',
    iconName: 'Landmark',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-100',
    descriptionEn: 'Ancient Indian History & Civilization',
    descriptionHi: 'प्राचीन भारतीय इतिहास और सभ्यता',
    chapters: [
      { nameEn: 'Stone Age', nameHi: 'पाषाण युग' },
      { nameEn: 'Indus Valley Civilization', nameHi: 'सिंधु घाटी सभ्यता' },
      { nameEn: 'Vedic Age', nameHi: 'वैदिक युग' },
      { nameEn: 'Sangam Age', nameHi: 'संगम युग' },
      { nameEn: 'Jainism and Buddhism', nameHi: 'जैन धर्म और बौद्ध धर्म' },
      { nameEn: 'Mahajanapadas', nameHi: 'महाजनपद' },
      { nameEn: 'Maurya Empire', nameHi: 'मौर्य साम्राज्य' },
      { nameEn: 'Post-Mauryan Dynasties', nameHi: 'मौर्य उत्तरकालीन राजवंश' },
      { nameEn: 'Gupta Dynasty', nameHi: 'गुप्त वंश' },
      { nameEn: 'Post-Gupta Period', nameHi: 'गुप्तोत्तर काल' },
      { nameEn: 'Tripartite Struggle and Cholas', nameHi: 'त्रिपक्षीय संघर्ष और चोल' }
    ]
  },
  {
    subjectEn: 'Medieval History',
    subjectHi: 'मध्यकालीन इतिहास',
    iconName: 'Castle',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50/80',
    borderColor: 'border-purple-100',
    descriptionEn: 'Delhi Sultanate, Mughals & Regional Kingdoms',
    descriptionHi: 'दिल्ली सल्तनत, मुगल और क्षेत्रीय साम्राज्य',
    chapters: [
      { nameEn: 'Delhi Sultanate', nameHi: 'दिल्ली सल्तनत' },
      { nameEn: 'Vijayanagara and Bahmani Empires', nameHi: 'विजयनगर और बहमनी साम्राज्य' },
      { nameEn: 'Mughal Empire', nameHi: 'मुगल साम्राज्य' },
      { nameEn: 'Marathas', nameHi: 'मराठा' },
      { nameEn: 'Bhakti and Sufi Movements', nameHi: 'भक्ति और सूफी आंदोलन' }
    ]
  },
  {
    subjectEn: 'Modern History',
    subjectHi: 'आधुनिक इतिहास',
    iconName: 'Scroll',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50/80',
    borderColor: 'border-rose-100',
    descriptionEn: 'Freedom Struggle, British Era & Gandhian Movements',
    descriptionHi: 'स्वतंत्रता संग्राम, ब्रिटिश काल और गांधीवादी आंदोलन',
    chapters: [
      { nameEn: 'Advent of Europeans', nameHi: 'यूरोपीय का आगमन' },
      { nameEn: 'Socio-Religious Reforms', nameHi: 'सामाजिक धार्मिक सुधार' },
      { nameEn: 'Revolt of 1857', nameHi: '1857 का विद्रोह' },
      { nameEn: 'Indian National Congress', nameHi: 'भारतीय राष्ट्रीय कांग्रेस' },
      { nameEn: 'Partition of Bengal', nameHi: 'बंगाल विभाजन' },
      { nameEn: 'Gandhian Era', nameHi: 'गांधी युग' },
      { nameEn: 'Civil Disobedience Movement and Simon Commission', nameHi: 'सविनय अवज्ञा आंदोलन और साइमन कमीशन' },
      { nameEn: 'Quit India Movement', nameHi: 'भारत छोड़ो आंदोलन' },
      { nameEn: 'Governor-Generals and Viceroys', nameHi: 'गवर्नर-जनरल और वायसराय' }
    ]
  },
  {
    subjectEn: 'Polity',
    subjectHi: 'राजव्यवस्था',
    iconName: 'Building2',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50/80',
    borderColor: 'border-emerald-100',
    descriptionEn: 'Constitution, Articles, Amendments & Parliament',
    descriptionHi: 'संविधान, अनुच्छेद, संशोधन और संसद',
    chapters: [
      { nameEn: 'Making of the Constitution', nameHi: 'संविधान का निर्माण' },
      { nameEn: 'Salient Features of the Constitution', nameHi: 'संविधान की प्रमुख विशेषताएं' },
      { nameEn: 'Preamble', nameHi: 'प्रस्तावना' },
      { nameEn: 'Part 1 and Part 2 of the Constitution', nameHi: 'संविधान का भाग 1 और भाग 2' },
      { nameEn: 'Fundamental Rights', nameHi: 'मौलिक अधिकार' },
      { nameEn: 'Directive Principles of State Policy and Fundamental Duties', nameHi: 'राज्य के नीति निर्देशक सिद्धांत और मौलिक कर्तव्य' },
      { nameEn: 'President and Vice-President of India', nameHi: 'भारत के राष्ट्रपति और उपराष्ट्रपति' },
      { nameEn: 'Prime Minister and Council of Ministers', nameHi: 'प्रधानमंत्री और मंत्रिपरिषद' },
      { nameEn: 'Parliament', nameHi: 'संसद' },
      { nameEn: 'State Legislature', nameHi: 'राज्य विधायिका' },
      { nameEn: 'Centre-State Relations', nameHi: 'केंद्र-राज्य संबंध' },
      { nameEn: 'Emergency Provisions and Constitutional Amendments', nameHi: 'आपातकाल और संविधान संशोधन' },
      { nameEn: 'Supreme Court and High Courts', nameHi: 'सर्वोच्च न्यायालय और उच्च न्यायालय' },
      { nameEn: 'Local Government', nameHi: 'स्थानीय सरकार' },
      { nameEn: 'Constitutional and Non-Constitutional Bodies', nameHi: 'संवैधानिक और गैर-संवैधानिक निकाय' },
      { nameEn: 'New Criminal Laws 2023', nameHi: 'नए आपराधिक कानून 2023' },
      { nameEn: 'Important Acts', nameHi: 'महत्वपूर्ण अधिनियम' },
      { nameEn: 'Sources of the Indian Constitution', nameHi: 'भारतीय संविधान के स्रोत' },
      { nameEn: 'Notable Points', nameHi: 'उल्लेखनीय बिन्दु' }
    ]
  },
  {
    subjectEn: 'Economy',
    subjectHi: 'अर्थव्यवस्था',
    iconName: 'TrendingUp',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50/80',
    borderColor: 'border-amber-100',
    descriptionEn: 'Banking, RBI, Inflation & Five Year Plans',
    descriptionHi: 'बैंकिंग, आरबीआई, मुद्रास्फीति और पंचवर्षीय योजनाएँ',
    chapters: [
      { nameEn: 'Basic Principles of Economy', nameHi: 'अर्थव्यवस्था का मूल सिद्धांत' },
      { nameEn: 'Microeconomics', nameHi: 'व्यष्टि अर्थशास्त्र' },
      { nameEn: 'National Income', nameHi: 'राष्ट्रीय आय' },
      { nameEn: 'Budget and Taxation', nameHi: 'बजट और कराधान' },
      { nameEn: 'Inflation and Unemployment', nameHi: 'मुद्रास्फीति और बेरोजगारी' },
      { nameEn: 'Banking Part-1', nameHi: 'बैंकिंग भाग-1' },
      { nameEn: 'Monetary Policy', nameHi: 'मौद्रिक नीति' },
      { nameEn: 'Banking Part-2', nameHi: 'बैंकिंग भाग-2' },
      { nameEn: 'Poverty and Balance of Payments', nameHi: 'गरीबी और भुगतान संतुलन' },
      { nameEn: 'Five-Year Plans and Industrial Policy Resolutions', nameHi: 'पंचवर्षीय योजनाएँ और औद्योगिक नीति संकल्प' },
      { nameEn: 'Index Reports, International Institutions and Major Economic Concepts', nameHi: 'सूचकांक रिपोर्ट, अंतर्राष्ट्रीय संस्थान और प्रमुख आर्थिक अवधारणाएं' }
    ]
  },
  {
    subjectEn: 'Physics',
    subjectHi: 'भौतिक विज्ञान',
    iconName: 'Atom',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50/80',
    borderColor: 'border-blue-100',
    descriptionEn: 'Mechanics, Optics, Electricity & Magnetism',
    descriptionHi: 'यांत्रिकी, प्रकाशिकी, विद्युत और चुंबकत्व',
    chapters: [
      { nameEn: 'Motion', nameHi: 'गति' },
      { nameEn: 'Force and Laws of Motion', nameHi: 'बल और गति के नियम' },
      { nameEn: 'Gravitation and Work', nameHi: 'गुरुत्वाकर्षण और कार्य' },
      { nameEn: 'Sound', nameHi: 'ध्वनि' },
      { nameEn: 'Reflection and Refraction', nameHi: 'परावर्तन और अपवर्तन' },
      { nameEn: 'Human Eye and Vision', nameHi: 'मानव नेत्र और दृष्टि' },
      { nameEn: 'Electricity', nameHi: 'विद्युत' },
      { nameEn: 'Magnetic Effects of Electric Current', nameHi: 'विद्युत धारा का चुंबकीय प्रभाव' }
    ]
  },
  {
    subjectEn: 'Chemistry',
    subjectHi: 'रसायन विज्ञान',
    iconName: 'FlaskConical',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50/80',
    borderColor: 'border-rose-100',
    descriptionEn: 'Organic, Inorganic & Physical Chemistry',
    descriptionHi: 'कार्बनिक, अकार्बनिक और भौतिक रसायन',
    chapters: [
      { nameEn: 'Matter', nameHi: 'पदार्थ' },
      { nameEn: 'Atom and its Structure', nameHi: 'परमाणु और उसकी संरचना' },
      { nameEn: 'Periodic Table', nameHi: 'आवर्त सारणी' },
      { nameEn: 'Chemical Reactions', nameHi: 'रासायनिक अभिक्रियाएं' },
      { nameEn: 'Metals and Non-Metals', nameHi: 'धातु और अधातु' },
      { nameEn: 'Acids, Bases and Salts', nameHi: 'अम्ल, क्षार और लवण' },
      { nameEn: 'Carbon and its Compounds', nameHi: 'कार्बन और उसके यौगिक' }
    ]
  },
  {
    subjectEn: 'Biology',
    subjectHi: 'जीव विज्ञान',
    iconName: 'Leaf',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50/80',
    borderColor: 'border-emerald-100',
    descriptionEn: 'Human Physiology, Botany & Zoology',
    descriptionHi: 'मानव शरीर विज्ञान, वनस्पति विज्ञान और प्राणी विज्ञान',
    chapters: [
      { nameEn: 'Cell', nameHi: 'कोशिका' },
      { nameEn: 'Plant Tissue and Animal Tissue', nameHi: 'पादप ऊतक और जंतु ऊतक' },
      { nameEn: 'Plant and Animal Kingdom', nameHi: 'वनस्पति और प्राणी जगत' },
      { nameEn: 'Nervous System', nameHi: 'तंत्रिका तंत्र' },
      { nameEn: 'Hormones and Movement in Plants', nameHi: 'हार्मोन और पादपों में गति' },
      { nameEn: 'Reproduction', nameHi: 'प्रजनन' },
      { nameEn: 'Digestion and Respiration', nameHi: 'पाचन और श्वसन' },
      { nameEn: 'Circulatory System and Excretory System', nameHi: 'परिसंचरण तंत्र और उत्सर्जन तंत्र' },
      { nameEn: 'Diseases', nameHi: 'रोग' },
      { nameEn: 'Nutrition', nameHi: 'पोषण' },
      { nameEn: 'Heredity and Evolution', nameHi: 'आनुवंशिकता और विकास' }
    ]
  },
  {
    subjectEn: 'Environment',
    subjectHi: 'पर्यावरण',
    iconName: 'BookOpen',
    color: 'text-green-600',
    bgColor: 'bg-green-50/80',
    borderColor: 'border-green-100',
    descriptionEn: 'Ecology, Biodiversity & Climate Change',
    descriptionHi: 'पारिस्थितिकी, जैव विविधता और जलवायु परिवर्तन',
    chapters: [
      { nameEn: 'Basic Elements of Environmental Science', nameHi: 'पर्यावरण विज्ञान के मूल तत्व' },
      { nameEn: 'Biodiversity', nameHi: 'जैव विविधता' },
      { nameEn: 'Climate Change and Global Warming', nameHi: 'जलवायु परिवर्तन और वैश्विक तापन' },
      { nameEn: 'Pollution and Conservation', nameHi: 'प्रदूषण और संरक्षण' },
      { nameEn: 'National Parks and Wildlife Sanctuaries', nameHi: 'राष्ट्रीय उद्यान और वन्यजीव अभ्यारण्य' }
    ]
  }
];
