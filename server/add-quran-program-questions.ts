import { db } from "./db";
import { questionBanks } from "@shared/schema";

// 20 questions about Quran recitation, memorization, and study program
const quranProgramQuestions = [
  {
    theme: "ورد التلاوة الثابت",
    themeEnglish: "Consistent Quran Recitation Program",
    description: "وصف جماعة يجعلون لهم ورد تلاوة ثابتًا",
    tags: ["تلاوة", "ورد", "ثبات"],
    correctPhraseIds: ["يتلون كتاب الله"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "التلاوة الصحيحة المتقَنة",
    themeEnglish: "Correct and Perfect Recitation",
    description: "التلاوة الصحيحة الكاملة المتقَنة",
    tags: ["تلاوة", "إتقان", "صحة"],
    correctPhraseIds: ["حق تلاوته"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "الترتيل والجمال في التلاوة",
    themeEnglish: "Beautiful Recitation with Tarteel",
    description: "التلاوة مرتلة بهدوء وجمال",
    tags: ["ترتيل", "جمال", "هدوء"],
    correctPhraseIds: ["ورتل القرآن ترتيلا"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "القرآن العربي الواضح",
    themeEnglish: "Clear Arabic Quran",
    description: "القرآن نزل بلغة عربية واضحة",
    tags: ["لغة", "عربي", "وضوح"],
    correctPhraseIds: ["قرآنا عربيا"],
    difficulty: 1,
    category: "thematic",
  },
  {
    theme: "التعقل والفهم",
    themeEnglish: "Intellect and Understanding",
    description: "هدف التلاوة والدراسة هو تشغيل العقل والفهم",
    tags: ["عقل", "فهم", "تعقل"],
    correctPhraseIds: ["لعلكم تعقلون"],
    difficulty: 1,
    category: "thematic",
  },
  {
    theme: "التدبر والتفكر",
    themeEnglish: "Contemplation and Reflection",
    description: "برنامج التدبر هو النظر في معاني القرآن",
    tags: ["تدبر", "معاني", "تفكر"],
    correctPhraseIds: ["افلا يتدبرون القرآن"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "البركة في الكتاب",
    themeEnglish: "Blessedness of the Quran",
    description: "الكتاب مبارك يصلح أن يكون وردًا دائمًا",
    tags: ["بركة", "مبارك", "ورد"],
    correctPhraseIds: ["كتاب انزلناه اليك مبارك"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "الشفاء والعلاج",
    themeEnglish: "Healing Through Quran",
    description: "سماع القرآن وقراءته علاج لقلوبهم",
    tags: ["شفاء", "علاج", "قلب"],
    correctPhraseIds: ["شفاء لما في الصدور"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "الهدى والرحمة",
    themeEnglish: "Guidance and Mercy",
    description: "الكتاب هداية ورحمة خاصة بالمؤمنين",
    tags: ["هدى", "رحمة", "إيمان"],
    correctPhraseIds: ["هدى ورحمة للمؤمنين"],
    difficulty: 1,
    category: "thematic",
  },
  {
    theme: "آداب الاستماع",
    themeEnglish: "Etiquette of Listening",
    description: "أدب الاستماع والإنصات بلا كلام جانبي",
    tags: ["استماع", "إنصات", "أدب"],
    correctPhraseIds: ["فاستمعوا له وانصتوا"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "تيسير الذكر",
    themeEnglish: "Ease of Remembrance",
    description: "حفظ القرآن ومراجعته ميسَّر لمن أراد",
    tags: ["حفظ", "تيسير", "ذكر"],
    correctPhraseIds: ["ولقد يسرنا القرآن للذكر"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "التجارة الرابحة",
    themeEnglish: "Profitable Transaction",
    description: "جعل التلاوة وردا ثابتا يرجو به الربح عند الله",
    tags: ["تجارة", "ربح", "عند الله"],
    correctPhraseIds: ["تجارة لن تبور"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "الهداية للأقوم",
    themeEnglish: "Guidance to the Straight Path",
    description: "القرآن يرشد صاحبه الى أقوم وأوضح طريق",
    tags: ["هداية", "الأقوم", "طريق"],
    correctPhraseIds: ["يهدي للتي هي اقوم"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "القول الثقيل",
    themeEnglish: "Weighty Word",
    description: "هذا الكلام ليس عاديًا بل حمْل ثقيل يحتاج صبرًا",
    tags: ["ثقل", "صبر", "كلام"],
    correctPhraseIds: ["قولا ثقيلا"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "النور والبيان",
    themeEnglish: "Light and Clarity",
    description: "القرآن نور يهدي وكتاب واضح",
    tags: ["نور", "بيان", "وضوح"],
    correctPhraseIds: ["نور وكتاب مبين"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "تعليم الكتاب والحكمة",
    themeEnglish: "Teaching Book and Wisdom",
    description: "وظيفة المدرِّس أن يعلِّمهم كتاب الله",
    tags: ["تعليم", "كتاب", "حكمة"],
    correctPhraseIds: ["يعلمكم الكتاب والحكمة"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "الصحبة الصالحة",
    themeEnglish: "Righteous Companionship",
    description: "المدارسة في صحبة صالحة مستقيمة",
    tags: ["صحبة", "صالح", "مستقيم"],
    correctPhraseIds: ["مع الصادقين"],
    difficulty: 2,
    category: "thematic",
  },
  {
    theme: "قيام الليل والمراجعة",
    themeEnglish: "Night Prayer and Review",
    description: "برنامج الليل له قوة التأثير في القلب واللسان",
    tags: ["ليل", "قيام", "مراجعة"],
    correctPhraseIds: ["ناشئة الليل هي اشد وطئا"],
    difficulty: 3,
    category: "thematic",
  },
  {
    theme: "عِظَم أثر القرآن",
    themeEnglish: "Mighty Impact of Quran",
    description: "عِظَم أثر القرآن حتى لو نزل على جبل صلب",
    tags: ["أثر", "قوة", "تأثير"],
    correctPhraseIds: ["لو انزلنا هذا القرآن على جبل"],
    difficulty: 3,
    category: "thematic",
  },
  {
    theme: "القدر والطاقة",
    themeEnglish: "Capability and Capacity",
    description: "التكليف بورد القرآن يكون على قدر طاقته",
    tags: ["قدر", "طاقة", "تكليف"],
    correctPhraseIds: ["لا يكلف الله نفسا الا وسعها"],
    difficulty: 2,
    category: "thematic",
  },
];

async function addQuranProgramQuestionsToDB() {
  console.log("📖 Adding 20 Quran Program & Recitation Questions...");

  try {
    for (let i = 0; i < quranProgramQuestions.length; i++) {
      const question = quranProgramQuestions[i];
      await db.insert(questionBanks).values(question as any);
      console.log(`✓ Added question ${i + 1}/20: ${question.theme}`);
    }

    console.log("\n✅ Successfully added all Quran program questions!");
    console.log("📊 Summary:");
    console.log(`   - Total questions added: ${quranProgramQuestions.length}`);
    console.log(`   - Topics: Recitation, Memorization, Contemplation, Teaching, Night Study`);
    console.log(`   - All linked to Quranic expressions for teaching`);
  } catch (error) {
    console.error("❌ Error adding questions:", error);
    throw error;
  }
}

addQuranProgramQuestionsToDB()
  .then(() => {
    console.log("✓ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
