import { db } from "./db";
import { philosophicalSentences } from "@shared/schema";

const wisdomData = [
  // أولاً: في الذات والوعي الداخلي (10 حكم)
  { arabicText: "قيمتك الحقيقية في جوهرك لا في مظهرك", symbolicMeaning: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ (الحجرات 13)", difficulty: 2, conceptTags: ["self_worth", "humility", "inner_value", "authenticity"] },
  { arabicText: "التغيير الخارجي يبدأ بإصلاح الداخل", symbolicMeaning: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ (الرعد 11)", difficulty: 2, conceptTags: ["self_improvement", "change", "accountability", "inner_work"] },
  { arabicText: "الهدوء النفسي هو أعلى درجات القوة", symbolicMeaning: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ (الرعد 28)", difficulty: 2, conceptTags: ["inner_peace", "tranquility", "emotional_control", "spiritual_strength"] },
  { arabicText: "النفس أمارة بالسوء إلا من هذبها الوعي", symbolicMeaning: "إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ (يوسف 53)", difficulty: 3, conceptTags: ["self_awareness", "self_discipline", "nafs", "moral_struggle"] },
  { arabicText: "الرضا هو المفتاح لفتح أبواب المزيد", symbolicMeaning: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ (إبراهيم 7)", difficulty: 2, conceptTags: ["gratitude", "contentment", "abundance", "thankfulness"] },
  { arabicText: "الوحدة مع الحق قوة، والكثرة مع الباطل وهم", symbolicMeaning: "كَم مِّن فِئَةٍ قَلِيلَةٍ غَلَبَتْ فِئَةً كَثِيرَةً بِإِذْنِ اللَّهِ (البقرة 249)", difficulty: 3, conceptTags: ["truth", "conviction", "perseverance", "minority_strength"] },
  { arabicText: "الصدق مع النفس هو أول طريق النجاة", symbolicMeaning: "بَلِ الْإِنسَانُ عَلَىٰ نَفْسِهِ بَصِيرَةٌ (القيامة 14)", difficulty: 2, conceptTags: ["honesty", "self_awareness", "introspection", "truth"] },
  { arabicText: "الكبر هو الحجاب الأكبر عن الحقيقة", symbolicMeaning: "سَأَصْرِفُ عَنْ آيَاتِيَ الَّذِينَ يَتَكَبَّرُونَ فِي الْأَرْضِ بِغَيْرِ الْحَقِّ (الأعراف 146)", difficulty: 3, conceptTags: ["humility", "arrogance", "truth", "self_deception"] },
  { arabicText: "لا تحمل هم الغد فلكل يوم رزقه", symbolicMeaning: "وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا (هود 6)", difficulty: 2, conceptTags: ["trust", "provision", "worry_free", "reliance_on_god"] },
  { arabicText: "الظن قد يكون أكبر عدو للحقيقة", symbolicMeaning: "إِنَّ بَعْضَ الظَّنِّ إِثْمٌ (الحجرات 12)", difficulty: 2, conceptTags: ["objectivity", "truth", "assumptions", "critical_thinking"] },

  // ثانياً: في القيادة والإدارة (10 حكم)
  { arabicText: "الشورى ليست ضعفاً بل هي اكتمال للرؤية", symbolicMeaning: "وَشَاوِرْهُمْ فِي الْأَمْرِ (آل عمران 159)", difficulty: 2 },
  { arabicText: "الأمانة هي معيار الكفاءة الأول", symbolicMeaning: "إِنَّ خَيْرَ مَنِ اسْتَأْجَرْتَ الْقَوِيُّ الْأَمِينُ (القصص 26)", difficulty: 2 },
  { arabicText: "العدل لا يتجزأ حتى مع الخصوم", symbolicMeaning: "وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا (المائدة 8)", difficulty: 3 },
  { arabicText: "الكلمة الطيبة هي المحرك الأقوى للفرق", symbolicMeaning: "أَلَمْ تَرَ كَيْفَ ضَرَبَ اللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ طَيِّبَةٍ (إبراهيم 24)", difficulty: 3 },
  { arabicText: "الرفق يفتح القلوب التي تغلقها الشدة", symbolicMeaning: "وَلَوْ كُنتَ فَظًّا غَلِيظَ الْقَلْبِ لَانفَضُّوا مِنْ حَوْلِكَ (آل عمران 159)", difficulty: 2 },
  { arabicText: "الوضوح والصدق في التواصل يمنع الفتن", symbolicMeaning: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا (الأحزاب 70)", difficulty: 2 },
  { arabicText: "العفو هو قمة القوة النفسية", symbolicMeaning: "وَأَن تَعْفُوا أَقْرَبُ لِلتَّقْوَىٰ (البقرة 237)", difficulty: 2 },
  { arabicText: "الرد الجميل يطفئ نار الحقد", symbolicMeaning: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ (فصلت 34)", difficulty: 2 },
  { arabicText: "التجاهل الذكي يحفظ كرامة الإنسان", symbolicMeaning: "وَإِذَا مَرُّوا بِاللَّغْوِ مَرُّوا كِرَامًا (الفرقان 72)", difficulty: 2 },
  { arabicText: "الرحمة هي الرابط الأقوى بين القلوب", symbolicMeaning: "وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً (الروم 21)", difficulty: 2 },

  // ثالثاً: في العلاقات الإنسانية (10 حكم)
  { arabicText: "لا تحكم على الآخرين بما يظهر منهم فقط", symbolicMeaning: "لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ عَسَىٰ أَن يَكُونُوا خَيْرًا مِّنْهُمْ (الحجرات 11)", difficulty: 2 },
  { arabicText: "النصيحة الصادقة تكون في السر لا العلن", symbolicMeaning: "ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ (النحل 125)", difficulty: 2 },
  { arabicText: "الوفاء بالوعود هو مقياس الرجولة", symbolicMeaning: "وَأَوْفُوا بِالْعَهْدِ ۖ إِنَّ الْعَهْدَ كَانَ مَسْئُولًا (الإسراء 34)", difficulty: 2 },
  { arabicText: "التواضع يرفع صاحبه في أعين الناس", symbolicMeaning: "وَاخْفِضْ جَنَاحَكَ لِلْمُؤْمِنِينَ (الحجر 88)", difficulty: 2 },
  { arabicText: "الكلام اللين يلين القلوب القاسية", symbolicMeaning: "فَقُولَا لَهُ قَوْلًا لَّيِّنًا (طه 44)", difficulty: 2 },
  { arabicText: "الباطل يزهق مهما طال أمد بقائه", symbolicMeaning: "جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ (الإسراء 81)", difficulty: 2 },
  { arabicText: "العلم بلا عمل هو حجة على صاحبه", symbolicMeaning: "كَبُرَ مَقْتًا عِندَ اللَّهِ أَن تَقُولُوا مَا لَا تَفْعَلُونَ (الصف 3)", difficulty: 3 },
  { arabicText: "التفكير العميق يؤدي للإيمان الراسخ", symbolicMeaning: "وَيَتَفَكَّرُونَ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ (آل عمران 191)", difficulty: 3 },
  { arabicText: "الإنصاف حتى مع النفس هو كمال العقل", symbolicMeaning: "كُونُوا قَوَّامِينَ بِالْقِسْطِ شُهَدَاءَ لِلَّهِ وَلَوْ عَلَىٰ أَنفُسِكُمْ (النساء 135)", difficulty: 3 },
  { arabicText: "بعد كل ضيق فرج لا محالة", symbolicMeaning: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا (الشرح 5)", difficulty: 1 },

  // رابعاً: في التحديات والصبر (10 حكم)
  { arabicText: "قد تكره شيئاً وهو بوابة لخير عظيم", symbolicMeaning: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ (البقرة 216)", difficulty: 2 },
  { arabicText: "الله لا يكلفك ما لا تطيق، فثق بقدرتك", symbolicMeaning: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا (البقرة 286)", difficulty: 1 },
  { arabicText: "النصر صبر ساعة", symbolicMeaning: "وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ (النحل 127)", difficulty: 2 },
  { arabicText: "البلاء كير ينقي الذهب من الشوائب", symbolicMeaning: "لِيَمِيزَ اللَّهُ الْخَبِيثَ مِنَ الطَّيِّبِ (الأنفال 37)", difficulty: 3 },
  { arabicText: "الثبات عند اللقاء هو شأن الأبطال", symbolicMeaning: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا لَقِيتُمْ فِئَةً فَاثْبُتُوا (الأنفال 45)", difficulty: 2 },
  { arabicText: "الأمل بالله لا ينقطع أبداً", symbolicMeaning: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ (الزمر 53)", difficulty: 1 },
  { arabicText: "كل مر سيمر، والبقاء للأصلح", symbolicMeaning: "فَأَمَّا الزَّبَدُ فَيَذْهَبُ جُفَاءً ۖ وَأَمَّا مَا يَنفَعُ النَّاسَ فَيَمْكُثُ فِي الْأَرْضِ (الرعد 17)", difficulty: 3 },
  { arabicText: "الاحسان للغير هو في الحقيقة نفع لنفسك قبلهم", symbolicMeaning: "إِنْ أَحْسَنْتُمْ أَحْسَنْتُمْ لِأَنْفُسِكُمْ (الإسراء 7)", difficulty: 2 },
  { arabicText: "السعي والجهد هو الميزان الوحيد لقيمة الانسان", symbolicMeaning: "وَأَنْ لَيْسَ لِلْإِنْسَانِ إِلَّا مَا سَعَى (النجم 39)", difficulty: 2 },
  { arabicText: "الجزاء يكون من جنس العمل", symbolicMeaning: "هَلْ جَزَاءُ الْإِحْسَانِ إِلَّا الْإِحْسَانُ (الرحمن 60)", difficulty: 2 },

  // خامساً: في المسؤولية والقيم (10 حكم)
  { arabicText: "لا احد يتحمل نتيجة اخطائك غيرك", symbolicMeaning: "وَلَا تَزِرُ وَازِرَةٌ وِزْرَ أُخْرَى (الأنعام 164)", difficulty: 2 },
  { arabicText: "التغيير يبدا من داخل النفس اولا", symbolicMeaning: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّى يُغَيِّرُوا مَا بِأَنْفُسِهِمْ (الرعد 11)", difficulty: 2 },
  { arabicText: "الوفاء بالعهد مسؤولية يسأل عنها الانسان", symbolicMeaning: "وَأَوْفُوا بِالْعَهْدِ إِنَّ الْعَهْدَ كَانَ مَسْئُولًا (الإسراء 34)", difficulty: 2 },
  { arabicText: "الله لا يكلف اي شخص فوق قدرته وطاقته", symbolicMeaning: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا (البقرة 286)", difficulty: 1 },
  { arabicText: "الكبر والغرور يمنع الانسان من رؤية الحقائق", symbolicMeaning: "سَأَصْرِفُ عَنْ آيَاتِيَ الَّذِينَ يَتَكَبَّرُونَ فِي الْأَرْضِ بِغَيْرِ الْحَقِّ (الأعراف 146)", difficulty: 3 },
  { arabicText: "الظن لا يغني عن الحق واليقين شيئا", symbolicMeaning: "إِنَّ الظَّنَّ لَا يُغْنِي مِنَ الْحَقِّ شَيْئًا (النجم 28)", difficulty: 2 },
  { arabicText: "القوة والامانة هما معيار الكفاءة في العمل", symbolicMeaning: "إِنَّ خَيْرَ مَنِ اسْتَأْجَرْتَ الْقَوِيُّ الْأَمِينُ (القصص 26)", difficulty: 2 },
  { arabicText: "العلم الذي يؤتيه الانسان قليل جدا بالنسبة للحقيقة الكلية", symbolicMeaning: "وَمَا أُوتِيتُمْ مِنَ الْعِلْمِ إِلَّا قَلِيلًا (الإسراء 85)", difficulty: 3 },
  { arabicText: "الحق دائما يغلب الباطل ويزيله", symbolicMeaning: "جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ (الإسراء 81)", difficulty: 2 },
  { arabicText: "الصلح دائما هو الخيار الافضل في النزاعات", symbolicMeaning: "وَالصُّلْحُ خَيْرٌ (النساء 128)", difficulty: 1 },

  // سادساً: في الحرية والإرادة (10 حكم)
  { arabicText: "لا ايمان ولا اقتناع حقيقي مع الاجبار", symbolicMeaning: "لَا إِكْرَاهَ فِي الدِّينِ (البقرة 256)", difficulty: 2 },
  { arabicText: "العاقبة والنتيجة النهائية تكون دائما للتقوى", symbolicMeaning: "وَالْعَاقِبَةُ لِلتَّقْوَى (طه 132)", difficulty: 2 },
  { arabicText: "المشاورة بين الناس هي اساس تدبير امورهم", symbolicMeaning: "وَأَمْرُهُمْ شُورَى بَيْنَهُمْ (الشورى 38)", difficulty: 2 },
  { arabicText: "الاحسان في العمل يضمن عدم ضياع الاجر", symbolicMeaning: "إِنَّا لَا نُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا (الكهف 30)", difficulty: 2 },
  { arabicText: "كل بداية لها نهاية معلومة ومستقرة", symbolicMeaning: "لِكُلِّ أَجَلٍ كِتَابٌ (الرعد 38)", difficulty: 2 },
  { arabicText: "الانسان على نفسه بصير ويعرف حقيقة فعله", symbolicMeaning: "بَلِ الْإِنْسَانُ عَلَى نَفْسِهِ بَصِيرَةٌ (القيامة 14)", difficulty: 2 },
  { arabicText: "الله يحب الذين يطهرون انفسهم وافعالهم", symbolicMeaning: "وَاللَّهُ يُحِبُّ الْمُطَّهِّرِينَ (التوبة 108)", difficulty: 2 },
  { arabicText: "الصبر هو الاستعانة الحقيقية في مواجهة الصعاب", symbolicMeaning: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ (البقرة 45)", difficulty: 2 },
  { arabicText: "القول اللين هو وسيلة التذكير الفعالة", symbolicMeaning: "فَقُولَا لَهُ قَوْلًا لَيِّنًا لَعَلَّهُ يَتَذَكَّرُ أَوْ يَخْشَى (طه 44)", difficulty: 2 },
  { arabicText: "الفضل دائما بيد الله يؤتيه من يشاء", symbolicMeaning: "قُلْ إِنَّ الْفَضْلَ بِيَدِ اللَّهِ يُؤْتِيهِ مَنْ يَشَاءُ (آل عمران 73)", difficulty: 2 },

  // سابعاً: في التعاون والمجتمع (10 حكم)
  { arabicText: "التعاون يجب ان يكون على الخير لا على الشر", symbolicMeaning: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ (المائدة 2)", difficulty: 2 },
  { arabicText: "ذكر الله هو الذي يحقق طمانينة القلب", symbolicMeaning: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ (الرعد 28)", difficulty: 1 },
  { arabicText: "ما ينفع الناس هو الذي يبقى راسخا في الارض", symbolicMeaning: "فَأَمَّا الزَّبَدُ فَيَذْهَبُ جُفَاءً وَأَمَّا مَا يَنْفَعُ النَّاسَ فَيَمْكُثُ فِي الْأَرْضِ (الرعد 17)", difficulty: 3 },
  { arabicText: "الانسان خلق في كبد ومشقة مستمرة", symbolicMeaning: "لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي كَبَدٍ (البلد 4)", difficulty: 2 },
  { arabicText: "القول المعروف خير من العطاء الذي يتبعه اذى", symbolicMeaning: "قَوْلٌ مَعْرُوفٌ وَمَغْفِرَةٌ خَيْرٌ مِنْ صَدَقَةٍ يَتْبَعُهَا أَذًى (البقرة 263)", difficulty: 3 },
  { arabicText: "التقوى هي المخرج الحقيقي من الازمات", symbolicMeaning: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا (الطلاق 2)", difficulty: 2 },
  { arabicText: "العلم يرفع مكانة الانسان درجات", symbolicMeaning: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنْكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ (المجادلة 11)", difficulty: 2 },
  { arabicText: "اليسر دائما يرافق العسر ويتبعه", symbolicMeaning: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا * إِنَّ مَعَ الْعُسْرِ يُسْرًا (الشرح 5-6)", difficulty: 1 },
  { arabicText: "اتباع الاهواء يضل الانسان عن الحق", symbolicMeaning: "وَلَا تَتَّبِعِ الْهَوَى فَيُضِلَّكَ عَنْ سَبِيلِ اللَّهِ (ص 26)", difficulty: 2 },
  { arabicText: "الامانة يجب ان تؤدى الى اصحابها", symbolicMeaning: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ إِلَى أَهْلِهَا (النساء 58)", difficulty: 2 },

  // ثامناً: في الاستقامة والعمل (10 حكم)
  { arabicText: "الاستقامة هي المنهج المطلوب بعد الايمان", symbolicMeaning: "فَاسْتَقِمْ كَمَا أُمِرْتَ (هود 112)", difficulty: 2 },
  { arabicText: "لكل مجتهد في الخير نصيب من الله", symbolicMeaning: "إِنَّا لَا نُضِيعُ أَجْرَ مَنْ أَحْسَنَ عَمَلًا (الكهف 30)", difficulty: 2 },
  { arabicText: "الظلم لا يفلح صاحبه في النهاية", symbolicMeaning: "إِنَّهُ لَا يُفْلِحُ الظَّالِمُونَ (الأنعام 21)", difficulty: 2 },
  { arabicText: "التكبر يمنع الانسان من دخول الجنة", symbolicMeaning: "فَبِئْسَ مَثْوَى الْمُتَكَبِّرِينَ (النحل 29)", difficulty: 2 },
  { arabicText: "الرحمة هي اساس انتشار الدعوة والالتفاف حول القائد", symbolicMeaning: "وَلَوْ كُنْتَ فَظًّا غَلِيظَ الْقَلْبِ لَانْفَضُّوا مِنْ حَوْلِكَ (آل عمران 159)", difficulty: 2 },
  { arabicText: "الاصلاح بين الناس يقتضي تقوى الله", symbolicMeaning: "فَاتَّقُوا اللَّهَ وَأَصْلِحُوا ذَاتَ بَيْنِكُمْ (الأنفال 1)", difficulty: 2 },
  { arabicText: "الاستهزاء بالاخرين قد يقع على من هو خير من المستهزئ", symbolicMeaning: "لَا يَسْخَرْ قَوْمٌ مِنْ قَوْمٍ عَسَى أَنْ يَكُونُوا خَيْرًا مِنْهُمْ (الحجرات 11)", difficulty: 2 },
  { arabicText: "المودة والرحمة هما اساس السكن بين الزوجين", symbolicMeaning: "وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً (الروم 21)", difficulty: 2 },
  { arabicText: "الله لا يحب من يختال بنفسه ويفخر عليها", symbolicMeaning: "إِنَّ اللَّهَ لَا يُحبُّ كُلَّ مُخْتَالٍ فَخُورٍ (لقمان 18)", difficulty: 2 },
  { arabicText: "العدل في الشهادة مطلوب ولو كان ضد الوالدين والاقربين", symbolicMeaning: "كُونُوا قَوَّامِينَ بِالْقِسْطِ شُهَدَاءَ لِلَّهِ وَلوْ عَلَى أَنْفُسِكُمْ أَوِ الْوَالِدَيْنِ وَالْأَقْرَبِينَ (النساء 135)", difficulty: 3 },

  // تاسعاً: في الأخلاق والتعامل (10 حكم)
  { arabicText: "الرد على التحية يجب ان يكون باحسن منها او بمثلها", symbolicMeaning: "وَإِذَا حُيِّيتُمْ بِتَحِيَّةٍ فَحَيُّوا بِأَحْسَنَ مِنْهَا أَوْ رُدُّوهَا (النساء 86)", difficulty: 2 },
  { arabicText: "اتباع الاكثرية في الارض قد يؤدي الى الضلال", symbolicMeaning: "وَإِنْ تُطِعْ أَكْثَرَ مَنْ فِي الْأَرْضِ يُضِلُّوكَ عَنْ سَبِيلِ اللَّهِ (الأنعام 116)", difficulty: 3 },
  { arabicText: "الصدق مع الله يتطلب الوفاء بما عاهد عليه الانسان", symbolicMeaning: "رِجَالٌ صَدَقُوا مَا عَاهَدُوا اللَّهَ عَلَيْهِ (الأحزاب 23)", difficulty: 2 },
  { arabicText: "العزة الحقيقية مصدرها الله وحده", symbolicMeaning: "فَإِنَّ الْعِزَّةَ لِلَّهِ جَمِيعًا (النساء 139)", difficulty: 2 },
  { arabicText: "العلم يرفع اهله فوق من لا يعلمون", symbolicMeaning: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ (الزمر 9)", difficulty: 2 },
  { arabicText: "الهداية بيد الله وحده وليس بجهد الانسان لمن يحب", symbolicMeaning: "إِنَّكَ لَا تَهْدِي مَنْ أَحْبَبْتَ وَلَكِنَّ اللَّهَ يَهْدِي مَنْ يَشَاءُ (القصص 56)", difficulty: 3 },
  { arabicText: "القناعة في الرزق هي الرضا بما اتاك الله", symbolicMeaning: "وَرَضُوا بِهِ (التوبة 59)", difficulty: 2 },
  { arabicText: "الفتنة اشد خطرا من القتل", symbolicMeaning: "وَالْفِتْنَةُ أَشَدُّ مِنَ الْقَتْلِ (البقرة 191)", difficulty: 2 },
  { arabicText: "الموت يدرك الانسان اينما كان ولو في حصون منيعة", symbolicMeaning: "أَيْنَمَا تَكُونُوا يُدْرِكْكُمُ الْمَوْتُ وَلَوْ كُنْتُمْ فِي بُرُوجٍ مُشَيَّدَةٍ (النساء 78)", difficulty: 3 },
  { arabicText: "التقوى والصدق هما طريق الوصول للمكانة العالية", symbolicMeaning: "فِي مَقْعَدِ صِدْقٍ عِنْدَ مَلِيكٍ مُقْتَدِرٍ (القمر 55)", difficulty: 3 },

  // عاشراً: في الطبيعة البشرية والختام (10 حكم)
  { arabicText: "الله يحب الذين يقاتلون ويجاهدون في سبيله بانتظام", symbolicMeaning: "إِنَّ اللَّهَ يُحِبُّ الَّذِينَ يُقَاتِلُونَ فِي سَبِيلِهِ صَفًّا (الصف 4)", difficulty: 3 },
  { arabicText: "الانسان خلق ضعيفا في تكوينه", symbolicMeaning: "وَخُلِقَ الْإِنْسَانُ ضَعِيفًا (النساء 28)", difficulty: 2 },
  { arabicText: "الارض يورثها الله للصالحين من عباده", symbolicMeaning: "أَنَّ الْأَرْضَ يَرِثُهَا عِبَادِيَ الصَّالِحُونَ (الأنبياء 105)", difficulty: 2 },
  { arabicText: "العمل الصالح هو الذي يرفع الكلم الطيب", symbolicMeaning: "إِلَيْهِ يَصْعَدُ الْكَلِمُ الطَّيِّبُ وَالْعَمَلُ الصَّالِحُ يَرْفَعُهُ (فاطر 10)", difficulty: 3 },
  { arabicText: "الانسان عجول في طبيعته وتصرفاته", symbolicMeaning: "وَكَانَ الْإِنْسَانُ عَجُولًا (الإسراء 11)", difficulty: 2 },
  { arabicText: "الصمت عن الجاهلين هو صفة عباد الرحمن", symbolicMeaning: "وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا (الفرقان 63)", difficulty: 2 },
  { arabicText: "الله مع الصابرين في كل حال", symbolicMeaning: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ (البقرة 153)", difficulty: 1 },
  { arabicText: "الانسان لا يملك الا نتيجة جهده وسعيه", symbolicMeaning: "وَأَنْ لَيْسَ لِلْإِنْسَانِ إِلَّا مَا سَعَى (النجم 39)", difficulty: 2 },
  { arabicText: "الاحسان للغير هو في الحقيقة نفع لنفسك", symbolicMeaning: "إِنْ أَحْسَنْتُمْ أَحْسَنْتُمْ لِأَنْفُسِكُمْ (الإسراء 7)", difficulty: 2 },
  { arabicText: "الانسان على نفسه بصير ويعرف اخطاءه", symbolicMeaning: "بَلِ الْإِنْسَانُ عَلَى نَفْسِهِ بَصِيرَةٌ (القيامة 14)", difficulty: 2 },
];

export async function addWisdomData() {
  console.log(`\n📚 إضافة/تحديث ${wisdomData.length} حكمة فلسفية في قاعدة البيانات...\n`);
  
  let added = 0;
  let updated = 0;
  let skipped = 0;
  
  for (const wisdom of wisdomData) {
    try {
      // Check if wisdom already exists
      const existing = await db
        .select()
        .from(philosophicalSentences)
        .where(sql`arabic_text = ${wisdom.arabicText}`)
        .limit(1);
      
      if (existing.length > 0) {
        // Update existing wisdom with conceptTags if provided
        if (wisdom.conceptTags && wisdom.conceptTags.length > 0) {
          const existingTags = (existing[0].conceptTags as string[]) || [];
          if (existingTags.length === 0) {
            await db
              .update(philosophicalSentences)
              .set({ conceptTags: wisdom.conceptTags })
              .where(sql`arabic_text = ${wisdom.arabicText}`);
            updated++;
          } else {
            skipped++;
          }
        } else {
          skipped++;
        }
        continue;
      }
      
      await db.insert(philosophicalSentences).values({
        arabicText: wisdom.arabicText,
        symbolicMeaning: wisdom.symbolicMeaning,
        difficulty: wisdom.difficulty,
        conceptTags: wisdom.conceptTags || [],
        translations: {},
      });
      added++;
    } catch (error) {
      console.error(`خطأ في إضافة/تحديث: ${wisdom.arabicText}`, error);
    }
  }
  
  console.log(`\n✅ تمت الإضافة: ${added} حكمة جديدة`);
  console.log(`🔄 تم التحديث: ${updated} حكمة بالمفاهيم`);
  console.log(`⏭️ تم التخطي: ${skipped} حكمة مكتملة مسبقاً`);
  console.log(`📊 المجموع: ${wisdomData.length} حكمة\n`);
  
  return { added, updated, skipped, total: wisdomData.length };
}

// Import sql for querying
import { sql } from "drizzle-orm";
