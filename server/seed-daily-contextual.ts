import { db } from "./db";
import { dailySentences, quranicExpressions, dailySentenceExercises } from "@shared/schema";

async function seedDailyContextualData() {
  console.log("Seeding daily contextual exercise data...");

  // Insert daily sentences
  const sentences = await db.insert(dailySentences).values([
    {
      englishText: "I will be patient with this situation",
      translations: {
        ar: "سأصبر على هذا الموقف",
        id: "Saya akan bersabar dengan situasi ini",
        tr: "Bu durumda sabırlı olacağım"
      },
      theme: "patience",
      difficulty: 1,
      contextNotes: "Used when facing difficult circumstances"
    },
    {
      englishText: "I trust in God's plan",
      translations: {
        ar: "أتوكل على تدبير الله",
        id: "Saya percaya pada rencana Allah",
        tr: "Allah'ın planına güveniyorum"
      },
      theme: "trust",
      difficulty: 1,
      contextNotes: "Expressing reliance on divine wisdom"
    },
    {
      englishText: "I am grateful for this blessing",
      translations: {
        ar: "أنا ممتن لهذه النعمة",
        id: "Saya bersyukur atas nikmat ini",
        tr: "Bu nimete şükrediyorum"
      },
      theme: "gratitude",
      difficulty: 1,
      contextNotes: "Showing appreciation for blessings"
    }
  ]).returning();

  // Insert Quranic expressions
  const expressions = await db.insert(quranicExpressions).values([
    // Patience expressions
    {
      arabicText: "فاصبر صبرا جميلا",
      surahAyah: "المعارج:5",
      theme: "patience",
      meaning: "Exercise beautiful patience",
      usageContext: "When facing trials, emphasizing patience with grace",
      wordCount: 3,
      explanations: {
        en: "Beautiful patience means patience without complaint",
        ar: "الصبر الجميل هو الصبر بدون شكوى"
      }
    },
    {
      arabicText: "توكل على العزيز الرحيم",
      surahAyah: "الشعراء:217",
      theme: "trust",
      meaning: "Put your trust in the Mighty, the Merciful",
      usageContext: "Expressing trust in Allah",
      wordCount: 4,
      explanations: {
        en: "Trust in Allah's might and mercy",
        ar: "التوكل على عزة الله ورحمته"
      }
    },
    {
      arabicText: "لا تحزن إن الله معنا",
      surahAyah: "التوبة:40",
      theme: "hope",
      meaning: "Do not grieve, Allah is with us",
      usageContext: "Consoling someone in difficulty",
      wordCount: 5,
      explanations: {
        en: "Reassurance that Allah is always present",
        ar: "طمأنينة بأن الله دائماً معنا"
      }
    },
    // More expressions...
    {
      arabicText: "إنما الصبر عند الصدمة الأولى",
      surahAyah: "حديث شريف",
      theme: "patience",
      meaning: "True patience is at the first shock",
      usageContext: "About immediate emotional control",
      wordCount: 5,
      explanations: {
        en: "Real patience is shown at the initial moment of hardship",
        ar: "الصبر الحقيقي يظهر عند أول لحظة من المصيبة"
      }
    },
    {
      arabicText: "والله خير الرازقين",
      surahAyah: "الجمعة:11",
      theme: "trust",
      meaning: "And Allah is the Best of Providers",
      usageContext: "Trusting in divine provision",
      wordCount: 3,
      explanations: {
        en: "Allah provides better than anyone",
        ar: "الله يرزق أفضل من أي أحد"
      }
    },
    {
      arabicText: "الحمد لله رب العالمين",
      surahAyah: "الفاتحة:2",
      theme: "gratitude",
      meaning: "Praise be to Allah, Lord of the worlds",
      usageContext: "Expressing gratitude and praise",
      wordCount: 4,
      explanations: {
        en: "Universal praise to Allah",
        ar: "حمد شامل لله"
      }
    }
  ]).returning();

  // Create exercises matching sentences to expressions
  const exercises = await db.insert(dailySentenceExercises).values([
    {
      dailySentenceId: sentences[0].id,  // "I will be patient"
      correctExpressionId: expressions[0].id,  // "فاصبر صبرا جميلا"
      distractorIds: [expressions[1].id, expressions[2].id],  // Trust and hope expressions
      explanation: {
        en: "\"فاصبر صبرا جميلا\" (Exercise beautiful patience) from Al-Ma'arij:5 is the most accurate because it directly addresses patience in difficult situations. The verse emphasizes patience that is graceful and without complaint, perfectly matching the intent of being patient with a challenging situation.",
        ar: "\"فاصبر صبرا جميلا\" من المعارج:5 هي الأدق لأنها تتناول الصبر مباشرة في المواقف الصعبة. الآية تؤكد على الصبر الجميل دون شكوى."
      },
      learningNote: {
        en: "This phrase uses the imperative form \"اصبر\" (be patient) with the descriptive \"صبرا جميلا\" (beautiful patience). In Arabic, adding \"جميلا\" elevates the quality of patience to one that is admirable and graceful.",
        ar: "هذه العبارة تستخدم صيغة الأمر \"اصبر\" مع الوصف \"صبرا جميلا\". في اللغة العربية، إضافة \"جميلا\" ترفع نوعية الصبر إلى مستوى محمود ورفيع."
      }
    },
    {
      dailySentenceId: sentences[1].id,  // "I trust in God's plan"
      correctExpressionId: expressions[1].id,  // "توكل على العزيز الرحيم"
      distractorIds: [expressions[0].id, expressions[4].id],  // Patience and provision
      explanation: {
        en: "\"توكل على العزيز الرحيم\" (Put your trust in the Mighty, the Merciful) from Ash-Shu'ara:217 is most fitting as it explicitly commands trust in Allah's attributes of might and mercy, directly expressing reliance on divine wisdom and plan.",
        ar: "\"توكل على العزيز الرحيم\" من الشعراء:217 هي الأنسب لأنها تأمر صراحة بالتوكل على صفات الله من العزة والرحمة."
      },
      learningNote: {
        en: "The verb \"توكل\" means to place complete trust and reliance. \"العزيز الرحيم\" combines two divine names emphasizing both Allah's power (Al-'Aziz) and His mercy (Ar-Rahim).",
        ar: "الفعل \"توكل\" يعني وضع الثقة والاعتماد الكامل. \"العزيز الرحيم\" يجمع بين اسمين من أسماء الله يؤكدان قوته ورحمته."
      }
    },
    {
      dailySentenceId: sentences[2].id,  // "I am grateful"
      correctExpressionId: expressions[5].id,  // "الحمد لله رب العالمين"
      distractorIds: [expressions[2].id, expressions[4].id],  // Hope and provision
      explanation: {
        en: "\"الحمد لله رب العالمين\" (Praise be to Allah, Lord of the worlds) from Al-Fatihah:2 is the perfect expression of gratitude. It's the opening statement of the Quran's first chapter, establishing a foundation of thankfulness to Allah.",
        ar: "\"الحمد لله رب العالمين\" من الفاتحة:2 هي التعبير الأمثل عن الشكر. إنها العبارة الافتتاحية لأول سورة في القرآن."
      },
      learningNote: {
        en: "\"الحمد\" specifically means praise that acknowledges excellence and perfection, unlike simple thanks. \"رب العالمين\" (Lord of all worlds) expands the gratitude universally.",
        ar: "\"الحمد\" تعني الثناء الذي يعترف بالتميز والكمال، وليس مجرد شكر بسيط. \"رب العالمين\" توسع نطاق الشكر عالمياً."
      }
    }
  ]).returning();

  console.log(`✅ Inserted ${sentences.length} daily sentences`);
  console.log(`✅ Inserted ${expressions.length} Quranic expressions`);
  console.log(`✅ Inserted ${exercises.length} exercises`);
  console.log("Daily contextual data seeding complete!");

  process.exit(0);
}

seedDailyContextualData().catch((error) => {
  console.error("Error seeding data:", error);
  process.exit(1);
});
