import { db } from "./db";
import { conversationPrompts, quranicExpressions } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

const NEW_EXERCISES = [
  {
    title: "الشكر بعد المساعدة",
    situation: "صديقك ساعدك في حل مشكلة.",
    situationEn: "Your friend helped you solve a problem.",
    targetExpression: "ومن يشكر فإنما يشكر لنفسه",
    surahAyah: "لقمان:12",
    translation: "And whoever is grateful is grateful for [the benefit of] himself",
  },
  {
    title: "وقت الضيق والضغط",
    situation: "زميلك متوتر من الامتحان.",
    situationEn: "Your colleague is anxious about the exam.",
    targetExpression: "لا يكلف الله نفسًا إلا وسعها",
    surahAyah: "البقرة:286",
    translation: "Allah does not burden a soul beyond that it can bear",
  },
  {
    title: "تشجيع على الصبر",
    situation: "طالب حزين لأنه فشل في تجربة ما.",
    situationEn: "A student is sad because he failed at something.",
    targetExpression: "إن الله مع الصابرين",
    surahAyah: "البقرة:153",
    translation: "Indeed, Allah is with the patient",
  },
  {
    title: "الأمل بعد العسر",
    situation: "شخص فقد وظيفة ويرى أن المستقبل مظلم.",
    situationEn: "Someone lost their job and sees a dark future.",
    targetExpression: "إن مع العسر يسرًا",
    surahAyah: "الشرح:6",
    translation: "Indeed, with hardship comes ease",
  },
  {
    title: "التوكل بعد اتخاذ القرار",
    situation: "طالب متردد هل يسافر للدراسة أم لا.",
    situationEn: "A student is hesitant about traveling for studies.",
    targetExpression: "فإذا عزمت فتوكل على الله",
    surahAyah: "آل عمران:159",
    translation: "And when you have decided, then rely upon Allah",
  },
  {
    title: "كراهية الخير الظاهر",
    situation: "شخص حزين لأن جامعة معينة قبلته في تخصص لا يحبه.",
    situationEn: "Someone is sad because a university accepted them in a major they don't like.",
    targetExpression: "وعسى أن تكرهوا شيئًا وهو خير لكم",
    surahAyah: "البقرة:216",
    translation: "But perhaps you hate a thing and it is good for you",
  },
  {
    title: "حب ما فيه شر خفي",
    situation: "شخص يطارد وظيفة تغريه لكنها خطرة دينيًا.",
    situationEn: "Someone is pursuing a tempting but religiously dangerous job.",
    targetExpression: "وعسى أن تحبوا شيئًا وهو شر لكم",
    surahAyah: "البقرة:216",
    translation: "And perhaps you love a thing and it is bad for you",
  },
  {
    title: "التعجب من النعمة",
    situation: "رأيت مشروعًا ناجحًا أو بيتًا جميلاً لصديق.",
    situationEn: "You saw a successful project or a beautiful house belonging to a friend.",
    targetExpression: "ما شاء الله لا قوة إلا بالله",
    surahAyah: "الكهف:39",
    translation: "What Allah willed [has occurred]; there is no power except in Allah",
  },
  {
    title: "طمأنة في الرزق",
    situation: "شخص خائف من قلة الرزق لو ترك وظيفة متعبة.",
    situationEn: "Someone is afraid of losing income if they leave a tiring job.",
    targetExpression: "والله خير الرازقين",
    surahAyah: "المائدة:114",
    translation: "And Allah is the best of providers",
  },
  {
    title: "تذكير بالذكر",
    situation: "صديقك نسي الأذكار وينشغل كثيرًا.",
    situationEn: "Your friend forgets remembrance and is often busy.",
    targetExpression: "فاذكروني أذكركم",
    surahAyah: "البقرة:152",
    translation: "So remember Me; I will remember you",
  },
  {
    title: "رحمة الله قريبة",
    situation: "شخص يقول: أشعر أن الله لن يرحمني.",
    situationEn: "Someone says: I feel Allah will not have mercy on me.",
    targetExpression: "إن رحمت الله قريب من المحسنين",
    surahAyah: "الأعراف:56",
    translation: "Indeed, the mercy of Allah is near to the doers of good",
  },
  {
    title: "الدعاء بطلب العلم",
    situation: "طالب يتهيأ لبداية سنة دراسية جديدة.",
    situationEn: "A student is preparing for a new academic year.",
    targetExpression: "رب زدني علمًا",
    surahAyah: "طه:114",
    translation: "My Lord, increase me in knowledge",
  },
  {
    title: "تسهيل الأمور",
    situation: "شخص أمامه مهمة صعبة (مقابلة، عرض، مشروع).",
    situationEn: "Someone faces a difficult task (interview, presentation, project).",
    targetExpression: "ويسر لي أمري",
    surahAyah: "طه:26",
    translation: "And ease for me my task",
  },
  {
    title: "نفي الخوف والحزن",
    situation: "طفل خائف من المستقبل.",
    situationEn: "A child is afraid of the future.",
    targetExpression: "لا خوف عليهم ولا هم يحزنون",
    surahAyah: "البقرة:62",
    translation: "No fear shall be upon them, nor shall they grieve",
  },
  {
    title: "التفويض إلى الله",
    situation: "مجموعة تواجه تهديدًا أو ضغطًا من جهة ما.",
    situationEn: "A group faces a threat or pressure from some party.",
    targetExpression: "حسبنا الله ونعم الوكيل",
    surahAyah: "آل عمران:173",
    translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs",
  },
  {
    title: "منع الظلم المتبادل",
    situation: "نزاع بين شخصين على دين أو مبلغ.",
    situationEn: "A dispute between two people over a debt or amount.",
    targetExpression: "لا تَظلِمون ولا تُظلَمون",
    surahAyah: "البقرة:279",
    translation: "You do no wrong, nor are you wronged",
  },
  {
    title: "التعاون في الخير",
    situation: "طلاب يريدون تنظيم فعالية تطوعية.",
    situationEn: "Students want to organize a volunteer activity.",
    targetExpression: "وتعاونوا على البر والتقوى",
    surahAyah: "المائدة:2",
    translation: "And cooperate in righteousness and piety",
  },
  {
    title: "حسن الكلام مع الناس",
    situation: "أحدهم يتكلم بحدة مع الآخرين.",
    situationEn: "Someone speaks harshly with others.",
    targetExpression: "وقولوا للناس حسنًا",
    surahAyah: "البقرة:83",
    translation: "And speak to people good [words]",
  },
  {
    title: "الكلام المنضبط",
    situation: "شخص يكثر الكلام الجارح على وسائل التواصل.",
    situationEn: "Someone frequently posts hurtful words on social media.",
    targetExpression: "وقولوا قولاً سديدًا",
    surahAyah: "الأحزاب:70",
    translation: "And speak words of appropriate justice",
  },
  {
    title: "الإنفاق على قدر القدرة",
    situation: "صديق يشعر بالذنب لأنه لا يستطيع التصدق بمبالغ كبيرة.",
    situationEn: "A friend feels guilty because he cannot give large amounts in charity.",
    targetExpression: "لينفق ذو سعة من سعته",
    surahAyah: "الطلاق:7",
    translation: "Let a man of wealth spend from his wealth",
  },
  {
    title: "منع السخرية",
    situation: "مجموعة تسخر من زميل أقل منهم ماديًا أو علميًا.",
    situationEn: "A group mocks a colleague who is less wealthy or knowledgeable.",
    targetExpression: "لا يسخر قوم من قوم",
    surahAyah: "الحجرات:11",
    translation: "Let not a people ridicule [another] people",
  },
  {
    title: "سوء الظن",
    situation: "شخص يسيء الظن بكل من حوله.",
    situationEn: "Someone thinks badly of everyone around him.",
    targetExpression: "إن بعض الظن إثم",
    surahAyah: "الحجرات:12",
    translation: "Indeed, some assumption is sin",
  },
  {
    title: "التوازن بين الدين والدنيا",
    situation: "أحدهم يقول: إما الدين أو الدنيا، لا يجتمعان.",
    situationEn: "Someone says: Either religion or worldly life, they cannot coexist.",
    targetExpression: "ولا تنس نصيبك من الدنيا",
    surahAyah: "القصص:77",
    translation: "But do not forget your share of the world",
  },
  {
    title: "عدم بخس حقوق الناس",
    situation: "بائع يحاول الغش في الميزان.",
    situationEn: "A seller tries to cheat with the scale.",
    targetExpression: "ولا تبخسوا الناس أشياءهم",
    surahAyah: "الأعراف:85",
    translation: "And do not deprive people of their due",
  },
  {
    title: "العدل في الحكم بين الناس",
    situation: "طلاب يكلفون زميلًا بالتحكيم في مشكلة.",
    situationEn: "Students assign a colleague to arbitrate a problem.",
    targetExpression: "وإذا حكمتم بين الناس أن تحكموا بالعدل",
    surahAyah: "النساء:58",
    translation: "And when you judge between people to judge with justice",
  },
  {
    title: "محبة المتقين",
    situation: "تحدث عن صفات من يحبهم الله.",
    situationEn: "Discuss the qualities of those whom Allah loves.",
    targetExpression: "إن الله يحب المتقين",
    surahAyah: "التوبة:4",
    translation: "Indeed, Allah loves the righteous",
  },
  {
    title: "محبة المحسنين",
    situation: "تشجيع متطوعين على إتقان عملهم.",
    situationEn: "Encouraging volunteers to perfect their work.",
    targetExpression: "إن الله يحب المحسنين",
    surahAyah: "البقرة:195",
    translation: "Indeed, Allah loves the doers of good",
  },
  {
    title: "ذم الكبر والاختيال",
    situation: "شخص يتفاخر على الآخرين بماله.",
    situationEn: "Someone brags to others about his wealth.",
    targetExpression: "إن الله لا يحب كل مختال فخور",
    surahAyah: "لقمان:18",
    translation: "Indeed, Allah does not like everyone self-deluded and boastful",
  },
  {
    title: "خفض الصوت",
    situation: "طالب يرفع صوته في البيت أو الفصل.",
    situationEn: "A student raises his voice at home or in class.",
    targetExpression: "واغضض من صوتك",
    surahAyah: "لقمان:19",
    translation: "And lower your voice",
  },
  {
    title: "المشي بتواضع",
    situation: "شخص يمشي في السوق بتكبر وتعال.",
    situationEn: "Someone walks in the market with arrogance and pride.",
    targetExpression: "ولا تمش في الأرض مرحًا",
    surahAyah: "الإسراء:37",
    translation: "And do not walk upon the earth exultantly",
  },
  {
    title: "الوفاء بالعقود",
    situation: "شخص يريد أن يتنصل من عقد مكتوب بحجة أن الظروف تغيرت.",
    situationEn: "Someone wants to renege on a written contract claiming circumstances changed.",
    targetExpression: "يا أيها الذين آمنوا أوفوا بالعقود",
    surahAyah: "المائدة:1",
    translation: "O you who have believed, fulfill [all] contracts",
  },
  {
    title: "صحبة الصادقين",
    situation: "طالب يبحث عن أصدقاء صالحين.",
    situationEn: "A student is looking for righteous friends.",
    targetExpression: "يا أيها الذين آمنوا اتقوا الله وكونوا مع الصادقين",
    surahAyah: "التوبة:119",
    translation: "O you who have believed, fear Allah and be with those who are true",
  },
  {
    title: "اجتناب الظن",
    situation: "حوار عن مشاكل الشائعات في المجتمع.",
    situationEn: "A discussion about the problems of rumors in society.",
    targetExpression: "يا أيها الذين آمنوا اجتنبوا كثيرًا من الظن",
    surahAyah: "الحجرات:12",
    translation: "O you who have believed, avoid much [negative] assumption",
  },
  {
    title: "الفرح المشروع",
    situation: "فريق أنهى مشروعًا نافعًا للمجتمع.",
    situationEn: "A team completed a beneficial project for the community.",
    targetExpression: "فبذلك فليفرحوا",
    surahAyah: "يونس:58",
    translation: "In that let them rejoice",
  },
  {
    title: "الاستعانة بالصبر والصلاة",
    situation: "شخص يمر بأزمة عائلية شديدة.",
    situationEn: "Someone is going through a severe family crisis.",
    targetExpression: "واستعينوا بالصبر والصلاة",
    surahAyah: "البقرة:45",
    translation: "And seek help through patience and prayer",
  },
  {
    title: "أثر الصلاة",
    situation: "شاب يقول: لا أرى أثر الصلاة في حياتي.",
    situationEn: "A young man says: I don't see the effect of prayer in my life.",
    targetExpression: "إن الصلاة تنهى عن الفحشاء والمنكر",
    surahAyah: "العنكبوت:45",
    translation: "Indeed, prayer prohibits immorality and wrongdoing",
  },
  {
    title: "التنوع والتعارف",
    situation: "نقاش عن اختلاف الشعوب والبلدان.",
    situationEn: "A discussion about the diversity of peoples and countries.",
    targetExpression: "وجعلناكم شعوبًا وقبائل لتعارفوا",
    surahAyah: "الحجرات:13",
    translation: "And made you peoples and tribes that you may know one another",
  },
  {
    title: "الشورى في القرار",
    situation: "مجموعة طلاب تريد اتخاذ قرار مهم.",
    situationEn: "A group of students wants to make an important decision.",
    targetExpression: "وأمرهم شورى بينهم",
    surahAyah: "الشورى:38",
    translation: "And whose affair is [determined by] consultation among themselves",
  },
  {
    title: "الحذر من خطوات الشيطان",
    situation: "شاب على وشك الدخول في عادة سيئة بحجة المرة الأولى فقط.",
    situationEn: "A young man is about to start a bad habit claiming it's just the first time.",
    targetExpression: "لا تتبعوا خطوات الشيطان",
    surahAyah: "البقرة:168",
    translation: "And do not follow the footsteps of Satan",
  },
  {
    title: "الرضا بالقضاء",
    situation: "شخص أصابه مرض مفاجئ.",
    situationEn: "Someone was struck with a sudden illness.",
    targetExpression: "قل لن يصيبنا إلا ما كتب الله لنا",
    surahAyah: "التوبة:51",
    translation: "Say: Never will we be struck except by what Allah has decreed for us",
  },
  {
    title: "التغيير يبدأ من الداخل",
    situation: "نقاش عن نهضة المجتمعات.",
    situationEn: "A discussion about societal renaissance.",
    targetExpression: "إن الله لا يغير ما بقوم حتى يغيروا ما بأنفسهم",
    surahAyah: "الرعد:11",
    translation: "Indeed, Allah will not change the condition of a people until they change what is in themselves",
  },
  {
    title: "نية الإصلاح",
    situation: "شخص يدخل في وساطة بين طرفين متخاصمين.",
    situationEn: "Someone mediates between two conflicting parties.",
    targetExpression: "إن أريد إلا الإصلاح ما استطعت",
    surahAyah: "هود:88",
    translation: "I only intend reform as much as I am able",
  },
  {
    title: "مراقبة الله للعباد",
    situation: "موظف يظن أن لا أحد يراه وهو يغش.",
    situationEn: "An employee thinks no one sees him while he cheats.",
    targetExpression: "والله بصير بالعباد",
    surahAyah: "آل عمران:15",
    translation: "And Allah is Seeing of [His] servants",
  },
  {
    title: "قدرة الله المطلقة",
    situation: "شخص يقول: هذا مستحيل، لا يمكن أن يتغير شيء.",
    situationEn: "Someone says: This is impossible, nothing can change.",
    targetExpression: "والله على كل شيء قدير",
    surahAyah: "البقرة:20",
    translation: "And Allah is over all things competent",
  },
  {
    title: "المرجع الأخير لله",
    situation: "نقاش سياسي أو اقتصادي محتد.",
    situationEn: "A heated political or economic discussion.",
    targetExpression: "إليه يرجع الأمر كله",
    surahAyah: "هود:123",
    translation: "To Him [alone] is returned [all] matter",
  },
  {
    title: "الدعاء للأسرة",
    situation: "أب يتكلم عن همّه بأولاده وذرّيته.",
    situationEn: "A father talks about his concern for his children and offspring.",
    targetExpression: "ربنا هب لنا من أزواجنا وذرياتنا قرة أعين",
    surahAyah: "الفرقان:74",
    translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes",
  },
  {
    title: "الدعاء بعد مصيبة",
    situation: "مجموعة أصابتها خسارة أو مصيبة.",
    situationEn: "A group suffered a loss or calamity.",
    targetExpression: "ربنا اغفر لنا ذنوبنا وإسرافنا في أمرنا",
    surahAyah: "آل عمران:147",
    translation: "Our Lord, forgive us our sins and the excess [committed] in our affairs",
  },
  {
    title: "الدعاء عند الشعور بالضعف",
    situation: "شخص يشعر بضعف شديد أمام مشكلات الحياة.",
    situationEn: "Someone feels very weak facing life's problems.",
    targetExpression: "وثبت أقدامنا وانصرنا على القوم الكافرين",
    surahAyah: "آل عمران:147",
    translation: "And plant firmly our feet and give us victory over the disbelieving people",
  },
];

