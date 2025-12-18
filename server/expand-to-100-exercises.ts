import { db } from "./db";
import { diplomaWeeks, diplomaExercises } from "@shared/schema";
import { eq, count } from "drizzle-orm";

// قوالب الأسئلة لتوليد 100 تمرين لكل أسبوع
const QUESTION_TEMPLATES = {
  1: { // المشاعر والأحوال
    theme: "المشاعر والأحوال",
    questions: [
      { qAr: "كيف تعبر عن الفرح؟", qEn: "How do you express joy?", answer: "الحمد لله", options: ["الحمد لله", "سبحان الله", "الله أكبر", "لا حول ولا قوة إلا بالله"] },
      { qAr: "ماذا تقول عند الراحة النفسية؟", qEn: "What do you say when feeling at peace?", answer: "سكينة", options: ["سكينة", "طمأنينة", "راحة", "هدوء"] },
      { qAr: "كيف تصف القلب المطمئن؟", qEn: "How do you describe a peaceful heart?", answer: "قلب سليم", options: ["قلب سليم", "قلب مؤمن", "قلب صادق", "قلب راضٍ"] },
      { qAr: "ما التعبير القرآني للسعادة الحقيقية؟", qEn: "What is the Quranic expression for true happiness?", answer: "فوز عظيم", options: ["فوز عظيم", "نجاح كبير", "سعادة دائمة", "فرح عظيم"] },
      { qAr: "كيف نصف الأمان التام؟", qEn: "How do we describe complete safety?", answer: "آمنين", options: ["آمنين", "مطمئنين", "سالمين", "محفوظين"] },
      { qAr: "ما الكلمة القرآنية للهدوء؟", qEn: "What is the Quranic word for tranquility?", answer: "سكون", options: ["سكون", "صمت", "هدوء", "راحة"] },
      { qAr: "كيف تعبر عن الرضا؟", qEn: "How do you express satisfaction?", answer: "رضوان", options: ["رضوان", "قبول", "موافقة", "ارتياح"] },
      { qAr: "ما التعبير عن الحب العميق؟", qEn: "What is the expression for deep love?", answer: "مودة", options: ["مودة", "حب", "عشق", "ولاء"] },
    ]
  },
  2: { // العلاقات
    theme: "العلاقات الاجتماعية",
    questions: [
      { qAr: "كيف نصف العلاقة بين الإخوة؟", qEn: "How do we describe brotherhood?", answer: "إخوة", options: ["إخوة", "أصدقاء", "رفقاء", "أحباء"] },
      { qAr: "ما واجبنا تجاه الوالدين؟", qEn: "What is our duty to parents?", answer: "إحسان", options: ["إحسان", "طاعة", "احترام", "رعاية"] },
      { qAr: "كيف نعامل الجار؟", qEn: "How do we treat neighbors?", answer: "بالمعروف", options: ["بالمعروف", "بالخير", "بالإحسان", "باللطف"] },
      { qAr: "ما صفة الصديق الحقيقي؟", qEn: "What is the quality of a true friend?", answer: "خليل", options: ["خليل", "صديق", "رفيق", "حبيب"] },
      { qAr: "كيف نصف التعاون؟", qEn: "How do we describe cooperation?", answer: "تعاونوا", options: ["تعاونوا", "ساعدوا", "اعملوا معاً", "شاركوا"] },
      { qAr: "ما معنى صلة الرحم؟", qEn: "What does maintaining family ties mean?", answer: "الأرحام", options: ["الأرحام", "العائلة", "الأقارب", "القربى"] },
      { qAr: "كيف نصف الوفاء؟", qEn: "How do we describe loyalty?", answer: "عهد", options: ["عهد", "وعد", "أمانة", "صدق"] },
      { qAr: "ما التعبير عن حسن الجوار؟", qEn: "What is the expression for good neighborliness?", answer: "الجار ذي القربى", options: ["الجار ذي القربى", "الجار الطيب", "الجار المحسن", "الجار الكريم"] },
    ]
  },
  3: { // العلم والتعلم
    theme: "العلم والتعلم",
    questions: [
      { qAr: "ما أول أمر في القرآن؟", qEn: "What is the first command in the Quran?", answer: "اقرأ", options: ["اقرأ", "اكتب", "تعلم", "افهم"] },
      { qAr: "كيف نطلب المزيد من العلم؟", qEn: "How do we ask for more knowledge?", answer: "رب زدني علماً", options: ["رب زدني علماً", "علمني", "فهمني", "أرشدني"] },
      { qAr: "ما صفة أهل العلم؟", qEn: "What is the quality of scholars?", answer: "أولو العلم", options: ["أولو العلم", "العلماء", "الفقهاء", "المتعلمون"] },
      { qAr: "كيف نصف الفهم العميق؟", qEn: "How do we describe deep understanding?", answer: "فقه", options: ["فقه", "فهم", "إدراك", "وعي"] },
      { qAr: "ما التعبير عن التدبر؟", qEn: "What is the expression for contemplation?", answer: "يتدبرون", options: ["يتدبرون", "يفكرون", "يتأملون", "ينظرون"] },
      { qAr: "كيف نصف الحكمة؟", qEn: "How do we describe wisdom?", answer: "حكمة", options: ["حكمة", "علم", "فهم", "بصيرة"] },
      { qAr: "ما معنى البصيرة؟", qEn: "What does insight mean?", answer: "بصيرة", options: ["بصيرة", "رؤية", "فهم", "إدراك"] },
      { qAr: "كيف نصف التفكر؟", qEn: "How do we describe reflection?", answer: "تفكر", options: ["تفكر", "تأمل", "تدبر", "نظر"] },
    ]
  },
  4: { // الأخلاق
    theme: "الأخلاق والقيم",
    questions: [
      { qAr: "ما أعلى درجات الأخلاق؟", qEn: "What is the highest level of morals?", answer: "خلق عظيم", options: ["خلق عظيم", "خلق حسن", "خلق كريم", "خلق رفيع"] },
      { qAr: "كيف نصف الصدق؟", qEn: "How do we describe honesty?", answer: "صدق", options: ["صدق", "أمانة", "وفاء", "إخلاص"] },
      { qAr: "ما ضد الكذب؟", qEn: "What is the opposite of lying?", answer: "الصادقين", options: ["الصادقين", "المخلصين", "الأمناء", "الوفاء"] },
      { qAr: "كيف نصف الأمانة؟", qEn: "How do we describe trustworthiness?", answer: "أمانة", options: ["أمانة", "صدق", "وفاء", "ثقة"] },
      { qAr: "ما التعبير عن الإخلاص؟", qEn: "What is the expression for sincerity?", answer: "مخلصين", options: ["مخلصين", "صادقين", "أمناء", "وفاء"] },
      { qAr: "كيف نصف التواضع؟", qEn: "How do we describe humility?", answer: "خافض الجناح", options: ["خافض الجناح", "متواضع", "لين", "رقيق"] },
      { qAr: "ما معنى العفة؟", qEn: "What does chastity mean?", answer: "عفاف", options: ["عفاف", "طهارة", "نقاء", "صفاء"] },
      { qAr: "كيف نصف الحياء؟", qEn: "How do we describe modesty?", answer: "حياء", options: ["حياء", "خجل", "تواضع", "أدب"] },
    ]
  },
  5: { // الصبر والشكر
    theme: "الصبر والشكر",
    questions: [
      { qAr: "ما أجمل أنواع الصبر؟", qEn: "What is the most beautiful type of patience?", answer: "صبر جميل", options: ["صبر جميل", "صبر طويل", "صبر عظيم", "صبر كريم"] },
      { qAr: "كيف نشكر الله؟", qEn: "How do we thank Allah?", answer: "شكور", options: ["شكور", "حامد", "شاكر", "ممتن"] },
      { qAr: "ما جزاء الشاكرين؟", qEn: "What is the reward of the grateful?", answer: "لأزيدنكم", options: ["لأزيدنكم", "الجنة", "الثواب", "الأجر"] },
      { qAr: "كيف نصف الصابرين؟", qEn: "How do we describe the patient?", answer: "الصابرين", options: ["الصابرين", "المحتسبين", "الراضين", "المطمئنين"] },
      { qAr: "ما التعبير عن الرضا بالقضاء؟", qEn: "What is the expression for acceptance of fate?", answer: "قدر الله", options: ["قدر الله", "إرادة الله", "مشيئة الله", "حكم الله"] },
      { qAr: "كيف نصف الحمد؟", qEn: "How do we describe praise?", answer: "الحمد لله", options: ["الحمد لله", "شكراً لله", "الشكر لله", "المجد لله"] },
      { qAr: "ما معنى الاحتساب؟", qEn: "What does seeking reward mean?", answer: "يحتسب", options: ["يحتسب", "يصبر", "يشكر", "يرضى"] },
      { qAr: "كيف نصف النعمة؟", qEn: "How do we describe blessing?", answer: "نعمة", options: ["نعمة", "فضل", "خير", "بركة"] },
    ]
  },
  6: { // التوكل والدعاء
    theme: "التوكل والدعاء",
    questions: [
      { qAr: "ما معنى التوكل؟", qEn: "What does reliance mean?", answer: "توكلت على الله", options: ["توكلت على الله", "اعتمدت على الله", "وثقت بالله", "فوضت أمري"] },
      { qAr: "كيف ندعو الله؟", qEn: "How do we call upon Allah?", answer: "ادعوني", options: ["ادعوني", "اسألوني", "نادوني", "اطلبوني"] },
      { qAr: "ما صفة الدعاء المستجاب؟", qEn: "What is the quality of answered supplication?", answer: "تضرعاً وخفية", options: ["تضرعاً وخفية", "بصوت عالٍ", "جهراً", "علناً"] },
      { qAr: "كيف نطلب الهداية؟", qEn: "How do we seek guidance?", answer: "اهدنا", options: ["اهدنا", "أرشدنا", "وفقنا", "سددنا"] },
      { qAr: "ما التعبير عن طلب المغفرة؟", qEn: "What is the expression for seeking forgiveness?", answer: "استغفر الله", options: ["استغفر الله", "أتوب إلى الله", "اغفر لي", "ارحمني"] },
      { qAr: "كيف نصف الرجاء؟", qEn: "How do we describe hope?", answer: "يرجون", options: ["يرجون", "يأملون", "يتوقعون", "ينتظرون"] },
      { qAr: "ما معنى الإنابة؟", qEn: "What does turning back mean?", answer: "أنيب", options: ["أنيب", "أتوب", "أرجع", "أعود"] },
      { qAr: "كيف نصف الخشوع؟", qEn: "How do we describe humility in prayer?", answer: "خاشعين", options: ["خاشعين", "خاضعين", "متواضعين", "ساجدين"] },
    ]
  },
  7: { // العمل والإنتاج
    theme: "العمل والإنتاج",
    questions: [
      { qAr: "ما الأمر بالعمل؟", qEn: "What is the command to work?", answer: "اعملوا", options: ["اعملوا", "افعلوا", "أنجزوا", "أتموا"] },
      { qAr: "كيف نصف الإتقان؟", qEn: "How do we describe perfection?", answer: "إحسان", options: ["إحسان", "إتقان", "جودة", "كمال"] },
      { qAr: "ما جزاء العمل الصالح؟", qEn: "What is the reward of good deeds?", answer: "أجر عظيم", options: ["أجر عظيم", "ثواب كبير", "جزاء حسن", "مكافأة"] },
      { qAr: "كيف نصف السعي؟", qEn: "How do we describe striving?", answer: "يسعى", options: ["يسعى", "يعمل", "يجتهد", "يكدح"] },
      { qAr: "ما التعبير عن الكسب الحلال؟", qEn: "What is the expression for lawful earning?", answer: "طيبات", options: ["طيبات", "حلال", "مباح", "جائز"] },
      { qAr: "كيف نصف الجهد؟", qEn: "How do we describe effort?", answer: "جهد", options: ["جهد", "عمل", "كد", "تعب"] },
      { qAr: "ما معنى الكدح؟", qEn: "What does toiling mean?", answer: "كادح", options: ["كادح", "عامل", "ساعٍ", "مجتهد"] },
      { qAr: "كيف نصف النجاح؟", qEn: "How do we describe success?", answer: "فلاح", options: ["فلاح", "نجاح", "فوز", "تفوق"] },
    ]
  },
  8: { // الأسرة
    theme: "الأسرة والتربية",
    questions: [
      { qAr: "كيف نصف السكن الأسري؟", qEn: "How do we describe family dwelling?", answer: "سكن", options: ["سكن", "راحة", "أمان", "طمأنينة"] },
      { qAr: "ما أساس الزواج؟", qEn: "What is the foundation of marriage?", answer: "مودة ورحمة", options: ["مودة ورحمة", "حب وعشق", "إعجاب وتقدير", "احترام وتقدير"] },
      { qAr: "كيف نصف الذرية الصالحة؟", qEn: "How do we describe righteous offspring?", answer: "ذرية طيبة", options: ["ذرية طيبة", "أولاد صالحين", "أبناء بارين", "نسل كريم"] },
      { qAr: "ما دعاء الأولاد؟", qEn: "What is the supplication for children?", answer: "قرة أعين", options: ["قرة أعين", "سعادة قلب", "فرحة نفس", "أنس روح"] },
      { qAr: "كيف نصف بر الوالدين؟", qEn: "How do we describe kindness to parents?", answer: "بر", options: ["بر", "إحسان", "طاعة", "خدمة"] },
      { qAr: "ما التعبير عن الرحمة بالصغار؟", qEn: "What is the expression for mercy to children?", answer: "رحمة", options: ["رحمة", "حنان", "شفقة", "عطف"] },
      { qAr: "كيف نصف التربية الحسنة؟", qEn: "How do we describe good upbringing?", answer: "تربية", options: ["تربية", "تنشئة", "تعليم", "تأديب"] },
      { qAr: "ما معنى الرعاية؟", qEn: "What does care mean?", answer: "رعاية", options: ["رعاية", "عناية", "اهتمام", "حماية"] },
    ]
  },
  9: { // المجتمع
    theme: "المجتمع والعدالة",
    questions: [
      { qAr: "ما أساس العدل؟", qEn: "What is the foundation of justice?", answer: "عدل", options: ["عدل", "مساواة", "إنصاف", "حق"] },
      { qAr: "كيف نصف المساواة؟", qEn: "How do we describe equality?", answer: "سواء", options: ["سواء", "مساواة", "عدالة", "تكافؤ"] },
      { qAr: "ما التعبير عن الشورى؟", qEn: "What is the expression for consultation?", answer: "شورى", options: ["شورى", "استشارة", "تشاور", "مشورة"] },
      { qAr: "كيف نصف التكافل؟", qEn: "How do we describe solidarity?", answer: "تعاون", options: ["تعاون", "تكافل", "تضامن", "تآزر"] },
      { qAr: "ما معنى الإصلاح؟", qEn: "What does reform mean?", answer: "إصلاح", options: ["إصلاح", "تحسين", "تطوير", "تغيير"] },
      { qAr: "كيف نصف الأمر بالمعروف؟", qEn: "How do we describe enjoining good?", answer: "أمر بالمعروف", options: ["أمر بالمعروف", "دعوة للخير", "نصيحة", "إرشاد"] },
      { qAr: "ما التعبير عن النهي عن المنكر؟", qEn: "What is the expression for forbidding evil?", answer: "نهي عن المنكر", options: ["نهي عن المنكر", "منع الشر", "رفض الباطل", "إنكار السوء"] },
      { qAr: "كيف نصف الوحدة؟", qEn: "How do we describe unity?", answer: "اعتصموا", options: ["اعتصموا", "اتحدوا", "تماسكوا", "ترابطوا"] },
    ]
  },
  10: { // الطبيعة
    theme: "الطبيعة والكون",
    questions: [
      { qAr: "من خلق الكون؟", qEn: "Who created the universe?", answer: "الخالق", options: ["الخالق", "الباري", "المصور", "المبدع"] },
      { qAr: "كيف نصف السماء؟", qEn: "How do we describe the sky?", answer: "سماء", options: ["سماء", "فضاء", "أفق", "علو"] },
      { qAr: "ما التعبير عن الأرض؟", qEn: "What is the expression for the earth?", answer: "أرض", options: ["أرض", "دنيا", "كوكب", "عالم"] },
      { qAr: "كيف نصف الجبال؟", qEn: "How do we describe mountains?", answer: "رواسي", options: ["رواسي", "جبال", "قمم", "شوامخ"] },
      { qAr: "ما معنى البحار؟", qEn: "What does seas mean?", answer: "بحار", options: ["بحار", "محيطات", "مياه", "أمواج"] },
      { qAr: "كيف نصف الماء؟", qEn: "How do we describe water?", answer: "ماء", options: ["ماء", "سائل", "نهر", "غيث"] },
      { qAr: "ما التعبير عن المطر؟", qEn: "What is the expression for rain?", answer: "غيث", options: ["غيث", "مطر", "ماء", "سحاب"] },
      { qAr: "كيف نصف الشمس؟", qEn: "How do we describe the sun?", answer: "سراج", options: ["سراج", "ضياء", "نور", "شمس"] },
    ]
  },
  11: { // الزمن
    theme: "الزمن والتخطيط",
    questions: [
      { qAr: "ما قيمة الوقت؟", qEn: "What is the value of time?", answer: "العصر", options: ["العصر", "الوقت", "الزمن", "الدهر"] },
      { qAr: "كيف نصف الصباح؟", qEn: "How do we describe morning?", answer: "فجر", options: ["فجر", "صباح", "صبح", "ضحى"] },
      { qAr: "ما التعبير عن المساء؟", qEn: "What is the expression for evening?", answer: "عشي", options: ["عشي", "مساء", "ليل", "غروب"] },
      { qAr: "كيف نصف الليل؟", qEn: "How do we describe night?", answer: "ليل", options: ["ليل", "ظلام", "سكون", "هدوء"] },
      { qAr: "ما معنى الغد؟", qEn: "What does tomorrow mean?", answer: "غد", options: ["غد", "مستقبل", "قادم", "آتٍ"] },
      { qAr: "كيف نصف الأمس؟", qEn: "How do we describe yesterday?", answer: "أمس", options: ["أمس", "ماضٍ", "سابق", "فائت"] },
      { qAr: "ما التعبير عن الأبد؟", qEn: "What is the expression for eternity?", answer: "أبد", options: ["أبد", "خلود", "دوام", "سرمد"] },
      { qAr: "كيف نصف اللحظة؟", qEn: "How do we describe the moment?", answer: "ساعة", options: ["ساعة", "لحظة", "آن", "وقت"] },
    ]
  },
  12: { // ختام
    theme: "أسئلة ختامية شاملة",
    questions: [
      { qAr: "ما الغاية من الخلق؟", qEn: "What is the purpose of creation?", answer: "عبادة", options: ["عبادة", "طاعة", "خدمة", "تسبيح"] },
      { qAr: "كيف نصف الآخرة؟", qEn: "How do we describe the hereafter?", answer: "الآخرة", options: ["الآخرة", "الجنة", "الدار الباقية", "المعاد"] },
      { qAr: "ما التعبير عن الجنة؟", qEn: "What is the expression for paradise?", answer: "جنة", options: ["جنة", "فردوس", "نعيم", "دار السلام"] },
      { qAr: "كيف نصف النعيم الأبدي؟", qEn: "How do we describe eternal bliss?", answer: "خالدين", options: ["خالدين", "مخلدين", "دائمين", "باقين"] },
      { qAr: "ما معنى الفوز؟", qEn: "What does success mean?", answer: "فوز", options: ["فوز", "نجاح", "فلاح", "ظفر"] },
      { qAr: "كيف نصف الرحمة الإلهية؟", qEn: "How do we describe divine mercy?", answer: "رحمة واسعة", options: ["رحمة واسعة", "رحمة كبيرة", "رحمة عظيمة", "رحمة شاملة"] },
      { qAr: "ما التعبير عن الخلود؟", qEn: "What is the expression for eternity?", answer: "خلد", options: ["خلد", "أبد", "دوام", "بقاء"] },
      { qAr: "كيف نختم بالحمد؟", qEn: "How do we conclude with praise?", answer: "الحمد لله رب العالمين", options: ["الحمد لله رب العالمين", "سبحان الله", "الله أكبر", "لا إله إلا الله"] },
    ]
  }
};

