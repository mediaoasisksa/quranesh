import { db } from "./db";
import { conversationPrompts, quranicExpressions } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

const NEW_PHONETIC_EXERCISES = [
  {
    situation: "قبل تقديم عرض عمل مهم امام لجنة.",
    instruction: "اطلب من زميلك ان يدعو لك بهذه الجملة قبل الدخول.",
    verse: "رب اشرح لي صدري",
    phoneticNote: "جملة من اربع كلمات قصيرة، فيها تكرار صوت الراء والصاد، مناسبة للتدريب على وضوح الراء.",
  },
  {
    situation: "بعد انتهاء مشروع كبير شعرت فيه بنعمة التوفيق.",
    instruction: "تشارك فريقك بدعاء جماعي.",
    verse: "ربنا تقبل منا",
    phoneticNote: "نهايتها على مقطع مفتوح \"منا\" تعطي نبرة هابطة لطيفة في اخر الجملة.",
  },
  {
    situation: "صديق يعترف انه اخطأ في حق نفسه واسرته.",
    instruction: "ذكّره بدعاء ابينا آدم.",
    verse: "ربنا ظلمنا انفسنا",
    phoneticNote: "توالي المقاطع القصيرة \"ربنا ظلمنا\" يسهل الترديد الجماعي بصوت واحد.",
  },
  {
    situation: "طالب يخاف ان يتغير قلبه بعد التزامه بالطاعة.",
    instruction: "علمه هذا الدعاء ليكرره في سجوده.",
    verse: "ربنا لا تزغ قلوبنا بعد اذ هديتنا",
    phoneticNote: "جملة طويلة نسبيا، تصلح لتدريب المتعلم على النفس الطويل والوقفة الصوتية بعد \"قلوبنا\".",
  },
  {
    situation: "فريق يتهيأ لقرار مصيري في مشروع.",
    instruction: "اجعل ختام النقاش بهذه الجملة.",
    verse: "ربنا عليك توكلنا",
    phoneticNote: "حركة النبر على \"عليك\" ثم هدوء في \"توكلنا\" يعطي احساسا بالاستسلام الهادئ.",
  },
  {
    situation: "خلاف بين مجموعتين في العمل وتريد تحكيم جهة عادلة.",
    instruction: "استخدم هذه الجملة عند طلب التحكيم.",
    verse: "ربنا افتح بيننا وبين قومنا بالحق",
    phoneticNote: "التتابع \"بيننا وبين قومنا\" فيه تكرار نون وميم، مفيد لتدريب مخارج الانف.",
  },
  {
    situation: "شخص يبحث عن عمل ويشعر بضيق الموارد.",
    instruction: "ساعده على حفظ هذا الدعاء واستعماله.",
    verse: "رب اني لما انزلت الي من خير فقير",
    phoneticNote: "الميل النبري على \"خير\" يجعل الكلمة محور المعنى والصوت معا.",
  },
  {
    situation: "مريض يخبرك ان علاجه تأخر وانه تعب.",
    instruction: "لقنه هذا الدعاء القصير.",
    verse: "رب اني مسني الضر وانت ارحم الراحمين",
    phoneticNote: "تكرار الراء في \"الضر\" و\"الراحمين\" يدرّب على الراء المرققة غير المتفخمة.",
  },
  {
    situation: "مجموعة تشعر بالضعف امام خصم قوي.",
    instruction: "اجعل قائدهم يردد هذه الجملة.",
    verse: "رب اني مغلوب فانتصر",
    phoneticNote: "الجملة موجزة قوية الايقاع، مقطعان طويلان متقابلان \"مغلوب\" / \"فانتصر\".",
  },
  {
    situation: "حوار عن بر الوالدين، واب يريد ان يدعو لوالديه.",
    instruction: "مرنه على هذا الدعاء.",
    verse: "رب ارحمهما كما ربياني صغيرا",
    phoneticNote: "تكرار \"رب\" و\"ربياني\" يعطي انسجاما سمعيا يسهل حفظ الجملة.",
  },
  {
    situation: "شخص يرى نعما كثيرة ولا يحسن شكرها.",
    instruction: "علّمه هذا الدعاء في جلسة حمد وشكر.",
    verse: "رب اوزعني ان اشكر نعمتك",
    phoneticNote: "الفعل \"اوزعني\" نادر في الاستعمال، جيد لتوسيع الذخيرة السمعية عند المتعلم.",
  },
  {
    situation: "ختام مجلس فيه اخطاء وهفوات في الكلام.",
    instruction: "استخدم هذه الجملة ختاما.",
    verse: "ربنا لا تؤاخذنا ان نسينا او اخطأنا",
    phoneticNote: "السلسلة \"نسينا او اخطأنا\" تدرّب على الانتقال بين السين والخاء بسلاسة.",
  },
  {
    situation: "شخص يشعر بثقل المسؤوليات.",
    instruction: "يردد هذه الجملة عند الشكوى.",
    verse: "ربنا ولا تحملنا ما لا طاقة لنا به",
    phoneticNote: "التكرار في \"لا طاقة لنا\" يعطي موسيقى داخلية واضحة.",
  },
  {
    situation: "مجموعة بين قوم ظالمين في بلد ما.",
    instruction: "عبّروا عن طلبهم بهذه الجملة.",
    verse: "ربنا لا تجعلنا مع القوم الظالمين",
    phoneticNote: "اجتماع الجيم والعين واللام في \"لا تجعلنا\" يثري تدريب المتعلم على وسط اللسان.",
  },
  {
    situation: "شاب سمع محاضرة ايمانية وأثرته.",
    instruction: "يقص على زميله ما سمعه باستخدام هذه الجملة.",
    verse: "ربنا اننا سمعنا مناديا ينادي للايمان",
    phoneticNote: "تكرار \"ن\" في \"اننا سمعنا مناديا ينادي\" يعطي جرسا جماعيا لطيفا.",
  },
  {
    situation: "مجموعة تعلن ايمانها بعد تفكير وبحث.",
    instruction: "صغ اعلانهم بهذه الجملة.",
    verse: "ربنا امنا فاغفر لنا ذنوبنا",
    phoneticNote: "الانتقال من الميم في \"امنا\" الى الفاء في \"فاغفر\" يقوي حركة الشفتين.",
  },
  {
    situation: "مسلمين في بيئة معادية يطلبون السلامة من الفتن.",
    instruction: "يرددون هذه الجملة في دعائهم.",
    verse: "ربنا لا تجعلنا فتنة للذين كفروا",
    phoneticNote: "كلمة \"فتنة\" ذات وزن قصير واضح، نافعة للتدريب على النون الساكنة.",
  },
  {
    situation: "حوار عن الامن في الاوطان.",
    instruction: "استخدم هذه الجملة عند الحديث عن بلدك او اي بلد.",
    verse: "رب اجعل هذا البلد امنا",
    phoneticNote: "مجيء الالف الممدودة في \"امنا\" في نهاية الجملة يعطي اشباعا صوتيا هادئا.",
  },
  {
    situation: "نقاش عن سعة مغفرة الله بعد التوبة.",
    instruction: "تلخّص المعنى بهذه الجملة.",
    verse: "ان الله غفور رحيم",
    phoneticNote: "توازي كلمتي \"غفور رحيم\" في الوزن والقافية يجعلها مثالية للتكرار الصوتي.",
  },
  {
    situation: "حديث عن العفو عن الاساءة.",
    instruction: "استخدم هذه الجملة في تشجيع شخص على العفو.",
    verse: "ان الله عفو غفور",
    phoneticNote: "توالي العين ثم الغين يعطي تمرينا دقيقا لمخارج الحلق.",
  },
  {
    situation: "شخص يظن ان رحمة الله محدودة بقوم دون قوم.",
    instruction: "صحح فهمه بهذه الجملة.",
    verse: "ان رحمة ربي واسعة",
    phoneticNote: "كلمة \"واسعة\" في اخر الجملة تفتح الفم وتبسط النفس، مناسبة لختام مطمئن.",
  },
  {
    situation: "احدهم يقول: ادعو لكن لا اشعر بالاجابة.",
    instruction: "ذكّره بقرب الله من الداعي.",
    verse: "ان ربي قريب مجيب",
    phoneticNote: "القافية بين \"قريب\" و\"مجيب\" تعطي سلاسة غنائية يسهل حفظها.",
  },
  {
    situation: "حوار عن لطف الله في ترتيب الاحداث.",
    instruction: "لخّص المعنى بهذه الجملة.",
    verse: "ان ربي لطيف لما يشاء",
    phoneticNote: "التقاء الفاء في \"لطيف\" مع اللام في \"لما\" يصنع وصلا صوتيا ناعما.",
  },
  {
    situation: "حديث عن استقامة طريق الله.",
    instruction: "استخدم هذه الجملة لتصوير وضوح الطريق.",
    verse: "ان ربي على صراط مستقيم",
    phoneticNote: "تركيب \"صراط مستقيم\" من اشهر التراكيب، ممتاز لتثبيت نطق الصاد والطاء.",
  },
  {
    situation: "شخص اخطأ في حقك وتاب، وتريد طمأنته.",
    instruction: "تخاطبه بهذه الجملة.",
    verse: "لا تثريب عليكم اليوم",
    phoneticNote: "بداية الجملة بلا الناهية يعقبها ثاء مهموسة، مفيدة للتدريب على الثاء.",
  },
  {
    situation: "زيارة لمريض تحسنت حالته بعد صبر.",
    instruction: "تهنئه بهذه الجملة.",
    verse: "سلام عليكم بما صبرتم",
    phoneticNote: "التكرار في \"سلام\" و\"صبرتم\" على حرف الميم يعطي قفلة صوتية رخية.",
  },
  {
    situation: "ختام مجلس ذكر او عبادة في جو روحاني.",
    instruction: "اجعل هذه الجملة ختاما للمجلس.",
    verse: "سلام هي حتى مطلع الفجر",
    phoneticNote: "امتداد الالف في \"سلام\" و\"مطلع\" يعطي جوا ليليا هادئا عند النطق.",
  },
  {
    situation: "تريد تشجيع مجموعة على تثبيت الحق والصبر.",
    instruction: "استخدم هذه الجملة شعارا لدورتكم.",
    verse: "وتواصوا بالحق",
    phoneticNote: "حرف الصاد المشدد في \"تواصوا\" و\"الحق\" يعزز قوة النطق.",
  },
  {
    situation: "تكملة المعنى السابق في تدريب اخر.",
    instruction: "اجعلها شعارا ثانيا في سلسلة تربوية.",
    verse: "وتواصوا بالصبر",
    phoneticNote: "التشابه بين \"بالحق\" و\"بالصبر\" يسمح بالتمرين على التبديل بين حاء وصاد.",
  },
  {
    situation: "الحديث عن الخيرية الحقيقية في العطاء.",
    instruction: "تلخص موقفك بهذه الجملة.",
    verse: "لن تنالوا البر حتى تنفقوا مما تحبون",
    phoneticNote: "التوازن بين \"تنالوا\" و\"تنفقوا\" يخلق ايقاعا متكررا جميلا.",
  },
  {
    situation: "تشجيع متطوعين على تقديم الخير لانفسهم اولا.",
    instruction: "استخدم هذه الجملة في خطاب تحفيزي.",
    verse: "وما تقدموا لانفسكم من خير تجدوه عند الله",
    phoneticNote: "دخول الميم والنون في \"من خير\" يهيئ لوقف قصير جميل قبل \"تجدوه\".",
  },
  {
    situation: "درس عن عدل الله وجزاء الاعمال الصغيرة.",
    instruction: "استعمل هذه الجملة في ختام الدرس.",
    verse: "فمن يعمل مثقال ذرة خيرا يره",
    phoneticNote: "كلمة \"مثقال\" ذات بنية صوتية واضحة مفيدة لشرح الوزن الصرفي.",
  },
  {
    situation: "تكملة المعنى السابق عن الجزاء على الشر.",
    instruction: "تضيف هذه الجملة في حوار توعوي.",
    verse: "ومن يعمل مثقال ذرة شرا يره",
    phoneticNote: "التعاقب بين \"خيرا\" و\"شرا\" يبين اثر تبدل حرف واحد على المعنى.",
  },
  {
    situation: "نقاش عن الرد على الاساءة بالاحسان.",
    instruction: "تلخص القاعدة بهذه الجملة.",
    verse: "ولا تستوي الحسنة ولا السيئة",
    phoneticNote: "التوازي بين \"الحسنة\" و\"السيئة\" يثري حس المقابلة الصوتية والمعنوية.",
  },
  {
    situation: "نصيحة عملية لكيفية التعامل مع من يسيء اليك.",
    instruction: "تختم النصيحة بهذه الجملة.",
    verse: "ادفع بالتي هي احسن",
    phoneticNote: "اجتماع الدال والفاء في \"ادفع\" يدرّب على الانتقال بين موضعي اللسان والشفة.",
  },
  {
    situation: "حوار عن العفو والاصلاح في النزاعات الاسرية.",
    instruction: "استخدم هذه الجملة قاعدة ذهبية.",
    verse: "فمن عفا واصلح فاجره على الله",
    phoneticNote: "الجملة متدرجة الصوت من الشدة في \"عفا\" الى السكون النسبي في \"على الله\".",
  },
  {
    situation: "تشجيع الطلاب على السبق في الخير والعلم.",
    instruction: "اجعل هذه الجملة شعارا على لوحة الفصل.",
    verse: "والسابقون السابقون",
    phoneticNote: "تكرار الكلمة نفسها يخلق جرسا انشاديا يسهل التلقين الجماعي.",
  },
  {
    situation: "درس عن التنافس الايجابي في الاعمال الصالحة.",
    instruction: "تختم الدرس بهذه الجملة.",
    verse: "وفي ذلك فليتنافس المتنافسون",
    phoneticNote: "تركيب \"فليتنافس المتنافسون\" ثري بالاصوات المتماثلة، رائع للتمرين الانشادي.",
  },
  {
    situation: "نقاش صلح بين عائلتين متخاصمتين.",
    instruction: "تلخص موقفك من الصلح.",
    verse: "والصلح خير",
    phoneticNote: "جملة قصيرة جدا، كلمتان فقط، قوية التأكيد وسهلة الحفظ للاطفال.",
  },
  {
    situation: "توجيه للمؤمنين بالثبات والتقوى الحقيقية.",
    instruction: "تقرأ هذه الجملة في افتتاحية محاضرة ايمانية.",
    verse: "يا ايها الذين امنوا اتقوا الله حق تقاته",
    phoneticNote: "التكرار في \"اتقوا\" و\"تقاته\" يوضح علاقة الجذر الواحد بصيغه المختلفة.",
  },
  {
    situation: "حث على الصبر الجماعي في مشروع طويل.",
    instruction: "اجعلها شعار فريق عمل.",
    verse: "يا ايها الذين امنوا اصبروا وصابروا",
    phoneticNote: "تقارب \"اصبروا\" و\"صابروا\" يدرّب الاذن على التفريق بين الصيغتين مع تشابه النطق.",
  },
  {
    situation: "تشجيع على احسان العمل ومراقبة الله.",
    instruction: "تختم درس الاتقان بهذه الجملة.",
    verse: "ان الله لا يضيع اجر المحسنين",
    phoneticNote: "تناغم \"يضيع\" و\"اجر\" و\"المحسنين\" يربط بين الفعل ونتيجته في الاذن.",
  },
  {
    situation: "نقاش عن التفاضل بين الناس ومعيار الكرامة.",
    instruction: "ترد على من يفتخر بالنسب او اللون.",
    verse: "ان اكرمكم عند الله اتقاكم",
    phoneticNote: "توزيع النبر على \"اكرمكم\" و\"اتقاكم\" يبرز المقابلة بين الكلمتين.",
  },
  {
    situation: "تهدئة شخص يرى ان جهده يضيع سدى.",
    instruction: "تطمئنه بهذه الجملة.",
    verse: "انا لا نضيع اجر من احسن عملا",
    phoneticNote: "وجود \"نضيع\" و\"احسن\" في جملة واحدة يقوي الارتباط السمعي بين الاتقان والحفظ.",
  },
  {
    situation: "نصيحة لمن يفرط في السرعة والغضب في قراراته.",
    instruction: "توجهه بهذه الوصية القرآنية.",
    verse: "ولا تعجل بالقران من قبل ان يقضى اليك وحيه",
    phoneticNote: "الجملة طويلة قليلا، تدرّب على ضبط السرعة في النطق وعدم الاستعجال فعلا.",
  },
  {
    situation: "دعوة لشاب ان يفتح على نفسه باب العلم والعمل الصالح.",
    instruction: "استخدم هذه الجملة تشجيعا.",
    verse: "وقل رب ادخلني مدخل صدق",
    phoneticNote: "مقابلة \"ادخلني\" و\"مدخل\" فيها تكرار خفي للجذر، لطيف اذنيا.",
  },
  {
    situation: "شعور بوساوس وافكار سلبية متكررة.",
    instruction: "تعلم هذا التعوذ ليستخدمه في المحادثة مع نفسه.",
    verse: "وقل رب اعوذ بك من همزات الشياطين",
    phoneticNote: "تكرار الزاي في \"اعوذ\" و\"همزات\" يلفت انتباه المتعلم لمخرج هذا الحرف.",
  },
  {
    situation: "في وسط مشروع صعب يحتاج الى صبر طويل.",
    instruction: "يذكّر القائد فريقه بهذه الجملة.",
    verse: "واصبر وما صبرك الا بالله",
    phoneticNote: "الجملة تقرن اللفظ بالمعنى؛ تكرار الصاد والباء يعزز شعور الثبات في السمع.",
  },
  {
    situation: "في شرح ان ثواب الله لا يضيع مجهود احد.",
    instruction: "تلخص الفكرة بهذه الجملة.",
    verse: "انا لا نضيع اجر المصلحين",
    phoneticNote: "المقابلة بين \"نضيع\" و\"المصلحين\" تعطي وقعا صوتيا يحمل معنى الحفاظ والرعاية.",
  },
];