async function addNewConversationExercises() {
  console.log("🔄 Starting to add new conversation exercises...\n");

  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const exercise of NEW_EXERCISES) {
    try {
      console.log(`\n📝 Processing: ${exercise.title}`);

      // Check if this expression already exists
      const existingExpression = await db
        .select()
        .from(quranicExpressions)
        .where(eq(quranicExpressions.arabicText, exercise.targetExpression))
        .limit(1);

      let expressionId: string;

      if (existingExpression.length > 0) {
        expressionId = existingExpression[0].id;
        console.log(`   ✓ Using existing expression: ${exercise.targetExpression}`);
      } else {
        // Add new Quranic expression
        // Count words in Arabic text
        const wordCount = exercise.targetExpression.trim().split(/\s+/).length;
        
        const [newExpression] = await db
          .insert(quranicExpressions)
          .values({
            id: sql`gen_random_uuid()`,
            arabicText: exercise.targetExpression,
            surahAyah: exercise.surahAyah,
            theme: "daily_conversation",
            meaning: exercise.translation,
            usageContext: exercise.situationEn,
            wordCount: wordCount,
          })
          .returning();

        expressionId = newExpression.id;
        console.log(`   ✅ Added new expression: ${exercise.targetExpression}`);
      }

      // Check if this conversation prompt already exists
      const existingPrompt = await db
        .select()
        .from(conversationPrompts)
        .where(eq(conversationPrompts.question, exercise.situation))
        .limit(1);

      if (existingPrompt.length > 0) {
        console.log(`   ⚠️  Skipped (already exists): ${exercise.title}`);
        skippedCount++;
        continue;
      }

      // Add conversation prompt
      await db.insert(conversationPrompts).values({
        id: sql`gen_random_uuid()`,
        question: exercise.situation,
        questionEn: exercise.situationEn,
        suggestedVerse: exercise.targetExpression,
        category: "daily_practice",
        isPracticalDailyUse: 1,
        usageDomain: "general",
      });

      console.log(`   ✅ Added conversation prompt: ${exercise.title}`);
      addedCount++;

    } catch (error) {
      console.error(`   ❌ Error processing ${exercise.title}:`, error);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total exercises: ${NEW_EXERCISES.length}`);
  console.log(`✅ Added: ${addedCount}`);
  console.log(`⚠️  Skipped (duplicates): ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log("=".repeat(60));

  if (errorCount > 0) {
    console.log("\n⚠️  Some exercises failed to add. Check the errors above.");
    process.exit(1);
  } else {
    console.log("\n✅ All exercises processed successfully!");
    process.exit(0);
  }
}

addNewConversationExercises().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
