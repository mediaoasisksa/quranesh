import { db } from "./db";
import { diplomaWeeks, diplomaExercises } from "@shared/schema";
import { eq } from "drizzle-orm";

const NEW_QUESTIONS = [
  // Week 1 - أسئلة إضافية عن المشاعر (8 أسئلة)
  {
    weekNumber: 1,
    questions: [
      { questionAr: "كيف تصف شعورك بالراحة؟", questionEn: "How do you describe feeling at peace?", correctAnswer: "سكينة", wordBank: ["سكينة", "راحة", "هدوء", "أمان"] },
      { questionAr: "ما الذي يجعلك سعيداً؟", questionEn: "What makes you happy?", correctAnswer: "فرح", wordBank: ["فرح", "سعادة", "بهجة", "سرور"] },
      { questionAr: "هل تشعر بالأمان الآن؟", questionEn: "Do you feel safe now?", correctAnswer: "أمنة مطمئنة", wordBank: ["أمنة مطمئنة", "آمن", "مطمئن", "هادئ"] },
      { questionAr: "ما الذي يقلقك؟", questionEn: "What worries you?", correctAnswer: "همّ", wordBank: ["همّ", "قلق", "خوف", "حزن"] },
      { questionAr: "كيف تتعامل مع الحزن؟", questionEn: "How do you deal with sadness?", correctAnswer: "صبر جميل", wordBank: ["صبر جميل", "بالدعاء", "بالصبر", "بالذكر"] },
      { questionAr: "هل أنت راضٍ عن يومك؟", questionEn: "Are you satisfied with your day?", correctAnswer: "رضي الله عنهم ورضوا عنه", wordBank: ["رضي الله عنهم ورضوا عنه", "نعم", "الحمد لله", "راضٍ"] },
      { questionAr: "ما الذي يملأ قلبك بالسلام؟", questionEn: "What fills your heart with peace?", correctAnswer: "ذكر الله", wordBank: ["ذكر الله", "الصلاة", "القرآن", "الدعاء"] },
      { questionAr: "كيف تشعر عندما تسمع القرآن؟", questionEn: "How do you feel when you hear the Quran?", correctAnswer: "تقشعر منه الجلود", wordBank: ["تقشعر منه الجلود", "سعادة", "طمأنينة", "خشوع"] },
    ]
  },
  // Week 2 - أسئلة عن العلاقات (8 أسئلة)
  {
    weekNumber: 2,
    questions: [
      { questionAr: "كيف تعامل والديك؟", questionEn: "How do you treat your parents?", correctAnswer: "وبالوالدين إحساناً", wordBank: ["وبالوالدين إحساناً", "بالاحترام", "بالحب", "بالرعاية"] },
      { questionAr: "ما واجبك تجاه جيرانك؟", questionEn: "What is your duty towards your neighbors?", correctAnswer: "والجار ذي القربى", wordBank: ["والجار ذي القربى", "الإحسان", "المساعدة", "الاحترام"] },
      { questionAr: "كيف تتعامل مع الضيف؟", questionEn: "How do you treat a guest?", correctAnswer: "أكرموا الضيف", wordBank: ["أكرموا الضيف", "بالترحيب", "بالكرم", "بالاحترام"] },
      { questionAr: "ما حق اليتيم؟", questionEn: "What is the right of the orphan?", correctAnswer: "فأما اليتيم فلا تقهر", wordBank: ["فأما اليتيم فلا تقهر", "الرعاية", "الإحسان", "الحماية"] },
      { questionAr: "كيف تعامل المسكين؟", questionEn: "How do you treat the needy?", correctAnswer: "وأما السائل فلا تنهر", wordBank: ["وأما السائل فلا تنهر", "بالكرم", "بالإحسان", "بالمساعدة"] },
      { questionAr: "ما أهمية صلة الرحم؟", questionEn: "What is the importance of maintaining family ties?", correctAnswer: "وأولو الأرحام", wordBank: ["وأولو الأرحام", "التواصل", "المحبة", "الزيارة"] },
      { questionAr: "كيف تتصرف مع من أساء إليك؟", questionEn: "How do you act with someone who wronged you?", correctAnswer: "ادفع بالتي هي أحسن", wordBank: ["ادفع بالتي هي أحسن", "أعفو", "أسامح", "أصفح"] },
      { questionAr: "ما أفضل وصف للصداقة الحقيقية؟", questionEn: "What is the best description of true friendship?", correctAnswer: "الأخلاء يومئذ بعضهم لبعض عدو إلا المتقين", wordBank: ["الأخلاء يومئذ بعضهم لبعض عدو إلا المتقين", "الوفاء", "الصدق", "الإخلاص"] },
    ]
  },
  // Week 3 - أسئلة عن العلم والحكمة (8 أسئلة)
  {
    weekNumber: 3,
    questions: [
      { questionAr: "ما قيمة العلم؟", questionEn: "What is the value of knowledge?", correctAnswer: "يرفع الله الذين آمنوا والذين أوتوا العلم درجات", wordBank: ["يرفع الله الذين آمنوا والذين أوتوا العلم درجات", "كبيرة", "عظيمة", "مهمة"] },
      { questionAr: "كيف نطلب الهداية؟", questionEn: "How do we seek guidance?", correctAnswer: "اهدنا الصراط المستقيم", wordBank: ["اهدنا الصراط المستقيم", "بالدعاء", "بالصلاة", "بالتوبة"] },
      { questionAr: "ما مفتاح الحكمة؟", questionEn: "What is the key to wisdom?", correctAnswer: "يؤتي الحكمة من يشاء", wordBank: ["يؤتي الحكمة من يشاء", "التفكر", "التدبر", "التأمل"] },
      { questionAr: "كيف نتعلم من الطبيعة؟", questionEn: "How do we learn from nature?", correctAnswer: "أفلا ينظرون", wordBank: ["أفلا ينظرون", "بالتأمل", "بالنظر", "بالتفكر"] },
      { questionAr: "ما فائدة القصص القرآني؟", questionEn: "What is the benefit of Quranic stories?", correctAnswer: "لقد كان في قصصهم عبرة", wordBank: ["لقد كان في قصصهم عبرة", "التعلم", "الاتعاظ", "الحكمة"] },
      { questionAr: "كيف نفهم القرآن؟", questionEn: "How do we understand the Quran?", correctAnswer: "أفلا يتدبرون القرآن", wordBank: ["أفلا يتدبرون القرآن", "بالقراءة", "بالتفسير", "بالتعلم"] },
      { questionAr: "ما أول ما أُنزل من القرآن؟", questionEn: "What was the first thing revealed from the Quran?", correctAnswer: "اقرأ باسم ربك", wordBank: ["اقرأ باسم ربك", "الفاتحة", "البقرة", "الإخلاص"] },
      { questionAr: "كيف نسأل أهل العلم؟", questionEn: "How do we ask the people of knowledge?", correctAnswer: "فاسألوا أهل الذكر", wordBank: ["فاسألوا أهل الذكر", "بأدب", "باحترام", "بتواضع"] },
    ]
  },
  // Week 4 - أسئلة عن الأخلاق (8 أسئلة)
  {
    weekNumber: 4,
    questions: [
      { questionAr: "ما أفضل الأخلاق؟", questionEn: "What is the best character?", correctAnswer: "وإنك لعلى خلق عظيم", wordBank: ["وإنك لعلى خلق عظيم", "الصدق", "الأمانة", "الوفاء"] },
      { questionAr: "كيف نتجنب الكذب؟", questionEn: "How do we avoid lying?", correctAnswer: "واجتنبوا قول الزور", wordBank: ["واجتنبوا قول الزور", "بالصدق", "بالحق", "بالأمانة"] },
      { questionAr: "ما حكم الغيبة؟", questionEn: "What is the ruling on backbiting?", correctAnswer: "ولا يغتب بعضكم بعضاً", wordBank: ["ولا يغتب بعضكم بعضاً", "محرمة", "مكروهة", "منهي عنها"] },
      { questionAr: "كيف نتعامل مع الظن؟", questionEn: "How do we deal with suspicion?", correctAnswer: "اجتنبوا كثيراً من الظن", wordBank: ["اجتنبوا كثيراً من الظن", "بالحذر", "بالتأكد", "بالتثبت"] },
      { questionAr: "ما قيمة الصدق؟", questionEn: "What is the value of truthfulness?", correctAnswer: "يا أيها الذين آمنوا اتقوا الله وكونوا مع الصادقين", wordBank: ["يا أيها الذين آمنوا اتقوا الله وكونوا مع الصادقين", "عظيمة", "كبيرة", "مهمة"] },
      { questionAr: "كيف نحفظ الأمانة؟", questionEn: "How do we keep the trust?", correctAnswer: "إن الله يأمركم أن تؤدوا الأمانات إلى أهلها", wordBank: ["إن الله يأمركم أن تؤدوا الأمانات إلى أهلها", "بالوفاء", "بالصدق", "بالإخلاص"] },
      { questionAr: "ما جزاء الإحسان؟", questionEn: "What is the reward of doing good?", correctAnswer: "هل جزاء الإحسان إلا الإحسان", wordBank: ["هل جزاء الإحسان إلا الإحسان", "الخير", "الثواب", "الأجر"] },
      { questionAr: "كيف نكون من المتواضعين؟", questionEn: "How do we become humble?", correctAnswer: "واخفض جناحك للمؤمنين", wordBank: ["واخفض جناحك للمؤمنين", "بالتواضع", "باللين", "بالرفق"] },
    ]
  },
  // Week 5 - أسئلة عن الصبر والشكر (8 أسئلة)
  {
    weekNumber: 5,
    questions: [
      { questionAr: "ما أجر الصابرين؟", questionEn: "What is the reward of the patient?", correctAnswer: "إنما يوفى الصابرون أجرهم بغير حساب", wordBank: ["إنما يوفى الصابرون أجرهم بغير حساب", "الجنة", "الثواب", "الأجر العظيم"] },
      { questionAr: "كيف نشكر النعم؟", questionEn: "How do we thank for blessings?", correctAnswer: "لئن شكرتم لأزيدنكم", wordBank: ["لئن شكرتم لأزيدنكم", "بالحمد", "بالعمل", "بالدعاء"] },
      { questionAr: "ما الموقف من المصائب؟", questionEn: "What is the attitude towards calamities?", correctAnswer: "إنا لله وإنا إليه راجعون", wordBank: ["إنا لله وإنا إليه راجعون", "الصبر", "الرضا", "التسليم"] },
      { questionAr: "متى يأتي الفرج؟", questionEn: "When does relief come?", correctAnswer: "إن مع العسر يسراً", wordBank: ["إن مع العسر يسراً", "بعد الصبر", "مع الدعاء", "بإذن الله"] },
      { questionAr: "كيف نواجه الصعوبات؟", questionEn: "How do we face difficulties?", correctAnswer: "فاصبر صبراً جميلاً", wordBank: ["فاصبر صبراً جميلاً", "بالإيمان", "بالتوكل", "بالثقة"] },
      { questionAr: "ما نقول في السراء؟", questionEn: "What do we say in prosperity?", correctAnswer: "الحمد لله رب العالمين", wordBank: ["الحمد لله رب العالمين", "شكراً", "الحمد لله", "بارك الله"] },
      { questionAr: "ما نقول في الضراء؟", questionEn: "What do we say in adversity?", correctAnswer: "قدر الله وما شاء فعل", wordBank: ["قدر الله وما شاء فعل", "الصبر", "الحمد لله", "لا حول ولا قوة إلا بالله"] },
      { questionAr: "من هم أولو العزم؟", questionEn: "Who are those of determination?", correctAnswer: "فاصبر كما صبر أولو العزم من الرسل", wordBank: ["فاصبر كما صبر أولو العزم من الرسل", "الأنبياء", "الرسل", "الصالحون"] },
    ]
  },
  // Week 6 - أسئلة عن التوكل والدعاء (8 أسئلة)
  {
    weekNumber: 6,
    questions: [
      { questionAr: "كيف نتوكل على الله؟", questionEn: "How do we rely on Allah?", correctAnswer: "ومن يتوكل على الله فهو حسبه", wordBank: ["ومن يتوكل على الله فهو حسبه", "بالإيمان", "بالثقة", "بالصبر"] },
      { questionAr: "ما أقرب دعاء للاستجابة؟", questionEn: "What is the closest supplication to be answered?", correctAnswer: "ادعوني أستجب لكم", wordBank: ["ادعوني أستجب لكم", "في السجود", "في الليل", "بإخلاص"] },
      { questionAr: "كيف ندعو الله؟", questionEn: "How do we call upon Allah?", correctAnswer: "ادعوا ربكم تضرعاً وخفية", wordBank: ["ادعوا ربكم تضرعاً وخفية", "بخشوع", "بإخلاص", "بتواضع"] },
      { questionAr: "متى يستجاب الدعاء؟", questionEn: "When is supplication answered?", correctAnswer: "إني قريب أجيب دعوة الداع", wordBank: ["إني قريب أجيب دعوة الداع", "في الليل", "بعد الصلاة", "عند الإخلاص"] },
      { questionAr: "ما دعاء دخول المنزل؟", questionEn: "What is the supplication for entering the house?", correctAnswer: "رب أدخلني مدخل صدق", wordBank: ["رب أدخلني مدخل صدق", "بسم الله", "السلام عليكم", "الحمد لله"] },
      { questionAr: "ما دعاء الخروج من المنزل؟", questionEn: "What is the supplication for leaving the house?", correctAnswer: "بسم الله توكلت على الله", wordBank: ["بسم الله توكلت على الله", "الله أكبر", "الحمد لله", "لا إله إلا الله"] },
      { questionAr: "كيف نطلب المغفرة؟", questionEn: "How do we seek forgiveness?", correctAnswer: "ربنا اغفر لنا ذنوبنا", wordBank: ["ربنا اغفر لنا ذنوبنا", "أستغفر الله", "اللهم اغفر لي", "تب علينا"] },
      { questionAr: "ما دعاء الهداية؟", questionEn: "What is the supplication for guidance?", correctAnswer: "ربنا لا تزغ قلوبنا", wordBank: ["ربنا لا تزغ قلوبنا", "اهدنا", "يا مقلب القلوب", "ثبت قلبي"] },
    ]
  },
  // Week 7 - أسئلة عن العمل والإنتاج (8 أسئلة)
  {
    weekNumber: 7,
    questions: [
      { questionAr: "ما قيمة العمل في الإسلام؟", questionEn: "What is the value of work in Islam?", correctAnswer: "وقل اعملوا فسيرى الله عملكم", wordBank: ["وقل اعملوا فسيرى الله عملكم", "عظيمة", "مهمة", "كبيرة"] },
      { questionAr: "كيف نتقن العمل؟", questionEn: "How do we perfect work?", correctAnswer: "إن الله يحب إذا عمل أحدكم عملاً أن يتقنه", wordBank: ["إن الله يحب إذا عمل أحدكم عملاً أن يتقنه", "بالإخلاص", "بالجد", "بالاهتمام"] },
      { questionAr: "ما ثمرة العمل الصالح؟", questionEn: "What is the fruit of good deeds?", correctAnswer: "من عمل صالحاً فلنفسه", wordBank: ["من عمل صالحاً فلنفسه", "الجنة", "الثواب", "السعادة"] },
      { questionAr: "كيف نوازن بين الدنيا والآخرة؟", questionEn: "How do we balance worldly life and the hereafter?", correctAnswer: "وابتغ فيما آتاك الله الدار الآخرة ولا تنس نصيبك من الدنيا", wordBank: ["وابتغ فيما آتاك الله الدار الآخرة ولا تنس نصيبك من الدنيا", "بالتوازن", "بالاعتدال", "بالحكمة"] },
      { questionAr: "ما نتيجة الكسل؟", questionEn: "What is the result of laziness?", correctAnswer: "خسر", wordBank: ["خسر", "الفشل", "الضياع", "الندم"] },
      { questionAr: "كيف نبدأ أي عمل؟", questionEn: "How do we start any work?", correctAnswer: "بسم الله", wordBank: ["بسم الله", "الحمد لله", "الله أكبر", "إن شاء الله"] },
      { questionAr: "ما أفضل الكسب؟", questionEn: "What is the best earning?", correctAnswer: "من عمل يده", wordBank: ["من عمل يده", "التجارة", "الزراعة", "الصناعة"] },
      { questionAr: "كيف نحقق النجاح؟", questionEn: "How do we achieve success?", correctAnswer: "أولئك هم المفلحون", wordBank: ["أولئك هم المفلحون", "بالعمل", "بالإخلاص", "بالتوكل"] },
    ]
  },
  // Week 8 - أسئلة عن الأسرة (8 أسئلة)
  {
    weekNumber: 8,
    questions: [
      { questionAr: "ما دعاء الزوجين؟", questionEn: "What is the supplication for spouses?", correctAnswer: "ربنا هب لنا من أزواجنا وذرياتنا قرة أعين", wordBank: ["ربنا هب لنا من أزواجنا وذرياتنا قرة أعين", "اللهم بارك", "اللهم أصلح", "اللهم وفق"] },
      { questionAr: "كيف نربي الأولاد؟", questionEn: "How do we raise children?", correctAnswer: "يا أيها الذين آمنوا قوا أنفسكم وأهليكم ناراً", wordBank: ["يا أيها الذين آمنوا قوا أنفسكم وأهليكم ناراً", "بالقدوة", "بالحب", "بالتعليم"] },
      { questionAr: "ما واجب الأبناء تجاه الوالدين؟", questionEn: "What is the duty of children towards parents?", correctAnswer: "وقضى ربك ألا تعبدوا إلا إياه وبالوالدين إحساناً", wordBank: ["وقضى ربك ألا تعبدوا إلا إياه وبالوالدين إحساناً", "البر", "الطاعة", "الاحترام"] },
      { questionAr: "كيف نتعامل مع كبر سن الوالدين؟", questionEn: "How do we deal with aging parents?", correctAnswer: "ولا تقل لهما أف ولا تنهرهما", wordBank: ["ولا تقل لهما أف ولا تنهرهما", "بالصبر", "بالرحمة", "بالحنان"] },
      { questionAr: "ما دعاء للوالدين؟", questionEn: "What is a supplication for parents?", correctAnswer: "رب ارحمهما كما ربياني صغيراً", wordBank: ["رب ارحمهما كما ربياني صغيراً", "اللهم اغفر لهما", "اللهم احفظهما", "بارك الله فيهما"] },
      { questionAr: "كيف تكون الأسرة المثالية؟", questionEn: "How is an ideal family?", correctAnswer: "ومن آياته أن خلق لكم من أنفسكم أزواجاً لتسكنوا إليها", wordBank: ["ومن آياته أن خلق لكم من أنفسكم أزواجاً لتسكنوا إليها", "بالمودة", "بالرحمة", "بالتفاهم"] },
      { questionAr: "ما أساس العلاقة الزوجية؟", questionEn: "What is the foundation of marital relationship?", correctAnswer: "وجعل بينكم مودة ورحمة", wordBank: ["وجعل بينكم مودة ورحمة", "الحب", "الاحترام", "التفاهم"] },
      { questionAr: "كيف نحل الخلافات الأسرية؟", questionEn: "How do we resolve family disputes?", correctAnswer: "فإن خفتم شقاق بينهما فابعثوا حكماً من أهله وحكماً من أهلها", wordBank: ["فإن خفتم شقاق بينهما فابعثوا حكماً من أهله وحكماً من أهلها", "بالحوار", "بالتفاهم", "بالصلح"] },
    ]
  },
  // Week 9 - أسئلة عن المجتمع (8 أسئلة)
  {
    weekNumber: 9,
    questions: [
      { questionAr: "ما أساس الوحدة؟", questionEn: "What is the foundation of unity?", correctAnswer: "واعتصموا بحبل الله جميعاً ولا تفرقوا", wordBank: ["واعتصموا بحبل الله جميعاً ولا تفرقوا", "التعاون", "المحبة", "التسامح"] },
      { questionAr: "كيف نأمر بالمعروف؟", questionEn: "How do we enjoin good?", correctAnswer: "ولتكن منكم أمة يدعون إلى الخير", wordBank: ["ولتكن منكم أمة يدعون إلى الخير", "بالحكمة", "بالموعظة", "بالقدوة"] },
      { questionAr: "ما واجبنا تجاه الفقراء؟", questionEn: "What is our duty towards the poor?", correctAnswer: "وآتوا الزكاة", wordBank: ["وآتوا الزكاة", "الإحسان", "المساعدة", "الكرم"] },
      { questionAr: "كيف نتعامل مع الاختلاف؟", questionEn: "How do we deal with differences?", correctAnswer: "لكم دينكم ولي دين", wordBank: ["لكم دينكم ولي دين", "بالاحترام", "بالتسامح", "بالحوار"] },
      { questionAr: "ما حق الطريق؟", questionEn: "What is the right of the road?", correctAnswer: "غض البصر وكف الأذى ورد السلام", wordBank: ["غض البصر وكف الأذى ورد السلام", "الأمانة", "النظافة", "الاحترام"] },
      { questionAr: "كيف نحقق العدالة؟", questionEn: "How do we achieve justice?", correctAnswer: "إن الله يأمر بالعدل والإحسان", wordBank: ["إن الله يأمر بالعدل والإحسان", "بالمساواة", "بالإنصاف", "بالحق"] },
      { questionAr: "ما أهمية الشورى؟", questionEn: "What is the importance of consultation?", correctAnswer: "وشاورهم في الأمر", wordBank: ["وشاورهم في الأمر", "التعاون", "الاتفاق", "الحكمة"] },
      { questionAr: "كيف نصلح بين الناس؟", questionEn: "How do we reconcile between people?", correctAnswer: "إنما المؤمنون إخوة فأصلحوا بين أخويكم", wordBank: ["إنما المؤمنون إخوة فأصلحوا بين أخويكم", "بالحوار", "بالنصيحة", "بالوساطة"] },
    ]
  },
  // Week 10 - أسئلة عن الطبيعة والكون (8 أسئلة)
  {
    weekNumber: 10,
    questions: [
      { questionAr: "ما نقول عند رؤية جمال الطبيعة؟", questionEn: "What do we say when seeing the beauty of nature?", correctAnswer: "هذا خلق الله", wordBank: ["هذا خلق الله", "سبحان الله", "ما شاء الله", "الله أكبر"] },
      { questionAr: "من خلق السماوات والأرض؟", questionEn: "Who created the heavens and the earth?", correctAnswer: "الله الذي خلق السماوات والأرض", wordBank: ["الله الذي خلق السماوات والأرض", "الله", "الخالق", "الرب"] },
      { questionAr: "ما دليل عظمة الله في الكون؟", questionEn: "What is the evidence of Allah's greatness in the universe?", correctAnswer: "وفي أنفسكم أفلا تبصرون", wordBank: ["وفي أنفسكم أفلا تبصرون", "السماء", "الأرض", "الجبال"] },
      { questionAr: "كيف نتأمل في خلق الله؟", questionEn: "How do we contemplate Allah's creation?", correctAnswer: "ويتفكرون في خلق السماوات والأرض", wordBank: ["ويتفكرون في خلق السماوات والأرض", "بالنظر", "بالتدبر", "بالتأمل"] },
      { questionAr: "من يسخر لنا الكون؟", questionEn: "Who subjects the universe to us?", correctAnswer: "وسخر لكم ما في السماوات وما في الأرض جميعاً منه", wordBank: ["وسخر لكم ما في السماوات وما في الأرض جميعاً منه", "الله", "الرحمن", "الخالق"] },
      { questionAr: "ما فائدة التأمل في الطبيعة؟", questionEn: "What is the benefit of contemplating nature?", correctAnswer: "إن في ذلك لآيات لقوم يتفكرون", wordBank: ["إن في ذلك لآيات لقوم يتفكرون", "العبرة", "الحكمة", "العلم"] },
      { questionAr: "كيف نشكر نعمة الماء؟", questionEn: "How do we thank for the blessing of water?", correctAnswer: "وجعلنا من الماء كل شيء حي", wordBank: ["وجعلنا من الماء كل شيء حي", "الحمد لله", "شكراً", "بارك الله"] },
      { questionAr: "ما نقول عند نزول المطر؟", questionEn: "What do we say when rain falls?", correctAnswer: "اللهم صيباً نافعاً", wordBank: ["اللهم صيباً نافعاً", "الحمد لله", "سبحان الله", "الله أكبر"] },
    ]
  },
  // Week 11 - أسئلة عن الزمن والتخطيط (10 أسئلة)
  {
    weekNumber: 11,
    questions: [
      { questionAr: "ما قيمة الوقت؟", questionEn: "What is the value of time?", correctAnswer: "والعصر إن الإنسان لفي خسر", wordBank: ["والعصر إن الإنسان لفي خسر", "ثمينة", "عظيمة", "كبيرة"] },
      { questionAr: "كيف نخطط للمستقبل؟", questionEn: "How do we plan for the future?", correctAnswer: "ولتنظر نفس ما قدمت لغد", wordBank: ["ولتنظر نفس ما قدمت لغد", "بالتفكير", "بالتدبير", "بالعمل"] },
      { questionAr: "ما نقول عند النية للعمل؟", questionEn: "What do we say when intending to work?", correctAnswer: "إن شاء الله", wordBank: ["إن شاء الله", "بسم الله", "الحمد لله", "الله أكبر"] },
      { questionAr: "كيف نستثمر أوقاتنا؟", questionEn: "How do we invest our time?", correctAnswer: "اغتنم خمساً قبل خمس", wordBank: ["اغتنم خمساً قبل خمس", "بالعمل", "بالعبادة", "بالتعلم"] },
      { questionAr: "ما حكمة تقلب الأيام؟", questionEn: "What is the wisdom of changing days?", correctAnswer: "وتلك الأيام نداولها بين الناس", wordBank: ["وتلك الأيام نداولها بين الناس", "العبرة", "الاختبار", "الحكمة"] },
      { questionAr: "متى يحين وقت الفجر؟", questionEn: "When is the time of dawn?", correctAnswer: "والفجر", wordBank: ["والفجر", "عند الأذان", "قبل الشروق", "آخر الليل"] },
      { questionAr: "ما فضل الليل؟", questionEn: "What is the virtue of the night?", correctAnswer: "ومن الليل فتهجد به نافلة لك", wordBank: ["ومن الليل فتهجد به نافلة لك", "السكون", "الراحة", "العبادة"] },
      { questionAr: "كيف نبدأ الصباح؟", questionEn: "How do we start the morning?", correctAnswer: "أصبحنا وأصبح الملك لله", wordBank: ["أصبحنا وأصبح الملك لله", "بالدعاء", "بالذكر", "بالصلاة"] },
      { questionAr: "ما نقول في المساء؟", questionEn: "What do we say in the evening?", correctAnswer: "أمسينا وأمسى الملك لله", wordBank: ["أمسينا وأمسى الملك لله", "الحمد لله", "سبحان الله", "الله أكبر"] },
      { questionAr: "كيف نختم يومنا؟", questionEn: "How do we end our day?", correctAnswer: "باسمك اللهم أموت وأحيا", wordBank: ["باسمك اللهم أموت وأحيا", "بالدعاء", "بالاستغفار", "بالذكر"] },
    ]
  },
  // Week 12 - أسئلة ختامية شاملة (10 أسئلة)
  {
    weekNumber: 12,
    questions: [
      { questionAr: "ما الغاية من الحياة؟", questionEn: "What is the purpose of life?", correctAnswer: "وما خلقت الجن والإنس إلا ليعبدون", wordBank: ["وما خلقت الجن والإنس إلا ليعبدون", "العبادة", "العمل", "السعادة"] },
      { questionAr: "ما نهاية كل شيء؟", questionEn: "What is the end of everything?", correctAnswer: "كل من عليها فان", wordBank: ["كل من عليها فان", "الموت", "الفناء", "الزوال"] },
      { questionAr: "ما الباقي من الأعمال؟", questionEn: "What remains of deeds?", correctAnswer: "والباقيات الصالحات خير عند ربك", wordBank: ["والباقيات الصالحات خير عند ربك", "الصدقة", "العلم", "الولد الصالح"] },
      { questionAr: "ما جزاء المؤمنين؟", questionEn: "What is the reward of believers?", correctAnswer: "جنات تجري من تحتها الأنهار", wordBank: ["جنات تجري من تحتها الأنهار", "الجنة", "النعيم", "الفوز"] },
      { questionAr: "كيف نختم الكلام؟", questionEn: "How do we conclude speech?", correctAnswer: "والحمد لله رب العالمين", wordBank: ["والحمد لله رب العالمين", "شكراً", "الحمد لله", "بارك الله فيكم"] },
      { questionAr: "ما دعاء الثبات؟", questionEn: "What is the supplication for steadfastness?", correctAnswer: "ربنا لا تزغ قلوبنا بعد إذ هديتنا", wordBank: ["ربنا لا تزغ قلوبنا بعد إذ هديتنا", "يا مقلب القلوب", "ثبتني", "اهدني"] },
      { questionAr: "ما دعاء حسن الخاتمة؟", questionEn: "What is the supplication for a good ending?", correctAnswer: "توفني مسلماً وألحقني بالصالحين", wordBank: ["توفني مسلماً وألحقني بالصالحين", "اللهم احسن خاتمتي", "اللهم ثبتني", "اللهم اغفر لي"] },
      { questionAr: "ما شعار المسلم في الحياة؟", questionEn: "What is the Muslim's motto in life?", correctAnswer: "قل إن صلاتي ونسكي ومحياي ومماتي لله رب العالمين", wordBank: ["قل إن صلاتي ونسكي ومحياي ومماتي لله رب العالمين", "العبادة", "الإخلاص", "التوحيد"] },
      { questionAr: "ما أفضل الذكر؟", questionEn: "What is the best remembrance?", correctAnswer: "لا إله إلا الله", wordBank: ["لا إله إلا الله", "سبحان الله", "الحمد لله", "الله أكبر"] },
      { questionAr: "ما ختام الدعاء؟", questionEn: "What is the conclusion of supplication?", correctAnswer: "سبحان ربك رب العزة عما يصفون وسلام على المرسلين والحمد لله رب العالمين", wordBank: ["سبحان ربك رب العزة عما يصفون وسلام على المرسلين والحمد لله رب العالمين", "آمين", "الحمد لله", "وصلى الله على محمد"] },
    ]
  }
];

