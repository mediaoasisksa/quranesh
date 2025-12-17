import { db } from "./db";
import { diplomaWeeks, diplomaExercises } from "@shared/schema";
import { eq } from "drizzle-orm";

const QURANIC_QUESTIONS = [
  // Week 1 - المشاعر والأحوال (Feelings & States)
  {
    weekNumber: 1,
    questions: [
      { questionAr: "كيف حالك اليوم يا حبيبي؟", questionEn: "How are you today, dear?", correctAnswer: "الحمد لله", wordBank: ["الحمد لله", "بسم الله", "إن شاء الله", "ما شاء الله"] },
      { questionAr: "ماذا تشعر الآن؟", questionEn: "How do you feel now?", correctAnswer: "تطمئن القلوب", wordBank: ["تطمئن القلوب", "لا تحزن", "لا تخف", "رحمة"] },
      { questionAr: "هل أنت حزين أم سعيد؟", questionEn: "Are you sad or happy?", correctAnswer: "لا تحزن", wordBank: ["لا تحزن", "لا تخف", "اصبر", "توكل"] },
      { questionAr: "لماذا تبكي؟", questionEn: "Why are you crying?", correctAnswer: "وهو أضحك وأبكى", wordBank: ["وهو أضحك وأبكى", "لا تحزن", "اصبر", "رحمة"] },
      { questionAr: "هل أنت خائف؟", questionEn: "Are you afraid?", correctAnswer: "لا تخف", wordBank: ["لا تخف", "لا تحزن", "اصبر", "توكل"] },
    ]
  },
  // Week 2 - المساعدة والتعاون (Help & Cooperation)
  {
    weekNumber: 2,
    questions: [
      { questionAr: "هل تريد أن تحكي لي ما حدث؟", questionEn: "Do you want to tell me what happened?", correctAnswer: "نقص عليك", wordBank: ["نقص عليك", "اقرأ", "اكتب", "تكلم"] },
      { questionAr: "من أزعجك اليوم؟", questionEn: "Who bothered you today?", correctAnswer: "أذى", wordBank: ["أذى", "ظلم", "غضب", "حزن"] },
      { questionAr: "أين تشعر بالألم؟", questionEn: "Where do you feel pain?", correctAnswer: "مسني الضر", wordBank: ["مسني الضر", "لا تحزن", "اصبر", "رحمة"] },
      { questionAr: "كيف أستطيع مساعدتك؟", questionEn: "How can I help you?", correctAnswer: "وتعاونوا على البر والتقوى", wordBank: ["وتعاونوا على البر والتقوى", "اعملوا", "اصبروا", "توكلوا"] },
      { questionAr: "هل تريد حضناً؟", questionEn: "Do you want a hug?", correctAnswer: "رحمة", wordBank: ["رحمة", "محبة", "سلام", "أمان"] },
    ]
  },
  // Week 3 - الدراسة والتعلم (Study & Learning)
  {
    weekNumber: 3,
    questions: [
      { questionAr: "متى نبدأ الواجب؟", questionEn: "When do we start homework?", correctAnswer: "وقل اعملوا", wordBank: ["وقل اعملوا", "اقرأ", "اكتب", "ادرس"] },
      { questionAr: "كم دقيقة تحتاج؟", questionEn: "How many minutes do you need?", correctAnswer: "قليلاً", wordBank: ["قليلاً", "كثيراً", "ساعة", "دقيقة"] },
      { questionAr: "هل تفضل أن نقرأ الآن؟", questionEn: "Do you prefer to read now?", correctAnswer: "اقرأ", wordBank: ["اقرأ", "اكتب", "ادرس", "العب"] },
      { questionAr: "ماذا تريد أن تتعلم اليوم؟", questionEn: "What do you want to learn today?", correctAnswer: "رب زدني علماً", wordBank: ["رب زدني علماً", "اقرأ", "تعلم", "افهم"] },
      { questionAr: "هل تحب أن نراجع الدرس معاً؟", questionEn: "Do you like to review the lesson together?", correctAnswer: "فذكر", wordBank: ["فذكر", "اقرأ", "راجع", "ادرس"] },
    ]
  },
  // Week 4 - الفهم والتوضيح (Understanding & Explanation)
  {
    weekNumber: 4,
    questions: [
      { questionAr: "أي كتاب تحب؟", questionEn: "Which book do you like?", correctAnswer: "ذلك الكتاب", wordBank: ["ذلك الكتاب", "هذا الكتاب", "كتابي", "كتابك"] },
      { questionAr: "هل تريد مثالاً آخر؟", questionEn: "Do you want another example?", correctAnswer: "يضرب الله الأمثال", wordBank: ["يضرب الله الأمثال", "اشرح", "وضح", "بين"] },
      { questionAr: "هل فهمت؟", questionEn: "Did you understand?", correctAnswer: "يفقهون", wordBank: ["يفقهون", "يفهمون", "يعلمون", "يدركون"] },
      { questionAr: "ما معنى هذه الكلمة؟", questionEn: "What is the meaning of this word?", correctAnswer: "تبياناً", wordBank: ["تبياناً", "معنى", "تفسير", "شرح"] },
      { questionAr: "هل تستطيع أن تشرح لي بطريقتك؟", questionEn: "Can you explain to me in your own way?", correctAnswer: "لتبين للناس", wordBank: ["لتبين للناس", "اشرح", "وضح", "قل"] },
    ]
  },
  // Week 5 - الروتين اليومي (Daily Routine)
  {
    weekNumber: 5,
    questions: [
      { questionAr: "هل رتبت غرفتك؟", questionEn: "Did you tidy your room?", correctAnswer: "وطهر بيتي", wordBank: ["وطهر بيتي", "رتب", "نظف", "اغسل"] },
      { questionAr: "أين وضعت ألعابك؟", questionEn: "Where did you put your toys?", correctAnswer: "أينما تكونوا", wordBank: ["أينما تكونوا", "هنا", "هناك", "مكان"] },
      { questionAr: "متى ننام؟", questionEn: "When do we sleep?", correctAnswer: "جعلنا نومكم سباتاً", wordBank: ["جعلنا نومكم سباتاً", "الليل", "النوم", "الراحة"] },
      { questionAr: "هل غسلت يديك؟", questionEn: "Did you wash your hands?", correctAnswer: "ليطهركم", wordBank: ["ليطهركم", "اغسل", "نظف", "طهر"] },
      { questionAr: "هل أكلت فطورك؟", questionEn: "Did you eat your breakfast?", correctAnswer: "كلوا من طيبات", wordBank: ["كلوا من طيبات", "كلوا", "اشربوا", "تناول"] },
    ]
  },
  // Week 6 - الطعام والشراب (Food & Drink)
  {
    weekNumber: 6,
    questions: [
      { questionAr: "ماذا تريد أن تأكل؟", questionEn: "What do you want to eat?", correctAnswer: "كلوا واشربوا", wordBank: ["كلوا واشربوا", "طعام", "شراب", "أكل"] },
      { questionAr: "هل شربت ماءً كافياً؟", questionEn: "Did you drink enough water?", correctAnswer: "وجعلنا من الماء كل شيء حي", wordBank: ["وجعلنا من الماء كل شيء حي", "اشرب", "ماء", "عطش"] },
      { questionAr: "كم ساعة نستخدم الهاتف اليوم؟", questionEn: "How many hours do we use the phone today?", correctAnswer: "ولا تسرفوا", wordBank: ["ولا تسرفوا", "قليلاً", "كثيراً", "ساعة"] },
      { questionAr: "هل انتهيت من ترتيب حقيبتك؟", questionEn: "Did you finish packing your bag?", correctAnswer: "وتزودوا", wordBank: ["وتزودوا", "جهز", "رتب", "احزم"] },
      { questionAr: "إلى أين سنذهب بعد المدرسة؟", questionEn: "Where will we go after school?", correctAnswer: "ثم إلى ربكم ترجعون", wordBank: ["ثم إلى ربكم ترجعون", "البيت", "السوق", "الحديقة"] },
    ]
  },
  // Week 7 - الأدب والأخلاق (Manners & Ethics)
  {
    weekNumber: 7,
    questions: [
      { questionAr: "هل قلت من فضلك؟", questionEn: "Did you say please?", correctAnswer: "قولاً كريماً", wordBank: ["قولاً كريماً", "شكراً", "عفواً", "لو سمحت"] },
      { questionAr: "هل قلت شكراً؟", questionEn: "Did you say thank you?", correctAnswer: "واشكروا لله", wordBank: ["واشكروا لله", "الحمد لله", "شكراً", "جزاك الله"] },
      { questionAr: "كيف نطلب الشيء بأدب؟", questionEn: "How do we ask for something politely?", correctAnswer: "يقولوا التي هي أحسن", wordBank: ["يقولوا التي هي أحسن", "من فضلك", "لو سمحت", "أرجوك"] },
      { questionAr: "هل يمكن أن تنتظر دورك؟", questionEn: "Can you wait for your turn?", correctAnswer: "واصبر", wordBank: ["واصبر", "انتظر", "توقف", "قف"] },
      { questionAr: "ماذا نقول عندما نغضب؟", questionEn: "What do we say when we get angry?", correctAnswer: "والكاظمين الغيظ", wordBank: ["والكاظمين الغيظ", "اهدأ", "توقف", "اصبر"] },
    ]
  },
  // Week 8 - الاعتذار والمسامحة (Apology & Forgiveness)
  {
    weekNumber: 8,
    questions: [
      { questionAr: "كيف نعتذر؟", questionEn: "How do we apologize?", correctAnswer: "ربنا ظلمنا أنفسنا", wordBank: ["ربنا ظلمنا أنفسنا", "آسف", "عفواً", "سامحني"] },
      { questionAr: "لمن نعتذر الآن؟", questionEn: "To whom do we apologize now?", correctAnswer: "إلى الله ترجع الأمور", wordBank: ["إلى الله ترجع الأمور", "للوالدين", "للمعلم", "للصديق"] },
      { questionAr: "هل سامحت أخاك/أختك؟", questionEn: "Did you forgive your brother/sister?", correctAnswer: "وليعفوا وليصفحوا", wordBank: ["وليعفوا وليصفحوا", "سامحته", "عفوت", "نسيت"] },
      { questionAr: "كيف نحل المشكلة دون صراخ؟", questionEn: "How do we solve the problem without shouting?", correctAnswer: "وأصلحوا ذات بينكم", wordBank: ["وأصلحوا ذات بينكم", "بالحوار", "بالهدوء", "بالصبر"] },
      { questionAr: "هل تحب أن نتفق على قاعدة جديدة؟", questionEn: "Do you want to agree on a new rule?", correctAnswer: "ميثاق", wordBank: ["ميثاق", "اتفاق", "عهد", "وعد"] },
    ]
  },
  // Week 9 - التشجيع والإنجاز (Encouragement & Achievement)
  {
    weekNumber: 9,
    questions: [
      { questionAr: "ماذا فعلت اليوم بشكل جيد؟", questionEn: "What did you do well today?", correctAnswer: "إن أحسنتم أحسنتم لأنفسكم", wordBank: ["إن أحسنتم أحسنتم لأنفسكم", "أحسنت", "ممتاز", "رائع"] },
      { questionAr: "ما الشيء الذي تفخر به اليوم؟", questionEn: "What are you proud of today?", correctAnswer: "فبذلك فليفرحوا", wordBank: ["فبذلك فليفرحوا", "فخور", "سعيد", "مسرور"] },
      { questionAr: "هل حاولت مرة أخرى عندما أخطأت؟", questionEn: "Did you try again when you made a mistake?", correctAnswer: "ولا تيأسوا من روح الله", wordBank: ["ولا تيأسوا من روح الله", "حاولت", "أعدت", "كررت"] },
      { questionAr: "كيف نجعل الغد أفضل؟", questionEn: "How do we make tomorrow better?", correctAnswer: "حتى يغيروا ما بأنفسهم", wordBank: ["حتى يغيروا ما بأنفسهم", "نتعلم", "نعمل", "نجتهد"] },
      { questionAr: "من ساعدت اليوم؟", questionEn: "Who did you help today?", correctAnswer: "وتعاونوا على البر والتقوى", wordBank: ["وتعاونوا على البر والتقوى", "ساعدت", "عاونت", "أعنت"] },
    ]
  },
  // Week 10 - المشاركة والتقدير (Sharing & Appreciation)
  {
    weekNumber: 10,
    questions: [
      { questionAr: "هل شاركت ألعابك مع غيرك؟", questionEn: "Did you share your toys with others?", correctAnswer: "ويؤثرون على أنفسهم", wordBank: ["ويؤثرون على أنفسهم", "شاركت", "أعطيت", "قدمت"] },
      { questionAr: "ما أجمل كلمة سمعتها اليوم؟", questionEn: "What is the nicest word you heard today?", correctAnswer: "قول معروف", wordBank: ["قول معروف", "شكراً", "أحبك", "جميل"] },
      { questionAr: "ما هدفك هذا الأسبوع؟", questionEn: "What is your goal this week?", correctAnswer: "استبقوا الخيرات", wordBank: ["استبقوا الخيرات", "النجاح", "التفوق", "التعلم"] },
      { questionAr: "هل تريد مكافأة أم تشجيعاً بالكلام؟", questionEn: "Do you want a reward or verbal encouragement?", correctAnswer: "أجر عظيم", wordBank: ["أجر عظيم", "هدية", "مكافأة", "جائزة"] },
      { questionAr: "ما الطريقة التي تحب أن أشجعك بها؟", questionEn: "What way do you like me to encourage you?", correctAnswer: "وبشر", wordBank: ["وبشر", "شجعني", "حفزني", "ادعمني"] },
    ]
  },
  // Week 11 - المدرسة والأصدقاء (School & Friends)
  {
    weekNumber: 11,
    questions: [
      { questionAr: "ماذا حدث في المدرسة اليوم؟", questionEn: "What happened at school today?", correctAnswer: "النبأ العظيم", wordBank: ["النبأ العظيم", "أخبار", "قصة", "حكاية"] },
      { questionAr: "من هو صديقك اليوم؟", questionEn: "Who is your friend today?", correctAnswer: "إنما المؤمنون إخوة", wordBank: ["إنما المؤمنون إخوة", "صديقي", "زميلي", "رفيقي"] },
      { questionAr: "ما اللعبة التي لعبتموها؟", questionEn: "What game did you play?", correctAnswer: "لهو ولعب", wordBank: ["لهو ولعب", "كرة", "سباق", "لعبة"] },
      { questionAr: "هل واجهت مشكلة؟", questionEn: "Did you face a problem?", correctAnswer: "لا يكلف الله نفساً إلا وسعها", wordBank: ["لا يكلف الله نفساً إلا وسعها", "نعم", "مشكلة", "صعوبة"] },
      { questionAr: "كيف كان المعلم اليوم؟", questionEn: "How was the teacher today?", correctAnswer: "ويعلمكم ما لم تكونوا تعلمون", wordBank: ["ويعلمكم ما لم تكونوا تعلمون", "رائع", "ممتاز", "طيب"] },
    ]
  },
  // Week 12 - التأمل والختام (Reflection & Conclusion)
  {
    weekNumber: 12,
    questions: [
      { questionAr: "هل شعرت بالظلم؟", questionEn: "Did you feel wronged?", correctAnswer: "لا تظلمون ولا تظلمون", wordBank: ["لا تظلمون ولا تظلمون", "نعم", "ظلم", "حزن"] },
      { questionAr: "ماذا تعلمت من هذا الموقف؟", questionEn: "What did you learn from this situation?", correctAnswer: "لعلكم تعقلون", wordBank: ["لعلكم تعقلون", "درس", "عبرة", "حكمة"] },
      { questionAr: "ما الشيء الذي تريد أن تخبرني به قبل النوم؟", questionEn: "What do you want to tell me before bed?", correctAnswer: "بسم الله الرحمن الرحيم", wordBank: ["بسم الله الرحمن الرحيم", "أحبك", "شكراً", "تصبح على خير"] },
      { questionAr: "هل تريد أن أسمعك دون مقاطعة؟", questionEn: "Do you want me to listen without interrupting?", correctAnswer: "فاستمعوا له وأنصتوا", wordBank: ["فاستمعوا له وأنصتوا", "نعم", "استمع", "أنصت"] },
      { questionAr: "هل تحب أن نضع خطة بسيطة للغد؟", questionEn: "Do you like to make a simple plan for tomorrow?", correctAnswer: "ولتنظر نفس ما قدمت لغد", wordBank: ["ولتنظر نفس ما قدمت لغد", "خطة", "برنامج", "جدول"] },
    ]
  }
];

async function addQuranicQuestions() {
  console.log("📖 Adding Quranic conversational questions to diploma...");
  
  const weeks = await db.select().from(diplomaWeeks);
  
  for (const weekData of QURANIC_QUESTIONS) {
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
        explanation: `الجواب الصحيح: "${q.correctAnswer}" - تعبير قرآني يُستخدم في هذا الموقف.`,
        isQuiz: 0,
        orderIndex: orderIndex++,
      });
    }
    
    console.log(`  ✓ Added ${weekData.questions.length} Quranic questions`);
  }
  
  console.log("🎉 Quranic questions added successfully!");
  console.log("📊 Total: 60 new questions (5 per week × 12 weeks)");
}

addQuranicQuestions()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
