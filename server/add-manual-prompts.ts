import { db } from "./db";
import { conversationPrompts } from "@shared/schema";
import { sql } from "drizzle-orm";

// استخراج الأسئلة من الملفات المرفقة
const manualPrompts = [
  // الملف الأول
  { question: "صديقك مهموم من ضيق رزقه، كيف تواسيه؟", suggested_verse: "إِنَّ مَعَ الْعُسْرِ يُسْرًا" },
  { question: "تريد أن تُذكِّر زميلك أن النجاح من عند الله، ماذا تقول؟", suggested_verse: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ" },
  { question: "ابنك خائف من الامتحان، كيف تشجعه؟", suggested_verse: "لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ" },
  { question: "رأيت فقيرًا في الطريق وتريد أن تحثَّ صديقك على مساعدته.", suggested_verse: "وَيُطْعِمُونَ الطَّعَامَ عَلَىٰ حُبِّهِ" },
  { question: "تريد أن تذكّر شخصًا بأن الله يراه في عمله.", suggested_verse: "أَلَمْ يَعْلَمْ بِأَنَّ اللَّهَ يَرَى" },
  { question: "تشكر من ساعدك في مشكلة صعبة.", suggested_verse: "هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ" },
  { question: "تشعر بالتعب وتريد أن تذكر أن الراحة بيد الله.", suggested_verse: "وَهُوَ الَّذِي جَعَلَ لَكُمُ اللَّيْلَ لِبَاسًا" },
  { question: "تحب أن تدعو لصديقك بالهداية.", suggested_verse: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
  { question: "ترى شخصًا مغرورًا بماله، ماذا تذكّره؟", suggested_verse: "اللَّهُ يَرْزُقُ مَنْ يَشَاءُ" },
  { question: "تريد أن تواسي نفسك بعد فقد عزيز.", suggested_verse: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ" },
  { question: "تذكّر ابنك أن يشكر الله على النعم.", suggested_verse: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ" },
  { question: "يطلب منك صديق نصيحة قبل اتخاذ قرار مهم.", suggested_verse: "وَشَاوِرْهُمْ فِي الْأَمْرِ" },
  { question: "تريد أن تمنع صديقًا من الكذب في موقف ما.", suggested_verse: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ" },
  { question: "تخبر ولدك أن علمه من فضل الله.", suggested_verse: "وَقُلْ رَبِّ زِدْنِي عِلْمًا" },
  { question: "شخص يظن أن الله لن يغفر له، كيف تطمئنه؟", suggested_verse: "لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ" },
  { question: "تشعر بالخوف من المستقبل.", suggested_verse: "وَعَلَى اللَّهِ فَلْيَتَوَكَّلِ الْمُؤْمِنُونَ" },
  { question: "تريد أن تهدئ شخصًا غاضبًا.", suggested_verse: "وَالْكَاظِمِينَ الْغَيْظَ" },
  { question: "تذكّر نفسك أن لا تنشغل بالدنيا كثيرًا.", suggested_verse: "وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ" },
  { question: "ترى شخصًا يظلم عاملًا عنده.", suggested_verse: "إِنَّ اللَّهَ لَا يُحِبُّ الظَّالِمِينَ" },
  { question: "تريد أن تشجّع أخاك على الصبر في مرضه.", suggested_verse: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُمْ" },
  { question: "صديقك يطلب رزقًا، وتدعـو له.", suggested_verse: "رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ" },
  { question: "تشعر بالضياع وتريد أن تسأل الله طريق الحق.", suggested_verse: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا" },
  { question: "تحثّ أخاك على برّ والديه.", suggested_verse: "وَبِالْوَالِدَيْنِ إِحْسَانًا" },
  { question: "تريد أن تهنئ صديقًا بزواجه مع ذكر نعمة السكن.", suggested_verse: "لِتَسْكُنُوا إِلَيْهَا" },
  { question: "ابنك يسأل: لماذا نصلي؟", suggested_verse: "إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ" },
  { question: "تريد أن تذكّر صديقك أنّ الله قريب من دعائه.", suggested_verse: "إِنِّي قَرِيبٌ" },
  { question: "تشجع طالبًا على الجدّ في العلم.", suggested_verse: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ" },
  { question: "تريد أن تحذر صديقك من الغيبة.", suggested_verse: "وَلَا يَغْتَبْ بَعْضُكُمْ بَعْضًا" },
  { question: "تذكّر نفسك أن كل شيء مكتوب.", suggested_verse: "وَكَانَ أَمْرُ اللَّهِ قَدَرًا مَقْدُورًا" },
  { question: "تريد أن تهدئ طفلًا خائفًا من الظلام.", suggested_verse: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ" },
  { question: "شخص يسأل: لماذا نصبر على الأذى؟", suggested_verse: "وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ" },
  { question: "تريد أن تذكّر زميلك أن الله يسمع كلامه.", suggested_verse: "إِنَّ رَبِّي لَسَمِيعُ الدُّعَاءِ" },
  { question: "تواسي شخصًا خسر ماله.", suggested_verse: "وَعَسَىٰ أَنْ تَكْرَهُوا شَيْئًا" },
  { question: "تريد أن تشجّع نفسك على الاستقامة.", suggested_verse: "فَاسْتَقِمْ كَمَا أُمِرْتَ" },
  { question: "تحثّ أسرتك على التعاون في الخير.", suggested_verse: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى" },
  { question: "تريد أن تذكّر أخاك أن الراحة في ذكر الله.", suggested_verse: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ" },
  { question: "تنصح صديقًا أن لا يتكبر على الناس.", suggested_verse: "وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا" },
  { question: "تذكّر طالبًا أن الله لا يضيع تعبه.", suggested_verse: "إِنَّا لَا نُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا" },
  { question: "تريد أن تهدي صديقًا كلمة قبل النوم.", suggested_verse: "وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ" },
  { question: "ترى من يقطع رحمه، كيف تنصحه؟", suggested_verse: "وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ" },
  { question: "شخص يسأل: لماذا نتصدق سرًّا أحيانًا؟", suggested_verse: "إِنْ تُبْدُوا الصَّدَقَاتِ فَنِعِمَّا هِيَ" },
  { question: "تريد أن تذكّر نفسك أن الفضل من الله.", suggested_verse: "ذَٰلِكَ فَضْلُ اللَّهِ يُؤْتِيهِ مَنْ يَشَاءُ" },
  { question: "تحثّ صديقًا على الإحسان إلى الجار.", suggested_verse: "وَالْجَارِ ذِي الْقُرْبَى وَالْجَارِ الْجُنُبِ" },
  { question: "تشعر بالعجز أمام مشكلة كبيرة.", suggested_verse: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ" },
  { question: "تذكّر طالبًا أن الله يعلم جهده الخفيّ.", suggested_verse: "إِنَّ رَبَّكَ لَبِالْمِرْصَادِ" },
  { question: "تريد أن تهنئ صديقًا بنعمة الولَد.", suggested_verse: "يَهَبُ لِمَنْ يَشَاءُ إِنَاثًا" },
  { question: "تحثّ نفسك على الإخلاص في العمل.", suggested_verse: "وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ" },
  { question: "تريد أن تمنع صديقًا من اليأس بعد الفشل.", suggested_verse: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا" },
  { question: "تذكّر نفسك أن تراقب الله في السر.", suggested_verse: "يَعْلَمُ السِّرَّ وَأَخْفَى" },
  { question: "تريد أن تدعو لأمتك بالوحدة والهداية.", suggested_verse: "رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا" },
  
  // الملف الثاني (السلوكية)
  { question: "طالب يؤجل المذاكرة دائمًا حتى آخر لحظة، ويريد أن يغيّر عادة التسويف.", suggested_verse: "وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِنْ رَبِّكُمْ" },
  { question: "موظف يشعر أنه يعمل وحده وزملاؤه لا يتعاونون، فيبدأ بالتقاعس.", suggested_verse: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ" },
  { question: "شاب يتأثر بمواقع التواصل ويقارن نفسه بالآخرين فيحبط.", suggested_verse: "وَلَا تَمُدَّنَّ عَيْنَيْكَ إِلَىٰ مَا مَتَّعْنَا بِهِ أَزْوَاجًا" },
  { question: "شخص يغضب سريعًا في النقاشات العائلية ويريد ضبط انفعاله.", suggested_verse: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ" },
  { question: "موظف يتعرض لضغط كبير في العمل ويفكّر في الغش أو التحايل.", suggested_verse: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا" },
  { question: "أب يحاول تغيير سلوك أولاده بالحوار بدل الصراخ.", suggested_verse: "وَجَادِلْهُمْ بِالَّتِي هِيَ أَحْسَنُ" },
  { question: "شاب يريد بناء عادة رياضية للحفاظ على صحته لكن يكسل.", suggested_verse: "وَلَا تَقْتُلُوا أَنْفُسَكُمْ" },
  { question: "طالبة تكثر من استخدام الهاتف ليلًا وتنام متأخرة.", suggested_verse: "وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا" },
  { question: "شخص يستهلك المال في الكماليات ثم يشتكي من ضيق الحال.", suggested_verse: "وَلَا تُسْرِفُوا إِنَّهُ لَا يُحِبُّ الْمُسْرِفِينَ" },
  { question: "طالب يتأثر بسخرية أصحابه من التزامه الديني.", suggested_verse: "فَلَا تَخْشَوُا النَّاسَ وَاخْشَوْنِي" },
  { question: "موظف يتردد كثيرًا في اتخاذ القرارات ويخاف الخطأ.", suggested_verse: "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ" },
  { question: "مراهق يقضي معظم وقته في الألعاب الإلكترونية وينسى واجباته.", suggested_verse: "أَضَاعُوا الصَّلَاةَ وَاتَّبَعُوا الشَّهَوَاتِ" },
  { question: "شخص يحاول بناء عادة قراءة يومية للقرآن لكنه ينقطع بسرعة.", suggested_verse: "فَاقْرَءُوا مَا تَيَسَّرَ مِنَ الْقُرْآنِ" },
  { question: "مدير يريد نشر ثقافة العدالة في فريق العمل.", suggested_verse: "اعْدِلُوا هُوَ أَقْرَبُ لِلتَّقْوَى" },
  { question: "شاب يواجه ضغط الأصدقاء لتعاطي ما يضرّ صحته وعقله.", suggested_verse: "وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ" },
  { question: "شخص يريد إصلاح علاقته المتوترة مع أحد الأقارب.", suggested_verse: "وَالصُّلْحُ خَيْرٌ" },
  { question: "طالب يشعر أنه أقل من غيره في القدرات ويستسلم.", suggested_verse: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا" },
  { question: "موظف يلاحظ خطأ في العمل ويستطيع إصلاحه، لكنه يتردد خوفًا من اللوم.", suggested_verse: "كُنْتُمْ خَيْرَ أُمَّةٍ تَأْمُرُونَ بِالْمَعْرُوفِ" },
  { question: "شخص يحاول التحكم في استهلاكه للطعام حفاظًا على صحته وسلوكه.", suggested_verse: "كُلُوا وَاشْرَبُوا وَلَا تُسْرِفُوا" },
  { question: "شاب يريد أن يحوّل غضبه إلى عمل نافع بدلاً من الانتقام.", suggested_verse: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ" },
  
  // الملف الثالث (مبسط)
  { question: "انسان خائف من المستقبل والرزق ويريد ان يطمئن قلبه.", suggested_verse: "وعلى الله فليتوكل المؤمنون" },
  { question: "رجل ارتكب معاصي كثيرة ويظن ان الله لن يغفر له.", suggested_verse: "لا تقنطوا من رحمة الله" },
  { question: "طالبة تجتهد في دراستها وتريد ان تتذكر ان الله لا يضيع تعبها.", suggested_verse: "انا لا نضيع اجر من احسن عملا" },
  { question: "قريب يريد اصلاح العلاقة بعد خصام طويل بينه وبين اخيه.", suggested_verse: "والصلح خير" },
  { question: "شاب يضغط عليه اصدقاؤه ليفعل ما يغضب الله.", suggested_verse: "يا ايها الذين امنوا اتقوا الله وكونوا مع الصادقين" },
  { question: "شخص ينفق ماله بلا حساب ثم يشتكي من ضيق الحال.", suggested_verse: "وكلوا واشربوا ولا تسرفوا" },
  { question: "مجموعة تتكلم في عرض انسان غائب عن المجلس.", suggested_verse: "ولا يغتب بعضكم بعضا" },
  { question: "شخص يفكر ان يقطع رحمه بسبب خلاف مالي.", suggested_verse: "واتقوا الله الذي تساءلون به والارحام" },
  { question: "اسرة فقدت عزيزا وتبحث عن كلام تصبر به نفسها.", suggested_verse: "انا لله وانا اليه راجعون" },
  { question: "انسان يشعر بالقلق والاضطراب ويريد طمأنينة القلب.", suggested_verse: "الا بذكر الله تطمئن القلوب" },
  { question: "طالب خائف من نتيجة الامتحان ويريد ان يتذكر ان الامر كله لله.", suggested_verse: "قل لن يصيبنا الا ما كتب الله لنا" },
  { question: "معلم يشجع تلميذه على طلب العلم وعدم التوقف عن التعلم.", suggested_verse: "وقل رب زدني علما" },
  { question: "مدير يريد ان يلتزم بالعدل بين الموظفين في توزيع الفرص.", suggested_verse: "اعدلوا هو اقرب للتقوى" },
  { question: "شاب يتكاسل عن الصلاة مع انها اساس حياته الروحية.", suggested_verse: "واقيموا الصلاة" },
  { question: "انسان ينجز عملا ثم يضيع وقته بعده بلا هدف ويريد ان يستثمر وقته.", suggested_verse: "فاذا فرغت فانصب" },
  { question: "شخص ندم على ظلم وقع منه ويريد ان يبدأ صفحة توبة جديدة.", suggested_verse: "ان الله يحب التوابين" },
];

async function addManualPromptsToDatabase() {
  console.log("🔄 إضافة أسئلة المحادثة من الملفات المرفقة...\n");

  try {
    // جلب جميع الأسئلة الموجودة للتحقق من التكرار
    const existingPrompts = await db.select({
      question: conversationPrompts.question,
      suggestedVerse: conversationPrompts.suggestedVerse,
    }).from(conversationPrompts);

    console.log(`عدد الأسئلة الموجودة حالياً: ${existingPrompts.length}\n`);

    const existingQuestions = new Set(existingPrompts.map(p => 
      p.question?.trim().toLowerCase()
    ).filter(Boolean));

    const existingVerses = new Set(existingPrompts.map(p => 
      p.suggestedVerse?.trim()
    ).filter(Boolean));

    let addedCount = 0;
    let skippedCount = 0;

    for (const prompt of manualPrompts) {
      const questionNormalized = prompt.question.trim().toLowerCase();
      const verseNormalized = prompt.suggested_verse.trim();

      // تحقق من التكرار بناءً على السؤال أو الآية المقترحة
      const isDuplicateQuestion = existingQuestions.has(questionNormalized);
      const isDuplicateVerse = existingVerses.has(verseNormalized);

      if (isDuplicateQuestion || isDuplicateVerse) {
        skippedCount++;
        console.log(`⏭️  تم تخطي (مكرر): ${prompt.question.substring(0, 60)}...`);
        continue;
      }

      // إضافة السؤال الجديد
      try {
        await db.insert(conversationPrompts).values({
          question: prompt.question,
          suggestedVerse: prompt.suggested_verse,
          isPracticalDailyUse: 1,
        });

        existingQuestions.add(questionNormalized);
        existingVerses.add(verseNormalized);
        
        addedCount++;
        console.log(`✅ [${addedCount}] تم الإضافة: ${prompt.question.substring(0, 60)}...`);
      } catch (error: any) {
        console.error(`❌ خطأ في إضافة: ${prompt.question.substring(0, 40)}...`);
        console.error(`   السبب: ${error.message}`);
      }
    }

    console.log(`\n📊 الملخص:`);
    console.log(`   ✅ تم إضافة: ${addedCount} سؤال`);
    console.log(`   ⏭️  تم تخطي (مكرر): ${skippedCount} سؤال`);
    console.log(`   📝 إجمالي الأسئلة المقدمة: ${manualPrompts.length}`);

    // عرض العدد النهائي
    const finalCount = await db.select().from(conversationPrompts);
    console.log(`   💾 إجمالي الأسئلة في القاعدة الآن: ${finalCount.length}\n`);

  } catch (error) {
    console.error("❌ خطأ عام:", error);
    process.exit(1);
  }
}

addManualPromptsToDatabase()
  .then(() => {
    console.log("🎉 تمت العملية بنجاح!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ فشلت العملية:", error);
    process.exit(1);
  });
