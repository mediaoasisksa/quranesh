// Web Worker for local Quran text matching
// Performs word-by-word comparison without network latency

let referenceText = null;
let referenceWords = [];

// Initialize worker with reference text
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'INIT':
      initializeReference(data);
      break;
    case 'MATCH':
      performMatching(data);
      break;
    case 'CLEAR':
      clearReference();
      break;
    default:
      console.warn('[Worker] Unknown message type:', type);
  }
});

function initializeReference(data) {
  try {
    const { ayahs } = data;
    
    // Combine all ayahs into reference text
    referenceText = ayahs.map(ayah => ayah.simpleText || ayah.arabicText).join(' ');
    
    // Split into individual words for word-by-word matching
    referenceWords = ayahs.flatMap(ayah => {
      const words = ayah.words || (ayah.simpleText || ayah.arabicText).split(' ');
      return words.map(word => normalizeArabic(word));
    });

    console.log('[Worker] Initialized with', referenceWords.length, 'words');
    
    self.postMessage({
      type: 'INIT_COMPLETE',
      data: {
        totalWords: referenceWords.length,
        referenceText: referenceText
      }
    });
  } catch (error) {
    console.error('[Worker] Error initializing:', error);
    self.postMessage({
      type: 'ERROR',
      data: { message: 'Failed to initialize reference text' }
    });
  }
}

function performMatching(data) {
  try {
    const { userText, currentWordIndex = 0 } = data;
    
    // Normalize user input
    const normalizedUserText = normalizeArabic(userText);
    const userWords = normalizedUserText.split(' ').filter(w => w.length > 0);

    // Match user words against reference
    const results = [];
    let matchIndex = currentWordIndex;
    let correctCount = 0;

    for (let i = 0; i < userWords.length; i++) {
      const userWord = userWords[i];
      const referenceWord = referenceWords[matchIndex];

      if (!referenceWord) {
        // User has gone beyond the reference text
        results.push({
          userWord,
          referenceWord: null,
          isCorrect: false,
          position: matchIndex,
          reason: 'beyond_range'
        });
        break;
      }

      const isCorrect = compareWords(userWord, referenceWord);
      
      results.push({
        userWord,
        referenceWord,
        isCorrect,
        position: matchIndex
      });

      if (isCorrect) {
        correctCount++;
        matchIndex++;
      } else {
        // Check if user might have skipped a word
        const nextWordMatch = matchIndex < referenceWords.length - 1 && 
                             compareWords(userWord, referenceWords[matchIndex + 1]);
        
        if (nextWordMatch) {
          results[results.length - 1].possibleSkip = true;
        }
        matchIndex++;
      }
    }

    const accuracy = userWords.length > 0 
      ? Math.round((correctCount / userWords.length) * 100)
      : 0;

    self.postMessage({
      type: 'MATCH_RESULT',
      data: {
        results,
        accuracy,
        correctCount,
        totalWords: userWords.length,
        nextWordIndex: matchIndex,
        expectedNextWord: referenceWords[matchIndex] || null
      }
    });

  } catch (error) {
    console.error('[Worker] Error matching:', error);
    self.postMessage({
      type: 'ERROR',
      data: { message: 'Failed to perform matching' }
    });
  }
}

function clearReference() {
  referenceText = null;
  referenceWords = [];
  self.postMessage({ type: 'CLEAR_COMPLETE' });
}

// Normalize Arabic text for comparison
function normalizeArabic(text) {
  if (!text) return '';
  
  return text
    // Remove tashkeel (diacritics)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize alef variants
    .replace(/[إأآا]/g, 'ا')
    // Normalize taa marbuta
    .replace(/ة/g, 'ه')
    // Remove tatweel
    .replace(/ـ/g, '')
    // Remove extra spaces
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// Compare two words with fuzzy matching
function compareWords(word1, word2) {
  const normalized1 = normalizeArabic(word1);
  const normalized2 = normalizeArabic(word2);
  
  // Exact match
  if (normalized1 === normalized2) {
    return true;
  }

  // Check if one is a substring of the other (handles partial matches)
  if (normalized1.length > 2 && normalized2.length > 2) {
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
      return true;
    }
  }

  // Levenshtein distance for very close matches
  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);
  const similarity = 1 - (distance / maxLength);
  
  // Accept if 80% similar
  return similarity >= 0.8;
}

// Levenshtein distance algorithm
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

console.log('[Worker] Quran Matcher Worker initialized');