async function generateMoreQuestions(weekNumber: number, needed: number): Promise<any[]> {
  const template = QUESTION_TEMPLATES[weekNumber as keyof typeof QUESTION_TEMPLATES];
  if (!template) return [];
  
  const questions: any[] = [];
  const baseQuestions = template.questions;
  
  // توليد أسئلة إضافية بناءً على القوالب
  const variations = [
    { prefix: "ما معنى", prefixEn: "What is the meaning of" },
    { prefix: "كيف نقول", prefixEn: "How do we say" },
    { prefix: "ما التعبير القرآني عن", prefixEn: "What is the Quranic expression for" },
    { prefix: "ما الكلمة المناسبة لـ", prefixEn: "What is the suitable word for" },
    { prefix: "اختر الإجابة الصحيحة:", prefixEn: "Choose the correct answer:" },
    { prefix: "ما المفردة القرآنية لـ", prefixEn: "What is the Quranic vocabulary for" },
    { prefix: "أكمل الجملة:", prefixEn: "Complete the sentence:" },
    { prefix: "ما المقصود بـ", prefixEn: "What is meant by" },
  ];
  
  let count = 0;
  let variationIndex = 0;
  
  while (count < needed) {
    for (const q of baseQuestions) {
      if (count >= needed) break;
      
      const variation = variations[variationIndex % variations.length];
      const newQuestion = {
        questionAr: `${variation.prefix} "${q.answer}"؟`,
        questionEn: `${variation.prefixEn} "${q.answer}"?`,
        correctAnswer: q.answer,
        wordBank: [...q.options].sort(() => Math.random() - 0.5),
      };
      
      questions.push(newQuestion);
      count++;
      variationIndex++;
    }
    variationIndex++;
  }
  
  return questions;
}

