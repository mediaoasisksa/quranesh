import { db } from "./db";
import { diplomaWeeks, diplomaVocabulary, diplomaExercises } from "@shared/schema";

const WEEKS_CONTENT = [
  {
    weekNumber: 1,
    titleAr: "الحروف والقراءة العملية",
    titleEn: "Letters and Practical Reading",
    descriptionAr: "تعلم قراءة الكلمات العربية المضبوطة بالشكل من مفردات قرآنية شائعة",
    descriptionEn: "Learn to read Arabic words with diacritics using common Quranic vocabulary",
    lessonContentAr: `# الحروف العربية والقراءة العملية

## أهداف الأسبوع
- التعرف على أشكال الحروف العربية
- فهم المدود البسيطة كظاهرة لغوية
- قراءة كلمات عربية مضبوطة الشكل

## الحروف الأساسية
الحروف العربية 28 حرفاً، وتختلف أشكالها حسب موضعها في الكلمة (بداية - وسط - نهاية).

## المدود
- مد الألف: كِتَاب (kitāb)
- مد الياء: طَرِيق (ṭarīq)
- مد الواو: نُور (nūr)

## التنوين
التنوين علامة صوتية تُضاف لنهاية الاسم:
- تنوين الفتح: كِتَابًا
- تنوين الضم: كِتَابٌ
- تنوين الكسر: كِتَابٍ

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط، والنصوص تُستخدم كأمثلة لغوية.`,
    lessonContentEn: `# Arabic Letters and Practical Reading

## Week Objectives
- Recognize Arabic letter shapes
- Understand basic vowel extensions as linguistic phenomena
- Read Arabic words with diacritical marks

## Basic Letters
Arabic has 28 letters. Their shapes change based on position (beginning - middle - end).

## Long Vowels
- Alif extension: kitāb (كِتَاب)
- Ya extension: ṭarīq (طَرِيق)
- Waw extension: nūr (نُور)

## Tanween (Nunation)
Tanween is a phonetic marker added to noun endings:
- Fatḥa tanween: kitāban
- Ḍamma tanween: kitābun
- Kasra tanween: kitābin

**Note:** This content is for Arabic language learning only. Texts are used as linguistic examples.`,
    grammarFocus: "الحروف والحركات",
    vocabulary: [
      { wordAr: "كِتَاب", root: "ك-ت-ب", translit: "kitāb", meaningEn: "book", meaningAr: "مجموعة أوراق مجلدة للقراءة", exampleModern: "هذا كِتَابٌ جديد." },
      { wordAr: "نُور", root: "ن-و-ر", translit: "nūr", meaningEn: "light", meaningAr: "الضوء الذي يُبصَر به", exampleModern: "نُورُ الشمسِ ساطعٌ." },
      { wordAr: "طَرِيق", root: "ط-ر-ق", translit: "ṭarīq", meaningEn: "road, path", meaningAr: "السبيل الذي يُسلك", exampleModern: "هذا طَرِيقٌ طويلٌ." },
      { wordAr: "لَيْل", root: "ل-ي-ل", translit: "layl", meaningEn: "night", meaningAr: "الوقت من غروب الشمس إلى طلوعها", exampleModern: "اللَّيْلُ هادئٌ." },
      { wordAr: "نَهَار", root: "ن-ه-ر", translit: "nahār", meaningEn: "day", meaningAr: "الوقت من طلوع الشمس إلى غروبها", exampleModern: "النَّهَارُ مُشْمِسٌ." },
      { wordAr: "قَلْب", root: "ق-ل-ب", translit: "qalb", meaningEn: "heart", meaningAr: "العضو الذي يضخ الدم", exampleModern: "قَلْبُهُ سليمٌ." },
      { wordAr: "عِلْم", root: "ع-ل-م", translit: "ʿilm", meaningEn: "knowledge", meaningAr: "المعرفة المكتسبة", exampleModern: "العِلْمُ نافعٌ." },
      { wordAr: "سَمَاء", root: "س-م-و", translit: "samāʾ", meaningEn: "sky", meaningAr: "الفضاء فوق الأرض", exampleModern: "السَّمَاءُ زرقاءٌ." },
      { wordAr: "أَرْض", root: "أ-ر-ض", translit: "arḍ", meaningEn: "earth, land", meaningAr: "اليابسة التي نعيش عليها", exampleModern: "الأَرْضُ واسعةٌ." },
      { wordAr: "مَاء", root: "م-و-ه", translit: "māʾ", meaningEn: "water", meaningAr: "السائل الضروري للحياة", exampleModern: "المَاءُ باردٌ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "املأ الفراغ بالكلمة المناسبة", sentenceWithBlanks: "هذا ____ جديدٌ للقراءة.", wordBank: ["كِتَاب", "طَرِيق", "نُور", "مَاء"], correctAnswer: "كِتَاب", explanation: "الكتاب هو المناسب للقراءة." },
      { type: "fill_blanks", questionAr: "املأ الفراغ بالكلمة المناسبة", sentenceWithBlanks: "____ الشمسِ ساطعٌ اليوم.", wordBank: ["لَيْل", "نُور", "قَلْب", "أَرْض"], correctAnswer: "نُور", explanation: "نور الشمس هو الضوء." },
      { type: "reorder", questionAr: "رتب الكلمات لتكوين جملة صحيحة", shuffledWords: ["طويلٌ", "طَرِيقٌ", "هذا"], correctAnswer: "هذا طَرِيقٌ طويلٌ.", explanation: "الجملة الاسمية: مبتدأ (هذا) + خبر (طريق) + صفة (طويل)." },
      { type: "reorder", questionAr: "رتب الكلمات لتكوين جملة صحيحة", shuffledWords: ["العِلْمُ", "نافعٌ"], correctAnswer: "العِلْمُ نافعٌ.", explanation: "جملة اسمية بسيطة: مبتدأ + خبر." },
    ]
  },
  {
    weekNumber: 2,
    titleAr: "الجذر والاشتقاق",
    titleEn: "Root and Derivation",
    descriptionAr: "توسيع المفردات بسرعة عبر فهم نظام الجذور العربية",
    descriptionEn: "Rapidly expand vocabulary through understanding the Arabic root system",
    lessonContentAr: `# الجذر والاشتقاق

## أهداف الأسبوع
- فهم نظام الجذور الثلاثية
- استنتاج معاني الكلمات الجديدة من الجذر
- التعرف على الأوزان الشائعة

## نظام الجذور
معظم الكلمات العربية تُشتق من جذر ثلاثي (3 حروف أساسية):

### مثال: جذر (ع-ل-م)
- عِلْم = knowledge
- عالِم = scholar
- مَعْلُوم = known
- تَعْلِيم = teaching
- مُعَلِّم = teacher

### مثال: جذر (ك-ت-ب)
- كِتَاب = book
- كاتِب = writer
- مَكْتُوب = written
- مَكْتَبَة = library

## الأوزان الشائعة
- فاعِل (عامل) = اسم الفاعل
- مَفْعول (معمول) = اسم المفعول
- تَفْعِيل (تعليم) = المصدر

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# Root and Derivation

## Week Objectives
- Understand the trilateral root system
- Derive meanings of new words from roots
- Recognize common patterns

## Root System
Most Arabic words derive from a trilateral root (3 base letters):

### Example: Root (ع-ل-م)
- ʿilm = knowledge
- ʿālim = scholar
- maʿlūm = known
- taʿlīm = teaching
- muʿallim = teacher

### Example: Root (ك-ت-ب)
- kitāb = book
- kātib = writer
- maktūb = written
- maktaba = library

## Common Patterns
- fāʿil (doer) = active participle
- mafʿūl (done) = passive participle
- tafʿīl (process) = verbal noun

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "الجذور والأوزان",
    vocabulary: [
      { wordAr: "عالِم", root: "ع-ل-م", translit: "ʿālim", meaningEn: "scholar, scientist", meaningAr: "الشخص ذو العلم والمعرفة", exampleModern: "هو عالِمٌ مشهورٌ.", derivations: [{ word: "علم", meaning: "knowledge" }, { word: "تعليم", meaning: "teaching" }] },
      { wordAr: "كاتِب", root: "ك-ت-ب", translit: "kātib", meaningEn: "writer", meaningAr: "الشخص الذي يكتب", exampleModern: "هو كاتِبٌ ماهرٌ.", derivations: [{ word: "كتاب", meaning: "book" }, { word: "مكتوب", meaning: "written" }] },
      { wordAr: "خالِق", root: "خ-ل-ق", translit: "khāliq", meaningEn: "creator", meaningAr: "الذي يُوجد الشيء", exampleModern: "الفنان خالِقٌ للجمال." },
      { wordAr: "رازِق", root: "ر-ز-ق", translit: "rāziq", meaningEn: "provider", meaningAr: "الذي يُعطي الرزق", exampleModern: "الوالد رازِقٌ لأسرته." },
      { wordAr: "حَكِيم", root: "ح-ك-م", translit: "ḥakīm", meaningEn: "wise", meaningAr: "ذو الحكمة والرأي السديد", exampleModern: "جدي رجلٌ حَكِيمٌ." },
      { wordAr: "عَظِيم", root: "ع-ظ-م", translit: "ʿaẓīm", meaningEn: "great", meaningAr: "الكبير في القدر", exampleModern: "هذا إنجازٌ عَظِيمٌ." },
      { wordAr: "كَرِيم", root: "ك-ر-م", translit: "karīm", meaningEn: "generous", meaningAr: "كثير العطاء", exampleModern: "صديقي كَرِيمٌ جداً." },
      { wordAr: "رَحِيم", root: "ر-ح-م", translit: "raḥīm", meaningEn: "merciful", meaningAr: "ذو الرحمة والعطف", exampleModern: "الطبيب رَحِيمٌ بالمرضى." },
      { wordAr: "سَمِيع", root: "س-م-ع", translit: "samīʿ", meaningEn: "hearing, listener", meaningAr: "الذي يسمع جيداً", exampleModern: "هو سَمِيعٌ لكل شكوى." },
      { wordAr: "بَصِير", root: "ب-ص-ر", translit: "baṣīr", meaningEn: "seeing, insightful", meaningAr: "ذو البصيرة والفهم", exampleModern: "المستشار بَصِيرٌ بالأمور." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "اختر الكلمة المناسبة من نفس الجذر", sentenceWithBlanks: "الـ____ يكتب الكتب.", wordBank: ["كاتِب", "عالِم", "حَكِيم", "كَرِيم"], correctAnswer: "كاتِب", explanation: "كاتب من جذر (ك-ت-ب) مثل كتاب." },
      { type: "fill_blanks", questionAr: "اختر الصفة المناسبة", sentenceWithBlanks: "جدي رجلٌ ____ في قراراته.", wordBank: ["عَظِيم", "حَكِيم", "كاتِب", "سَمِيع"], correctAnswer: "حَكِيم", explanation: "الحكيم هو ذو الحكمة في القرارات." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["مشهورٌ", "عالِمٌ", "هو"], correctAnswer: "هو عالِمٌ مشهورٌ.", explanation: "مبتدأ (هو) + خبر (عالم) + صفة (مشهور)." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["كَرِيمٌ", "جداً", "صديقي"], correctAnswer: "صديقي كَرِيمٌ جداً.", explanation: "مبتدأ + خبر + ظرف." },
    ]
  },
  {
    weekNumber: 3,
    titleAr: "الاسم والصفة",
    titleEn: "Nouns and Adjectives",
    descriptionAr: "التذكير والتأنيث ومطابقة الصفة للموصوف",
    descriptionEn: "Gender agreement and adjective-noun matching",
    lessonContentAr: `# الاسم والصفة

## أهداف الأسبوع
- التمييز بين المذكر والمؤنث
- مطابقة الصفة للموصوف
- بناء تراكيب وصفية

## التذكير والتأنيث
- المؤنث غالباً ينتهي بالتاء المربوطة (ة)
- رَحْمَة (mercy) - مؤنث
- كِتَاب (book) - مذكر

## مطابقة الصفة
الصفة تتبع الموصوف في:
- التذكير والتأنيث
- التعريف والتنكير

### أمثلة
- رَحْمَةٌ واسِعَةٌ (vast mercy)
- رِزْقٌ كَرِيمٌ (generous provision)
- قَوْلٌ سَدِيدٌ (correct speech)

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# Nouns and Adjectives

## Week Objectives
- Distinguish masculine and feminine
- Match adjectives to nouns
- Build descriptive phrases

## Gender
- Feminine usually ends with tā' marbūṭa (ة)
- raḥma (mercy) - feminine
- kitāb (book) - masculine

## Adjective Agreement
Adjectives follow the noun in:
- Gender (masculine/feminine)
- Definiteness (definite/indefinite)

### Examples
- raḥmatun wāsiʿatun (vast mercy)
- rizqun karīmun (generous provision)
- qawlun sadīdun (correct speech)

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "المطابقة والوصف",
    vocabulary: [
      { wordAr: "رَحْمَة", root: "ر-ح-م", translit: "raḥma", meaningEn: "mercy", meaningAr: "العطف والرأفة", exampleModern: "أظهر رَحْمَةً للضعفاء." },
      { wordAr: "واسِعَة", root: "و-س-ع", translit: "wāsiʿa", meaningEn: "vast, wide (f.)", meaningAr: "كبيرة الحجم أو المدى", exampleModern: "الغرفة واسِعَةٌ." },
      { wordAr: "رِزْق", root: "ر-ز-ق", translit: "rizq", meaningEn: "provision, sustenance", meaningAr: "ما يُنتفع به", exampleModern: "البحث عن الرِزْق مهم." },
      { wordAr: "كَرِيم", root: "ك-ر-م", translit: "karīm", meaningEn: "generous, noble", meaningAr: "السخي والمعطاء", exampleModern: "هو رجلٌ كَرِيمٌ." },
      { wordAr: "قَوْل", root: "ق-و-ل", translit: "qawl", meaningEn: "speech, saying", meaningAr: "الكلام المنطوق", exampleModern: "هذا قَوْلٌ صحيحٌ." },
      { wordAr: "سَدِيد", root: "س-د-د", translit: "sadīd", meaningEn: "correct, sound", meaningAr: "الصواب والاستقامة", exampleModern: "رأيه سَدِيدٌ." },
      { wordAr: "حَسَنَة", root: "ح-س-ن", translit: "ḥasana", meaningEn: "good deed, good (f.)", meaningAr: "الفعل الطيب", exampleModern: "النتيجة حَسَنَةٌ." },
      { wordAr: "عَظِيمَة", root: "ع-ظ-م", translit: "ʿaẓīma", meaningEn: "great (f.)", meaningAr: "كبيرة القدر", exampleModern: "هذه فرصةٌ عَظِيمَةٌ." },
      { wordAr: "جَمِيل", root: "ج-م-ل", translit: "jamīl", meaningEn: "beautiful", meaningAr: "حسن المظهر", exampleModern: "المنظر جَمِيلٌ." },
      { wordAr: "جَمِيلَة", root: "ج-م-ل", translit: "jamīla", meaningEn: "beautiful (f.)", meaningAr: "حسنة المظهر", exampleModern: "الحديقة جَمِيلَةٌ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "اختر الصفة المناسبة للاسم المؤنث", sentenceWithBlanks: "هذه رَحْمَةٌ ____.", wordBank: ["واسِعَة", "واسِع", "كَرِيم", "عَظِيم"], correctAnswer: "واسِعَة", explanation: "رحمة مؤنث، فالصفة تكون مؤنثة (واسعة)." },
      { type: "fill_blanks", questionAr: "اختر الصفة المناسبة للاسم المذكر", sentenceWithBlanks: "هذا قَوْلٌ ____.", wordBank: ["سَدِيدَة", "سَدِيد", "جَمِيلَة", "واسِعَة"], correctAnswer: "سَدِيد", explanation: "قول مذكر، فالصفة تكون مذكرة (سديد)." },
      { type: "reorder", questionAr: "رتب لتكوين تركيب وصفي", shuffledWords: ["عَظِيمَةٌ", "فرصةٌ", "هذه"], correctAnswer: "هذه فرصةٌ عَظِيمَةٌ.", explanation: "اسم إشارة + موصوف + صفة." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["جَمِيلٌ", "المنظرُ"], correctAnswer: "المنظرُ جَمِيلٌ.", explanation: "مبتدأ معرف + خبر." },
    ]
  },
  {
    weekNumber: 4,
    titleAr: "الجمع وأوزانه",
    titleEn: "Plurals and Their Patterns",
    descriptionAr: "جمع المذكر والمؤنث السالم وجموع التكسير الشائعة",
    descriptionEn: "Regular and broken plurals in Arabic",
    lessonContentAr: `# الجمع وأوزانه

## أهداف الأسبوع
- التعرف على أنواع الجمع
- حفظ جموع التكسير الشائعة
- استخدام الجموع في جمل

## أنواع الجمع

### جمع المذكر السالم
يُضاف (ون) أو (ين):
- مُسْلِم → مُسْلِمُون/مُسْلِمِين
- عامِل → عامِلُون/عامِلِين

### جمع المؤنث السالم
يُضاف (ات):
- مُسْلِمَة → مُسْلِمَات
- سَيَّارَة → سَيَّارَات

### جمع التكسير
يتغير شكل الكلمة:
- بَيْت → بُيُوت
- يَوْم → أَيَّام
- قَلْب → قُلُوب

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# Plurals and Their Patterns

## Week Objectives
- Recognize types of plurals
- Memorize common broken plurals
- Use plurals in sentences

## Types of Plurals

### Sound Masculine Plural
Add (ūn) or (īn):
- muslim → muslimūn/muslimīn
- ʿāmil → ʿāmilūn/ʿāmilīn

### Sound Feminine Plural
Add (āt):
- muslima → muslimāt
- sayyāra → sayyārāt

### Broken Plural
Word shape changes:
- bayt → buyūt (houses)
- yawm → ayyām (days)
- qalb → qulūb (hearts)

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "الجموع",
    vocabulary: [
      { wordAr: "بُيُوت", root: "ب-ي-ت", translit: "buyūt", meaningEn: "houses", meaningAr: "جمع بيت - المساكن", exampleModern: "البُيُوتُ كثيرةٌ." },
      { wordAr: "أَيَّام", root: "ي-و-م", translit: "ayyām", meaningEn: "days", meaningAr: "جمع يوم", exampleModern: "مرت أَيَّامٌ طويلةٌ." },
      { wordAr: "قُلُوب", root: "ق-ل-ب", translit: "qulūb", meaningEn: "hearts", meaningAr: "جمع قلب", exampleModern: "القُلُوبُ صافيةٌ." },
      { wordAr: "آيَات", root: "أ-ي-ي", translit: "āyāt", meaningEn: "signs, verses", meaningAr: "جمع آية - علامات", exampleModern: "هذه آيَاتٌ واضحةٌ." },
      { wordAr: "سَمَاوَات", root: "س-م-و", translit: "samāwāt", meaningEn: "skies, heavens", meaningAr: "جمع سماء", exampleModern: "السَّمَاوَاتُ صافيةٌ." },
      { wordAr: "أَنْهَار", root: "ن-ه-ر", translit: "anhār", meaningEn: "rivers", meaningAr: "جمع نهر", exampleModern: "الأَنْهَارُ تجري." },
      { wordAr: "جِبَال", root: "ج-ب-ل", translit: "jibāl", meaningEn: "mountains", meaningAr: "جمع جبل", exampleModern: "الجِبَالُ شاهقةٌ." },
      { wordAr: "نَاس", root: "ن-و-س", translit: "nās", meaningEn: "people", meaningAr: "البشر عامة", exampleModern: "النَّاسُ مختلفون." },
      { wordAr: "عُلَمَاء", root: "ع-ل-م", translit: "ʿulamāʾ", meaningEn: "scholars", meaningAr: "جمع عالم", exampleModern: "العُلَمَاءُ يبحثون." },
      { wordAr: "كُتُب", root: "ك-ت-ب", translit: "kutub", meaningEn: "books", meaningAr: "جمع كتاب", exampleModern: "الكُتُبُ مفيدةٌ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "اختر جمع كلمة (بَيْت)", sentenceWithBlanks: "في المدينة ____ كثيرةٌ.", wordBank: ["بُيُوت", "أَيَّام", "قُلُوب", "كُتُب"], correctAnswer: "بُيُوت", explanation: "بيت جمعها بُيُوت (جمع تكسير)." },
      { type: "fill_blanks", questionAr: "اختر جمع كلمة (يَوْم)", sentenceWithBlanks: "مرت ____ سريعةٌ.", wordBank: ["أَنْهَار", "أَيَّام", "جِبَال", "آيَات"], correctAnswer: "أَيَّام", explanation: "يوم جمعها أيام." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["شاهقةٌ", "الجِبَالُ"], correctAnswer: "الجِبَالُ شاهقةٌ.", explanation: "مبتدأ + خبر." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["يبحثون", "العُلَمَاءُ"], correctAnswer: "العُلَمَاءُ يبحثون.", explanation: "مبتدأ + خبر جملة فعلية." },
    ]
  },
  {
    weekNumber: 5,
    titleAr: "الضمائر والإشارة",
    titleEn: "Pronouns and Demonstratives",
    descriptionAr: "الضمائر المنفصلة وأسماء الإشارة والملكية",
    descriptionEn: "Personal pronouns, demonstratives, and possessives",
    lessonContentAr: `# الضمائر والإشارة

## أهداف الأسبوع
- حفظ الضمائر المنفصلة
- استخدام أسماء الإشارة
- التعبير عن الملكية

## الضمائر المنفصلة
- أَنَا (I)
- نَحْنُ (we)
- أَنْتَ (you m.)
- أَنْتِ (you f.)
- هُوَ (he)
- هِيَ (she)
- هُمْ (they m.)

## أسماء الإشارة
- هذا (this m.)
- هذه (this f.)
- ذلك (that m.)
- تلك (that f.)

## الملكية
تُضاف الضمائر المتصلة:
- كِتَابِي (my book)
- كِتَابُكَ (your book)
- كِتَابُهُ (his book)

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# Pronouns and Demonstratives

## Week Objectives
- Memorize independent pronouns
- Use demonstratives
- Express possession

## Independent Pronouns
- anā (I)
- naḥnu (we)
- anta (you m.)
- anti (you f.)
- huwa (he)
- hiya (she)
- hum (they m.)

## Demonstratives
- hādhā (this m.)
- hādhihi (this f.)
- dhālika (that m.)
- tilka (that f.)

## Possession
Attached pronouns are added:
- kitābī (my book)
- kitābuka (your book)
- kitābuhu (his book)

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "الضمائر والإشارة",
    vocabulary: [
      { wordAr: "أَنَا", translit: "anā", meaningEn: "I", meaningAr: "ضمير المتكلم المفرد", exampleModern: "أَنَا طالبٌ." },
      { wordAr: "نَحْنُ", translit: "naḥnu", meaningEn: "we", meaningAr: "ضمير المتكلم الجمع", exampleModern: "نَحْنُ نعمل معاً." },
      { wordAr: "هُوَ", translit: "huwa", meaningEn: "he", meaningAr: "ضمير الغائب المذكر", exampleModern: "هُوَ مهندسٌ." },
      { wordAr: "هِيَ", translit: "hiya", meaningEn: "she", meaningAr: "ضمير الغائب المؤنث", exampleModern: "هِيَ طبيبةٌ." },
      { wordAr: "هذا", translit: "hādhā", meaningEn: "this (m.)", meaningAr: "اسم إشارة للقريب المذكر", exampleModern: "هذا كتابي." },
      { wordAr: "هذه", translit: "hādhihi", meaningEn: "this (f.)", meaningAr: "اسم إشارة للقريب المؤنث", exampleModern: "هذه سيارتي." },
      { wordAr: "ذلك", translit: "dhālika", meaningEn: "that (m.)", meaningAr: "اسم إشارة للبعيد المذكر", exampleModern: "ذلك الرجل طويل." },
      { wordAr: "تلك", translit: "tilka", meaningEn: "that (f.)", meaningAr: "اسم إشارة للبعيد المؤنث", exampleModern: "تلك المرأة طبيبة." },
      { wordAr: "أَنْفُس", root: "ن-ف-س", translit: "anfus", meaningEn: "souls, selves", meaningAr: "جمع نفس - الذوات", exampleModern: "اعتنوا بأَنْفُسِكم." },
      { wordAr: "رَبّ", root: "ر-ب-ب", translit: "rabb", meaningEn: "lord, master", meaningAr: "السيد والمالك", exampleModern: "رَبُّ الأسرة مسؤول." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "اختر الضمير المناسب", sentenceWithBlanks: "____ طالبٌ في الجامعة.", wordBank: ["أَنَا", "هذا", "تلك", "ذلك"], correctAnswer: "أَنَا", explanation: "أنا ضمير المتكلم المفرد." },
      { type: "fill_blanks", questionAr: "اختر اسم الإشارة المناسب للمؤنث", sentenceWithBlanks: "____ سيارةٌ جديدةٌ.", wordBank: ["هذا", "هذه", "ذلك", "هُوَ"], correctAnswer: "هذه", explanation: "سيارة مؤنث، فنستخدم (هذه)." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["معاً", "نعمل", "نَحْنُ"], correctAnswer: "نَحْنُ نعمل معاً.", explanation: "ضمير + فعل + ظرف." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["كتابي", "هذا"], correctAnswer: "هذا كتابي.", explanation: "اسم إشارة + مبتدأ مؤخر." },
    ]
  },
  {
    weekNumber: 6,
    titleAr: "الجملة الاسمية",
    titleEn: "The Nominal Sentence",
    descriptionAr: "بناء الجمل الاسمية للتعريف والوصف",
    descriptionEn: "Building nominal sentences for definition and description",
    lessonContentAr: `# الجملة الاسمية

## أهداف الأسبوع
- فهم بنية الجملة الاسمية
- التمييز بين المبتدأ والخبر
- بناء جمل وصفية

## بنية الجملة الاسمية
المبتدأ + الخبر = جملة اسمية

### أنواع الخبر
1. **خبر مفرد:** العِلْمُ نافعٌ
2. **خبر جملة فعلية:** الطالبُ يدرسُ
3. **خبر شبه جملة:** الكتابُ على الطاولة

### أمثلة
- الحياةُ قصيرةٌ (Life is short)
- الحقُّ واضحٌ (Truth is clear)
- الصبرُ جميلٌ (Patience is beautiful)

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# The Nominal Sentence

## Week Objectives
- Understand nominal sentence structure
- Distinguish subject and predicate
- Build descriptive sentences

## Nominal Sentence Structure
Subject (mubtadaʾ) + Predicate (khabar) = Nominal sentence

### Types of Predicate
1. **Single word:** al-ʿilmu nāfiʿun (Knowledge is useful)
2. **Verbal sentence:** aṭ-ṭālibu yadrusu (The student studies)
3. **Prepositional phrase:** al-kitābu ʿalā aṭ-ṭāwila (The book is on the table)

### Examples
- al-ḥayātu qaṣīratun (Life is short)
- al-ḥaqqu wāḍiḥun (Truth is clear)
- aṣ-ṣabru jamīlun (Patience is beautiful)

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "المبتدأ والخبر",
    vocabulary: [
      { wordAr: "الحياةُ", root: "ح-ي-ي", translit: "al-ḥayāh", meaningEn: "life", meaningAr: "الوجود والعيش", exampleModern: "الحياةُ جميلةٌ." },
      { wordAr: "الحقُّ", root: "ح-ق-ق", translit: "al-ḥaqq", meaningEn: "truth, right", meaningAr: "الصواب والصدق", exampleModern: "الحقُّ يظهرُ دائماً." },
      { wordAr: "الصبرُ", root: "ص-ب-ر", translit: "aṣ-ṣabr", meaningEn: "patience", meaningAr: "التحمل والانتظار", exampleModern: "الصبرُ مفتاحُ النجاح." },
      { wordAr: "العدلُ", root: "ع-د-ل", translit: "al-ʿadl", meaningEn: "justice", meaningAr: "الإنصاف والمساواة", exampleModern: "العدلُ أساسُ الحكم." },
      { wordAr: "السلامُ", root: "س-ل-م", translit: "as-salām", meaningEn: "peace", meaningAr: "الأمان والطمأنينة", exampleModern: "السلامُ مطلوبٌ." },
      { wordAr: "الخيرُ", root: "خ-ي-ر", translit: "al-khayr", meaningEn: "good, goodness", meaningAr: "النفع والصلاح", exampleModern: "الخيرُ يعم." },
      { wordAr: "الشرُّ", root: "ش-ر-ر", translit: "ash-sharr", meaningEn: "evil", meaningAr: "الأذى والضرر", exampleModern: "الشرُّ مكروهٌ." },
      { wordAr: "واضحٌ", root: "و-ض-ح", translit: "wāḍiḥ", meaningEn: "clear", meaningAr: "بيّن وظاهر", exampleModern: "الأمرُ واضحٌ." },
      { wordAr: "قريبٌ", root: "ق-ر-ب", translit: "qarīb", meaningEn: "near, close", meaningAr: "غير بعيد", exampleModern: "البيتُ قريبٌ." },
      { wordAr: "بعيدٌ", root: "ب-ع-د", translit: "baʿīd", meaningEn: "far", meaningAr: "غير قريب", exampleModern: "السفرُ بعيدٌ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أكمل الجملة الاسمية", sentenceWithBlanks: "الحقُّ ____.", wordBank: ["واضحٌ", "يدرس", "كتاب", "على"], correctAnswer: "واضحٌ", explanation: "خبر مفرد للمبتدأ (الحق)." },
      { type: "fill_blanks", questionAr: "اختر المبتدأ المناسب", sentenceWithBlanks: "____ مفتاحُ النجاح.", wordBank: ["الصبرُ", "واضحٌ", "قريبٌ", "يعمل"], correctAnswer: "الصبرُ", explanation: "الصبر مبتدأ والباقي خبر." },
      { type: "reorder", questionAr: "رتب لتكوين جملة اسمية", shuffledWords: ["جميلةٌ", "الحياةُ"], correctAnswer: "الحياةُ جميلةٌ.", explanation: "مبتدأ + خبر." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["أساسُ", "العدلُ", "الحكم"], correctAnswer: "العدلُ أساسُ الحكم.", explanation: "مبتدأ + خبر مضاف." },
    ]
  },
  {
    weekNumber: 7,
    titleAr: "الفعل الماضي والمضارع",
    titleEn: "Past and Present Verbs",
    descriptionAr: "تصريف الأفعال وبناء الجمل الفعلية",
    descriptionEn: "Verb conjugation and building verbal sentences",
    lessonContentAr: `# الفعل الماضي والمضارع

## أهداف الأسبوع
- التمييز بين الماضي والمضارع
- تصريف الأفعال الأساسية
- بناء جمل فعلية

## الفعل الماضي
يدل على حدث وقع في الماضي:
- كَتَبَ (he wrote)
- عَلِمَ (he knew)
- ذَهَبَ (he went)

## الفعل المضارع
يدل على الحاضر أو المستقبل:
- يَكْتُبُ (he writes)
- يَعْلَمُ (he knows)
- يَذْهَبُ (he goes)

## تصريف بسيط
- أَكْتُبُ (I write)
- نَكْتُبُ (we write)
- يَكْتُبُون (they write)

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# Past and Present Verbs

## Week Objectives
- Distinguish past and present tense
- Conjugate basic verbs
- Build verbal sentences

## Past Tense
Indicates completed action:
- kataba (he wrote)
- ʿalima (he knew)
- dhahaba (he went)

## Present Tense
Indicates present or future:
- yaktub (he writes)
- yaʿlam (he knows)
- yadhhabu (he goes)

## Simple Conjugation
- aktubu (I write)
- naktubu (we write)
- yaktubūn (they write)

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "الأفعال",
    vocabulary: [
      { wordAr: "يَعْلَمُ", root: "ع-ل-م", translit: "yaʿlam", meaningEn: "he knows", meaningAr: "يدرك ويفهم", exampleModern: "هو يَعْلَمُ الجواب." },
      { wordAr: "يَخْلُقُ", root: "خ-ل-ق", translit: "yakhluq", meaningEn: "he creates", meaningAr: "يُوجد شيئاً جديداً", exampleModern: "الفنان يَخْلُقُ أعمالاً جميلة." },
      { wordAr: "يَرْزُقُ", root: "ر-ز-ق", translit: "yarzuq", meaningEn: "he provides", meaningAr: "يُعطي الرزق", exampleModern: "الوالد يَرْزُقُ أسرته." },
      { wordAr: "يَكْتُبُ", root: "ك-ت-ب", translit: "yaktub", meaningEn: "he writes", meaningAr: "يخط الكلمات", exampleModern: "الطالب يَكْتُبُ الواجب." },
      { wordAr: "يَقْرَأُ", root: "ق-ر-أ", translit: "yaqraʾ", meaningEn: "he reads", meaningAr: "يطالع المكتوب", exampleModern: "أحمد يَقْرَأُ كتاباً." },
      { wordAr: "يَذْهَبُ", root: "ذ-ه-ب", translit: "yadhab", meaningEn: "he goes", meaningAr: "يتحرك إلى مكان", exampleModern: "هو يَذْهَبُ إلى العمل." },
      { wordAr: "يَأْتِي", root: "أ-ت-ي", translit: "yaʾtī", meaningEn: "he comes", meaningAr: "يحضر إلى مكان", exampleModern: "الضيف يَأْتِي غداً." },
      { wordAr: "قَالَ", root: "ق-و-ل", translit: "qāla", meaningEn: "he said", meaningAr: "تكلم وتحدث", exampleModern: "قَالَ المعلم كلاماً مهماً." },
      { wordAr: "جَاءَ", root: "ج-ي-أ", translit: "jāʾa", meaningEn: "he came", meaningAr: "حضر ووصل", exampleModern: "جَاءَ الصديق مبكراً." },
      { wordAr: "كَانَ", root: "ك-و-ن", translit: "kāna", meaningEn: "he was", meaningAr: "فعل ماضٍ ناقص", exampleModern: "كَانَ الجو بارداً." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "اختر الفعل المضارع المناسب", sentenceWithBlanks: "الطالب ____ الكتاب.", wordBank: ["يَقْرَأُ", "قَالَ", "جَاءَ", "كَانَ"], correctAnswer: "يَقْرَأُ", explanation: "يقرأ فعل مضارع يدل على الحاضر." },
      { type: "fill_blanks", questionAr: "اختر الفعل الماضي المناسب", sentenceWithBlanks: "____ الضيف أمس.", wordBank: ["يَأْتِي", "جَاءَ", "يَذْهَبُ", "يَكْتُبُ"], correctAnswer: "جَاءَ", explanation: "جاء فعل ماضٍ يناسب (أمس)." },
      { type: "reorder", questionAr: "رتب لتكوين جملة فعلية", shuffledWords: ["الواجب", "الطالب", "يَكْتُبُ"], correctAnswer: "يَكْتُبُ الطالب الواجب.", explanation: "فعل + فاعل + مفعول به." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["بارداً", "الجو", "كَانَ"], correctAnswer: "كَانَ الجو بارداً.", explanation: "كان + اسمها + خبرها." },
    ]
  },
  {
    weekNumber: 8,
    titleAr: "حروف الجر والظروف",
    titleEn: "Prepositions and Adverbs",
    descriptionAr: "استخدام حروف الجر وظروف الزمان والمكان",
    descriptionEn: "Using prepositions and adverbs of time and place",
    lessonContentAr: `# حروف الجر والظروف

## أهداف الأسبوع
- حفظ حروف الجر الأساسية
- استخدام ظروف الزمان والمكان
- بناء جمل مركبة

## حروف الجر
- في (in)
- على (on)
- إلى (to)
- من (from)
- عن (about)
- بـ (with/by)
- لـ (for)

## ظروف الزمان
- قَبْلَ (before)
- بَعْدَ (after)
- يَوْمَ (day of)
- عِنْدَ (at/when)

## ظروف المكان
- فَوْقَ (above)
- تَحْتَ (under)
- أَمَامَ (in front)
- خَلْفَ (behind)

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# Prepositions and Adverbs

## Week Objectives
- Memorize basic prepositions
- Use time and place adverbs
- Build complex sentences

## Prepositions
- fī (in)
- ʿalā (on)
- ilā (to)
- min (from)
- ʿan (about)
- bi- (with/by)
- li- (for)

## Time Adverbs
- qabla (before)
- baʿda (after)
- yawma (day of)
- ʿinda (at/when)

## Place Adverbs
- fawqa (above)
- taḥta (under)
- amāma (in front)
- khalfa (behind)

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "الجر والظروف",
    vocabulary: [
      { wordAr: "في", translit: "fī", meaningEn: "in, at", meaningAr: "حرف جر للظرفية", exampleModern: "أنا في البيت." },
      { wordAr: "على", translit: "ʿalā", meaningEn: "on, upon", meaningAr: "حرف جر للاستعلاء", exampleModern: "الكتاب على الطاولة." },
      { wordAr: "إلى", translit: "ilā", meaningEn: "to, towards", meaningAr: "حرف جر للانتهاء", exampleModern: "ذهبت إلى المدرسة." },
      { wordAr: "مِن", translit: "min", meaningEn: "from", meaningAr: "حرف جر للابتداء", exampleModern: "جئت من العمل." },
      { wordAr: "عَن", translit: "ʿan", meaningEn: "about, from", meaningAr: "حرف جر للمجاوزة", exampleModern: "سألت عن الموضوع." },
      { wordAr: "قَبْلَ", translit: "qabla", meaningEn: "before", meaningAr: "ظرف زمان للسابق", exampleModern: "جئت قَبْلَ الموعد." },
      { wordAr: "بَعْدَ", translit: "baʿda", meaningEn: "after", meaningAr: "ظرف زمان للاحق", exampleModern: "سأعود بَعْدَ العمل." },
      { wordAr: "عِنْدَ", translit: "ʿinda", meaningEn: "at, with", meaningAr: "ظرف للقرب أو الملكية", exampleModern: "عِنْدِي سؤال." },
      { wordAr: "فَوْقَ", translit: "fawqa", meaningEn: "above", meaningAr: "ظرف مكان للأعلى", exampleModern: "الطائرة فَوْقَ السحاب." },
      { wordAr: "تَحْتَ", translit: "taḥta", meaningEn: "under", meaningAr: "ظرف مكان للأسفل", exampleModern: "القلم تَحْتَ الكتاب." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "اختر حرف الجر المناسب", sentenceWithBlanks: "ذهبت ____ المدرسة.", wordBank: ["إلى", "عَن", "فَوْقَ", "تَحْتَ"], correctAnswer: "إلى", explanation: "إلى للاتجاه والوصول." },
      { type: "fill_blanks", questionAr: "اختر الظرف المناسب", sentenceWithBlanks: "سأعود ____ العمل.", wordBank: ["بَعْدَ", "فَوْقَ", "في", "على"], correctAnswer: "بَعْدَ", explanation: "بعد ظرف زمان." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["الطاولة", "على", "الكتاب"], correctAnswer: "الكتاب على الطاولة.", explanation: "مبتدأ + خبر شبه جملة." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["السحاب", "فَوْقَ", "الطائرة"], correctAnswer: "الطائرة فَوْقَ السحاب.", explanation: "مبتدأ + ظرف + مضاف إليه." },
    ]
  },
  {
    weekNumber: 9,
    titleAr: "الإضافة",
    titleEn: "The Construct State (Idafa)",
    descriptionAr: "بناء التراكيب الإضافية والعناوين",
    descriptionEn: "Building genitive constructs and titles",
    lessonContentAr: `# الإضافة

## أهداف الأسبوع
- فهم تركيب الإضافة
- بناء عناوين ووصف
- استخدام الإضافة في الكتابة

## تركيب الإضافة
مضاف + مضاف إليه

### قواعد
1. المضاف لا يُنوَّن
2. المضاف إليه مجرور دائماً

### أمثلة
- دارُ السلامِ (house of peace)
- كتابُ العِلْمِ (book of knowledge)
- طريقُ الحقِّ (path of truth)

## استخدامات عملية
- عناوين: "مكتبة المدينة"
- وصف منتجات: "عصير الفواكه"
- سيرة ذاتية: "مدير المشروع"

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# The Construct State (Idafa)

## Week Objectives
- Understand idafa structure
- Build titles and descriptions
- Use idafa in writing

## Idafa Structure
Possessed + Possessor

### Rules
1. First noun loses tanween
2. Second noun is always genitive

### Examples
- dāru s-salāmi (house of peace)
- kitābu l-ʿilmi (book of knowledge)
- ṭarīqu l-ḥaqqi (path of truth)

## Practical Uses
- Titles: "City Library"
- Product descriptions: "Fruit juice"
- Resume: "Project Manager"

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "المضاف والمضاف إليه",
    vocabulary: [
      { wordAr: "دارُ", root: "د-و-ر", translit: "dār", meaningEn: "house, abode", meaningAr: "المسكن والمنزل", exampleModern: "دارُ الكتب مفتوحة." },
      { wordAr: "سلام", root: "س-ل-م", translit: "salām", meaningEn: "peace", meaningAr: "الأمان والسكينة", exampleModern: "نريد السلام." },
      { wordAr: "سبيل", root: "س-ب-ل", translit: "sabīl", meaningEn: "way, path", meaningAr: "الطريق والمسلك", exampleModern: "هذا سبيلُ النجاح." },
      { wordAr: "أهل", root: "أ-ه-ل", translit: "ahl", meaningEn: "people, family", meaningAr: "الأسرة والقوم", exampleModern: "أهلُ البيتِ كرماء." },
      { wordAr: "رَبّ", root: "ر-ب-ب", translit: "rabb", meaningEn: "lord, master", meaningAr: "المالك والسيد", exampleModern: "رَبُّ العمل مسؤول." },
      { wordAr: "مَلِك", root: "م-ل-ك", translit: "malik", meaningEn: "king", meaningAr: "الحاكم الأعلى", exampleModern: "مَلِكُ البلاد حكيم." },
      { wordAr: "يَوْم", root: "ي-و-م", translit: "yawm", meaningEn: "day", meaningAr: "الفترة من الصباح للمساء", exampleModern: "يَوْمُ العمل طويل." },
      { wordAr: "لَيْلَة", root: "ل-ي-ل", translit: "layla", meaningEn: "night", meaningAr: "فترة الظلام", exampleModern: "لَيْلَةُ العيد جميلة." },
      { wordAr: "بَيْت", root: "ب-ي-ت", translit: "bayt", meaningEn: "house", meaningAr: "المسكن", exampleModern: "بَيْتُ العائلة كبير." },
      { wordAr: "باب", root: "ب-و-ب", translit: "bāb", meaningEn: "door, gate", meaningAr: "المدخل", exampleModern: "بابُ الفرص مفتوح." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أكمل الإضافة", sentenceWithBlanks: "هذا كتابُ ____.", wordBank: ["العِلْمِ", "كبير", "يكتب", "على"], correctAnswer: "العِلْمِ", explanation: "كتاب مضاف، والعلم مضاف إليه مجرور." },
      { type: "fill_blanks", questionAr: "اختر المضاف المناسب", sentenceWithBlanks: "____ السلامِ واسعة.", wordBank: ["دارُ", "في", "يذهب", "كتاب"], correctAnswer: "دارُ", explanation: "دار السلام = تركيب إضافي." },
      { type: "reorder", questionAr: "رتب لتكوين إضافة", shuffledWords: ["الحقِّ", "طريقُ"], correctAnswer: "طريقُ الحقِّ.", explanation: "مضاف + مضاف إليه." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["كرماء", "البيتِ", "أهلُ"], correctAnswer: "أهلُ البيتِ كرماء.", explanation: "إضافة + خبر." },
    ]
  },
  {
    weekNumber: 10,
    titleAr: "النفي والاستفهام",
    titleEn: "Negation and Questions",
    descriptionAr: "أدوات النفي والاستفهام وأدوات الربط",
    descriptionEn: "Negation, interrogatives, and conjunctions",
    lessonContentAr: `# النفي والاستفهام

## أهداف الأسبوع
- استخدام أدوات النفي
- طرح الأسئلة
- ربط الجمل

## أدوات النفي
- لا (no, not)
- ما (not - للماضي)
- لَمْ (not - للمضارع المجزوم)
- لَنْ (will not)

### أمثلة
- لا أعرف (I don't know)
- ما ذهب (he didn't go)
- لَمْ يَكْتُب (he hasn't written)

## أدوات الاستفهام
- هَلْ (yes/no question)
- ما/ماذا (what)
- مَنْ (who)
- أَيْنَ (where)
- مَتى (when)
- كَيْفَ (how)
- لِماذا (why)

## أدوات الربط
- وَ (and)
- ثُمَّ (then)
- أَوْ (or)
- لكِنْ (but)
- لأَنَّ (because)

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# Negation and Questions

## Week Objectives
- Use negation particles
- Ask questions
- Connect sentences

## Negation Particles
- lā (no, not)
- mā (not - for past)
- lam (not - for jussive present)
- lan (will not)

### Examples
- lā aʿrif (I don't know)
- mā dhahab (he didn't go)
- lam yaktub (he hasn't written)

## Interrogatives
- hal (yes/no question)
- mā/mādhā (what)
- man (who)
- ayna (where)
- matā (when)
- kayfa (how)
- limādhā (why)

## Conjunctions
- wa (and)
- thumma (then)
- aw (or)
- lākin (but)
- li-anna (because)

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "النفي والاستفهام",
    vocabulary: [
      { wordAr: "لا", translit: "lā", meaningEn: "no, not", meaningAr: "أداة نفي", exampleModern: "لا أعرف الجواب." },
      { wordAr: "ما", translit: "mā", meaningEn: "what / not", meaningAr: "استفهام أو نفي", exampleModern: "ما اسمك؟" },
      { wordAr: "هَلْ", translit: "hal", meaningEn: "is/does (question)", meaningAr: "أداة استفهام", exampleModern: "هَلْ أنت جاهز؟" },
      { wordAr: "مَنْ", translit: "man", meaningEn: "who", meaningAr: "استفهام عن العاقل", exampleModern: "مَنْ هذا؟" },
      { wordAr: "أَيْنَ", translit: "ayna", meaningEn: "where", meaningAr: "استفهام عن المكان", exampleModern: "أَيْنَ الكتاب؟" },
      { wordAr: "مَتى", translit: "matā", meaningEn: "when", meaningAr: "استفهام عن الزمان", exampleModern: "مَتى تأتي؟" },
      { wordAr: "كَيْفَ", translit: "kayfa", meaningEn: "how", meaningAr: "استفهام عن الحال", exampleModern: "كَيْفَ حالك؟" },
      { wordAr: "لِماذا", translit: "limādhā", meaningEn: "why", meaningAr: "استفهام عن السبب", exampleModern: "لِماذا تأخرت؟" },
      { wordAr: "لكِنْ", translit: "lākin", meaningEn: "but", meaningAr: "أداة استدراك", exampleModern: "أحبه لكِنْ أختلف معه." },
      { wordAr: "لأَنَّ", translit: "li-anna", meaningEn: "because", meaningAr: "أداة تعليل", exampleModern: "نجحت لأَنَّني اجتهدت." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "اختر أداة الاستفهام المناسبة", sentenceWithBlanks: "____ اسمك؟", wordBank: ["ما", "لا", "لكِنْ", "وَ"], correctAnswer: "ما", explanation: "ما للسؤال عن الشيء أو الاسم." },
      { type: "fill_blanks", questionAr: "اختر أداة النفي المناسبة", sentenceWithBlanks: "____ أعرف الجواب.", wordBank: ["لا", "هَلْ", "مَنْ", "أَيْنَ"], correctAnswer: "لا", explanation: "لا لنفي المضارع." },
      { type: "reorder", questionAr: "رتب لتكوين سؤال", shuffledWords: ["حالك؟", "كَيْفَ"], correctAnswer: "كَيْفَ حالك؟", explanation: "أداة استفهام + مبتدأ." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["اجتهدت", "لأَنَّني", "نجحت"], correctAnswer: "نجحت لأَنَّني اجتهدت.", explanation: "جملة + أداة تعليل + سبب." },
    ]
  },
  {
    weekNumber: 11,
    titleAr: "الأساليب الشائعة",
    titleEn: "Common Expressions",
    descriptionAr: "التوكيد والتفضيل وصيغ المبالغة",
    descriptionEn: "Emphasis, comparison, and intensive forms",
    lessonContentAr: `# الأساليب الشائعة

## أهداف الأسبوع
- استخدام أدوات التوكيد
- بناء جمل التفضيل
- فهم صيغ المبالغة

## التوكيد
- إِنَّ (indeed, verily)
- قَدْ (certainly)
- لَـ (emphatic)

### أمثلة
- إِنَّ العِلْمَ نورٌ (Indeed, knowledge is light)
- قَدْ نجح (He has certainly succeeded)

## التفضيل
صيغة أَفْعَل:
- أَكْبَر (bigger)
- أَحْسَن (better)
- أَعْظَم (greater)

## صيغ المبالغة
- فَعِيل: رَحِيم، عَلِيم، كَبِير
- فَعَّال: غَفَّار، وَهَّاب
- فَعُول: غَفُور، شَكُور

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# Common Expressions

## Week Objectives
- Use emphasis particles
- Build comparative sentences
- Understand intensive forms

## Emphasis
- inna (indeed, verily)
- qad (certainly)
- la- (emphatic)

### Examples
- inna l-ʿilma nūrun (Indeed, knowledge is light)
- qad najaḥa (He has certainly succeeded)

## Comparison
Pattern afʿal:
- akbar (bigger)
- aḥsan (better)
- aʿẓam (greater)

## Intensive Forms
- faʿīl: raḥīm, ʿalīm, kabīr
- faʿʿāl: ghaffār, wahhāb
- faʿūl: ghafūr, shakūr

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "التوكيد والمبالغة",
    vocabulary: [
      { wordAr: "إِنَّ", translit: "inna", meaningEn: "indeed, verily", meaningAr: "أداة توكيد", exampleModern: "إِنَّ الصدق منجاة." },
      { wordAr: "قَدْ", translit: "qad", meaningEn: "certainly, already", meaningAr: "أداة تحقيق", exampleModern: "قَدْ وصل الضيف." },
      { wordAr: "أَكْبَر", root: "ك-ب-ر", translit: "akbar", meaningEn: "bigger, greatest", meaningAr: "اسم تفضيل من كبير", exampleModern: "هذا أَكْبَر بيت." },
      { wordAr: "أَحْسَن", root: "ح-س-ن", translit: "aḥsan", meaningEn: "better, best", meaningAr: "اسم تفضيل من حسن", exampleModern: "هذا أَحْسَن حل." },
      { wordAr: "أَعْظَم", root: "ع-ظ-م", translit: "aʿẓam", meaningEn: "greater, greatest", meaningAr: "اسم تفضيل من عظيم", exampleModern: "هذا أَعْظَم إنجاز." },
      { wordAr: "غَفُور", root: "غ-ف-ر", translit: "ghafūr", meaningEn: "forgiving", meaningAr: "كثير المغفرة", exampleModern: "كن غَفُوراً للآخرين." },
      { wordAr: "شَكُور", root: "ش-ك-ر", translit: "shakūr", meaningEn: "grateful", meaningAr: "كثير الشكر", exampleModern: "الإنسان الناجح شَكُور." },
      { wordAr: "صَبُور", root: "ص-ب-ر", translit: "ṣabūr", meaningEn: "patient", meaningAr: "كثير الصبر", exampleModern: "المعلم صَبُور." },
      { wordAr: "وَدُود", root: "و-د-د", translit: "wadūd", meaningEn: "loving", meaningAr: "كثير المحبة", exampleModern: "الأم وَدُود." },
      { wordAr: "حَمِيد", root: "ح-م-د", translit: "ḥamīd", meaningEn: "praiseworthy", meaningAr: "مستحق للحمد", exampleModern: "عمله حَمِيد." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أكمل بأداة التوكيد المناسبة", sentenceWithBlanks: "____ الصدقَ منجاةٌ.", wordBank: ["إِنَّ", "هَلْ", "أَيْنَ", "لكِنْ"], correctAnswer: "إِنَّ", explanation: "إنَّ أداة توكيد تنصب المبتدأ." },
      { type: "fill_blanks", questionAr: "اختر اسم التفضيل المناسب", sentenceWithBlanks: "هذا ____ حل.", wordBank: ["أَحْسَن", "حَسَن", "غَفُور", "صَبُور"], correctAnswer: "أَحْسَن", explanation: "أحسن اسم تفضيل للمقارنة." },
      { type: "reorder", questionAr: "رتب لتكوين جملة مؤكدة", shuffledWords: ["نورٌ", "العِلْمَ", "إِنَّ"], correctAnswer: "إِنَّ العِلْمَ نورٌ.", explanation: "إنَّ + اسمها منصوب + خبرها." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["صَبُور", "المعلم"], correctAnswer: "المعلم صَبُور.", explanation: "مبتدأ + خبر (صيغة مبالغة)." },
    ]
  },
  {
    weekNumber: 12,
    titleAr: "المشروع النهائي",
    titleEn: "Final Project",
    descriptionAr: "مشروع تطبيقي واختبار نهائي شامل",
    descriptionEn: "Applied project and comprehensive final exam",
    lessonContentAr: `# المشروع النهائي

## أهداف الأسبوع
- تطبيق ما تعلمته
- كتابة نص متكامل
- إتمام الاختبار النهائي

## المشروع التطبيقي
اكتب نصاً قصيراً (150-250 كلمة) يصف:
- هدفاً تريد تحقيقه، أو
- خطة لمشروع، أو
- قصة قصيرة

### المتطلبات
- استخدم 60-80 مفردة من الدبلوم
- وظف التراكيب النحوية المختلفة
- اجعل النص متماسكاً ومترابطاً

## الاختبار النهائي
- 20 سؤالاً من نموذجَي التمارين
- الوقت: 45 دقيقة
- النجاح: 70% فما فوق

## مراجعة شاملة
راجع المواضيع التالية:
1. الجذور والاشتقاق
2. الجملة الاسمية والفعلية
3. الإضافة والوصف
4. حروف الجر والظروف
5. النفي والاستفهام

**ملاحظة:** هذا المحتوى لتعليم اللغة العربية فقط.`,
    lessonContentEn: `# Final Project

## Week Objectives
- Apply what you learned
- Write a complete text
- Complete the final exam

## Applied Project
Write a short text (150-250 words) describing:
- A goal you want to achieve, or
- A plan for a project, or
- A short story

### Requirements
- Use 60-80 vocabulary words from the diploma
- Employ various grammatical structures
- Make the text coherent and connected

## Final Exam
- 20 questions from the two exercise types
- Time: 45 minutes
- Passing: 70% or above

## Comprehensive Review
Review these topics:
1. Roots and derivation
2. Nominal and verbal sentences
3. Idafa and description
4. Prepositions and adverbs
5. Negation and questions

**Note:** This content is for Arabic language learning only.`,
    grammarFocus: "مراجعة شاملة",
    vocabulary: [
      { wordAr: "هَدَف", root: "ه-د-ف", translit: "hadaf", meaningEn: "goal, objective", meaningAr: "الغاية المطلوبة", exampleModern: "حققت هَدَفي." },
      { wordAr: "خُطَّة", root: "خ-ط-ط", translit: "khuṭṭa", meaningEn: "plan", meaningAr: "البرنامج المرسوم", exampleModern: "لدي خُطَّة واضحة." },
      { wordAr: "نَجَاح", root: "ن-ج-ح", translit: "najāḥ", meaningEn: "success", meaningAr: "تحقيق المطلوب", exampleModern: "النَجَاحُ يحتاج صبراً." },
      { wordAr: "عَمَل", root: "ع-م-ل", translit: "ʿamal", meaningEn: "work, deed", meaningAr: "الفعل والنشاط", exampleModern: "العَمَلُ الجاد مهم." },
      { wordAr: "دَرْس", root: "د-ر-س", translit: "dars", meaningEn: "lesson", meaningAr: "ما يُتعلم", exampleModern: "الدَرْسُ مفيد." },
      { wordAr: "تَقَدُّم", root: "ق-د-م", translit: "taqaddum", meaningEn: "progress", meaningAr: "السير للأمام", exampleModern: "أحرزت تَقَدُّماً." },
      { wordAr: "مُسْتَقْبَل", root: "ق-ب-ل", translit: "mustaqbal", meaningEn: "future", meaningAr: "الزمن الآتي", exampleModern: "المُسْتَقْبَلُ مشرق." },
      { wordAr: "طُمُوح", root: "ط-م-ح", translit: "ṭumūḥ", meaningEn: "ambition", meaningAr: "التطلع للأعلى", exampleModern: "لدي طُمُوحٌ كبير." },
      { wordAr: "إِنْجَاز", root: "ن-ج-ز", translit: "injāz", meaningEn: "achievement", meaningAr: "ما تم تحقيقه", exampleModern: "هذا إِنْجَازٌ عظيم." },
      { wordAr: "شُكْر", root: "ش-ك-ر", translit: "shukr", meaningEn: "thanks, gratitude", meaningAr: "الامتنان والتقدير", exampleModern: "أقدم الشُكْرَ لكم." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "مراجعة: أكمل الجملة", sentenceWithBlanks: "____ العِلْمَ نورٌ.", wordBank: ["إِنَّ", "هَلْ", "أَيْنَ", "مَنْ"], correctAnswer: "إِنَّ", explanation: "إنَّ أداة توكيد." },
      { type: "fill_blanks", questionAr: "مراجعة: اختر الكلمة المناسبة", sentenceWithBlanks: "لدي ____ واضحة للنجاح.", wordBank: ["خُطَّة", "يكتب", "على", "في"], correctAnswer: "خُطَّة", explanation: "خطة = plan." },
      { type: "reorder", questionAr: "مراجعة: رتب الجملة", shuffledWords: ["مشرق", "المُسْتَقْبَلُ"], correctAnswer: "المُسْتَقْبَلُ مشرق.", explanation: "جملة اسمية." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["لكم", "الشُكْرَ", "أقدم"], correctAnswer: "أقدم الشُكْرَ لكم.", explanation: "فعل + مفعول + جار ومجرور." },
    ]
  }
];

async function seedDiplomaContent() {
  console.log("🎓 Starting Diploma Content Seeding...");
  
  // Check if content already exists
  const existingWeeks = await db.select().from(diplomaWeeks);
  if (existingWeeks.length > 0) {
    console.log("✓ Diploma content already exists. Skipping seed.");
    return;
  }
  
  for (const weekData of WEEKS_CONTENT) {
    console.log(`📚 Seeding Week ${weekData.weekNumber}: ${weekData.titleEn}`);
    
    // Insert week
    const [insertedWeek] = await db.insert(diplomaWeeks).values({
      weekNumber: weekData.weekNumber,
      titleAr: weekData.titleAr,
      titleEn: weekData.titleEn,
      descriptionAr: weekData.descriptionAr,
      descriptionEn: weekData.descriptionEn,
      lessonContentAr: weekData.lessonContentAr,
      lessonContentEn: weekData.lessonContentEn,
      grammarFocus: weekData.grammarFocus,
      orderIndex: weekData.weekNumber,
    }).returning();
    
    // Insert vocabulary
    for (let i = 0; i < weekData.vocabulary.length; i++) {
      const vocab = weekData.vocabulary[i];
      await db.insert(diplomaVocabulary).values({
        weekId: insertedWeek.id,
        wordAr: vocab.wordAr,
        root: vocab.root || null,
        translit: vocab.translit,
        meaningEn: vocab.meaningEn,
        meaningAr: vocab.meaningAr,
        derivations: vocab.derivations || null,
        exampleQuranic: vocab.exampleQuranic || null,
        exampleModern: vocab.exampleModern || null,
        orderIndex: i + 1,
      });
    }
    
    // Insert exercises
    for (let i = 0; i < weekData.exercises.length; i++) {
      const ex = weekData.exercises[i];
      await db.insert(diplomaExercises).values({
        weekId: insertedWeek.id,
        exerciseType: ex.type === "fill_blanks" ? "fill_blanks" : "reorder",
        questionAr: ex.questionAr,
        questionEn: ex.type === "fill_blanks" ? "Fill in the blank with the appropriate word" : "Reorder the words to form a correct sentence",
        sentenceWithBlanks: ex.sentenceWithBlanks || null,
        wordBank: ex.wordBank || null,
        shuffledWords: ex.shuffledWords || null,
        correctAnswer: ex.correctAnswer,
        explanation: ex.explanation,
        isQuiz: i >= 2 ? 1 : 0, // Last 2 exercises are quiz
        orderIndex: i + 1,
      });
    }
    
    console.log(`  ✓ Added ${weekData.vocabulary.length} vocabulary items and ${weekData.exercises.length} exercises`);
  }
  
  console.log("🎉 Diploma content seeding completed!");
}

seedDiplomaContent()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
