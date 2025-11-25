import { db } from "./db";
import { conversationPrompts } from "@shared/schema";

// 20 trilingual (Albanian, Swahili, Urdu) conversation exercises from Surah Al-Kahf
const kaafTrilingualExercises = [
  {
    question: "كيف أقول: أنا إنسان؟",
    questionEn: "How do you say: I am human?",
    questionSq: "Si thuhet: Jam njeri?",
    questionSw: "Je, unasemaje: Mimi ni mwanadamu?",
    questionUr: "انسان ہوں کیسے کہیں؟",
    suggestedVerse: "إِنَّمَا أَنَا بَشَرٌ",
    category: "Human Nature",
    usageDomain: "self-description",
  },
  {
    question: "كيف أقول: قل الحق؟",
    questionEn: "How do you say: Tell the truth?",
    questionSq: "Si thuhet: Thuaj të vërtetën është?",
    questionSw: "Je, unasemaje: Sema ukweli ni...?",
    questionUr: "سچ کہنا ہے کیسے کہیں؟",
    suggestedVerse: "قُلْ إِنَّمَا الْعِلْمُ",
    category: "Truth and Knowledge",
    usageDomain: "truth-telling",
  },
  {
    question: "كيف أسأل: هل نذهب إلى الكهف؟",
    questionEn: "How do you ask: Should we go to the cave?",
    questionSq: "Si pyet: Të shkojmë në shpellë?",
    questionSw: "Je, unauliza: Tuelekee pangoni?",
    questionUr: "غار چلیں؟ کیسے پوچھیں؟",
    suggestedVerse: "إِلَى الْكَهْفِ",
    category: "Seeking Refuge",
    usageDomain: "invitation",
  },
  {
    question: "كيف أقول: الله زادهم علماً؟",
    questionEn: "How do you say: Allah increased them in knowledge?",
    questionSq: "Si thuhet: Zoti ua shtoi diturinë?",
    questionSw: "Je, unasemaje: Mungu aliwazidishia maarifa?",
    questionUr: "اللہ نے علم بڑھایا کیسے کہیں؟",
    suggestedVerse: "فَزِدْنَاهُمْ هُدًى",
    category: "Divine Wisdom",
    usageDomain: "statement",
  },
  {
    question: "كيف أقول: كل العلم عند الله؟",
    questionEn: "How do you say: All knowledge is with Allah?",
    questionSq: "Si thuhet: E gjithë dituria është tek Allahu?",
    questionSw: "Je, unasemaje: Elimu yote iko kwa Mungu?",
    questionUr: "سب علم اللہ کے پاس ہے کیسے کہیں؟",
    suggestedVerse: "وَعِندَهُ أُمُّ الْكِتَابِ",
    category: "God's Knowledge",
    usageDomain: "statement",
  },
  {
    question: "كيف أقول: ربي أعلم؟",
    questionEn: "How do you say: My Lord knows best?",
    questionSq: "Si thuhet: Zoti ynë e di më mirë?",
    questionSw: "Je, unasemaje: Mola wetu anajua vyema?",
    questionUr: "ہمارا رب بہتر جانتا ہے کیسے کہیں؟",
    suggestedVerse: "رَبِّي أَعْلَمُ",
    category: "Trust in Allah",
    usageDomain: "statement",
  },
  {
    question: "كيف أقول: أريد مخرجاً؟",
    questionEn: "How do you say: I want a way out?",
    questionSq: "Si thuhet: Dua një dalje?",
    questionSw: "Je, unasemaje: Nataka njia ya kutokea?",
    questionUr: "میں راستہ چاہتا ہوں کیسے کہیں؟",
    suggestedVerse: "فَأْوُوا إِلَى الْكَهْفِ",
    category: "Seeking Guidance",
    usageDomain: "request",
  },
  {
    question: "كيف أسأل: هل يبحث عن طعام لنا؟",
    questionEn: "How do you ask: Can you seek food for us?",
    questionSq: "Si pyet: A mund të kërkojë ushqim për ne?",
    questionSw: "Je, unauliza: Akitafute chakula chema?",
    questionUr: "ہمارے لئے کھانا تلاش کرے؟ کیسے پوچھیں؟",
    suggestedVerse: "فَلْيَنظُرْ أَيُّهَا أَزْكَى طَعَامًا",
    category: "Provision and Care",
    usageDomain: "question",
  },
  {
    question: "كيف أقول: أرسلوا أحدكم؟",
    questionEn: "How do you say: Send one of you?",
    questionSq: "Si thuhet: Dërgoni një prej jush?",
    questionSw: "Je, unasemaje: Mmtume mmoja wenu?",
    questionUr: "اپنے میں سے کسی کو بھیجیں؟ کیسے کہیں؟",
    suggestedVerse: "فَابْعَثُوا أَحَدَكُم",
    category: "Cooperation",
    usageDomain: "request",
  },
  {
    question: "كيف أقول: اخفوا أنفسكم؟",
    questionEn: "How do you say: Hide and don't reveal yourselves?",
    questionSq: "Si thuhet: Fshihu, mos u tregoni?",
    questionSw: "Je, unasemaje: Jifiche msionekane?",
    questionUr: "چھپ جاؤ، ظاہر نہ کرو؟ کیسے کہیں؟",
    suggestedVerse: "وَلَا يُشْعِرَنَّ بِكُمْ أَحَدًا",
    category: "Concealment",
    usageDomain: "command",
  },
  {
    question: "كيف أقول: يحكم الله بيننا؟",
    questionEn: "How do you say: Let Allah judge between us?",
    questionSq: "Si thuhet: Le të gjykojë Zoti mes nesh?",
    questionSw: "Je, unasemaje: Mola atuhukumu kati yetu?",
    questionUr: "اللہ ہمارے درمیان فیصلہ کرے کیسے کہیں؟",
    suggestedVerse: "فَلْيَحْكُمْ بَيْنَنَا رَبُّنَا",
    category: "Divine Justice",
    usageDomain: "request",
  },
  {
    question: "كيف أسأل: هل تريدون أن تبدلوا؟",
    questionEn: "How do you ask: Do you want to change?",
    questionSq: "Si thuhet: A doni të ndryshoni?",
    questionSw: "Je, unasemaje: Mnataka kubadilisha?",
    questionUr: "کیا تم بدلنا چاہتے ہو؟ کیسے کہیں؟",
    suggestedVerse: "أَفَتُرِيدُونَ أَنْ تَبْدِلُوا",
    category: "Change and Growth",
    usageDomain: "question",
  },
  {
    question: "كيف أقول: أنا لا أستطيع حفظكم؟",
    questionEn: "How do you say: I cannot protect you?",
    questionSq: "Si thuhet: Nuk mund t'ju ruaj?",
    questionSw: "Je, unasemaje: Siwezi kuwalinda?",
    questionUr: "میں تمہیں بچا نہیں سکتا کیسے کہیں؟",
    suggestedVerse: "وَمَا أَنَا عَلَيْهِمْ بِحَفِيظٍ",
    category: "Humility",
    usageDomain: "statement",
  },
  {
    question: "كيف أقول: لا أحد يعلمهم؟",
    questionEn: "How do you say: No one knows about them?",
    questionSq: "Si thuhet: Askush nuk i di?",
    questionSw: "Je, unasemaje: Hakuna anayejua?",
    questionUr: "کوئی نہیں جانتا کیسے کہیں؟",
    suggestedVerse: "مَا يَعْلَمُهُمْ",
    category: "Secrecy",
    usageDomain: "statement",
  },
  {
    question: "كيف أقول: اعمل عملاً صالحاً؟",
    questionEn: "How do you say: Do good deeds?",
    questionSq: "Si thuhet: Bëj punë të mirë?",
    questionSw: "Je, unasemaje: Fanya kazi njema?",
    questionUr: "اچھا عمل کرو کیسے کہیں؟",
    suggestedVerse: "فَلْيَعْمَلْ عَمَلًا صَالِحًا",
    category: "Righteous Action",
    usageDomain: "exhortation",
  },
  {
    question: "كيف أقول: لا تشرك بالله أحداً؟",
    questionEn: "How do you say: Don't associate anyone with Allah?",
    questionSq: "Si thuhet: Mos i bashkëngjit Zotit?",
    questionSw: "Je, unasemaje: Usimshirikishe Mungu?",
    questionUr: "اللہ کے ساتھ کسی کو شریک نہ کرو کیسے کہیں؟",
    suggestedVerse: "وَلَا يُشْرِكْ",
    category: "Tawheed (Monotheism)",
    usageDomain: "command",
  },
  {
    question: "كيف أقول: لا تجادل فيهم كثيراً؟",
    questionEn: "How do you say: Don't dispute about them much?",
    questionSq: "Si thuhet: Mos pyet shumë?",
    questionSw: "Je, unasemaje: Usiulize sana?",
    questionUr: "زیادہ سوال نہ کرو کیسے کہیں؟",
    suggestedVerse: "فَلَا تُمَارِ فِيهِمْ",
    category: "Avoiding Arguments",
    usageDomain: "advice",
  },
  {
    question: "كيف أقول: لا تقل سأفعله غداً؟",
    questionEn: "How do you say: Don't say I will do it tomorrow?",
    questionSq: "Si thuhet: Mos thuaj do ta bëj nesër?",
    questionSw: "Je, unasemaje: Usiseme nitafanya kesho?",
    questionUr: "کل کروں گا نہ کہو کیسے کہیں؟",
    suggestedVerse: "وَلَا تَقُولَنَّ لِشَيْءٍ إِنِّي فَاعِلٌ ذَٰلِكَ غَدًا",
    category: "Reliance on Allah",
    usageDomain: "advice",
  },
  {
    question: "كيف أقول: إن شاء الله؟",
    questionEn: "How do you say: If Allah wills (Inshallah)?",
    questionSq: "Si thuhet: Thuaj inshallah?",
    questionSw: "Je, unasemaje: Sema inshallah?",
    questionUr: "ان شاء اللہ کہو کیسے کہیں؟",
    suggestedVerse: "إِلَّا أَنْ يَشَاءَ اللَّهُ",
    category: "Divine Will",
    usageDomain: "phrase",
  },
  {
    question: "كيف أقول: اذكر ربك؟",
    questionEn: "How do you say: Remember your Lord?",
    questionSq: "Si thuhet: Përmende Zotin tënd?",
    questionSw: "Je, unasemaje: Mtaje Mola wako?",
    questionUr: "اپنے رب کو یاد کرو کیسے کہیں؟",
    suggestedVerse: "وَاذْكُرْ رَبَّكَ",
    category: "Remembrance of Allah",
    usageDomain: "exhortation",
  },
];

async function addKaafTrilingualExercisesToDB() {
  console.log("📖 Adding 20 Trilingual (Albanian, Swahili, Urdu) Exercises from Surah Al-Kahf...");

  try {
    for (let i = 0; i < kaafTrilingualExercises.length; i++) {
      const exercise = kaafTrilingualExercises[i];
      await db.insert(conversationPrompts).values(exercise as any);
      console.log(`✓ Added exercise ${i + 1}/20: ${exercise.category}`);
    }

    console.log("\n✅ Successfully added all trilingual exercises!");
    console.log("📊 Summary:");
    console.log(`   - Total exercises added: ${kaafTrilingualExercises.length}`);
    console.log(`   - Languages: Albanian (sq), Swahili (sw), Urdu (ur)`);
    console.log(`   - Source: Surah Al-Kahf`);
    console.log(`   - Urdu language support now ENABLED in the application`);
  } catch (error) {
    console.error("❌ Error adding exercises:", error);
    throw error;
  }
}

addKaafTrilingualExercisesToDB()
  .then(() => {
    console.log("✓ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