async function expandTo100Exercises() {
  console.log("📖 Expanding to 100 exercises per week...\n");
  
  const weeks = await db.select().from(diplomaWeeks);
  
  for (const week of weeks) {
    // حساب عدد التمارين الموجودة
    const existingCount = await db
      .select({ count: count() })
      .from(diplomaExercises)
      .where(eq(diplomaExercises.weekId, week.id));
    
    const currentCount = Number(existingCount[0]?.count || 0);
    const needed = 100 - currentCount;
    
    if (needed <= 0) {
      console.log(`✓ Week ${week.weekNumber}: Already has ${currentCount} exercises`);
      continue;
    }
    
    console.log(`📚 Week ${week.weekNumber}: Adding ${needed} exercises (current: ${currentCount})...`);
    
    const newQuestions = await generateMoreQuestions(week.weekNumber, needed);
    let orderIndex = currentCount + 1;
    
    for (const q of newQuestions) {
      await db.insert(diplomaExercises).values({
        weekId: week.id,
        exerciseType: "fill_blanks",
        questionAr: q.questionAr,
        questionEn: q.questionEn,
        sentenceWithBlanks: `${q.questionAr}\nالجواب: __________`,
        wordBank: q.wordBank,
        shuffledWords: null,
        correctAnswer: q.correctAnswer,
        explanation: `الجواب الصحيح: "${q.correctAnswer}"`,
        isQuiz: 0,
        orderIndex: orderIndex++,
      });
    }
    
    console.log(`  ✓ Added ${newQuestions.length} exercises to Week ${week.weekNumber}`);
  }
  
  // التحقق النهائي
  console.log("\n📊 Final count per week:");
  for (const week of weeks) {
    const finalCount = await db
      .select({ count: count() })
      .from(diplomaExercises)
      .where(eq(diplomaExercises.weekId, week.id));
    console.log(`  Week ${week.weekNumber}: ${finalCount[0]?.count} exercises`);
  }
  
  console.log("\n🎉 Done! Each week now has 100 exercises.");
}

expandTo100Exercises()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