async function add100Questions() {
  console.log("📖 Adding 100 new Quranic questions to diploma...");
  
  const weeks = await db.select().from(diplomaWeeks);
  let totalAdded = 0;
  
  for (const weekData of NEW_QUESTIONS) {
    const week = weeks.find(w => w.weekNumber === weekData.weekNumber);
    if (!week) {
      console.log(`⚠️ Week ${weekData.weekNumber} not found, skipping...`);
      continue;
    }
    
    console.log(`📚 Adding questions to Week ${weekData.weekNumber}...`);
    
    const existingExercises = await db.select().from(diplomaExercises).where(eq(diplomaExercises.weekId, week.id));
    let orderIndex = existingExercises.length + 1;
    
    for (const q of weekData.questions) {
      await db.insert(diplomaExercises).values({
        weekId: week.id,
        exerciseType: "fill_blanks",
        questionAr: q.questionAr,
        questionEn: q.questionEn,
        sentenceWithBlanks: `${q.questionAr}\nالجواب القرآني: __________`,
        wordBank: q.wordBank,
        shuffledWords: null,
        correctAnswer: q.correctAnswer,
        explanation: `الجواب الصحيح: "${q.correctAnswer}" - تعبير قرآني يناسب هذا الموقف.`,
        isQuiz: 0,
        orderIndex: orderIndex++,
      });
      totalAdded++;
    }
    
    console.log(`  ✓ Added ${weekData.questions.length} questions`);
  }
  
  console.log(`\n🎉 Successfully added ${totalAdded} new questions!`);
}

add100Questions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
