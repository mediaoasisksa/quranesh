import { db } from "./db";
import { diplomaWeeks, diplomaVocabulary, diplomaExercises } from "@shared/schema";
import { eq } from "drizzle-orm";

const ADDITIONAL_CONTENT = [
  {
    weekNumber: 1,
    vocabulary: [
      { wordAr: "شَمْس", root: "ش-م-س", translit: "shams", meaningEn: "sun", meaningAr: "النجم الذي يضيء نهاراً", exampleModern: "الشَّمْسُ مشرقةٌ." },
      { wordAr: "قَمَر", root: "ق-م-ر", translit: "qamar", meaningEn: "moon", meaningAr: "الكوكب الذي يضيء ليلاً", exampleModern: "القَمَرُ منيرٌ." },
      { wordAr: "نَجْم", root: "ن-ج-م", translit: "najm", meaningEn: "star", meaningAr: "جرم سماوي مضيء", exampleModern: "النَّجْمُ لامعٌ." },
      { wordAr: "بَحْر", root: "ب-ح-ر", translit: "baḥr", meaningEn: "sea", meaningAr: "المسطح المائي الكبير", exampleModern: "البَحْرُ واسعٌ." },
      { wordAr: "جَبَل", root: "ج-ب-ل", translit: "jabal", meaningEn: "mountain", meaningAr: "المرتفع الضخم من الأرض", exampleModern: "الجَبَلُ عالٍ." },
      { wordAr: "نَهْر", root: "ن-ه-ر", translit: "nahr", meaningEn: "river", meaningAr: "مجرى مائي طبيعي", exampleModern: "النَّهْرُ جارٍ." },
      { wordAr: "شَجَرَة", root: "ش-ج-ر", translit: "shajara", meaningEn: "tree", meaningAr: "نبات كبير ذو ساق", exampleModern: "الشَّجَرَةُ كبيرةٌ." },
      { wordAr: "زَهْرَة", root: "ز-ه-ر", translit: "zahra", meaningEn: "flower", meaningAr: "الجزء الجميل من النبات", exampleModern: "الزَّهْرَةُ جميلةٌ." },
      { wordAr: "رِيح", root: "ر-و-ح", translit: "rīḥ", meaningEn: "wind", meaningAr: "الهواء المتحرك", exampleModern: "الرِّيحُ قويةٌ." },
      { wordAr: "مَطَر", root: "م-ط-ر", translit: "maṭar", meaningEn: "rain", meaningAr: "الماء النازل من السماء", exampleModern: "المَطَرُ غزيرٌ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "املأ الفراغ بالكلمة المناسبة", sentenceWithBlanks: "____ مشرقةٌ في السماء.", wordBank: ["الشَّمْسُ", "المَطَرُ", "النَّهْرُ", "الجَبَلُ"], correctAnswer: "الشَّمْسُ", explanation: "الشمس هي التي تشرق." },
      { type: "fill_blanks", questionAr: "اختر الكلمة المناسبة", sentenceWithBlanks: "____ عالٍ جداً.", wordBank: ["الجَبَلُ", "النَّهْرُ", "الزَّهْرَةُ", "الرِّيحُ"], correctAnswer: "الجَبَلُ", explanation: "الجبل هو المرتفع." },
      { type: "reorder", questionAr: "رتب الكلمات لتكوين جملة صحيحة", shuffledWords: ["جميلةٌ", "الزَّهْرَةُ"], correctAnswer: "الزَّهْرَةُ جميلةٌ.", explanation: "جملة اسمية بسيطة." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["منيرٌ", "القَمَرُ", "الليلةَ"], correctAnswer: "القَمَرُ منيرٌ الليلةَ.", explanation: "مبتدأ + خبر + ظرف." },
    ]
  },
  {
    weekNumber: 2,
    vocabulary: [
      { wordAr: "قادِر", root: "ق-د-ر", translit: "qādir", meaningEn: "able, capable", meaningAr: "ذو القدرة والاستطاعة", exampleModern: "هو قادِرٌ على النجاح." },
      { wordAr: "شاكِر", root: "ش-ك-ر", translit: "shākir", meaningEn: "thankful", meaningAr: "الذي يُظهر الامتنان", exampleModern: "أنا شاكِرٌ لك." },
      { wordAr: "صابِر", root: "ص-ب-ر", translit: "ṣābir", meaningEn: "patient", meaningAr: "الذي يتحمل بصبر", exampleModern: "كن صابِراً." },
      { wordAr: "ذاكِر", root: "ذ-ك-ر", translit: "dhākir", meaningEn: "remembering", meaningAr: "الذي يتذكر", exampleModern: "الطالب ذاكِرٌ لدروسه." },
      { wordAr: "عادِل", root: "ع-د-ل", translit: "ʿādil", meaningEn: "just, fair", meaningAr: "المنصف في الحكم", exampleModern: "القاضي عادِلٌ." },
      { wordAr: "صادِق", root: "ص-د-ق", translit: "ṣādiq", meaningEn: "truthful", meaningAr: "الذي يقول الصدق", exampleModern: "هو صادِقٌ دائماً." },
      { wordAr: "مُؤْمِن", root: "أ-م-ن", translit: "muʾmin", meaningEn: "believer", meaningAr: "الذي يؤمن", exampleModern: "هو مُؤْمِنٌ بالنجاح." },
      { wordAr: "مُحْسِن", root: "ح-س-ن", translit: "muḥsin", meaningEn: "doer of good", meaningAr: "الذي يفعل الخير", exampleModern: "الرجل مُحْسِنٌ للفقراء." },
      { wordAr: "مُتَّقٍ", root: "و-ق-ي", translit: "muttaqī", meaningEn: "cautious, pious", meaningAr: "الذي يحذر ويتجنب", exampleModern: "كن مُتَّقِياً للمخاطر." },
      { wordAr: "مُتَوَكِّل", root: "و-ك-ل", translit: "mutawakkil", meaningEn: "trusting, reliant", meaningAr: "الذي يعتمد على غيره", exampleModern: "هو مُتَوَكِّلٌ في أموره." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "اختر الصفة المناسبة", sentenceWithBlanks: "القاضي ____ في حكمه.", wordBank: ["عادِل", "ذاكِر", "شاكِر", "قادِر"], correctAnswer: "عادِل", explanation: "العادل هو المنصف." },
      { type: "fill_blanks", questionAr: "أكمل الجملة", sentenceWithBlanks: "كن ____ في الشدائد.", wordBank: ["صابِراً", "كاتِباً", "عالِماً", "قارِئاً"], correctAnswer: "صابِراً", explanation: "الصبر في الشدائد." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["صادِقٌ", "دائماً", "هو"], correctAnswer: "هو صادِقٌ دائماً.", explanation: "مبتدأ + خبر + ظرف." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["للفقراء", "مُحْسِنٌ", "الرجل"], correctAnswer: "الرجل مُحْسِنٌ للفقراء.", explanation: "مبتدأ + خبر + جار ومجرور." },
    ]
  },
  {
    weekNumber: 3,
    vocabulary: [
      { wordAr: "صَغِير", root: "ص-غ-ر", translit: "ṣaghīr", meaningEn: "small", meaningAr: "قليل الحجم", exampleModern: "البيت صَغِيرٌ." },
      { wordAr: "صَغِيرَة", root: "ص-غ-ر", translit: "ṣaghīra", meaningEn: "small (f.)", meaningAr: "قليلة الحجم", exampleModern: "الغرفة صَغِيرَةٌ." },
      { wordAr: "كَبِير", root: "ك-ب-ر", translit: "kabīr", meaningEn: "big", meaningAr: "عظيم الحجم", exampleModern: "المبنى كَبِيرٌ." },
      { wordAr: "كَبِيرَة", root: "ك-ب-ر", translit: "kabīra", meaningEn: "big (f.)", meaningAr: "عظيمة الحجم", exampleModern: "الشركة كَبِيرَةٌ." },
      { wordAr: "قَوِيّ", root: "ق-و-ي", translit: "qawiyy", meaningEn: "strong", meaningAr: "ذو القوة", exampleModern: "الرجل قَوِيٌّ." },
      { wordAr: "قَوِيَّة", root: "ق-و-ي", translit: "qawiyya", meaningEn: "strong (f.)", meaningAr: "ذات القوة", exampleModern: "الإرادة قَوِيَّةٌ." },
      { wordAr: "ضَعِيف", root: "ض-ع-ف", translit: "ḍaʿīf", meaningEn: "weak", meaningAr: "قليل القوة", exampleModern: "الصوت ضَعِيفٌ." },
      { wordAr: "ضَعِيفَة", root: "ض-ع-ف", translit: "ḍaʿīfa", meaningEn: "weak (f.)", meaningAr: "قليلة القوة", exampleModern: "الإشارة ضَعِيفَةٌ." },
      { wordAr: "قَدِيم", root: "ق-د-م", translit: "qadīm", meaningEn: "old, ancient", meaningAr: "عريق في الزمن", exampleModern: "المسجد قَدِيمٌ." },
      { wordAr: "جَدِيد", root: "ج-د-د", translit: "jadīd", meaningEn: "new", meaningAr: "حديث العهد", exampleModern: "الهاتف جَدِيدٌ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "اختر الصفة المناسبة للمذكر", sentenceWithBlanks: "المبنى ____.", wordBank: ["كَبِيرٌ", "كَبِيرَةٌ", "صَغِيرَةٌ", "قَوِيَّةٌ"], correctAnswer: "كَبِيرٌ", explanation: "المبنى مذكر فالصفة مذكرة." },
      { type: "fill_blanks", questionAr: "اختر الصفة المناسبة للمؤنث", sentenceWithBlanks: "الإرادة ____.", wordBank: ["قَوِيَّةٌ", "قَوِيٌّ", "ضَعِيفٌ", "كَبِيرٌ"], correctAnswer: "قَوِيَّةٌ", explanation: "الإرادة مؤنث." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["جَدِيدٌ", "الهاتف"], correctAnswer: "الهاتف جَدِيدٌ.", explanation: "مبتدأ + خبر." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["قَدِيمٌ", "جداً", "المسجد"], correctAnswer: "المسجد قَدِيمٌ جداً.", explanation: "مبتدأ + خبر + ظرف." },
    ]
  },
  {
    weekNumber: 4,
    vocabulary: [
      { wordAr: "مَدْرَسَة", root: "د-ر-س", translit: "madrasa", meaningEn: "school", meaningAr: "مكان التعليم", exampleModern: "المَدْرَسَةُ قريبةٌ." },
      { wordAr: "جامِعَة", root: "ج-م-ع", translit: "jāmiʿa", meaningEn: "university", meaningAr: "مؤسسة التعليم العالي", exampleModern: "الجامِعَةُ كبيرةٌ." },
      { wordAr: "مَكْتَبَة", root: "ك-ت-ب", translit: "maktaba", meaningEn: "library", meaningAr: "مكان الكتب", exampleModern: "المَكْتَبَةُ هادئةٌ." },
      { wordAr: "مَسْجِد", root: "س-ج-د", translit: "masjid", meaningEn: "mosque", meaningAr: "مكان الصلاة", exampleModern: "المَسْجِدُ جميلٌ." },
      { wordAr: "مُسْتَشْفَى", root: "ش-ف-ي", translit: "mustashfā", meaningEn: "hospital", meaningAr: "مكان العلاج", exampleModern: "المُسْتَشْفَى حديثٌ." },
      { wordAr: "سُوق", root: "س-و-ق", translit: "sūq", meaningEn: "market", meaningAr: "مكان البيع والشراء", exampleModern: "السُّوقُ مزدحمٌ." },
      { wordAr: "شارِع", root: "ش-ر-ع", translit: "shāriʿ", meaningEn: "street", meaningAr: "الطريق في المدينة", exampleModern: "الشارِعُ واسعٌ." },
      { wordAr: "حَدِيقَة", root: "ح-د-ق", translit: "ḥadīqa", meaningEn: "garden, park", meaningAr: "مكان الزرع والأشجار", exampleModern: "الحَدِيقَةُ خضراءٌ." },
      { wordAr: "مَطْعَم", root: "ط-ع-م", translit: "maṭʿam", meaningEn: "restaurant", meaningAr: "مكان الأكل", exampleModern: "المَطْعَمُ مشهورٌ." },
      { wordAr: "فُنْدُق", root: "ف-ن-د-ق", translit: "funduq", meaningEn: "hotel", meaningAr: "مكان الإقامة للمسافرين", exampleModern: "الفُنْدُقُ فاخرٌ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أين نذهب للقراءة والبحث؟", sentenceWithBlanks: "نذهب إلى ____.", wordBank: ["المَكْتَبَةِ", "السُّوقِ", "المَطْعَمِ", "الفُنْدُقِ"], correctAnswer: "المَكْتَبَةِ", explanation: "المكتبة للقراءة والبحث." },
      { type: "fill_blanks", questionAr: "أين نشتري الأشياء؟", sentenceWithBlanks: "____ مكان البيع والشراء.", wordBank: ["السُّوقُ", "المَسْجِدُ", "المَدْرَسَةُ", "الحَدِيقَةُ"], correctAnswer: "السُّوقُ", explanation: "السوق للبيع والشراء." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["جميلٌ", "المَسْجِدُ"], correctAnswer: "المَسْجِدُ جميلٌ.", explanation: "جملة اسمية." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["فاخرٌ", "جداً", "الفُنْدُقُ"], correctAnswer: "الفُنْدُقُ فاخرٌ جداً.", explanation: "مبتدأ + خبر + ظرف." },
    ]
  },
  {
    weekNumber: 5,
    vocabulary: [
      { wordAr: "دَخَلَ", root: "د-خ-ل", translit: "dakhala", meaningEn: "he entered", meaningAr: "ولج إلى الداخل", exampleModern: "دَخَلَ الطالبُ الفصلَ." },
      { wordAr: "خَرَجَ", root: "خ-ر-ج", translit: "kharaja", meaningEn: "he exited", meaningAr: "غادر المكان", exampleModern: "خَرَجَ من البيتِ." },
      { wordAr: "جَلَسَ", root: "ج-ل-س", translit: "jalasa", meaningEn: "he sat", meaningAr: "قعد على مقعد", exampleModern: "جَلَسَ على الكرسيِّ." },
      { wordAr: "قامَ", root: "ق-و-م", translit: "qāma", meaningEn: "he stood", meaningAr: "نهض واقفاً", exampleModern: "قامَ من مكانِهِ." },
      { wordAr: "نَظَرَ", root: "ن-ظ-ر", translit: "naẓara", meaningEn: "he looked", meaningAr: "أبصر بعينيه", exampleModern: "نَظَرَ إلى السماءِ." },
      { wordAr: "سَمِعَ", root: "س-م-ع", translit: "samiʿa", meaningEn: "he heard", meaningAr: "أدرك بالأذن", exampleModern: "سَمِعَ الصوتَ." },
      { wordAr: "أَكَلَ", root: "أ-ك-ل", translit: "akala", meaningEn: "he ate", meaningAr: "تناول الطعام", exampleModern: "أَكَلَ الطعامَ." },
      { wordAr: "شَرِبَ", root: "ش-ر-ب", translit: "shariba", meaningEn: "he drank", meaningAr: "تناول السائل", exampleModern: "شَرِبَ الماءَ." },
      { wordAr: "نامَ", root: "ن-و-م", translit: "nāma", meaningEn: "he slept", meaningAr: "استغرق في النوم", exampleModern: "نامَ مبكراً." },
      { wordAr: "صَحَا", root: "ص-ح-و", translit: "ṣaḥā", meaningEn: "he woke up", meaningAr: "استيقظ من النوم", exampleModern: "صَحَا من نومِهِ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أكمل الجملة بالفعل المناسب", sentenceWithBlanks: "____ الطالبُ الفصلَ.", wordBank: ["دَخَلَ", "نامَ", "شَرِبَ", "سَمِعَ"], correctAnswer: "دَخَلَ", explanation: "دخل = entered." },
      { type: "fill_blanks", questionAr: "ماذا فعل عندما عطش؟", sentenceWithBlanks: "____ الماءَ.", wordBank: ["شَرِبَ", "أَكَلَ", "نَظَرَ", "جَلَسَ"], correctAnswer: "شَرِبَ", explanation: "شرب الماء لإزالة العطش." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["مبكراً", "نامَ"], correctAnswer: "نامَ مبكراً.", explanation: "فعل + ظرف." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["الصوتَ", "سَمِعَ", "الرجلُ"], correctAnswer: "سَمِعَ الرجلُ الصوتَ.", explanation: "فعل + فاعل + مفعول." },
    ]
  },
  {
    weekNumber: 6,
    vocabulary: [
      { wordAr: "يَكْتُبُ", root: "ك-ت-ب", translit: "yaktub", meaningEn: "he writes", meaningAr: "يسطر الكلمات", exampleModern: "يَكْتُبُ رسالةً." },
      { wordAr: "يَقْرَأُ", root: "ق-ر-أ", translit: "yaqraʾ", meaningEn: "he reads", meaningAr: "يتلو المكتوب", exampleModern: "يَقْرَأُ الكتابَ." },
      { wordAr: "يَتَكَلَّمُ", root: "ك-ل-م", translit: "yatakallam", meaningEn: "he speaks", meaningAr: "ينطق بالكلام", exampleModern: "يَتَكَلَّمُ العربيةَ." },
      { wordAr: "يَسْأَلُ", root: "س-أ-ل", translit: "yasʾal", meaningEn: "he asks", meaningAr: "يطلب الجواب", exampleModern: "يَسْأَلُ سؤالاً." },
      { wordAr: "يُجِيبُ", root: "ج-و-ب", translit: "yujīb", meaningEn: "he answers", meaningAr: "يرد على السؤال", exampleModern: "يُجِيبُ بصدق." },
      { wordAr: "يَفْهَمُ", root: "ف-ه-م", translit: "yafham", meaningEn: "he understands", meaningAr: "يدرك المعنى", exampleModern: "يَفْهَمُ الدرسَ." },
      { wordAr: "يَتَعَلَّمُ", root: "ع-ل-م", translit: "yataʿallam", meaningEn: "he learns", meaningAr: "يكتسب المعرفة", exampleModern: "يَتَعَلَّمُ اللغةَ." },
      { wordAr: "يُعَلِّمُ", root: "ع-ل-م", translit: "yuʿallim", meaningEn: "he teaches", meaningAr: "ينقل المعرفة", exampleModern: "يُعَلِّمُ الطلابَ." },
      { wordAr: "يَعْمَلُ", root: "ع-م-ل", translit: "yaʿmal", meaningEn: "he works", meaningAr: "يؤدي العمل", exampleModern: "يَعْمَلُ بجدٍّ." },
      { wordAr: "يَلْعَبُ", root: "ل-ع-ب", translit: "yalʿab", meaningEn: "he plays", meaningAr: "يمارس اللعب", exampleModern: "يَلْعَبُ كرةَ القدمِ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أكمل بالفعل المضارع المناسب", sentenceWithBlanks: "الطالبُ ____ الكتابَ.", wordBank: ["يَقْرَأُ", "يَكْتُبُ", "يَلْعَبُ", "يَنامُ"], correctAnswer: "يَقْرَأُ", explanation: "يقرأ الكتاب = reads the book." },
      { type: "fill_blanks", questionAr: "ماذا يفعل المعلم؟", sentenceWithBlanks: "المعلمُ ____ الطلابَ.", wordBank: ["يُعَلِّمُ", "يَتَعَلَّمُ", "يَسْأَلُ", "يَلْعَبُ"], correctAnswer: "يُعَلِّمُ", explanation: "المعلم يعلّم الطلاب." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["العربيةَ", "يَتَكَلَّمُ", "هو"], correctAnswer: "هو يَتَكَلَّمُ العربيةَ.", explanation: "مبتدأ + فعل + مفعول." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["بجدٍّ", "يَعْمَلُ", "الموظفُ"], correctAnswer: "الموظفُ يَعْمَلُ بجدٍّ.", explanation: "مبتدأ + فعل + ظرف." },
    ]
  },
  {
    weekNumber: 7,
    vocabulary: [
      { wordAr: "بابُ البيتِ", root: null, translit: "bābu l-bayt", meaningEn: "door of the house", meaningAr: "مدخل المنزل", exampleModern: "بابُ البيتِ مفتوحٌ." },
      { wordAr: "مِفْتاحُ السيارةِ", root: null, translit: "miftāḥu s-sayyāra", meaningEn: "car key", meaningAr: "أداة فتح السيارة", exampleModern: "أين مِفْتاحُ السيارةِ؟" },
      { wordAr: "حُجْرَةُ النومِ", root: null, translit: "ḥujratu n-nawm", meaningEn: "bedroom", meaningAr: "غرفة النوم", exampleModern: "حُجْرَةُ النومِ مريحةٌ." },
      { wordAr: "غُرْفَةُ الجلوسِ", root: null, translit: "ghurfatu l-julūs", meaningEn: "living room", meaningAr: "مكان الجلوس", exampleModern: "غُرْفَةُ الجلوسِ واسعةٌ." },
      { wordAr: "طاوِلَةُ الطعامِ", root: null, translit: "ṭāwilatu ṭ-ṭaʿām", meaningEn: "dining table", meaningAr: "مائدة الأكل", exampleModern: "طاوِلَةُ الطعامِ جاهزةٌ." },
      { wordAr: "كُرْسِيُّ المكتبِ", root: null, translit: "kursiyyu l-maktab", meaningEn: "office chair", meaningAr: "مقعد المكتب", exampleModern: "كُرْسِيُّ المكتبِ مريحٌ." },
      { wordAr: "شاشَةُ الحاسوبِ", root: null, translit: "shāshatu l-ḥāsūb", meaningEn: "computer screen", meaningAr: "عرض الكمبيوتر", exampleModern: "شاشَةُ الحاسوبِ كبيرةٌ." },
      { wordAr: "هاتِفُ المكتبِ", root: null, translit: "hātifu l-maktab", meaningEn: "office phone", meaningAr: "تلفون العمل", exampleModern: "هاتِفُ المكتبِ يرنّ." },
      { wordAr: "نافِذَةُ الغرفةِ", root: null, translit: "nāfidhatu l-ghurfa", meaningEn: "room window", meaningAr: "فتحة الضوء", exampleModern: "نافِذَةُ الغرفةِ نظيفةٌ." },
      { wordAr: "سَقْفُ المنزلِ", root: null, translit: "saqfu l-manzil", meaningEn: "house roof", meaningAr: "أعلى البيت", exampleModern: "سَقْفُ المنزلِ عالٍ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أين ننام؟", sentenceWithBlanks: "ننام في ____.", wordBank: ["حُجْرَةِ النومِ", "غُرْفَةِ الجلوسِ", "المطبخِ", "الحمّامِ"], correctAnswer: "حُجْرَةِ النومِ", explanation: "حجرة النوم للنوم." },
      { type: "fill_blanks", questionAr: "أكمل الإضافة", sentenceWithBlanks: "____ مفتوحٌ.", wordBank: ["بابُ البيتِ", "كتابٌ", "قلمٌ", "ماءٌ"], correctAnswer: "بابُ البيتِ", explanation: "باب البيت = door of the house." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["كبيرةٌ", "شاشَةُ", "الحاسوبِ"], correctAnswer: "شاشَةُ الحاسوبِ كبيرةٌ.", explanation: "مضاف + مضاف إليه + خبر." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["مريحٌ", "المكتبِ", "كُرْسِيُّ"], correctAnswer: "كُرْسِيُّ المكتبِ مريحٌ.", explanation: "إضافة + خبر." },
    ]
  },
  {
    weekNumber: 8,
    vocabulary: [
      { wordAr: "فَوْقَ", root: "ف-و-ق", translit: "fawqa", meaningEn: "above", meaningAr: "في الأعلى", exampleModern: "الكتابُ فَوْقَ الطاولةِ." },
      { wordAr: "تَحْتَ", root: "ت-ح-ت", translit: "taḥta", meaningEn: "under", meaningAr: "في الأسفل", exampleModern: "القلمُ تَحْتَ الورقةِ." },
      { wordAr: "أَمَامَ", root: "أ-م-م", translit: "amāma", meaningEn: "in front of", meaningAr: "قُدّام", exampleModern: "الحديقةُ أَمَامَ البيتِ." },
      { wordAr: "وَرَاءَ", root: "و-ر-ي", translit: "warāʾa", meaningEn: "behind", meaningAr: "خلف", exampleModern: "السيارةُ وَرَاءَ المبنى." },
      { wordAr: "يَمِينَ", root: "ي-م-ن", translit: "yamīna", meaningEn: "to the right", meaningAr: "الجهة اليمنى", exampleModern: "المكتبةُ يَمِينَ الشارعِ." },
      { wordAr: "يَسَارَ", root: "ي-س-ر", translit: "yasāra", meaningEn: "to the left", meaningAr: "الجهة اليسرى", exampleModern: "المسجدُ يَسَارَ الميدانِ." },
      { wordAr: "دَاخِلَ", root: "د-خ-ل", translit: "dākhila", meaningEn: "inside", meaningAr: "في الباطن", exampleModern: "الأثاثُ دَاخِلَ الغرفةِ." },
      { wordAr: "خَارِجَ", root: "خ-ر-ج", translit: "khārija", meaningEn: "outside", meaningAr: "في الظاهر", exampleModern: "الحديقةُ خَارِجَ المنزلِ." },
      { wordAr: "بِجانِبِ", root: "ج-ن-ب", translit: "bi-jānib", meaningEn: "beside", meaningAr: "إلى جنب", exampleModern: "الكرسيُّ بِجانِبِ الطاولةِ." },
      { wordAr: "وَسَطَ", root: "و-س-ط", translit: "wasaṭa", meaningEn: "in the middle of", meaningAr: "في المنتصف", exampleModern: "النافورةُ وَسَطَ الحديقةِ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أين الكتاب؟", sentenceWithBlanks: "الكتابُ ____ الطاولةِ.", wordBank: ["فَوْقَ", "يَكْتُبُ", "جميلٌ", "سريعٌ"], correctAnswer: "فَوْقَ", explanation: "فوق = above." },
      { type: "fill_blanks", questionAr: "أين السيارة؟", sentenceWithBlanks: "السيارةُ ____ المبنى.", wordBank: ["وَرَاءَ", "كبيرٌ", "يدخلُ", "قديمٌ"], correctAnswer: "وَرَاءَ", explanation: "وراء = behind." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["المنزلِ", "خَارِجَ", "الحديقةُ"], correctAnswer: "الحديقةُ خَارِجَ المنزلِ.", explanation: "مبتدأ + ظرف + مضاف إليه." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["الحديقةِ", "وَسَطَ", "النافورةُ"], correctAnswer: "النافورةُ وَسَطَ الحديقةِ.", explanation: "مبتدأ + ظرف + مضاف إليه." },
    ]
  },
  {
    weekNumber: 9,
    vocabulary: [
      { wordAr: "لا أَعْرِفُ", root: "ع-ر-ف", translit: "lā aʿrif", meaningEn: "I don't know", meaningAr: "ليس لدي علم", exampleModern: "لا أَعْرِفُ الإجابةَ." },
      { wordAr: "لا أَفْهَمُ", root: "ف-ه-م", translit: "lā afham", meaningEn: "I don't understand", meaningAr: "لا أدرك المعنى", exampleModern: "لا أَفْهَمُ هذا." },
      { wordAr: "لا أُحِبُّ", root: "ح-ب-ب", translit: "lā uḥibb", meaningEn: "I don't like", meaningAr: "ليس لدي ميل", exampleModern: "لا أُحِبُّ الانتظارَ." },
      { wordAr: "لا أَسْتَطِيعُ", root: "ط-و-ع", translit: "lā astaṭīʿ", meaningEn: "I cannot", meaningAr: "ليس بمقدوري", exampleModern: "لا أَسْتَطِيعُ الحضورَ." },
      { wordAr: "لا يُوجَدُ", root: "و-ج-د", translit: "lā yūjad", meaningEn: "there is not", meaningAr: "غير موجود", exampleModern: "لا يُوجَدُ وقتٌ." },
      { wordAr: "ما هذا؟", root: null, translit: "mā hādhā?", meaningEn: "What is this?", meaningAr: "سؤال عن الشيء", exampleModern: "ما هذا الشيء؟" },
      { wordAr: "لِماذا؟", root: null, translit: "limādhā?", meaningEn: "Why?", meaningAr: "سؤال عن السبب", exampleModern: "لِماذا تأخرت؟" },
      { wordAr: "مَتَى؟", root: null, translit: "matā?", meaningEn: "When?", meaningAr: "سؤال عن الزمان", exampleModern: "مَتَى تصل؟" },
      { wordAr: "كَيْفَ؟", root: null, translit: "kayfa?", meaningEn: "How?", meaningAr: "سؤال عن الكيفية", exampleModern: "كَيْفَ حالُك؟" },
      { wordAr: "كَمْ؟", root: null, translit: "kam?", meaningEn: "How many/much?", meaningAr: "سؤال عن العدد", exampleModern: "كَمْ الثمنُ؟" },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أكمل جملة النفي", sentenceWithBlanks: "____ الإجابةَ.", wordBank: ["لا أَعْرِفُ", "أَعْرِفُ", "نَعَمْ", "هَلْ"], correctAnswer: "لا أَعْرِفُ", explanation: "لا أعرف = I don't know." },
      { type: "fill_blanks", questionAr: "اختر أداة الاستفهام المناسبة", sentenceWithBlanks: "____ تصل؟", wordBank: ["مَتَى", "لا", "نَعَمْ", "إِنَّ"], correctAnswer: "مَتَى", explanation: "متى للسؤال عن الزمان." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["حالُك؟", "كَيْفَ"], correctAnswer: "كَيْفَ حالُك؟", explanation: "أداة استفهام + مبتدأ." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["الانتظارَ", "أُحِبُّ", "لا"], correctAnswer: "لا أُحِبُّ الانتظارَ.", explanation: "نفي + فعل + مفعول." },
    ]
  },
  {
    weekNumber: 10,
    vocabulary: [
      { wordAr: "سَوْفَ أَذْهَبُ", root: "ذ-ه-ب", translit: "sawfa adhhab", meaningEn: "I will go", meaningAr: "سأتوجه لاحقاً", exampleModern: "سَوْفَ أَذْهَبُ غداً." },
      { wordAr: "سَأَعْمَلُ", root: "ع-م-ل", translit: "saʾaʿmal", meaningEn: "I will work", meaningAr: "سأؤدي العمل", exampleModern: "سَأَعْمَلُ بجدٍّ." },
      { wordAr: "سَنَتَعَلَّمُ", root: "ع-ل-م", translit: "sanataʿallam", meaningEn: "we will learn", meaningAr: "سنكتسب المعرفة", exampleModern: "سَنَتَعَلَّمُ معاً." },
      { wordAr: "سَيَأْتِي", root: "أ-ت-ي", translit: "sayaʾtī", meaningEn: "he will come", meaningAr: "سيحضر لاحقاً", exampleModern: "سَيَأْتِي قريباً." },
      { wordAr: "سَتَنْجَحُ", root: "ن-ج-ح", translit: "satanjaḥ", meaningEn: "you will succeed", meaningAr: "ستحقق النجاح", exampleModern: "سَتَنْجَحُ بإذن الله." },
      { wordAr: "كانَ يَعْمَلُ", root: "ع-م-ل", translit: "kāna yaʿmal", meaningEn: "he was working", meaningAr: "كان يؤدي العمل", exampleModern: "كانَ يَعْمَلُ هنا." },
      { wordAr: "كُنْتُ أَدْرُسُ", root: "د-ر-س", translit: "kuntu adrus", meaningEn: "I was studying", meaningAr: "كنت أتعلم", exampleModern: "كُنْتُ أَدْرُسُ العربية." },
      { wordAr: "كانُوا يَسْكُنُون", root: "س-ك-ن", translit: "kānū yaskun", meaningEn: "they were living", meaningAr: "كانوا يقيمون", exampleModern: "كانُوا يَسْكُنُون هنا." },
      { wordAr: "أَصْبَحَ", root: "ص-ب-ح", translit: "aṣbaḥa", meaningEn: "became", meaningAr: "صار كذلك", exampleModern: "أَصْبَحَ طبيباً." },
      { wordAr: "ظَلَّ", root: "ظ-ل-ل", translit: "ẓalla", meaningEn: "remained", meaningAr: "بقي واستمر", exampleModern: "ظَلَّ يعملُ." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أكمل جملة المستقبل", sentenceWithBlanks: "____ غداً.", wordBank: ["سَوْفَ أَذْهَبُ", "ذَهَبْتُ", "أَذْهَبُ", "ذَهَبَ"], correctAnswer: "سَوْفَ أَذْهَبُ", explanation: "سوف + المضارع = المستقبل." },
      { type: "fill_blanks", questionAr: "أكمل جملة الماضي المستمر", sentenceWithBlanks: "____ العربيةَ.", wordBank: ["كُنْتُ أَدْرُسُ", "أَدْرُسُ", "سَأَدْرُسُ", "دَرَسْتُ"], correctAnswer: "كُنْتُ أَدْرُسُ", explanation: "كان + المضارع = الماضي المستمر." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["طبيباً", "أَصْبَحَ"], correctAnswer: "أَصْبَحَ طبيباً.", explanation: "كان وأخواتها." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["هنا", "يَسْكُنُون", "كانُوا"], correctAnswer: "كانُوا يَسْكُنُون هنا.", explanation: "كان + فعل مضارع + ظرف." },
    ]
  },
  {
    weekNumber: 11,
    vocabulary: [
      { wordAr: "أَنْ يَتَعَلَّمَ", root: "ع-ل-م", translit: "an yataʿallam", meaningEn: "to learn", meaningAr: "أن يكتسب المعرفة", exampleModern: "يريدُ أَنْ يَتَعَلَّمَ." },
      { wordAr: "أَنْ يَنْجَحَ", root: "ن-ج-ح", translit: "an yanjaḥ", meaningEn: "to succeed", meaningAr: "أن يحقق النجاح", exampleModern: "يسعى أَنْ يَنْجَحَ." },
      { wordAr: "أَنْ يَفْهَمَ", root: "ف-ه-م", translit: "an yafham", meaningEn: "to understand", meaningAr: "أن يدرك", exampleModern: "يحاولُ أَنْ يَفْهَمَ." },
      { wordAr: "أَنْ يُساعِدَ", root: "س-ع-د", translit: "an yusāʿid", meaningEn: "to help", meaningAr: "أن يقدم المساعدة", exampleModern: "يحبُّ أَنْ يُساعِدَ." },
      { wordAr: "أَنْ يَعْمَلَ", root: "ع-م-ل", translit: "an yaʿmal", meaningEn: "to work", meaningAr: "أن يؤدي العمل", exampleModern: "عليه أَنْ يَعْمَلَ." },
      { wordAr: "الَّذِي تَعَلَّمَ", root: "ع-ل-م", translit: "alladhī taʿallam", meaningEn: "who learned (m.)", meaningAr: "الذي اكتسب", exampleModern: "الرجلُ الَّذِي تَعَلَّمَ." },
      { wordAr: "الَّتِي نَجَحَتْ", root: "ن-ج-ح", translit: "allatī najaḥat", meaningEn: "who succeeded (f.)", meaningAr: "التي حققت النجاح", exampleModern: "الطالبةُ الَّتِي نَجَحَتْ." },
      { wordAr: "الَّذِينَ عَمِلُوا", root: "ع-م-ل", translit: "alladhīna ʿamilū", meaningEn: "those who worked", meaningAr: "الذين أدوا العمل", exampleModern: "الناسُ الَّذِينَ عَمِلُوا." },
      { wordAr: "حَيْثُ", root: "ح-ي-ث", translit: "ḥaythu", meaningEn: "where", meaningAr: "المكان الذي", exampleModern: "المكانُ حَيْثُ يعيش." },
      { wordAr: "عِنْدَما", root: "ع-ن-د", translit: "ʿindamā", meaningEn: "when", meaningAr: "في الوقت الذي", exampleModern: "عِنْدَما وصل." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أكمل الجملة بأن والفعل المضارع المنصوب", sentenceWithBlanks: "يريدُ ____ العربيةَ.", wordBank: ["أَنْ يَتَعَلَّمَ", "يَتَعَلَّمُ", "تَعَلَّمَ", "تَعَلُّم"], correctAnswer: "أَنْ يَتَعَلَّمَ", explanation: "يريد + أن + المضارع المنصوب." },
      { type: "fill_blanks", questionAr: "أكمل بالاسم الموصول المناسب", sentenceWithBlanks: "الطالبةُ ____ نَجَحَتْ.", wordBank: ["الَّتِي", "الَّذِي", "الَّذِينَ", "أَنْ"], correctAnswer: "الَّتِي", explanation: "التي للمؤنث." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["وصل", "عِنْدَما", "ابتسم"], correctAnswer: "عِنْدَما وصل ابتسم.", explanation: "ظرف زمان + فعل + فعل." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["يُساعِدَ", "أَنْ", "يحبُّ"], correctAnswer: "يحبُّ أَنْ يُساعِدَ.", explanation: "فعل + أن + مضارع منصوب." },
    ]
  },
  {
    weekNumber: 12,
    vocabulary: [
      { wordAr: "تَخَرُّج", root: "خ-ر-ج", translit: "takharruj", meaningEn: "graduation", meaningAr: "إتمام الدراسة", exampleModern: "يومُ التَّخَرُّجِ سعيدٌ." },
      { wordAr: "شَهادَة", root: "ش-ه-د", translit: "shahāda", meaningEn: "certificate", meaningAr: "وثيقة الإتمام", exampleModern: "حصلتُ على الشَّهادَةِ." },
      { wordAr: "مُراجَعَة", root: "ر-ج-ع", translit: "murājaʿa", meaningEn: "review", meaningAr: "إعادة النظر", exampleModern: "المُراجَعَةُ مفيدةٌ." },
      { wordAr: "تَطْبِيق", root: "ط-ب-ق", translit: "taṭbīq", meaningEn: "application", meaningAr: "الاستخدام العملي", exampleModern: "التَّطْبِيقُ مهمٌّ." },
      { wordAr: "مُمَارَسَة", root: "م-ر-س", translit: "mumārasa", meaningEn: "practice", meaningAr: "التدريب المستمر", exampleModern: "المُمَارَسَةُ تصنع الإتقان." },
      { wordAr: "إِتْقان", root: "ت-ق-ن", translit: "itqān", meaningEn: "mastery", meaningAr: "الإجادة التامة", exampleModern: "الإِتْقانُ هدفي." },
      { wordAr: "تَفَوُّق", root: "ف-و-ق", translit: "tafawwuq", meaningEn: "excellence", meaningAr: "التميز والبروز", exampleModern: "حقق التَّفَوُّقَ." },
      { wordAr: "اسْتِمْرار", root: "م-ر-ر", translit: "istimrār", meaningEn: "continuation", meaningAr: "المواصلة", exampleModern: "الاسْتِمْرارُ مطلوبٌ." },
      { wordAr: "تَحْسِين", root: "ح-س-ن", translit: "taḥsīn", meaningEn: "improvement", meaningAr: "جعل الشيء أفضل", exampleModern: "التَّحْسِينُ مستمرٌّ." },
      { wordAr: "مُثابَرَة", root: "ث-ب-ر", translit: "muthābara", meaningEn: "perseverance", meaningAr: "المواظبة والصبر", exampleModern: "المُثابَرَةُ تؤدي للنجاح." },
    ],
    exercises: [
      { type: "fill_blanks", questionAr: "أكمل الجملة", sentenceWithBlanks: "____ تصنع الإتقان.", wordBank: ["المُمَارَسَةُ", "الشَّهادَةُ", "التَّخَرُّجُ", "الهَدَفُ"], correctAnswer: "المُمَارَسَةُ", explanation: "الممارسة تؤدي للإتقان." },
      { type: "fill_blanks", questionAr: "ما هو هدفنا؟", sentenceWithBlanks: "هدفنا هو ____.", wordBank: ["الإِتْقانُ", "النومُ", "الأكلُ", "اللعبُ"], correctAnswer: "الإِتْقانُ", explanation: "الإتقان هو الهدف الأعلى." },
      { type: "reorder", questionAr: "رتب الكلمات", shuffledWords: ["للنجاح", "تؤدي", "المُثابَرَةُ"], correctAnswer: "المُثابَرَةُ تؤدي للنجاح.", explanation: "مبتدأ + فعل + جار ومجرور." },
      { type: "reorder", questionAr: "رتب لتكوين جملة", shuffledWords: ["مستمرٌّ", "التَّحْسِينُ"], correctAnswer: "التَّحْسِينُ مستمرٌّ.", explanation: "جملة اسمية." },
    ]
  }
];

async function addMoreDiplomaContent() {
  console.log("📚 Adding more vocabulary and exercises to diploma...");
  
  const weeks = await db.select().from(diplomaWeeks);
  
  for (const weekData of ADDITIONAL_CONTENT) {
    const week = weeks.find(w => w.weekNumber === weekData.weekNumber);
    if (!week) {
      console.log(`⚠️ Week ${weekData.weekNumber} not found, skipping...`);
      continue;
    }
    
    console.log(`📖 Adding content to Week ${weekData.weekNumber}...`);
    
    // Get current max orderIndex for vocabulary
    const existingVocab = await db.select().from(diplomaVocabulary).where(eq(diplomaVocabulary.weekId, week.id));
    const vocabStartIndex = existingVocab.length + 1;
    
    // Add new vocabulary
    for (let i = 0; i < weekData.vocabulary.length; i++) {
      const vocab = weekData.vocabulary[i];
      await db.insert(diplomaVocabulary).values({
        weekId: week.id,
        wordAr: vocab.wordAr,
        root: vocab.root || null,
        translit: vocab.translit,
        meaningEn: vocab.meaningEn,
        meaningAr: vocab.meaningAr,
        derivations: null,
        exampleQuranic: null,
        exampleModern: vocab.exampleModern || null,
        orderIndex: vocabStartIndex + i,
      });
    }
    
    // Get current max orderIndex for exercises
    const existingExercises = await db.select().from(diplomaExercises).where(eq(diplomaExercises.weekId, week.id));
    const exerciseStartIndex = existingExercises.length + 1;
    
    // Add new exercises
    for (let i = 0; i < weekData.exercises.length; i++) {
      const ex = weekData.exercises[i];
      await db.insert(diplomaExercises).values({
        weekId: week.id,
        exerciseType: ex.type === "fill_blanks" ? "fill_blanks" : "reorder",
        questionAr: ex.questionAr,
        questionEn: ex.type === "fill_blanks" ? "Fill in the blank with the appropriate word" : "Reorder the words to form a correct sentence",
        sentenceWithBlanks: ex.sentenceWithBlanks || null,
        wordBank: ex.wordBank || null,
        shuffledWords: ex.shuffledWords || null,
        correctAnswer: ex.correctAnswer,
        explanation: ex.explanation,
        isQuiz: i >= 2 ? 1 : 0,
        orderIndex: exerciseStartIndex + i,
      });
    }
    
    console.log(`  ✓ Added ${weekData.vocabulary.length} vocabulary + ${weekData.exercises.length} exercises`);
  }
  
  console.log("🎉 Content doubling completed!");
}

addMoreDiplomaContent()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
