import { db } from "./db";
import { conversationPrompts } from "@shared/schema";

interface KahfQuestion {
  question: string;
  verse: string;
  stage: string;
  category: string;
}

const SURAH_KAHF_QUESTIONS: KahfQuestion[] = [
  // المرحلة الأولى: بذرة الإيمان (البدايات)
  { question: "من هم الذين أعلنوا إيمانهم بربهم في ظروف صعبة؟", verse: "إِنَّهُمْ فِتْيَةٌ آمَنُوا بِرَبِّهِمْ", stage: "بذرة الإيمان", category: "surah_kahf_stage1" },
  { question: "ما هو العطاء الإلهي الذي ناله هؤلاء الفتية بعد إيمانهم؟", verse: "وَزِدْنَاهُمْ هُدًى", stage: "بذرة الإيمان", category: "surah_kahf_stage1" },
  { question: "إلى أين اتجه الفتية بحثاً عن النجاة بدينهم؟", verse: "إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ", stage: "بذرة الإيمان", category: "surah_kahf_stage1" },
  { question: "ما هو المطلب الأساسي الذي تضرع به الفتية إلى الله؟", verse: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً", stage: "بذرة الإيمان", category: "surah_kahf_stage1" },
  { question: "ماذا طلبوا من الله بشأن أمرهم الصعب؟", verse: "وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا", stage: "بذرة الإيمان", category: "surah_kahf_stage1" },
  { question: "كيف حفظ الله حواسهم عن الضجيج الخارجي؟", verse: "فَضَرَبْنَا عَلَىٰ آذَانِهِمْ", stage: "بذرة الإيمان", category: "surah_kahf_stage1" },
  { question: "ما هي الفترة التي قضاها الفتية في نومهم؟", verse: "سِنِينَ عَدَدًا", stage: "بذرة الإيمان", category: "surah_kahf_stage1" },
  { question: "من الذي يتولى سرد هذه القصة بالحق؟", verse: "نَحْنُ نَقُصُّ عَلَيْكَ نَبَأَهُم بِالْحَقِّ", stage: "بذرة الإيمان", category: "surah_kahf_stage1" },
  { question: "ماذا فعل الله بقلوبهم ليتمكنوا من مواجهة الملك الظالم؟", verse: "وَرَبَطْنَا عَلَىٰ قُلُوبِهِمْ", stage: "بذرة الإيمان", category: "surah_kahf_stage1" },
  { question: "ماذا قالوا حين قاموا بجرأة أمام القوم؟", verse: "رَبُّنَا رَبُّ السَّمَاوَاتِ وَالْأَرْضِ", stage: "بذرة الإيمان", category: "surah_kahf_stage1" },

  // المرحلة الثانية: فهم الجملة البسيطة (الفعل والنتيجة)
  { question: "ماذا فعل الله بهم بعد نومهم الطويل؟", verse: "ثُمَّ بَعَثْنَاهُمْ", stage: "فهم الجملة البسيطة", category: "surah_kahf_stage2" },
  { question: "ما الغاية من إيقاظهم بعد تلك السنين؟", verse: "لِنَعْلَمَ أَيُّ الْحِزْبَيْنِ أَحْصَىٰ لِمَا لَبِثُوا أَمَدًا", stage: "فهم الجملة البسيطة", category: "surah_kahf_stage2" },
  { question: "بم وصف الفتية الآلهة التي اتخذها قومهم؟", verse: "هَٰؤُلَاءِ قَوْمُنَا اتَّخَذُوا مِن دُونِهِ آلِهَةً", stage: "فهم الجملة البسيطة", category: "surah_kahf_stage2" },
  { question: "ماذا ينشر الله للفتية في كهفهم من رحمته؟", verse: "يَنشُرْ لَكُمْ رَبُّكُم مِّن رَّحْمَتِهِ", stage: "فهم الجملة البسيطة", category: "surah_kahf_stage2" },
  { question: "كيف كانت الشمس تتعامل مع كهفهم عند الطلوع؟", verse: "تَزَاوَرُ عَن كَهْفِهِمْ ذَاتَ الْيَمِينِ", stage: "فهم الجملة البسيطة", category: "surah_kahf_stage2" },
  { question: "وكيف كانت الشمس تتركهم عند الغروب؟", verse: "وَإِذَا غَرَبَت تَّقْرِضُهُمْ ذَاتَ الشِّمَالِ", stage: "فهم الجملة البسيطة", category: "surah_kahf_stage2" },
  { question: "كيف وصف الله حالهم من حيث اليقظة والنوم؟", verse: "وَتَحْسَبُهُمْ أَيْقَاظًا وَهُمْ رُقُودٌ", stage: "فهم الجملة البسيطة", category: "surah_kahf_stage2" },
  { question: "كيف كان الله يقلب أجسادهم في النوم؟", verse: "وَنُقَلِّبُهُمْ ذَاتَ الْيَمِينِ وَذَاتَ الشِّمَالِ", stage: "فهم الجملة البسيطة", category: "surah_kahf_stage2" },
  { question: "كيف كان وضع كلبهم عند مدخل الكهف؟", verse: "وَكَلْبُهُم بَاسِطٌ ذِرَاعَيْهِ بِالْوَصِيدِ", stage: "فهم الجملة البسيطة", category: "surah_kahf_stage2" },
  { question: "ما هو الشعور الذي كان سيصيب من يراهم؟", verse: "لَوَلَّيْتَ مِنْهُمْ فِرَارًا وَلَمُلِئْتَ مِنْهُمْ رُعْبًا", stage: "فهم الجملة البسيطة", category: "surah_kahf_stage2" },

  // المرحلة الثالثة: مفاهيم الحياة والقيم (المستوى المتوسط)
  { question: "ما هو السؤال الذي طرحه أحدهم عند استيقاظهم؟", verse: "قَالَ قَائِلٌ مِّنْهُمْ كَمْ لَبِثْتُمْ", stage: "مفاهيم الحياة والقيم", category: "surah_kahf_stage3" },
  { question: "ماذا كان رد الآخرين على تساؤل المدة؟", verse: "لَبِثْنَا يَوْمًا أَوْ بَعْضَ يَوْمٍ", stage: "مفاهيم الحياة والقيم", category: "surah_kahf_stage3" },
  { question: "لمن فوضوا العلم الحقيقي بمدة لبثهم؟", verse: "رَبُّكُمْ أَعْلَمُ بِمَا لَبِثْتُمْ", stage: "مفاهيم الحياة والقيم", category: "surah_kahf_stage3" },
  { question: "بماذا أرسلوا صاحبهم إلى المدينة لشراء الطعام؟", verse: "فَابْعَثُوا أَحَدَكُم بِوَرِقِكُمْ هَٰذِهِ إِلَى الْمَدِينَةِ", stage: "مفاهيم الحياة والقيم", category: "surah_kahf_stage3" },
  { question: "ما هو المعيار الذي اختاروا على أساسه الطعام؟", verse: "فَلْيَنظُرْ أَيُّهَا أَزْكَىٰ طَعَامًا", stage: "مفاهيم الحياة والقيم", category: "surah_kahf_stage3" },
  { question: "كيف أمروا صاحبهم أن يتصرف داخل المدينة؟", verse: "وَلْيَتَلَطَّفْ", stage: "مفاهيم الحياة والقيم", category: "surah_kahf_stage3" },
  { question: "ماذا طلبوا منه أن يتجنب بخصوص موقعهم؟", verse: "وَلَا يُشْعِرَنَّ بِكُمْ أَحَدًا", stage: "مفاهيم الحياة والقيم", category: "surah_kahf_stage3" },
  { question: "ماذا كان الفتية يخشون أن يفعل بهم القوم؟", verse: "إِنَّهُمْ إِن يَظْهَرُوا عَلَيْكُمْ يَرْجُمُوكُمْ", stage: "مفاهيم الحياة والقيم", category: "surah_kahf_stage3" },
  { question: "ما هو الخطر الفكري الذي خافوا منه؟", verse: "أَوْ يُعِيدُوكُمْ فِي مِلَّتِهِمْ", stage: "مفاهيم الحياة والقيم", category: "surah_kahf_stage3" },
  { question: "ما هي نتيجة العودة لملة الكفر في رأيهم؟", verse: "وَلَن تُفْلِحُوا إِذًا أَبَدًا", stage: "مفاهيم الحياة والقيم", category: "surah_kahf_stage3" },

  // المرحلة الرابعة: الحكمة الخفية (موسى والخضر)
  { question: "ما هو العهد الذي قطعه موسى لمتابعة طريقه؟", verse: "لَا أَبْرَحُ حَتَّىٰ أَبْلُغَ مَجْمَعَ الْبَحْرَيْنِ", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "كيف وصف موسى تعبه في رحلة البحث؟", verse: "لَقَدْ لَقِينَا مِن سَفَرِنَا هَٰذَا نَصَبًا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "من هو الشخص الذي وجده موسى عند الصخرة؟", verse: "عَبْدًا مِّنْ عِبَادِنَا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "بماذا وصف الله ذلك العبد الصالح؟", verse: "آتَيْنَاهُ رَحْمَةً مِّنْ عِندِنَا وَعَلَّمْنَاهُ مِن لَّدُنَّا عِلْمًا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "كيف طلب موسى العلم بتواضع؟", verse: "هَلْ أَتَّبِعُكَ عَلَىٰ أَن تُعَلِّمَنِ مِمَّا عُلِّمْتَ رُشْدًا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "ما هو التحدي الأول الذي واجه به الخضر موسى؟", verse: "إِنَّكَ لَن تَسْتَطِيعَ مَعِيَ صَبْرًا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "ما هو مبرر عدم القدرة على الصبر في رأي الخضر؟", verse: "وَكَيْفَ تَصْبِرُ عَلَىٰ مَا لَمْ تُحِطْ بِهِ خُبْرًا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "بماذا رد موسى مؤكداً عزمه؟", verse: "سَتَجِدُنِي إِن شَاءَ اللَّهُ صَابِرًا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "ما هو الشرط الذي وضعه الخضر لمرافقة موسى؟", verse: "فَلَا تَسْأَلْنِي عَن شَيْءٍ حَتَّىٰ أُحْدِثَ لَكَ مِنْهُ ذِكْرًا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "ماذا فعل الخضر بالسفينة بمجرد ركوبها؟", verse: "خَرَقَهَا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "ما هو اعتراض موسى العفوي على خرق السفينة؟", verse: "أَخَرَقْتَهَا لِتُغْرِقَ أَهْلَهَا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "ماذا فعل الخضر بالغلام الذي لقياه؟", verse: "قَتَلَهُ", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "كيف استنكر موسى قتل الغلام؟", verse: "أَقَتَلْتَ نَفْسًا زَكِيَّةً بِغَيْرِ نَفْسٍ", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "ماذا فعل الخضر بالجدار الذي كاد أن يسقط؟", verse: "فَأَقَامَهُ", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "ما هو العرض الذي قدمه موسى بخصوص الجدار؟", verse: "لَوْ شِئْتَ لَاتَّخَذْتَ عَلَيْهِ أَجْرًا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "ماذا قال الخضر عند نقطة الفراق؟", verse: "هَٰذَا فِرَاقُ بَيْنِي وَبَيْنِكَ", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "لمن كانت السفينة التي خرقها الخضر؟", verse: "أَمَّا السَّفِينَةُ فَكَانَتْ لِمَسَاكِينَ", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "لماذا عاب الخضر السفينة؟", verse: "وَكَانَ وَرَاءَهُم مَّلِكٌ يَأْخُذُ كُلَّ سَفِينَةٍ غَصْبًا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "ماذا خشي الخضر من بقاء الغلام حياً؟", verse: "فَخَشِينَا أَن يُرْهِقَهُمَا طُغْيَانًا وَكُفْرًا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },
  { question: "لمن كان الكنز الذي تحت الجدار؟", verse: "وَكَانَ تَحْتَهُ كَنزٌ لَّهُمَا", stage: "الحكمة الخفية", category: "surah_kahf_stage4" },

  // المرحلة الخامسة: القيادة والقوة (ذو القرنين)
  { question: "ماذا قال الله عن تمكين ذو القرنين في الأرض؟", verse: "إِنَّا مَكَّنَّا لَهُ فِي الْأَرْضِ", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "ماذا أعطى الله ذو القرنين ليحقق أهدافه؟", verse: "وَآتَيْنَاهُ مِن كُلِّ شَيْءٍ سَبَبًا", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "أين وجد ذو القرنين الشمس تغرب؟", verse: "وَجَدَهَا تَغْرُبُ فِي عَيْنٍ حَمِئَةٍ", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "ما هو منهجه مع الظالمين؟", verse: "أَمَّا مَن ظَلَمَ فَسَوْفَ نُعَذِّبُهُ", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "وما هو وعده لمن آمن وعمل صالحاً؟", verse: "فَلَهُ جَزَاءً الْحُسْنَىٰ", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "كيف وصف الله القوم الذين لا يكادون يفقهون قولاً؟", verse: "وَجَدَ مِن دُونِهِمَا قَوْمًا لَّا يَكَادُونَ يَفْقَهُونَ قَوْلًا", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "ماذا طلب القوم من ذي القرنين بخصوص يأجوج ومأجوج؟", verse: "فَهَلْ نَجْعَلُ لَكَ خَرْجًا عَلَىٰ أَن تَجْعَلَ بَيْنَنَا وَبَيْنَهُمْ سَدًّا", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "بماذا اعتز ذو القرنين في رده عليهم؟", verse: "مَا مَكَّنِّي فِيهِ رَبِّي خَيْرٌ", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "ماذا طلب ذو القرنين من الناس ليعينوه؟", verse: "فَأَعِينُونِي بِقُوَّةٍ", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "ما هي المادة الخام التي طلبها لبناء السد؟", verse: "آتُونِي زُبَرَ الْحَدِيدِ", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "ماذا صب على الحديد المحمى لتقويته؟", verse: "قَالَ آتُونِي أُفْرِغْ عَلَيْهِ قِطْرًا", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "هل استطاع يأجوج ومأجوج تسلق السد؟", verse: "فَمَا اسْطَاعُوا أَن يَظْهَرُوهُ", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "وهل استطاعوا ثقبه؟", verse: "وَمَا اسْتَطَاعُوا لَهُ نَقْبًا", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "لمن نسب ذو القرنين الفضل في بناء السد؟", verse: "قَالَ هَٰذَا رَحْمَةٌ مِّن رَّبِّي", stage: "القيادة والقوة", category: "surah_kahf_stage5" },
  { question: "متى ينهار هذا السد العظيم؟", verse: "فإِذَا جَاءَ وَعْدُ رَبِّي جَعَلَهُ دَكَّاءَ", stage: "القيادة والقوة", category: "surah_kahf_stage5" },

  // المرحلة السادسة: الآخرة والغاية (المستوى الإيماني)
  { question: "كيف وصف الله حال الكافرين يوم العرض؟", verse: "وَعَرَضْنَا جَهَنَّمَ يَوْمَئِذٍ لِّلْكَافِرِينَ عَرْضًا", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "ما هي مشكلة أعين الكافرين في الدنيا؟", verse: "كَانَتْ أَعْيُنُهُمْ فِي غِطَاءٍ عَن ذِكْرِي", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "من هم الأخسرون أعمالاً؟", verse: "الَّذِينَ ضَلَّ سَعْيُهُمْ فِي الْحَيَاةِ الدُّنْيَا", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "ماذا يحسب هؤلاء الأخسرون عن أنفسهم؟", verse: "وَهُمْ يَحْسَبُونَ أَنَّهُمْ يُحْسِنُونَ صُنْعًا", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "ما هو مصير أعمال الكافرين يوم القيامة؟", verse: "فَحَبِطَتْ أَعْمَالُهُمْ", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "هل يضع الله وزناً لأعمال الكافرين؟", verse: "فَلَا نُقِيمُ لَهُمْ يَوْمَ الْقِيَامَةِ وَزْنًا", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "ما جزاء المؤمنين الذين عملوا الصالحات؟", verse: "كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ نُزُلًا", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "ما هي مدة بقائهم في الجنة؟", verse: "خَالِدِينَ فِيهَا", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "هل يرغب أهل الجنة في التحول عنها؟", verse: "لَا يَبْغُونَ عَنْهَا حِوَلًا", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "بم شبه الله اتساع كلماته وعلمه؟", verse: "قُل لَّوْ كَانَ الْبَحْرُ مِدَادًا لِّكَلِمَاتِ رَبِّي", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "ماذا سيحدث للبحر قبل أن تنفد كلمات الله؟", verse: "لَنَفِدَ الْبَحْرُ قَبْلَ أَن تَنفَدَ كَلِمَاتُ رَبِّي", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "ما هي حقيقة الرسول صلى الله عليه وسلم؟", verse: "قُلْ إِنَّمَا أَنَا بَشَرٌ مِّثْلُكُمْ يُوحَىٰ إِلَيَّ", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "ما هي الرسالة الأساسية التي يوحى بها للرسول؟", verse: "أَنَّمَا إِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "ماذا يفعل من يرجو لقاء الله؟", verse: "فَلْيَعْمَلْ عَمَلًا صَالِحًا", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },
  { question: "ما هو الشرط الثاني لقبول العمل مع الصلاح؟", verse: "وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِ أَحَدًا", stage: "الآخرة والغاية", category: "surah_kahf_stage6" },

  // المرحلة السابعة: دروس متفرقة وتثبيت الهوية
  { question: "ماذا قال صاحب الجنة لصاحبه وهو يحاوره؟", verse: "أَنَا أَكْثَرُ مِنكَ مَالًا وَأَعَزُّ نَفَرًا", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "ماذا قال الظالم لنفسه حين دخل جنته؟", verse: "مَا أَظُنُّ أَن تَبِيدَ هَٰذِهِ أَبَدًا", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "بماذا رد عليه صاحبه المؤمن؟", verse: "أَكَفَرْتَ بِالَّذِي خَلَقَكَ مِن تُرَابٍ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "ما هي الجملة التي يجب قولها عند رؤية النعمة؟", verse: "مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "كيف أصبحت جنة الظالم بعد عذاب الله؟", verse: "فَأَصْبَحَ يُقَلِّبُ كَفَّيْهِ عَلَىٰ مَا أَنفَقَ فِيهَا", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "بماذا شبه الله الحياة الدنيا؟", verse: "كَمَاءٍ أَنزَلْنَاهُ مِنَ السَّمَاءِ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "ما هو مصير زينة الأرض في النهاية؟", verse: "فَأَصْبَحَ هَشِيمًا تَذْرُوهُ الرِّيَاحُ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "ما هي زينة الحياة الدنيا الحقيقية؟", verse: "الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "ما هو الشيء الذي يبقى أجره عند الله؟", verse: "وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "كيف سيحشر الله الخلائق يوم القيامة؟", verse: "وَحَشَرْنَاهُمْ فَلَمْ نُغَادِرْ مِنْهُمْ أَحَدًا", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "ماذا سيقول المجرمون عند رؤية كتاب أعمالهم؟", verse: "يَا وَيْلَتَنَا مَالِ هَٰذَا الْكِتَابِ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "هل يترك الكتاب الأعمال الصغيرة؟", verse: "لَا يُغَادِرُ صَغِيرَةً وَلَا كَبِيرَةً إِلَّا أَحْصَاهَا", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "هل يظلم الله أحداً في كتابه؟", verse: "وَلَا يَظْلِمُ رَبُّكَ أَحَدًا", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "ماذا قال الله للملائكة بخصوص آدم؟", verse: "اسْجُدُوا لِآدَمَ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "من الذي استكبر ورفض السجود؟", verse: "فَسَجَدُوا إِلَّا إِبْلِيسَ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "ما هو أصل إبليس؟", verse: "كَانَ مِنَ الْجِنِّ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "هل اتخذ الله أحداً ليشهده خلق السموات؟", verse: "مَّا أَشْهَدتُّهُمْ خَلْقَ السَّمَاوَاتِ وَالْأَرْضِ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "ماذا جعل الله بين الكافرين وشركائهم يوم القيامة؟", verse: "وَجَعَلْنَا بَيْنَهُم مَّوْبِقًا", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "من هو أظلم الناس في نظر القرآن؟", verse: "وَمَنْ أَظْلَمُ مِمَّن ذُكِّرَ بِآيَاتِ رَبِّهِ فَأَعْرَضَ عَنْهَا", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
  { question: "ما هو الكهف الحقيقي الذي يلجأ إليه المؤمن دائماً؟", verse: "رَحْمَةِ رَبِّكَ", stage: "دروس متفرقة", category: "surah_kahf_stage7" },
];

const ECONOMIC_QUESTIONS: KahfQuestion[] = [
  { question: "ما هو الشرط الأساسي الذي وضعه ذو القرنين لتحويل الموارد الخام إلى أصل مستدام؟", verse: "فَأَعِينُونِي بِقُوَّةٍ", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "كيف طبق العبد الصالح استراتيجية الخسارة الصغرى لتفادي الخسارة الكبرى؟", verse: "فَأَرَدتُّ أَنْ أَعِيبَهَا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "ما هي الوسيلة المالية التي استخدمها الفتية للتبادل التجاري؟", verse: "بِوَرِقِكُمْ هَٰذِهِ إِلَى الْمَدِينَةِ فَلَيَنظُرْ أَيُّهَا أَزْكَىٰ طَعَامًا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "كيف وصف القرآن المشروع الزراعي لصاحب الجنتين من حيث تنويع الإنتاج؟", verse: "جَعَلْنَا لِأَحَدِهِمَا جَنَّتَيْنِ مِنْ أَعْنَابٍ وَحَفَفْنَاهُمَا بِنَخْلٍ وَجَعَلْنَا بَيْنَهُمَا زَرْعًا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "ما هي الآية التي تصف وصول المشروع الزراعي إلى أقصى طاقته الإنتاجية؟", verse: "كِلْتَا الْجَنَّتَيْنِ آتَتْ أُكُلَهَا وَلَمْ تَظْلِم مِّنْهُ شَيْئًا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "كيف عبر صاحب الجنتين عن عقلية تراكم الثروة كأداة للهيمنة؟", verse: "أَنَا أَكْثَرُ مِنكَ مَالًا وَأَعزُّ نَفَرًا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "ما هي الآية التي تشرح سرعة زوال الأصول الدنيوية؟", verse: "فَأَصْبَحَ هَشِيمًا تَذْرُوهُ الرِّيَاحُ", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "ما هو الدافع الاقتصادي لحفظ الكنز لليتامى حتى بلوغهم؟", verse: "وَكَانَ تَحْتَهُ كَنزٌ لَّهُمَا وَكَانَ أَبُوهُمَا صَالِحًا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "إذا كان المال والبنون زينة متغيرة القيمة، فما هو الاستثمار المضمون؟", verse: "وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ ثَوَابًا وَخَيْرٌ أَمَلًا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "ما هي الجملة التي توضح أن العلم أصل غير مادي يُمنح كمنحة ربانية؟", verse: "وَعَلَّمْنَاهُ مِن لَّدُنَّا عِلْمًا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "كيف وصفت السورة المخاطر التي تهدد صغار المستثمرين؟", verse: "وَكَانَ وَرَاءَهُم مَّلِكٌ يَأْخُذُ كُلَّ سَفِينَةٍ غَصْبًا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "كيف رفض ذو القرنين المنح المالية مفضلاً الاعتماد على الموارد الذاتية؟", verse: "مَا مَكَّنِّي فِيهِ رَبِّي خَيْرٌ", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "ما هي الآية التي تصف نظام تسجيل البيانات الذي لا يترك شيئاً؟", verse: "لَا يُغَادِرُ صَغِيرَةً وَلَا كَبِيرَةً إِلَّا أَحْصَاهَا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "كيف وصف القرآن المدير الذي يضيع موارده في مسارات خاطئة؟", verse: "الَّذِينَ ضَلَّ سَعْيُهُمْ فِي الْحَيَاةِ الدُّنْيَا وَهُمْ يَحْسَبُونَ أَنَّهُمْ يُحْسِنُونَ صُنْعًا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
  { question: "ما هي الآية التي تؤكد على منح التراخيص والموارد للقائد؟", verse: "إِنَّا مَكَّنَّا لَهُ فِي الْأَرْضِ وَآتَيْنَاهُ مِن كُلِّ شَيْءٍ سَبَبًا", stage: "اقتصاديات الكهف", category: "surah_kahf_economics" },
];

export async function addSurahKahfExercises() {
  console.log("Adding Surah Al-Kahf exercises...");
  
  let addedCount = 0;
  let skippedCount = 0;
  
  const allQuestions = [...SURAH_KAHF_QUESTIONS, ...ECONOMIC_QUESTIONS];
  
  for (const q of allQuestions) {
    try {
      await db.insert(conversationPrompts).values({
        question: q.question,
        questionEn: `(${q.stage}) ${q.question}`,
        suggestedVerse: q.verse,
        category: q.category,
        symbolicMeaning: `سورة الكهف - ${q.stage}`,
        isPracticalDailyUse: 0,
        usageDomain: "quran_study",
      });
      addedCount++;
    } catch (error: any) {
      if (error.message?.includes("duplicate")) {
        skippedCount++;
      } else {
        console.error(`Error adding question: ${q.question}`, error);
      }
    }
  }
  
  console.log(`\nSurah Al-Kahf exercises completed:`);
  console.log(`- Added: ${addedCount} exercises`);
  console.log(`- Skipped (duplicates): ${skippedCount}`);
  console.log(`- Total: ${allQuestions.length} exercises`);
  
  return { added: addedCount, skipped: skippedCount };
}

addSurahKahfExercises()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