async function addPhoneticConversationExercises() {
  console.log("🔄 Starting to add phonetic conversation exercises...\n");

  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < NEW_PHONETIC_EXERCISES.length; i++) {
    const exercise = NEW_PHONETIC_EXERCISES[i];
    try {
      console.log(`\n📝 Processing [${i + 1}/${NEW_PHONETIC_EXERCISES.length}]: ${exercise.verse.substring(0, 30)}...`);

      // Check if this verse already exists
      const existingExpression = await db
        .select()
        .from(quranicExpressions)
        .where(eq(quranicExpressions.arabicText, exercise.verse))
        .limit(1);

      let expressionId: string;

      if (existingExpression.length > 0) {
        expressionId = existingExpression[0].id;
        console.log(`   ✓ Using existing expression: ${exercise.verse}`);
      } else {
        // Count words in Arabic text
        const wordCount = exercise.verse.trim().split(/\s+/).length;

        // Add new Quranic expression
        const [newExpression] = await db
          .insert(quranicExpressions)
          .values({
            id: sql`gen_random_uuid()`,
            arabicText: exercise.verse,
            surahAyah: "متنوعة", // Various sources
            theme: "phonetic_practice",
            meaning: `${exercise.instruction} - ${exercise.phoneticNote}`,
            usageContext: exercise.situation,
            wordCount: wordCount,
          })
          .returning();

        expressionId = newExpression.id;
        console.log(`   ✅ Added new expression: ${exercise.verse}`);
      }

      // Check if this conversation prompt already exists
      const existingPrompt = await db
        .select()
        .from(conversationPrompts)
        .where(eq(conversationPrompts.question, exercise.situation))
        .limit(1);

      if (existingPrompt.length > 0) {
        console.log(`   ⚠️  Skipped (already exists): ${exercise.situation.substring(0, 40)}...`);
        skippedCount++;
        continue;
      }

      // Add conversation prompt
      await db.insert(conversationPrompts).values({
        id: sql`gen_random_uuid()`,
        question: exercise.situation,
        questionEn: `Situation: ${exercise.instruction}`,
        suggestedVerse: exercise.verse,
        category: "phonetic_practice",
        symbolicMeaning: exercise.phoneticNote,
        isPracticalDailyUse: 1,
        usageDomain: "supplication",
      });

      console.log(`   ✅ Added conversation prompt`);
      addedCount++;

    } catch (error) {
      console.error(`   ❌ Error processing exercise ${i + 1}:`, error);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total exercises: ${NEW_PHONETIC_EXERCISES.length}`);
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

addPhoneticConversationExercises().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
