import { db } from "./db";
import { dailySentences, quranicExpressions, dailySentenceExercises } from "@shared/schema";
import { randomUUID } from "crypto";

async function seedPsychologicalExercises() {
  console.log("🧠 Seeding 50 psychological-themed daily contextual exercises...\n");

  const exercises = [
    // Anxiety & Inner Peace (5 exercises)
    {
      theme: "anxiety",
      sentence: "When I feel anxious about the future, I remind myself",
      correctExpression: {
        arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
        reference: "الرعد:28",
        translation: "Verily, in the remembrance of Allah do hearts find rest",
      },
      distractors: [
        { arabic: "وَلَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا", reference: "التوبة:40" },
        { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", reference: "الشرح:5" },
        { arabic: "وَمَا أَصَابَكُم مِّن مُّصِيبَةٍ فَبِمَا كَسَبَتْ أَيْدِيكُمْ", reference: "الشورى:30" },
      ],
    },
    {
      theme: "anxiety",
      sentence: "My worries overwhelm me until I remember",
      correctExpression: {
        arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
        reference: "الزمر:53",
        translation: "Do not despair of the mercy of Allah",
      },
      distractors: [
        { arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", reference: "البقرة:45" },
        { arabic: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ", reference: "الرعد:11" },
        { arabic: "وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ", reference: "ق:16" },
      ],
    },
    {
      theme: "anxiety",
      sentence: "When my mind races with fearful thoughts",
      correctExpression: {
        arabic: "فَلَا تَخَافُوهُمْ وَخَافُونِ إِن كُنتُم مُّؤْمِنِينَ",
        reference: "آل عمران:175",
        translation: "So fear them not, but fear Me, if you are believers",
      },
      distractors: [
        { arabic: "إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا", reference: "فصلت:30" },
        { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", reference: "الطلاق:2" },
        { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", reference: "آل عمران:173" },
      ],
    },
    {
      theme: "anxiety",
      sentence: "To calm my racing heart, I recite",
      correctExpression: {
        arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ",
        reference: "الرعد:28",
        translation: "Those who believe, and whose hearts find rest in the remembrance of Allah",
      },
      distractors: [
        { arabic: "وَلَا تَكُونُوا كَالَّذِينَ نَسُوا اللَّهَ فَأَنسَاهُمْ أَنفُسَهُمْ", reference: "الحشر:19" },
        { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", reference: "البقرة:152" },
        { arabic: "إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ", reference: "الأنفال:2" },
      ],
    },
    {
      theme: "anxiety",
      sentence: "When stress paralyzes me, I trust",
      correctExpression: {
        arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
        reference: "الطلاق:3",
        translation: "And whoever relies upon Allah - then He is sufficient for him",
      },
      distractors: [
        { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", reference: "البقرة:153" },
        { arabic: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ", reference: "البقرة:155" },
        { arabic: "فَاصْبِرْ إِنَّ وَعْدَ اللَّهِ حَقٌّ", reference: "الروم:60" },
      ],
    },

    // Depression & Sadness (5 exercises)
    {
      theme: "depression",
      sentence: "When sadness consumes me, I find hope in",
      correctExpression: {
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        reference: "الشرح:5",
        translation: "For indeed, with hardship comes ease",
      },
      distractors: [
        { arabic: "وَبَشِّرِ الصَّابِرِينَ", reference: "البقرة:155" },
        { arabic: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ", reference: "الزمر:10" },
        { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", reference: "البقرة:286" },
      ],
    },
    {
      theme: "depression",
      sentence: "My grief feels endless, but I remember",
      correctExpression: {
        arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        reference: "الشرح:6",
        translation: "Indeed, with hardship comes ease",
      },
      distractors: [
        { arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", reference: "يوسف:87" },
        { arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا", reference: "الزمر:53" },
        { arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", reference: "الشرح:1" },
      ],
    },
    {
      theme: "depression",
      sentence: "In my darkest moments, I hold onto",
      correctExpression: {
        arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ",
        reference: "يوسف:87",
        translation: "And despair not of relief from Allah",
      },
      distractors: [
        { arabic: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", reference: "التوبة:120" },
        { arabic: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", reference: "البقرة:216" },
        { arabic: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ", reference: "الأعراف:56" },
      ],
    },
    {
      theme: "depression",
      sentence: "When I feel empty inside, I seek",
      correctExpression: {
        arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
        reference: "الشرح:1",
        translation: "Have We not expanded for you your breast?",
      },
      distractors: [
        { arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ", reference: "الإسراء:82" },
        { arabic: "يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ", reference: "يونس:57" },
        { arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", reference: "البقرة:186" },
      ],
    },
    {
      theme: "depression",
      sentence: "My soul aches, but I trust",
      correctExpression: {
        arabic: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ",
        reference: "البقرة:216",
        translation: "Perhaps you dislike a thing and it is good for you",
      },
      distractors: [
        { arabic: "وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ", reference: "البقرة:216" },
        { arabic: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا", reference: "التوبة:40" },
        { arabic: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا", reference: "النحل:128" },
      ],
    },

    // Self-doubt & Confidence (5 exercises)
    {
      theme: "self-doubt",
      sentence: "When I doubt my worth, I recall",
      correctExpression: {
        arabic: "وَلَقَدْ كَرَّمْنَا بَنِي آدَمَ",
        reference: "الإسراء:70",
        translation: "And We have certainly honored the children of Adam",
      },
      distractors: [
        { arabic: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ", reference: "التين:4" },
        { arabic: "وَنَفْسٍ وَمَا سَوَّاهَا", reference: "الشمس:7" },
        { arabic: "إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً", reference: "البقرة:30" },
      ],
    },
    {
      theme: "self-doubt",
      sentence: "My confidence wavers until I remember",
      correctExpression: {
        arabic: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
        reference: "الرعد:11",
        translation: "Allah will not change the condition of a people until they change what is in themselves",
      },
      distractors: [
        { arabic: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", reference: "الذاريات:56" },
        { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", reference: "البقرة:152" },
        { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", reference: "البقرة:153" },
      ],
    },
    {
      theme: "self-doubt",
      sentence: "When I feel inadequate, I know",
      correctExpression: {
        arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
        reference: "البقرة:286",
        translation: "Allah does not burden a soul beyond what it can bear",
      },
      distractors: [
        { arabic: "وَمَا جَعَلَ عَلَيْكُمْ فِي الدِّينِ مِنْ حَرَجٍ", reference: "الحج:78" },
        { arabic: "يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ", reference: "البقرة:185" },
        { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", reference: "الشرح:5" },
      ],
    },
    {
      theme: "self-doubt",
      sentence: "My inner critic silences when I hear",
      correctExpression: {
        arabic: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ",
        reference: "التين:4",
        translation: "We have certainly created man in the best of stature",
      },
      distractors: [
        { arabic: "وَفِي أَنفُسِكُمْ ۚ أَفَلَا تُبْصِرُونَ", reference: "الذاريات:21" },
        { arabic: "وَنَفْسٍ وَمَا سَوَّاهَا", reference: "الشمس:7" },
        { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", reference: "الرعد:28" },
      ],
    },
    {
      theme: "self-doubt",
      sentence: "When I compare myself to others",
      correctExpression: {
        arabic: "وَلَا تَتَمَنَّوْا مَا فَضَّلَ اللَّهُ بِهِ بَعْضَكُمْ عَلَىٰ بَعْضٍ",
        reference: "النساء:32",
        translation: "And do not wish for that by which Allah has made some exceed others",
      },
      distractors: [
        { arabic: "وَلَا تَمُدَّنَّ عَيْنَيْكَ إِلَىٰ مَا مَتَّعْنَا بِهِ أَزْوَاجًا مِّنْهُمْ", reference: "الحجر:88" },
        { arabic: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ", reference: "الحجرات:13" },
        { arabic: "وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ", reference: "يوسف:76" },
      ],
    },

    // Loneliness & Isolation (5 exercises)
    {
      theme: "loneliness",
      sentence: "In my loneliest moments, I remember",
      correctExpression: {
        arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
        reference: "البقرة:186",
        translation: "And when My servants ask you about Me - indeed I am near",
      },
      distractors: [
        { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", reference: "الحديد:4" },
        { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", reference: "الرعد:28" },
        { arabic: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", reference: "التوبة:120" },
      ],
    },
    {
      theme: "loneliness",
      sentence: "When I feel abandoned by everyone",
      correctExpression: {
        arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
        reference: "الحديد:4",
        translation: "And He is with you wherever you are",
      },
      distractors: [
        { arabic: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا", reference: "التوبة:40" },
        { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", reference: "البقرة:153" },
        { arabic: "وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ", reference: "النحل:127" },
      ],
    },
    {
      theme: "loneliness",
      sentence: "Solitude becomes meaningful when I realize",
      correctExpression: {
        arabic: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
        reference: "ق:16",
        translation: "And We are closer to him than his jugular vein",
      },
      distractors: [
        { arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", reference: "البقرة:186" },
        { arabic: "هُوَ الَّذِي يُصَوِّرُكُمْ فِي الْأَرْحَامِ", reference: "آل عمران:6" },
        { arabic: "وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ", reference: "ق:16" },
      ],
    },
    {
      theme: "loneliness",
      sentence: "When no one understands my pain",
      correctExpression: {
        arabic: "أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
        reference: "البقرة:186",
        translation: "I respond to the invocation of the supplicant when he calls upon Me",
      },
      distractors: [
        { arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ", reference: "غافر:60" },
        { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", reference: "البقرة:152" },
        { arabic: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ", reference: "هود:61" },
      ],
    },
    {
      theme: "loneliness",
      sentence: "My isolation teaches me",
      correctExpression: {
        arabic: "وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ",
        reference: "ق:16",
        translation: "We created man and We know what his soul whispers to him",
      },
      distractors: [
        { arabic: "يَعْلَمُ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ", reference: "الحديد:4" },
        { arabic: "وَاللَّهُ يَعْلَمُ مَا تُسِرُّونَ وَمَا تُعْلِنُونَ", reference: "النحل:19" },
        { arabic: "وَمَا تَكُونُ فِي شَأْنٍ وَمَا تَتْلُو مِنْهُ مِن قُرْآنٍ", reference: "يونس:61" },
      ],
    },

    // Anger & Emotional Control (5 exercises)
    {
      theme: "anger",
      sentence: "When anger boils inside me",
      correctExpression: {
        arabic: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
        reference: "آل عمران:134",
        translation: "Who restrain anger and pardon people",
      },
      distractors: [
        { arabic: "وَإِذَا مَا غَضِبُوا هُمْ يَغْفِرُونَ", reference: "الشورى:37" },
        { arabic: "فَاعْفُ عَنْهُمْ وَاصْفَحْ", reference: "المائدة:13" },
        { arabic: "وَلْيَعْفُوا وَلْيَصْفَحُوا ۗ أَلَا تُحِبُّونَ أَن يَغْفِرَ اللَّهُ لَكُمْ", reference: "النور:22" },
      ],
    },
    {
      theme: "anger",
      sentence: "To calm my rage, I practice",
      correctExpression: {
        arabic: "وَإِذَا مَا غَضِبُوا هُمْ يَغْفِرُونَ",
        reference: "الشورى:37",
        translation: "And when they are angry, they forgive",
      },
      distractors: [
        { arabic: "وَلَا تَسْتَوِي الْحَسَنَةُ وَلَا السَّيِّئَةُ", reference: "فصلت:34" },
        { arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ", reference: "المؤمنون:96" },
        { arabic: "وَالْكَاظِمِينَ الْغَيْظَ", reference: "آل عمران:134" },
      ],
    },
    {
      theme: "anger",
      sentence: "When someone wrongs me, I choose",
      correctExpression: {
        arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ",
        reference: "المؤمنون:96",
        translation: "Repel evil with that which is better",
      },
      distractors: [
        { arabic: "وَجَزَاءُ سَيِّئَةٍ سَيِّئَةٌ مِّثْلُهَا", reference: "الشورى:40" },
        { arabic: "فَمَنْ عَفَا وَأَصْلَحَ فَأَجْرُهُ عَلَى اللَّهِ", reference: "الشورى:40" },
        { arabic: "وَالْعَافِينَ عَنِ النَّاسِ", reference: "آل عمران:134" },
      ],
    },
    {
      theme: "anger",
      sentence: "My temper flares but I remember",
      correctExpression: {
        arabic: "فَاعْفُ عَنْهُمْ وَاصْفَحْ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ",
        reference: "المائدة:13",
        translation: "So pardon them and overlook; indeed, Allah loves the doers of good",
      },
      distractors: [
        { arabic: "وَلْيَعْفُوا وَلْيَصْفَحُوا", reference: "النور:22" },
        { arabic: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ", reference: "الأعراف:199" },
        { arabic: "وَإِن تَعْفُوا وَتَصْفَحُوا وَتَغْفِرُوا فَإِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ", reference: "التغابن:14" },
      ],
    },
    {
      theme: "anger",
      sentence: "Instead of retaliation, I embody",
      correctExpression: {
        arabic: "فَمَنْ عَفَا وَأَصْلَحَ فَأَجْرُهُ عَلَى اللَّهِ",
        reference: "الشورى:40",
        translation: "But whoever pardons and makes reconciliation, his reward is with Allah",
      },
      distractors: [
        { arabic: "وَجَزَاءُ سَيِّئَةٍ سَيِّئَةٌ مِّثْلُهَا", reference: "الشورى:40" },
        { arabic: "وَإِنْ عَاقَبْتُمْ فَعَاقِبُوا بِمِثْلِ مَا عُوقِبْتُم بِهِ", reference: "النحل:126" },
        { arabic: "وَلَمَن صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ", reference: "الشورى:43" },
      ],
    },

    // Guilt & Self-forgiveness (5 exercises)
    {
      theme: "guilt",
      sentence: "My past mistakes haunt me, but I know",
      correctExpression: {
        arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
        reference: "الزمر:53",
        translation: "Say: O My servants who have transgressed, do not despair of Allah's mercy",
      },
      distractors: [
        { arabic: "وَمَن يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ", reference: "النساء:110" },
        { arabic: "إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا", reference: "الزمر:53" },
        { arabic: "وَالَّذِينَ إِذَا فَعَلُوا فَاحِشَةً أَوْ ظَلَمُوا أَنفُسَهُمْ", reference: "آل عمران:135" },
      ],
    },
    {
      theme: "guilt",
      sentence: "When shame overwhelms me, I turn to",
      correctExpression: {
        arabic: "إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
        reference: "الزمر:53",
        translation: "Indeed, Allah forgives all sins",
      },
      distractors: [
        { arabic: "وَهُوَ الْغَفُورُ الرَّحِيمُ", reference: "يونس:107" },
        { arabic: "إِنَّ رَبَّكَ وَاسِعُ الْمَغْفِرَةِ", reference: "النجم:32" },
        { arabic: "وَمَن يَغْفِرُ الذُّنُوبَ إِلَّا اللَّهُ", reference: "آل عمران:135" },
      ],
    },
    {
      theme: "guilt",
      sentence: "My regret is heavy until I remember",
      correctExpression: {
        arabic: "وَمَن يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَّحِيمًا",
        reference: "النساء:110",
        translation: "Whoever does evil or wrongs himself then seeks Allah's forgiveness will find Allah Forgiving",
      },
      distractors: [
        { arabic: "وَالَّذِينَ إِذَا فَعَلُوا فَاحِشَةً أَوْ ظَلَمُوا أَنفُسَهُمْ ذَكَرُوا اللَّهَ", reference: "آل عمران:135" },
        { arabic: "إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ", reference: "هود:114" },
        { arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ", reference: "الزمر:53" },
      ],
    },
    {
      theme: "guilt",
      sentence: "To release self-condemnation, I accept",
      correctExpression: {
        arabic: "وَالَّذِينَ إِذَا فَعَلُوا فَاحِشَةً أَوْ ظَلَمُوا أَنفُسَهُمْ ذَكَرُوا اللَّهَ فَاسْتَغْفَرُوا لِذُنُوبِهِمْ",
        reference: "آل عمران:135",
        translation: "Those who when they commit an immorality or wrong themselves remember Allah and seek forgiveness",
      },
      distractors: [
        { arabic: "وَمَن يَغْفِرُ الذُّنُوبَ إِلَّا اللَّهُ", reference: "آل عمران:135" },
        { arabic: "وَتُوبُوا إِلَى اللَّهِ جَمِيعًا", reference: "النور:31" },
        { arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ", reference: "البقرة:222" },
      ],
    },
    {
      theme: "guilt",
      sentence: "When I cannot forgive myself",
      correctExpression: {
        arabic: "إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ",
        reference: "هود:114",
        translation: "Indeed, good deeds remove bad deeds",
      },
      distractors: [
        { arabic: "وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِّنَ اللَّيْلِ", reference: "هود:114" },
        { arabic: "إِنَّ اللَّهَ لَا يَظْلِمُ مِثْقَalَ ذَرَّةٍ", reference: "النساء:40" },
        { arabic: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ", reference: "الزلزلة:7" },
      ],
    },

    // Fear & Courage (5 exercises)
    {
      theme: "fear",
      sentence: "When fear paralyzes me, I say",
      correctExpression: {
        arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        reference: "آل عمران:173",
        translation: "Sufficient for us is Allah, and He is the best Disposer of affairs",
      },
      distractors: [
        { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", reference: "الطلاق:3" },
        { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", reference: "البقرة:153" },
        { arabic: "لَا تَخَافُوا وَلَا تَحْزَنُوا", reference: "آل عمران:139" },
      ],
    },
    {
      theme: "fear",
      sentence: "My courage comes from knowing",
      correctExpression: {
        arabic: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
        reference: "التوبة:40",
        translation: "Do not grieve; indeed Allah is with us",
      },
      distractors: [
        { arabic: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا", reference: "النحل:128" },
        { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", reference: "الحديد:4" },
        { arabic: "فَلَا تَخَافُوهُمْ وَخَافُونِ", reference: "آل عمران:175" },
      ],
    },
    {
      theme: "fear",
      sentence: "Facing the unknown, I hold onto",
      correctExpression: {
        arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
        reference: "الطلاق:2",
        translation: "And whoever fears Allah, He will make for him a way out",
      },
      distractors: [
        { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", reference: "الطلاق:3" },
        { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", reference: "الشرح:6" },
        { arabic: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ", reference: "الطلاق:3" },
      ],
    },
    {
      theme: "fear",
      sentence: "Terror grips me until I recall",
      correctExpression: {
        arabic: "لَا تَخَافُوا وَلَا تَحْزَنُوا",
        reference: "آل عمران:139",
        translation: "Do not fear and do not grieve",
      },
      distractors: [
        { arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا", reference: "آل عمران:139" },
        { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", reference: "البقرة:153" },
        { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", reference: "آل عمران:173" },
      ],
    },
    {
      theme: "fear",
      sentence: "My bravery is rooted in",
      correctExpression: {
        arabic: "فَلَا تَخْشَوُا النَّاسَ وَاخْشَوْنِ",
        reference: "المائدة:44",
        translation: "So do not fear the people but fear Me",
      },
      distractors: [
        { arabic: "فَلَا تَخَافُوهُمْ وَخَافُونِ إِن كُنتُم مُّؤْمِنِينَ", reference: "آل عمران:175" },
        { arabic: "إِنَّمَا ذَٰلِكُمُ الشَّيْطَانُ يُخَوِّفُ أَوْلِيَاءَهُ", reference: "آل عمران:175" },
        { arabic: "وَإِيَّايَ فَارْهَبُونِ", reference: "البقرة:40" },
      ],
    },

    // Grief & Loss (5 exercises)
    {
      theme: "grief",
      sentence: "After losing someone dear, I find comfort in",
      correctExpression: {
        arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
        reference: "البقرة:156",
        translation: "Indeed we belong to Allah, and indeed to Him we will return",
      },
      distractors: [
        { arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", reference: "آل عمران:185" },
        { arabic: "وَبَشِّرِ الصَّابِرِينَ", reference: "البقرة:155" },
        { arabic: "الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ", reference: "البقرة:156" },
      ],
    },
    {
      theme: "grief",
      sentence: "My heart breaks, but I trust",
      correctExpression: {
        arabic: "وَبَشِّرِ الصَّابِرِينَ",
        reference: "البقرة:155",
        translation: "And give good tidings to the patient",
      },
      distractors: [
        { arabic: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ", reference: "الزمر:10" },
        { arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", reference: "البقرة:45" },
        { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", reference: "البقرة:153" },
      ],
    },
    {
      theme: "grief",
      sentence: "In mourning, I understand",
      correctExpression: {
        arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
        reference: "آل عمران:185",
        translation: "Every soul will taste death",
      },
      distractors: [
        { arabic: "وَمَا تَدْرِي نَفْسٌ مَّاذَا تَكْسِبُ غَدًا", reference: "لقمان:34" },
        { arabic: "أَيْنَمَا تَكُونُوا يُدْرِككُّمُ الْمَوْتُ", reference: "النساء:78" },
        { arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", reference: "البقرة:156" },
      ],
    },
    {
      theme: "grief",
      sentence: "Loss teaches me the value of",
      correctExpression: {
        arabic: "الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
        reference: "البقرة:156",
        translation: "Who, when disaster strikes them, say: Indeed we belong to Allah",
      },
      distractors: [
        { arabic: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ", reference: "البقرة:155" },
        { arabic: "وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ", reference: "البقرة:155" },
        { arabic: "وَبَشِّرِ الصَّابِرِينَ", reference: "البقرة:155" },
      ],
    },
    {
      theme: "grief",
      sentence: "Through sorrow, I learn",
      correctExpression: {
        arabic: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ",
        reference: "البقرة:155",
        translation: "We will test you with fear, hunger, loss of wealth, lives and fruits",
      },
      distractors: [
        { arabic: "أَمْ حَسِبْتُمْ أَن تَدْخُلُوا الْجَنَّةَ", reference: "البقرة:214" },
        { arabic: "وَلَقَدْ فَتَنَّا الَّذِينَ مِن قَبْلِهِمْ", reference: "العنكبوت:3" },
        { arabic: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ", reference: "الزمر:10" },
      ],
    },

    // Hope & Optimism (5 exercises)
    {
      theme: "hope",
      sentence: "When all seems lost, I cling to",
      correctExpression: {
        arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
        reference: "يوسف:87",
        translation: "Do not despair of Allah's mercy; none despair except disbelievers",
      },
      distractors: [
        { arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ", reference: "الزمر:53" },
        { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", reference: "الشرح:5" },
        { arabic: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ", reference: "الأعراف:56" },
      ],
    },
    {
      theme: "hope",
      sentence: "My optimism is built on",
      correctExpression: {
        arabic: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ",
        reference: "الأعراف:56",
        translation: "Indeed, the mercy of Allah is near to the doers of good",
      },
      distractors: [
        { arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ", reference: "الأعراف:156" },
        { arabic: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", reference: "التوبة:120" },
        { arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", reference: "البقرة:195" },
      ],
    },
    {
      theme: "hope",
      sentence: "Despite setbacks, I believe",
      correctExpression: {
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
        reference: "الشرح:5-6",
        translation: "For indeed, with hardship comes ease; indeed, with hardship comes ease",
      },
      distractors: [
        { arabic: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ", reference: "البقرة:216" },
        { arabic: "سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا", reference: "الطلاق:7" },
        { arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", reference: "البقرة:286" },
      ],
    },
    {
      theme: "hope",
      sentence: "My faith in better days rests on",
      correctExpression: {
        arabic: "سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا",
        reference: "الطلاق:7",
        translation: "Allah will bring about ease after hardship",
      },
      distractors: [
        { arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مِنْ أَمْرِهِ يُسْرًا", reference: "الطلاق:4" },
        { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", reference: "الشرح:5" },
        { arabic: "يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ", reference: "البقرة:185" },
      ],
    },
    {
      theme: "hope",
      sentence: "Even in darkness, I trust",
      correctExpression: {
        arabic: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ ۖ وَعَسَىٰ أَن تُحِبُّوا شَيْئًا وَهُوَ شَرٌّ لَّكُمْ",
        reference: "البقرة:216",
        translation: "Perhaps you dislike a thing and it is good for you; perhaps you like a thing and it is bad",
      },
      distractors: [
        { arabic: "وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ", reference: "البقرة:216" },
        { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", reference: "الشرح:6" },
        { arabic: "وَمَا تَدْرِي نَفْسٌ مَّاذَا تَكْسِبُ غَدًا", reference: "لقمان:34" },
      ],
    },

    // Acceptance & Surrender (5 exercises)
    {
      theme: "acceptance",
      sentence: "I release control and embrace",
      correctExpression: {
        arabic: "قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا",
        reference: "التوبة:51",
        translation: "Say: Nothing will happen to us except what Allah has decreed for us",
      },
      distractors: [
        { arabic: "مَا أَصَابَ مِن مُّصِيبَةٍ إِلَّا بِإِذْنِ اللَّهِ", reference: "التغابن:11" },
        { arabic: "وَمَا تَشَاءُونَ إِلَّا أَن يَشَاءَ اللَّهُ", reference: "الإنسان:30" },
        { arabic: "مَا أَصَابَ مِن مُّصِيبَةٍ فِي الْأَرْضِ وَلَا فِي أَنفُسِكُمْ إِلَّا فِي كِتَابٍ", reference: "الحديد:22" },
      ],
    },
    {
      theme: "acceptance",
      sentence: "When things don't go my way, I remember",
      correctExpression: {
        arabic: "مَا أَصَابَ مِن مُّصِيبَةٍ إِلَّا بِإِذْنِ اللَّهِ",
        reference: "التغابن:11",
        translation: "No disaster strikes except by Allah's permission",
      },
      distractors: [
        { arabic: "وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ", reference: "التغابن:11" },
        { arabic: "وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ", reference: "التغابن:11" },
        { arabic: "قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا", reference: "التوبة:51" },
      ],
    },
    {
      theme: "acceptance",
      sentence: "My resistance fades when I accept",
      correctExpression: {
        arabic: "مَا أَصَابَ مِن مُّصِيبَةٍ فِي الْأَرْضِ وَلَا فِي أَنفُسِكُمْ إِلَّا فِي كِتَابٍ مِّن قَبْلِ أَن نَّبْرَأَهَا",
        reference: "الحديد:22",
        translation: "No disaster strikes except what is written in a record before We bring it into being",
      },
      distractors: [
        { arabic: "إِنَّ ذَٰلِكَ عَلَى اللَّهِ يَسِيرٌ", reference: "الحديد:22" },
        { arabic: "لِّكَيْلَا تَأْسَوْا عَلَىٰ مَا فَاتَكُمْ", reference: "الحديد:23" },
        { arabic: "وَلَا تَفْرَحُوا بِمَا آتَاكُمْ", reference: "الحديد:23" },
      ],
    },
    {
      theme: "acceptance",
      sentence: "To find peace with fate, I recite",
      correctExpression: {
        arabic: "لِّكَيْلَا تَأْسَوْا عَلَىٰ مَا فَاتَكُمْ وَلَا تَفْرَحُوا بِمَا آتَاكُمْ",
        reference: "الحديد:23",
        translation: "In order that you not despair over what has eluded you and not exult in what He has given you",
      },
      distractors: [
        { arabic: "مَا أَصَابَ مِن مُّصِيبَةٍ فِي الْأَرْضِ وَلَا فِي أَنفُسِكُمْ", reference: "الحديد:22" },
        { arabic: "وَاللَّهُ لَا يُحِبُّ كُلَّ مُخْتَالٍ فَخُورٍ", reference: "الحديد:23" },
        { arabic: "قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا", reference: "التوبة:51" },
      ],
    },
    {
      theme: "acceptance",
      sentence: "True surrender means",
      correctExpression: {
        arabic: "وَمَا تَشَاءُونَ إِلَّا أَن يَشَاءَ اللَّهُ",
        reference: "الإنسان:30",
        translation: "And you do not will except that Allah wills",
      },
      distractors: [
        { arabic: "إِنَّ اللَّهَ كَانَ عَلِيمًا حَكِيمًا", reference: "الإنسان:30" },
        { arabic: "مَا أَصَابَ مِن مُّصِيبَةٍ إِلَّا بِإِذْنِ اللَّهِ", reference: "التغابن:11" },
        { arabic: "وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ", reference: "التغابن:11" },
      ],
    },

    // Healing & Recovery (5 exercises)
    {
      theme: "healing",
      sentence: "For my wounded soul, I seek",
      correctExpression: {
        arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
        reference: "الإسراء:82",
        translation: "We send down the Quran that which is healing and mercy for the believers",
      },
      distractors: [
        { arabic: "يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ", reference: "يونس:57" },
        { arabic: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ", reference: "الشعراء:80" },
        { arabic: "فِيهِ شِفَاءٌ لِّلنَّاسِ", reference: "النحل:69" },
      ],
    },
    {
      theme: "healing",
      sentence: "Emotional wounds mend through",
      correctExpression: {
        arabic: "يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ لِّمَا فِي الصُّدُورِ",
        reference: "يونس:57",
        translation: "O mankind, there has come to you instruction and healing for what is in the breasts",
      },
      distractors: [
        { arabic: "وَهُدًى وَرَحْمَةٌ لِّلْمُؤْمِنِينَ", reference: "يونس:57" },
        { arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ", reference: "الإسراء:82" },
        { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", reference: "الرعد:28" },
      ],
    },
    {
      theme: "healing",
      sentence: "My recovery journey is guided by",
      correctExpression: {
        arabic: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ",
        reference: "الشعراء:80",
        translation: "And when I am ill, it is He who cures me",
      },
      distractors: [
        { arabic: "وَالَّذِي يُمِيتُنِي ثُمَّ يُحْيِينِ", reference: "الشعراء:81" },
        { arabic: "الَّذِي خَلَقَنِي فَهُوَ يَهْدِينِ", reference: "الشعراء:78" },
        { arabic: "وَالَّذِي هُوَ يُطْعِمُنِي وَيَسْقِينِ", reference: "الشعراء:79" },
      ],
    },
    {
      theme: "healing",
      sentence: "Time and trust restore me because",
      correctExpression: {
        arabic: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ",
        reference: "الأنعام:17",
        translation: "If Allah should touch you with adversity, there is no remover of it except Him",
      },
      distractors: [
        { arabic: "وَإِن يَمْسَسْكَ بِخَيْرٍ فَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", reference: "الأنعام:17" },
        { arabic: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ", reference: "الشعراء:80" },
        { arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ", reference: "الإسراء:82" },
      ],
    },
    {
      theme: "healing",
      sentence: "My scars teach me",
      correctExpression: {
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        reference: "الشرح:5",
        translation: "For indeed, with hardship comes ease",
      },
      distractors: [
        { arabic: "وَرَفَعْنَا لَكَ ذِكْرَكَ", reference: "الشرح:4" },
        { arabic: "وَوَضَعْنَا عَنكَ وِزْرَكَ", reference: "الشرح:2" },
        { arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", reference: "الشرح:1" },
      ],
    },
  ];

  let createdCount = 0;
  let totalExercises = 0;

  for (const exercise of exercises) {
    try {
      // Create the correct Quranic expression
      const words = exercise.correctExpression.arabic.split(" ").filter(w => w.length > 0);
      const [correctQuranicExpression] = await db
        .insert(quranicExpressions)
        .values({
          id: randomUUID(),
          arabicText: exercise.correctExpression.arabic,
          surahAyah: exercise.correctExpression.reference,
          theme: exercise.theme,
          meaning: exercise.correctExpression.translation,
          usageContext: `Psychological guidance for ${exercise.theme}`,
          wordCount: words.length,
        })
        .returning();

      // Create distractor expressions
      const distractorRecords = [];
      for (const distractor of exercise.distractors) {
        const distractorWords = distractor.arabic.split(" ").filter(w => w.length > 0);
        const [distractorRecord] = await db
          .insert(quranicExpressions)
          .values({
            id: randomUUID(),
            arabicText: distractor.arabic,
            surahAyah: distractor.reference,
            theme: exercise.theme,
            usageContext: "Alternative expression",
            wordCount: distractorWords.length,
          })
          .returning();
        distractorRecords.push(distractorRecord);
      }

      // Create the daily sentence
      const [dailySentence] = await db
        .insert(dailySentences)
        .values({
          id: randomUUID(),
          englishText: exercise.sentence,
          theme: exercise.theme,
          difficulty: 1,
        })
        .returning();

      // Create the exercise with exactly 3 distractors
      await db.insert(dailySentenceExercises).values({
        id: randomUUID(),
        dailySentenceId: dailySentence.id,
        correctExpressionId: correctQuranicExpression.id,
        distractorIds: distractorRecords.map((d) => d.id),
        explanation: `This verse addresses ${exercise.theme} from a psychological perspective, offering spiritual guidance for emotional well-being.`,
        learningNote: `Understanding the nuances and hints in this verse helps develop emotional intelligence and spiritual resilience.`,
      });

      createdCount++;
      totalExercises++;
      console.log(`✓ Exercise ${createdCount}/50 created (${exercise.theme})`);
    } catch (error) {
      console.error(`✗ Error creating exercise ${createdCount + 1}:`, error);
    }
  }

  console.log(`\n🎉 Successfully created ${createdCount}/50 psychological exercises!`);

  // Get total count
  const allExercises = await db.select().from(dailySentenceExercises);
  console.log(`📊 Total exercises now in database: ${allExercises.length}`);
}

seedPsychologicalExercises()
  .then(() => {
    console.log("✅ Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
