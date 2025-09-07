import { phrasesData } from './phrases-data';
import { questionBanksData } from './question-banks-data';
import type { InsertQuestionBank } from '@shared/schema';

// Helper function to find phrase by Arabic text
export function findPhraseIdByArabicText(arabicText: string): string | null {
  const phraseIndex = phrasesData.findIndex(phrase => phrase.arabicText === arabicText);
  return phraseIndex !== -1 ? `phrase-${phraseIndex}` : null;
}

// Mapping of Arabic phrases to their corresponding question themes
const phraseThemeMappings: Record<string, string[]> = {
  // المعية في الشدة - Companionship in Hardship
  "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا": ["المعية في الشدة"],
  "إِنَّ اللَّهَ مَعَ ٱلصَّـٰبِرِينَ": ["المعية في الشدة", "الصبر والمثابرة"],
  
  // العدالة والإنصاف - Justice and Fairness
  "إِنَّ اللَّهَ يُحِبُّ الْمُقۡسِطِينَ": ["العدالة والإنصاف"],
  
  // الإحسان والخير - Excellence and Goodness
  "إِنَّ اللَّهَ يُحِبُّ ٱلۡمُحۡسِنِينَن": ["الإحسان والخير"],
  
  // التوكل والثقة - Trust and Reliance
  "وَمَن يَتَوَكَّلۡ عَلَى ٱللَّهِ فَهُوَ حَسۡبُهُۥ": ["التوكل والثقة"],
  "إِنَّ اللَّهَ يُحِبُّ ٱلۡمُتَوَكِّلِينَ": ["التوكل والثقة"],
  
  // التقوى والصلاح - Righteousness and Piety
  "إِنَّ اللَّهَ يُحِبُّ ٱلۡمُتَّقِينَ": ["التقوى والصلاح"],
  
  // الاقتصاد ومحاربة الإسراف - Moderation and Fighting Extravagance
  "كُلُوا وَٱشۡرَبُوا وَلَا تُسۡرِفُوا": ["الاقتصاد ومحاربة الإسراف"],
  "إِنَّ اللَّهَ لَا يُحِبُّ ٱلۡمُسۡرِفِينَ": ["الاقتصاد ومحاربة الإسراف"],
  
  // الصدق والأمانة - Truthfulness and Trustworthiness
  "إِنَّ اللَّهَ لَا يُحِبُّ ٱلۡخَآئِنِينَ": ["الصدق والأمانة"],
  "وَأَوۡفُوا بِٱلۡعَهۡدِ": ["الصدق والأمانة"],
  
  // الصبر والمثابرة - Patience and Perseverance
  "وَاللَّهُ يُحِبُّ الصَّابِرِينَ": ["الصبر والمثابرة"],
  
  // الرحمة والمغفرة - Mercy and Forgiveness
  "إِنَّ اللَّهَ غَفُورٞ رَّحِيمٞ": ["الرحمة والمغفرة"],
  "وَاللَّهُ غَفُورٌ رَّحِيمٌ": ["الرحمة والمغفرة"],
  "إِنَّ اللَّهَ يُحِبُّ ٱلتَّوَّٰبِينَ": ["الرحمة والمغفرة"],
  
  // العبادة والذكر - Worship and Remembrance
  "أَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ": ["العبادة والذكر"],
  
  // الحقوق والواجبات - Rights and Duties
  "وَلَا تَبۡخَسُوا ٱلنَّاسَ أَشۡيَآءَهُمۡ": ["الحقوق والواجبات"]
};

// Generate question banks with proper phrase ID mappings
export function generateQuestionBanksWithPhraseIds(): InsertQuestionBank[] {
  return questionBanksData.map(questionBank => {
    const relevantPhraseIds: string[] = [];
    
    phrasesData.forEach((phrase, index) => {
      const themes = phraseThemeMappings[phrase.arabicText] || [];
      if (themes.includes(questionBank.theme)) {
        relevantPhraseIds.push(`phrase-${index}`);
      }
    });
    
    return {
      ...questionBank,
      correctPhraseIds: relevantPhraseIds
    };
  });
}

// Search function for thematic questions
export function searchQuestionsByTags(searchTags: string[]): InsertQuestionBank[] {
  return questionBanksData.filter(questionBank => 
    searchTags.some(searchTag => 
      questionBank.tags.some(tag => 
        tag.includes(searchTag) || searchTag.includes(tag)
      )
    )
  );
}