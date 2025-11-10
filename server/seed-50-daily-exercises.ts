import { db } from "./db";
import { dailySentences, quranicExpressions, dailySentenceExercises } from "@shared/schema";
import { sql } from "drizzle-orm";

async function seed50Exercises() {
  console.log("🌱 Seeding 50 daily contextual exercises...\n");

  const exercises = [
    // GRATITUDE Theme (5 exercises)
    {
      sentence: { englishText: "I feel grateful for the blessings in my life", theme: "gratitude", difficulty: 1 },
      correct: { arabicText: "الحمد لله", surahAyah: "الفاتحة:2", theme: "gratitude", meaning: "Praise be to Allah", usageContext: "Expressing gratitude", wordCount: 2 },
      distractors: [
        { arabicText: "إنا لله وإنا إليه راجعون", surahAyah: "البقرة:156", theme: "patience", meaning: "We belong to Allah", usageContext: "In times of loss", wordCount: 5 },
        { arabicText: "حسبنا الله ونعم الوكيل", surahAyah: "آل عمران:173", theme: "trust", meaning: "Allah is sufficient", usageContext: "Expressing trust", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I want to thank Allah for this opportunity", theme: "gratitude", difficulty: 2 },
      correct: { arabicText: "وقل الحمد لله", surahAyah: "الإسراء:111", theme: "gratitude", meaning: "And say: Praise be to Allah", usageContext: "Thanking Allah", wordCount: 3 },
      distractors: [
        { arabicText: "لا إله إلا أنت", surahAyah: "الأنبياء:87", theme: "worship", meaning: "There is no deity except You", usageContext: "Seeking forgiveness", wordCount: 4 },
        { arabicText: "ولا تيأسوا من روح الله", surahAyah: "يوسف:87", theme: "hope", meaning: "Do not despair of Allah's mercy", usageContext: "Encouraging hope", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I appreciate all the good things around me", theme: "gratitude", difficulty: 2 },
      correct: { arabicText: "فبأي آلاء ربكما تكذبان", surahAyah: "الرحمن:13", theme: "gratitude", meaning: "Which blessings will you deny", usageContext: "Reflecting on blessings", wordCount: 4 },
      distractors: [
        { arabicText: "إن مع العسر يسرا", surahAyah: "الشرح:6", theme: "hope", meaning: "With hardship comes ease", usageContext: "During difficulties", wordCount: 4 },
        { arabicText: "واصبر لحكم ربك", surahAyah: "الطور:48", theme: "patience", meaning: "Be patient with your Lord's decree", usageContext: "Practicing patience", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I'm thankful this situation turned out well", theme: "gratitude", difficulty: 1 },
      correct: { arabicText: "والحمد لله رب العالمين", surahAyah: "الفاتحة:2", theme: "gratitude", meaning: "All praise to Allah, Lord of all worlds", usageContext: "Complete gratitude", wordCount: 4 },
      distractors: [
        { arabicText: "فاصبر إن وعد الله حق", surahAyah: "الروم:60", theme: "patience", meaning: "Be patient, Allah's promise is true", usageContext: "Encouraging patience", wordCount: 5 },
        { arabicText: "وما النصر إلا من عند الله", surahAyah: "آل عمران:126", theme: "trust", meaning: "Victory comes only from Allah", usageContext: "Trusting Allah", wordCount: 6 }
      ]
    },
    {
      sentence: { englishText: "I recognize my blessings every day", theme: "gratitude", difficulty: 2 },
      correct: { arabicText: "لئن شكرتم لأزيدنكم", surahAyah: "إبراهيم:7", theme: "gratitude", meaning: "If you are grateful, I will increase you", usageContext: "Promise of more blessings", wordCount: 3 },
      distractors: [
        { arabicText: "وتوكل على الله", surahAyah: "الأحزاب:3", theme: "trust", meaning: "And rely upon Allah", usageContext: "Placing trust", wordCount: 3 },
        { arabicText: "ولا تقنطوا من رحمة الله", surahAyah: "الزمر:53", theme: "hope", meaning: "Do not despair of Allah's mercy", usageContext: "Maintaining hope", wordCount: 5 }
      ]
    },

    // PATIENCE Theme (5 exercises)
    {
      sentence: { englishText: "I will be patient with this difficult situation", theme: "patience", difficulty: 1 },
      correct: { arabicText: "فاصبر صبرا جميلا", surahAyah: "المعارج:5", theme: "patience", meaning: "So be patient with gracious patience", usageContext: "During hardship", wordCount: 3 },
      distractors: [
        { arabicText: "الله خير حافظا", surahAyah: "يوسف:64", theme: "trust", meaning: "Allah is the best guardian", usageContext: "Seeking protection", wordCount: 3 },
        { arabicText: "فإن مع العسر يسرا", surahAyah: "الشرح:5", theme: "hope", meaning: "Indeed with hardship comes ease", usageContext: "Finding hope", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "This test requires my patience", theme: "patience", difficulty: 2 },
      correct: { arabicText: "واصبر وما صبرك إلا بالله", surahAyah: "النحل:127", theme: "patience", meaning: "Be patient, your patience is only by Allah", usageContext: "Seeking Allah's help", wordCount: 6 },
      distractors: [
        { arabicText: "وتوب إلى الله جميعا", surahAyah: "النور:31", theme: "repentance", meaning: "Turn to Allah in repentance", usageContext: "Seeking forgiveness", wordCount: 4 },
        { arabicText: "قل حسبي الله", surahAyah: "التوبة:129", theme: "trust", meaning: "Say: Allah is sufficient for me", usageContext: "Relying on Allah", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I need to stay calm during this trial", theme: "patience", difficulty: 1 },
      correct: { arabicText: "إن الله مع الصابرين", surahAyah: "البقرة:153", theme: "patience", meaning: "Indeed Allah is with the patient", usageContext: "Encouragement in patience", wordCount: 4 },
      distractors: [
        { arabicText: "الله ولي الذين آمنوا", surahAyah: "البقرة:257", theme: "trust", meaning: "Allah is the ally of believers", usageContext: "Divine support", wordCount: 4 },
        { arabicText: "فاذكروا الله كثيرا", surahAyah: "الأنفال:45", theme: "remembrance", meaning: "Remember Allah abundantly", usageContext: "Constant remembrance", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I must endure this with grace", theme: "patience", difficulty: 2 },
      correct: { arabicText: "واصبر لحكم ربك", surahAyah: "الطور:48", theme: "patience", meaning: "Be patient with your Lord's decree", usageContext: "Accepting Allah's will", wordCount: 3 },
      distractors: [
        { arabicText: "وأقيموا الصلاة", surahAyah: "البقرة:43", theme: "worship", meaning: "Establish prayer", usageContext: "Religious duty", wordCount: 2 },
        { arabicText: "استغفروا ربكم", surahAyah: "نوح:10", theme: "repentance", meaning: "Seek forgiveness from your Lord", usageContext: "Asking forgiveness", wordCount: 2 }
      ]
    },
    {
      sentence: { englishText: "Patience will help me through this", theme: "patience", difficulty: 1 },
      correct: { arabicText: "والعاقبة للمتقين", surahAyah: "الأعراف:128", theme: "patience", meaning: "The outcome belongs to the righteous", usageContext: "Promise of reward", wordCount: 2 },
      distractors: [
        { arabicText: "لا تقنطوا من رحمة الله", surahAyah: "الزمر:53", theme: "hope", meaning: "Do not despair of Allah's mercy", usageContext: "Maintaining hope", wordCount: 5 },
        { arabicText: "والله على كل شيء قدير", surahAyah: "البقرة:20", theme: "power", meaning: "Allah is capable of everything", usageContext: "Divine omnipotence", wordCount: 5 }
      ]
    },

    // TRUST Theme (5 exercises)
    {
      sentence: { englishText: "I trust in God's plan for me", theme: "trust", difficulty: 1 },
      correct: { arabicText: "حسبنا الله ونعم الوكيل", surahAyah: "آل عمران:173", theme: "trust", meaning: "Allah is sufficient and best disposer", usageContext: "Complete trust", wordCount: 4 },
      distractors: [
        { arabicText: "الحمد لله رب العالمين", surahAyah: "الفاتحة:2", theme: "gratitude", meaning: "Praise to Allah Lord of worlds", usageContext: "Expressing gratitude", wordCount: 4 },
        { arabicText: "يا أيها الذين آمنوا اصبروا", surahAyah: "آل عمران:200", theme: "patience", meaning: "O believers be patient", usageContext: "Call to patience", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I rely completely on Allah", theme: "trust", difficulty: 1 },
      correct: { arabicText: "وتوكل على الله", surahAyah: "الأحزاب:3", theme: "trust", meaning: "And rely upon Allah", usageContext: "Placing trust", wordCount: 3 },
      distractors: [
        { arabicText: "وقل رب زدني علما", surahAyah: "طه:114", theme: "knowledge", meaning: "Say: My Lord increase my knowledge", usageContext: "Seeking knowledge", wordCount: 4 },
        { arabicText: "سبحان الله العظيم", surahAyah: "derived", theme: "glorification", meaning: "Glory to Allah the Great", usageContext: "Praising Allah", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "Allah will take care of this situation", theme: "trust", difficulty: 2 },
      correct: { arabicText: "وكفى بالله وكيلا", surahAyah: "النساء:81", theme: "trust", meaning: "Allah is sufficient as disposer", usageContext: "Trusting Allah's management", wordCount: 3 },
      distractors: [
        { arabicText: "فاصبر إن العاقبة للمتقين", surahAyah: "هود:49", theme: "patience", meaning: "Be patient, the outcome is for the righteous", usageContext: "Encouraging patience", wordCount: 5 },
        { arabicText: "واستعينوا بالصبر والصلاة", surahAyah: "البقرة:45", theme: "guidance", meaning: "Seek help through patience and prayer", usageContext: "Divine assistance", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I put my affairs in Allah's hands", theme: "trust", difficulty: 2 },
      correct: { arabicText: "وأفوض أمري إلى الله", surahAyah: "غافر:44", theme: "trust", meaning: "I entrust my affair to Allah", usageContext: "Complete reliance", wordCount: 4 },
      distractors: [
        { arabicText: "ربنا آتنا في الدنيا حسنة", surahAyah: "البقرة:201", theme: "supplication", meaning: "Our Lord give us good in this world", usageContext: "Making dua", wordCount: 5 },
        { arabicText: "إنا لله وإنا إليه راجعون", surahAyah: "البقرة:156", theme: "patience", meaning: "We belong to Allah", usageContext: "During calamity", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "God knows what's best for me", theme: "trust", difficulty: 1 },
      correct: { arabicText: "والله أعلم", surahAyah: "البقرة:216", theme: "trust", meaning: "And Allah knows best", usageContext: "Acknowledging divine wisdom", wordCount: 2 },
      distractors: [
        { arabicText: "فصبر جميل", surahAyah: "يوسف:18", theme: "patience", meaning: "So beautiful patience", usageContext: "Expressing patience", wordCount: 2 },
        { arabicText: "لا حول ولا قوة إلا بالله", surahAyah: "الكهف:39", theme: "reliance", meaning: "No power except by Allah", usageContext: "Acknowledging dependence", wordCount: 6 }
      ]
    },

    // WISDOM Theme (5 exercises)
    {
      sentence: { englishText: "I seek wisdom in this decision", theme: "wisdom", difficulty: 2 },
      correct: { arabicText: "وقل رب زدني علما", surahAyah: "طه:114", theme: "wisdom", meaning: "Say: My Lord increase me in knowledge", usageContext: "Seeking knowledge", wordCount: 4 },
      distractors: [
        { arabicText: "واستعينوا بالصبر", surahAyah: "البقرة:45", theme: "patience", meaning: "Seek help through patience", usageContext: "During hardship", wordCount: 2 },
        { arabicText: "الله نور السماوات والأرض", surahAyah: "النور:35", theme: "light", meaning: "Allah is light of heavens and earth", usageContext: "Divine illumination", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I need Allah's guidance on this matter", theme: "wisdom", difficulty: 2 },
      correct: { arabicText: "رب اشرح لي صدري", surahAyah: "طه:25", theme: "wisdom", meaning: "My Lord expand my chest", usageContext: "Seeking clarity", wordCount: 4 },
      distractors: [
        { arabicText: "وتوب إلينا", surahAyah: "البقرة:128", theme: "repentance", meaning: "And accept our repentance", usageContext: "Seeking forgiveness", wordCount: 2 },
        { arabicText: "وأنت خير الوارثين", surahAyah: "الأنبياء:89", theme: "supplication", meaning: "You are best of inheritors", usageContext: "Trusting Allah's provision", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "This requires thoughtful consideration", theme: "wisdom", difficulty: 3 },
      correct: { arabicText: "ويعلمكم ما لم تكونوا تعلمون", surahAyah: "البقرة:239", theme: "wisdom", meaning: "He teaches you what you did not know", usageContext: "Divine teaching", wordCount: 5 },
      distractors: [
        { arabicText: "واذكر ربك كثيرا", surahAyah: "آل عمران:41", theme: "remembrance", meaning: "Remember your Lord abundantly", usageContext: "Constant remembrance", wordCount: 3 },
        { arabicText: "وسبح بحمد ربك", surahAyah: "الحجر:98", theme: "glorification", meaning: "Glorify with praise of your Lord", usageContext: "Praising Allah", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I reflect on the lessons from this experience", theme: "wisdom", difficulty: 2 },
      correct: { arabicText: "أفلا يتدبرون القرآن", surahAyah: "النساء:82", theme: "wisdom", meaning: "Do they not ponder the Quran", usageContext: "Encouraging reflection", wordCount: 3 },
      distractors: [
        { arabicText: "إن الله لا يغير ما بقوم", surahAyah: "الرعد:11", theme: "change", meaning: "Allah does not change what is in a people", usageContext: "Personal responsibility", wordCount: 6 },
        { arabicText: "فذكر إن نفعت الذكرى", surahAyah: "الأعلى:9", theme: "reminder", meaning: "So remind if reminder benefits", usageContext: "Giving advice", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "Understanding comes from Allah alone", theme: "wisdom", difficulty: 2 },
      correct: { arabicText: "وعلمك ما لم تكن تعلم", surahAyah: "النساء:113", theme: "wisdom", meaning: "He taught you what you did not know", usageContext: "Acknowledging divine knowledge", wordCount: 5 },
      distractors: [
        { arabicText: "فسبح بحمد ربك", surahAyah: "النصر:3", theme: "glorification", meaning: "Glorify with praise of your Lord", usageContext: "Praising Allah", wordCount: 3 },
        { arabicText: "واستغفر الله", surahAyah: "النصر:3", theme: "repentance", meaning: "And seek forgiveness of Allah", usageContext: "Asking forgiveness", wordCount: 2 }
      ]
    },

    // GUIDANCE Theme (5 exercises)
    {
      sentence: { englishText: "I need Allah's guidance today", theme: "guidance", difficulty: 1 },
      correct: { arabicText: "اهدنا الصراط المستقيم", surahAyah: "الفاتحة:6", theme: "guidance", meaning: "Guide us to the straight path", usageContext: "Seeking guidance", wordCount: 3 },
      distractors: [
        { arabicText: "آمنا بالله", surahAyah: "آل عمران:193", theme: "faith", meaning: "We believed in Allah", usageContext: "Declaring faith", wordCount: 2 },
        { arabicText: "سمعنا وأطعنا", surahAyah: "البقرة:285", theme: "obedience", meaning: "We hear and obey", usageContext: "Showing obedience", wordCount: 2 }
      ]
    },
    {
      sentence: { englishText: "Help me stay on the right path", theme: "guidance", difficulty: 1 },
      correct: { arabicText: "وإنك لتهدي إلى صراط مستقيم", surahAyah: "الشورى:52", theme: "guidance", meaning: "You guide to straight path", usageContext: "Divine guidance", wordCount: 5 },
      distractors: [
        { arabicText: "وتوكلت على الله", surahAyah: "المائدة:11", theme: "trust", meaning: "I relied upon Allah", usageContext: "Placing trust", wordCount: 3 },
        { arabicText: "وأقيموا الصلاة وآتوا الزكاة", surahAyah: "البقرة:43", theme: "worship", meaning: "Establish prayer and give zakah", usageContext: "Religious duties", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I seek the right direction in life", theme: "guidance", difficulty: 2 },
      correct: { arabicText: "ومن يعتصم بالله", surahAyah: "آل عمران:101", theme: "guidance", meaning: "Whoever holds firmly to Allah", usageContext: "Seeking protection", wordCount: 3 },
      distractors: [
        { arabicText: "ربنا أفرغ علينا صبرا", surahAyah: "البقرة:250", theme: "patience", meaning: "Our Lord pour upon us patience", usageContext: "Asking for patience", wordCount: 4 },
        { arabicText: "ربنا اغفر لنا ذنوبنا", surahAyah: "آل عمران:16", theme: "forgiveness", meaning: "Our Lord forgive our sins", usageContext: "Seeking forgiveness", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "Show me the way forward", theme: "guidance", difficulty: 2 },
      correct: { arabicText: "ربنا آتنا من لدنك رحمة", surahAyah: "الكهف:10", theme: "guidance", meaning: "Our Lord grant us mercy from Yourself", usageContext: "Seeking divine mercy", wordCount: 5 },
      distractors: [
        { arabicText: "فاعف عنا واغفر لنا", surahAyah: "البقرة:286", theme: "forgiveness", meaning: "Pardon us and forgive us", usageContext: "Seeking pardon", wordCount: 4 },
        { arabicText: "ربنا لا تزغ قلوبنا", surahAyah: "آل عمران:8", theme: "supplication", meaning: "Our Lord do not deviate our hearts", usageContext: "Seeking steadfastness", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I pray for clarity in my choices", theme: "guidance", difficulty: 2 },
      correct: { arabicText: "رب اشرح لي صدري ويسر لي أمري", surahAyah: "طه:25-26", theme: "guidance", meaning: "My Lord expand my chest and ease my task", usageContext: "Seeking facilitation", wordCount: 6 },
      distractors: [
        { arabicText: "ربنا تقبل منا", surahAyah: "البقرة:127", theme: "acceptance", meaning: "Our Lord accept from us", usageContext: "Seeking acceptance", wordCount: 3 },
        { arabicText: "ربنا واجعلنا مسلمين لك", surahAyah: "البقرة:128", theme: "submission", meaning: "Our Lord make us Muslims to You", usageContext: "Seeking submission", wordCount: 4 }
      ]
    },

    // FAMILY Theme (5 exercises)
    {
      sentence: { englishText: "I pray for harmony in my family", theme: "family", difficulty: 2 },
      correct: { arabicText: "ربنا هب لنا من أزواجنا", surahAyah: "الفرقان:74", theme: "family", meaning: "Our Lord grant us from our spouses", usageContext: "Praying for family", wordCount: 5 },
      distractors: [
        { arabicText: "واعبدوا الله ولا تشركوا به", surahAyah: "النساء:36", theme: "worship", meaning: "Worship Allah and associate nothing with Him", usageContext: "Pure worship", wordCount: 5 },
        { arabicText: "وقل رب ارحمهما", surahAyah: "الإسراء:24", theme: "mercy", meaning: "Say: My Lord have mercy upon them", usageContext: "For parents", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "May Allah bless my household", theme: "family", difficulty: 1 },
      correct: { arabicText: "رحمة الله وبركاته عليكم", surahAyah: "هود:73", theme: "family", meaning: "Allah's mercy and blessings upon you", usageContext: "Blessing greeting", wordCount: 4 },
      distractors: [
        { arabicText: "سلام عليكم", surahAyah: "الأنعام:54", theme: "greeting", meaning: "Peace be upon you", usageContext: "General greeting", wordCount: 2 },
        { arabicText: "بسم الله الرحمن الرحيم", surahAyah: "الفاتحة:1", theme: "beginning", meaning: "In name of Allah Most Merciful", usageContext: "Starting actions", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I want to be a good parent", theme: "family", difficulty: 2 },
      correct: { arabicText: "رب اجعلني مقيم الصلاة", surahAyah: "إبراهيم:40", theme: "family", meaning: "My Lord make me establisher of prayer", usageContext: "Personal improvement", wordCount: 4 },
      distractors: [
        { arabicText: "وأصلح لي في ذريتي", surahAyah: "الأحقاف:15", theme: "family", meaning: "And make righteous my offspring", usageContext: "For children", wordCount: 4 },
        { arabicText: "ربنا آتنا في الدنيا حسنة", surahAyah: "البقرة:201", theme: "supplication", meaning: "Our Lord give us good in this world", usageContext: "General dua", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "May my children be righteous", theme: "family", difficulty: 2 },
      correct: { arabicText: "رب أوزعني أن أشكر نعمتك", surahAyah: "النمل:19", theme: "family", meaning: "My Lord enable me to be grateful", usageContext: "Gratitude for blessings", wordCount: 5 },
      distractors: [
        { arabicText: "ربنا اغفر لنا ولإخواننا", surahAyah: "الحشر:10", theme: "forgiveness", meaning: "Our Lord forgive us and our brothers", usageContext: "Communal forgiveness", wordCount: 3 },
        { arabicText: "واجعلنا للمتقين إماما", surahAyah: "الفرقان:74", theme: "leadership", meaning: "Make us an example for righteous", usageContext: "Seeking leadership", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I seek blessings for my spouse", theme: "family", difficulty: 2 },
      correct: { arabicText: "ربنا هب لنا أزواجا", surahAyah: "الفرقان:74", theme: "family", meaning: "Our Lord grant us spouses", usageContext: "Praying for spouse", wordCount: 4 },
      distractors: [
        { arabicText: "ربنا آتنا في الآخرة حسنة", surahAyah: "البقرة:201", theme: "supplication", meaning: "Our Lord give us good in hereafter", usageContext: "Dua for afterlife", wordCount: 5 },
        { arabicText: "واغفر لنا وارحمنا", surahAyah: "البقرة:286", theme: "forgiveness", meaning: "Forgive us and have mercy on us", usageContext: "Seeking mercy", wordCount: 3 }
      ]
    },

    // HOPE Theme (5 exercises)
    {
      sentence: { englishText: "I have hope that things will improve", theme: "hope", difficulty: 1 },
      correct: { arabicText: "إن مع العسر يسرا", surahAyah: "الشرح:6", theme: "hope", meaning: "Indeed with hardship comes ease", usageContext: "During difficulties", wordCount: 4 },
      distractors: [
        { arabicText: "وتوكل على الحي الذي لا يموت", surahAyah: "الفرقان:58", theme: "trust", meaning: "Rely upon the Ever-Living who does not die", usageContext: "Trusting Allah", wordCount: 6 },
        { arabicText: "واستغفروا ربكم ثم توبوا إليه", surahAyah: "هود:3", theme: "repentance", meaning: "Seek forgiveness of your Lord then repent", usageContext: "Seeking forgiveness", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I won't lose hope in Allah's mercy", theme: "hope", difficulty: 2 },
      correct: { arabicText: "ولا تيأسوا من روح الله", surahAyah: "يوسف:87", theme: "hope", meaning: "Do not despair of Allah's mercy", usageContext: "Maintaining hope", wordCount: 5 },
      distractors: [
        { arabicText: "فاصبر إن وعد الله حق", surahAyah: "الروم:60", theme: "patience", meaning: "Be patient, Allah's promise is true", usageContext: "Trusting promise", wordCount: 5 },
        { arabicText: "وقل الحق من ربكم", surahAyah: "الكهف:29", theme: "truth", meaning: "Say: The truth is from your Lord", usageContext: "Declaring truth", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "Better days are coming", theme: "hope", difficulty: 1 },
      correct: { arabicText: "فإن بعد العسر يسرا", surahAyah: "الشرح:5", theme: "hope", meaning: "Indeed after hardship comes ease", usageContext: "Promise of relief", wordCount: 4 },
      distractors: [
        { arabicText: "واذكر اسم ربك", surahAyah: "الإنسان:25", theme: "remembrance", meaning: "Remember name of your Lord", usageContext: "Constant remembrance", wordCount: 3 },
        { arabicText: "وما عند الله خير", surahAyah: "آل عمران:198", theme: "reward", meaning: "What Allah has is better", usageContext: "Preferring hereafter", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I remain optimistic about the future", theme: "hope", difficulty: 2 },
      correct: { arabicText: "لا تقنطوا من رحمة الله", surahAyah: "الزمر:53", theme: "hope", meaning: "Do not despair of Allah's mercy", usageContext: "Divine compassion", wordCount: 5 },
      distractors: [
        { arabicText: "إن الله لا يضيع أجر المحسنين", surahAyah: "التوبة:120", theme: "reward", meaning: "Allah does not waste reward of good-doers", usageContext: "Promise of reward", wordCount: 6 },
        { arabicText: "واتقوا الله", surahAyah: "البقرة:189", theme: "piety", meaning: "And fear Allah", usageContext: "Encouraging piety", wordCount: 2 }
      ]
    },
    {
      sentence: { englishText: "Allah's help is near", theme: "hope", difficulty: 1 },
      correct: { arabicText: "إن نصر الله قريب", surahAyah: "البقرة:214", theme: "hope", meaning: "Indeed Allah's help is near", usageContext: "Imminent relief", wordCount: 4 },
      distractors: [
        { arabicText: "والله على كل شيء قدير", surahAyah: "البقرة:20", theme: "power", meaning: "Allah is over all things competent", usageContext: "Divine power", wordCount: 5 },
        { arabicText: "وسارعوا إلى مغفرة", surahAyah: "آل عمران:133", theme: "forgiveness", meaning: "Hasten to forgiveness", usageContext: "Seeking forgiveness", wordCount: 3 }
      ]
    },

    // MERCY Theme (5 exercises)
    {
      sentence: { englishText: "I seek Allah's mercy and compassion", theme: "mercy", difficulty: 1 },
      correct: { arabicText: "رب ارحمني", surahAyah: "derived", theme: "mercy", meaning: "My Lord have mercy on me", usageContext: "Asking for mercy", wordCount: 2 },
      distractors: [
        { arabicText: "وأنت أرحم الراحمين", surahAyah: "الأنبياء:83", theme: "mercy", meaning: "You are Most Merciful of merciful", usageContext: "Acknowledging mercy", wordCount: 3 },
        { arabicText: "رب اغفر لي", surahAyah: "نوح:28", theme: "forgiveness", meaning: "My Lord forgive me", usageContext: "Seeking forgiveness", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "May Allah be merciful to us all", theme: "mercy", difficulty: 2 },
      correct: { arabicText: "وأنت أرحم الراحمين", surahAyah: "الأنبياء:83", theme: "mercy", meaning: "You are Most Merciful of merciful", usageContext: "Divine attribute", wordCount: 3 },
      distractors: [
        { arabicText: "إن الله غفور رحيم", surahAyah: "البقرة:173", theme: "forgiveness", meaning: "Indeed Allah is Forgiving Merciful", usageContext: "Divine attributes", wordCount: 4 },
        { arabicText: "والله بما تعملون بصير", surahAyah: "البقرة:110", theme: "awareness", meaning: "Allah is Seeing of what you do", usageContext: "Divine knowledge", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I need compassion in my life", theme: "mercy", difficulty: 2 },
      correct: { arabicText: "ورحمتي وسعت كل شيء", surahAyah: "الأعراف:156", theme: "mercy", meaning: "My mercy encompasses all things", usageContext: "Universal mercy", wordCount: 4 },
      distractors: [
        { arabicText: "وما خلقت الجن والإنس", surahAyah: "الذاريات:56", theme: "purpose", meaning: "I did not create jinn and mankind", usageContext: "Purpose of creation", wordCount: 5 },
        { arabicText: "إن الله يحب المتوكلين", surahAyah: "آل عمران:159", theme: "trust", meaning: "Indeed Allah loves those who trust", usageContext: "Divine love", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "Allah's mercy is greater than my sins", theme: "mercy", difficulty: 2 },
      correct: { arabicText: "إن الله يغفر الذنوب جميعا", surahAyah: "الزمر:53", theme: "mercy", meaning: "Indeed Allah forgives all sins", usageContext: "Complete forgiveness", wordCount: 5 },
      distractors: [
        { arabicText: "والله يدعو إلى دار السلام", surahAyah: "يونس:25", theme: "invitation", meaning: "Allah invites to home of peace", usageContext: "Divine call", wordCount: 5 },
        { arabicText: "ومن يتق الله يجعل له مخرجا", surahAyah: "الطلاق:2", theme: "piety", meaning: "Whoever fears Allah He makes way out", usageContext: "Divine promise", wordCount: 6 }
      ]
    },
    {
      sentence: { englishText: "I pray for my parents' mercy", theme: "mercy", difficulty: 2 },
      correct: { arabicText: "وقل رب ارحمهما", surahAyah: "الإسراء:24", theme: "mercy", meaning: "Say: My Lord have mercy upon them", usageContext: "For parents", wordCount: 4 },
      distractors: [
        { arabicText: "ربنا اغفر لنا ولوالدينا", surahAyah: "نوح:28", theme: "forgiveness", meaning: "Our Lord forgive us and our parents", usageContext: "Family forgiveness", wordCount: 3 },
        { arabicText: "رب اجعلني مقيم الصلاة", surahAyah: "إبراهيم:40", theme: "worship", meaning: "My Lord make me establisher of prayer", usageContext: "Personal dua", wordCount: 4 }
      ]
    },

    // REPENTANCE Theme (5 exercises)
    {
      sentence: { englishText: "I seek forgiveness for my mistakes", theme: "repentance", difficulty: 1 },
      correct: { arabicText: "أستغفر الله", surahAyah: "derived", theme: "repentance", meaning: "I seek forgiveness of Allah", usageContext: "Asking forgiveness", wordCount: 2 },
      distractors: [
        { arabicText: "سبحان الله", surahAyah: "derived", theme: "glorification", meaning: "Glory be to Allah", usageContext: "Praising Allah", wordCount: 2 },
        { arabicText: "لا إله إلا الله", surahAyah: "derived", theme: "faith", meaning: "No deity except Allah", usageContext: "Declaration of faith", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I want to turn back to Allah", theme: "repentance", difficulty: 2 },
      correct: { arabicText: "وتوبوا إلى الله جميعا", surahAyah: "النور:31", theme: "repentance", meaning: "Turn to Allah in repentance all together", usageContext: "Collective repentance", wordCount: 4 },
      distractors: [
        { arabicText: "واعبدوا الله ولا تشركوا", surahAyah: "النساء:36", theme: "worship", meaning: "Worship Allah and do not associate", usageContext: "Pure worship", wordCount: 4 },
        { arabicText: "وأنيبوا إلى ربكم", surahAyah: "الزمر:54", theme: "repentance", meaning: "Turn in repentance to your Lord", usageContext: "Returning to Allah", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "May Allah forgive my sins", theme: "repentance", difficulty: 1 },
      correct: { arabicText: "ربنا اغفر لنا ذنوبنا", surahAyah: "آل عمران:16", theme: "repentance", meaning: "Our Lord forgive us our sins", usageContext: "Seeking forgiveness", wordCount: 4 },
      distractors: [
        { arabicText: "ربنا آتنا في الدنيا حسنة", surahAyah: "البقرة:201", theme: "supplication", meaning: "Our Lord give us good in this world", usageContext: "General dua", wordCount: 5 },
        { arabicText: "ربنا لا تؤاخذنا", surahAyah: "البقرة:286", theme: "supplication", meaning: "Our Lord do not impose blame", usageContext: "Seeking pardon", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I regret my actions and seek pardon", theme: "repentance", difficulty: 2 },
      correct: { arabicText: "رب إني ظلمت نفسي", surahAyah: "القصص:16", theme: "repentance", meaning: "My Lord I have wronged myself", usageContext: "Acknowledging sin", wordCount: 4 },
      distractors: [
        { arabicText: "رب نجني من القوم الظالمين", surahAyah: "القصص:21", theme: "protection", meaning: "My Lord save me from wrongdoing people", usageContext: "Seeking safety", wordCount: 5 },
        { arabicText: "رب اجعلني من الشاكرين", surahAyah: "الأعراف:144", theme: "gratitude", meaning: "My Lord make me among grateful", usageContext: "Seeking gratitude", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "Help me overcome my shortcomings", theme: "repentance", difficulty: 2 },
      correct: { arabicText: "ربنا ظلمنا أنفسنا", surahAyah: "الأعراف:23", theme: "repentance", meaning: "Our Lord we have wronged ourselves", usageContext: "Confession", wordCount: 3 },
      distractors: [
        { arabicText: "ربنا أتمم لنا نورنا", surahAyah: "التحريم:8", theme: "supplication", meaning: "Our Lord perfect for us our light", usageContext: "Seeking completion", wordCount: 4 },
        { arabicText: "ربنا لا تزغ قلوبنا", surahAyah: "آل عمران:8", theme: "guidance", meaning: "Our Lord do not deviate our hearts", usageContext: "Seeking steadfastness", wordCount: 4 }
      ]
    },

    // COMMUNITY Theme (5 exercises)
    {
      sentence: { englishText: "I wish peace for everyone", theme: "community", difficulty: 1 },
      correct: { arabicText: "سلام عليكم", surahAyah: "الأنعام:54", theme: "community", meaning: "Peace be upon you", usageContext: "Greeting", wordCount: 2 },
      distractors: [
        { arabicText: "بسم الله الرحمن الرحيم", surahAyah: "الفاتحة:1", theme: "beginning", meaning: "In name of Allah Most Merciful", usageContext: "Starting actions", wordCount: 4 },
        { arabicText: "الحمد لله رب العالمين", surahAyah: "الفاتحة:2", theme: "gratitude", meaning: "Praise to Allah Lord of worlds", usageContext: "Expressing gratitude", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "May Allah bless our community", theme: "community", difficulty: 2 },
      correct: { arabicText: "ربنا اغفر لنا ولإخواننا", surahAyah: "الحشر:10", theme: "community", meaning: "Our Lord forgive us and our brothers", usageContext: "Community prayer", wordCount: 3 },
      distractors: [
        { arabicText: "ربنا آتنا من لدنك رحمة", surahAyah: "الكهف:10", theme: "mercy", meaning: "Our Lord grant us mercy from Yourself", usageContext: "Seeking mercy", wordCount: 5 },
        { arabicText: "ربنا هب لنا من أزواجنا", surahAyah: "الفرقان:74", theme: "family", meaning: "Our Lord grant us from our spouses", usageContext: "Family prayer", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I hope for unity among people", theme: "community", difficulty: 2 },
      correct: { arabicText: "واعتصموا بحبل الله جميعا", surahAyah: "آل عمران:103", theme: "community", meaning: "Hold firmly to rope of Allah all together", usageContext: "Calling to unity", wordCount: 4 },
      distractors: [
        { arabicText: "وأطيعوا الله والرسول", surahAyah: "آل عمران:132", theme: "obedience", meaning: "Obey Allah and the Messenger", usageContext: "Following guidance", wordCount: 3 },
        { arabicText: "واتقوا الله لعلكم تفلحون", surahAyah: "آل عمران:200", theme: "piety", meaning: "Fear Allah that you may succeed", usageContext: "Encouraging piety", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "Let's work together for good", theme: "community", difficulty: 2 },
      correct: { arabicText: "وتعاونوا على البر والتقوى", surahAyah: "المائدة:2", theme: "community", meaning: "Cooperate in righteousness and piety", usageContext: "Encouraging cooperation", wordCount: 4 },
      distractors: [
        { arabicText: "وأمرهم شورى بينهم", surahAyah: "الشورى:38", theme: "consultation", meaning: "Their affair is by consultation", usageContext: "Mutual consultation", wordCount: 3 },
        { arabicText: "وأقسطوا إن الله يحب المقسطين", surahAyah: "الحجرات:9", theme: "justice", meaning: "Be just, Allah loves the just", usageContext: "Promoting justice", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I care about my neighbors", theme: "community", difficulty: 2 },
      correct: { arabicText: "والجار ذي القربى", surahAyah: "النساء:36", theme: "community", meaning: "And the near neighbor", usageContext: "Rights of neighbors", wordCount: 3 },
      distractors: [
        { arabicText: "وقولوا للناس حسنا", surahAyah: "البقرة:83", theme: "kindness", meaning: "Speak to people good words", usageContext: "Good speech", wordCount: 3 },
        { arabicText: "والكاظمين الغيظ", surahAyah: "آل عمران:134", theme: "character", meaning: "Those who restrain anger", usageContext: "Good character", wordCount: 2 }
      ]
    }
  ];

  let successCount = 0;

  for (const exercise of exercises) {
    try {
      // Insert sentence
      const [sentence] = await db.insert(dailySentences).values(exercise.sentence).returning();
      
      // Insert correct expression
      const [correct] = await db.insert(quranicExpressions).values(exercise.correct).returning();
      
      // Insert first 2 distractors
      const [distractor1] = await db.insert(quranicExpressions).values(exercise.distractors[0]).returning();
      const [distractor2] = await db.insert(quranicExpressions).values(exercise.distractors[1]).returning();
      
      // Generate 3rd distractor - pick from already inserted expressions (excluding current correct + distractors)
      const allExpressions = [
        { arabicText: "سبحان الله", surahAyah: "derived", theme: "glorification", meaning: "Glory to Allah", usageContext: "Praising Allah", wordCount: 2 },
        { arabicText: "لا حول ولا قوة إلا بالله", surahAyah: "الكهف:39", theme: "reliance", meaning: "No power except by Allah", usageContext: "Acknowledging dependence", wordCount: 6 },
        { arabicText: "إنا لله", surahAyah: "البقرة:156", theme: "patience", meaning: "We belong to Allah", usageContext: "In calamity", wordCount: 2 },
        { arabicText: "توكلت على الله", surahAyah: "الأعراف:89", theme: "trust", meaning: "I have relied upon Allah", usageContext: "Placing trust", wordCount: 3 },
        { arabicText: "ربنا افتح بيننا", surahAyah: "الأعراف:89", theme: "judgment", meaning: "Our Lord decide between us", usageContext: "Seeking judgment", wordCount: 3 }
      ];
      
      // Pick a distractor that's different from the correct theme
      const distractor3Data = allExpressions.find(e => 
        e.theme !== exercise.correct.theme &&
        e.theme !== exercise.distractors[0].theme &&
        e.theme !== exercise.distractors[1].theme &&
        e.arabicText !== exercise.correct.arabicText &&
        e.arabicText !== exercise.distractors[0].arabicText &&
        e.arabicText !== exercise.distractors[1].arabicText
      ) || allExpressions[Math.floor(Math.random() * allExpressions.length)];
      
      const [distractor3] = await db.insert(quranicExpressions).values(distractor3Data).returning();
      
      // Create exercise with 3 distractors
      await db.insert(dailySentenceExercises).values({
        dailySentenceId: sentence.id,
        correctExpressionId: correct.id,
        distractorIds: [distractor1.id, distractor2.id, distractor3.id],
        explanation: {
          en: `The expression "${exercise.correct.arabicText}" is commonly used when ${exercise.sentence.englishText.toLowerCase()}.`,
          ar: `يُستخدم التعبير "${exercise.correct.arabicText}" عادة في ${exercise.sentence.theme}.`
        },
        learningNote: {
          en: `From ${exercise.correct.surahAyah}: ${exercise.correct.meaning}`,
          ar: `من ${exercise.correct.surahAyah}: ${exercise.correct.usageContext}`
        }
      });
      
      successCount++;
      console.log(`✓ Exercise ${successCount}/50 created (${exercise.sentence.theme})`);
    } catch (error) {
      console.error(`✗ Failed to create exercise:`, error);
    }
  }
  
  console.log(`\n🎉 Successfully created ${successCount}/50 exercises!`);
  process.exit(0);
}

seed50Exercises().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
