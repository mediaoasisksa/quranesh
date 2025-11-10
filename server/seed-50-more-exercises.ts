import { db } from "./db";
import { dailySentences, quranicExpressions, dailySentenceExercises } from "@shared/schema";

async function seed50MoreExercises() {
  console.log("🌱 Seeding 50 additional daily contextual exercises...\n");

  const exercises = [
    // WORK/CAREER Theme (5 exercises)
    {
      sentence: { englishText: "I seek success in my work", theme: "work", difficulty: 2 },
      correct: { arabicText: "رب اشرح لي صدري ويسر لي أمري", surahAyah: "طه:25-26", theme: "work", meaning: "My Lord expand my chest and ease my task", usageContext: "Before important work", wordCount: 6 },
      distractors: [
        { arabicText: "ربنا آتنا في الدنيا حسنة", surahAyah: "البقرة:201", theme: "supplication", meaning: "Our Lord give us good in this world", usageContext: "General dua", wordCount: 5 },
        { arabicText: "والله يرزق من يشاء", surahAyah: "البقرة:212", theme: "provision", meaning: "Allah provides for whom He wills", usageContext: "Trusting divine provision", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I start my project with Allah's name", theme: "work", difficulty: 1 },
      correct: { arabicText: "بسم الله الرحمن الرحيم", surahAyah: "الفاتحة:1", theme: "beginning", meaning: "In the name of Allah Most Merciful", usageContext: "Starting any action", wordCount: 4 },
      distractors: [
        { arabicText: "الحمد لله رب العالمين", surahAyah: "الفاتحة:2", theme: "gratitude", meaning: "Praise to Allah Lord of worlds", usageContext: "Expressing gratitude", wordCount: 4 },
        { arabicText: "لا إله إلا الله", surahAyah: "derived", theme: "faith", meaning: "No deity except Allah", usageContext: "Declaration of faith", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I need focus and clarity at work", theme: "work", difficulty: 2 },
      correct: { arabicText: "واجعل لي لسان صدق", surahAyah: "الشعراء:84", theme: "work", meaning: "Grant me truthful speech", usageContext: "Seeking eloquence", wordCount: 4 },
      distractors: [
        { arabicText: "ربنا لا تزغ قلوبنا", surahAyah: "آل عمران:8", theme: "guidance", meaning: "Our Lord do not deviate our hearts", usageContext: "Seeking steadfastness", wordCount: 4 },
        { arabicText: "فاصبر إن العاقبة للمتقين", surahAyah: "هود:49", theme: "patience", meaning: "Be patient, outcome is for righteous", usageContext: "Encouraging patience", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "May Allah bless my efforts", theme: "work", difficulty: 1 },
      correct: { arabicText: "ربنا تقبل منا", surahAyah: "البقرة:127", theme: "work", meaning: "Our Lord accept from us", usageContext: "Seeking acceptance", wordCount: 3 },
      distractors: [
        { arabicText: "سبحان الله وبحمده", surahAyah: "derived", theme: "glorification", meaning: "Glory to Allah and praise Him", usageContext: "Remembrance", wordCount: 3 },
        { arabicText: "ولا تقنطوا من رحمة الله", surahAyah: "الزمر:53", theme: "hope", meaning: "Do not despair of Allah's mercy", usageContext: "Maintaining hope", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I trust Allah with my career decisions", theme: "work", difficulty: 2 },
      correct: { arabicText: "وأفوض أمري إلى الله", surahAyah: "غافر:44", theme: "trust", meaning: "I entrust my affair to Allah", usageContext: "Complete reliance", wordCount: 4 },
      distractors: [
        { arabicText: "واستعينوا بالصبر والصلاة", surahAyah: "البقرة:45", theme: "guidance", meaning: "Seek help through patience and prayer", usageContext: "Divine assistance", wordCount: 3 },
        { arabicText: "إن الله لا يضيع أجر المحسنين", surahAyah: "التوبة:120", theme: "reward", meaning: "Allah does not waste reward of good-doers", usageContext: "Promise of reward", wordCount: 6 }
      ]
    },

    // HEALTH Theme (5 exercises)
    {
      sentence: { englishText: "I pray for good health and wellness", theme: "health", difficulty: 2 },
      correct: { arabicText: "رب إني مسني الضر وأنت أرحم الراحمين", surahAyah: "الأنبياء:83", theme: "health", meaning: "My Lord adversity has touched me and You are Most Merciful", usageContext: "During illness", wordCount: 6 },
      distractors: [
        { arabicText: "ربنا آتنا من لدنك رحمة", surahAyah: "الكهف:10", theme: "mercy", meaning: "Our Lord grant us mercy from Yourself", usageContext: "Seeking mercy", wordCount: 5 },
        { arabicText: "واصبر على ما أصابك", surahAyah: "لقمان:17", theme: "patience", meaning: "Be patient over what befalls you", usageContext: "Enduring trials", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I'm grateful for my body's strength", theme: "health", difficulty: 1 },
      correct: { arabicText: "الحمد لله على كل حال", surahAyah: "derived", theme: "gratitude", meaning: "Praise Allah in all circumstances", usageContext: "General gratitude", wordCount: 4 },
      distractors: [
        { arabicText: "فاذكروني أذكركم", surahAyah: "البقرة:152", theme: "remembrance", meaning: "Remember Me I will remember you", usageContext: "Divine remembrance", wordCount: 2 },
        { arabicText: "وتوبوا إلى الله", surahAyah: "النور:31", theme: "repentance", meaning: "Turn to Allah in repentance", usageContext: "Seeking forgiveness", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "May Allah heal what hurts me", theme: "health", difficulty: 2 },
      correct: { arabicText: "وإذا مرضت فهو يشفين", surahAyah: "الشعراء:80", theme: "health", meaning: "When I am ill He cures me", usageContext: "Trusting divine healing", wordCount: 4 },
      distractors: [
        { arabicText: "والله على كل شيء قدير", surahAyah: "البقرة:20", theme: "power", meaning: "Allah is over all things competent", usageContext: "Divine omnipotence", wordCount: 5 },
        { arabicText: "حسبنا الله ونعم الوكيل", surahAyah: "آل عمران:173", theme: "trust", meaning: "Allah is sufficient, best disposer", usageContext: "Complete trust", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I take care of my health as a trust", theme: "health", difficulty: 2 },
      correct: { arabicText: "ولا تلقوا بأيديكم إلى التهلكة", surahAyah: "البقرة:195", theme: "health", meaning: "Do not throw yourselves into destruction", usageContext: "Self-preservation", wordCount: 4 },
      distractors: [
        { arabicText: "إن الله يحب المتوكلين", surahAyah: "آل عمران:159", theme: "trust", meaning: "Allah loves those who trust", usageContext: "Divine love", wordCount: 4 },
        { arabicText: "وقل رب زدني علما", surahAyah: "طه:114", theme: "knowledge", meaning: "Say: My Lord increase my knowledge", usageContext: "Seeking knowledge", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I seek protection from harm", theme: "health", difficulty: 2 },
      correct: { arabicText: "قل أعوذ برب الفلق", surahAyah: "الفلق:1", theme: "protection", meaning: "Say: I seek refuge in Lord of daybreak", usageContext: "Seeking protection", wordCount: 4 },
      distractors: [
        { arabicText: "ربنا اغفر لنا ذنوبنا", surahAyah: "آل عمران:16", theme: "forgiveness", meaning: "Our Lord forgive our sins", usageContext: "Seeking forgiveness", wordCount: 4 },
        { arabicText: "فاذكروا الله كثيرا", surahAyah: "الأنفال:45", theme: "remembrance", meaning: "Remember Allah abundantly", usageContext: "Constant remembrance", wordCount: 3 }
      ]
    },

    // CHALLENGES Theme (5 exercises)
    {
      sentence: { englishText: "This difficulty will pass", theme: "challenges", difficulty: 1 },
      correct: { arabicText: "فإن مع العسر يسرا", surahAyah: "الشرح:5", theme: "hope", meaning: "Indeed after hardship comes ease", usageContext: "During difficulties", wordCount: 4 },
      distractors: [
        { arabicText: "واستعينوا بالصبر", surahAyah: "البقرة:45", theme: "patience", meaning: "Seek help through patience", usageContext: "During hardship", wordCount: 2 },
        { arabicText: "الله ولي الذين آمنوا", surahAyah: "البقرة:257", theme: "trust", meaning: "Allah is ally of believers", usageContext: "Divine support", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I face this challenge with courage", theme: "challenges", difficulty: 2 },
      correct: { arabicText: "لا تحزن إن الله معنا", surahAyah: "التوبة:40", theme: "challenges", meaning: "Do not grieve, Allah is with us", usageContext: "Facing adversity", wordCount: 5 },
      distractors: [
        { arabicText: "ومن يتق الله يجعل له مخرجا", surahAyah: "الطلاق:2", theme: "piety", meaning: "Whoever fears Allah He makes way out", usageContext: "Divine promise", wordCount: 6 },
        { arabicText: "إنما المؤمنون إخوة", surahAyah: "الحجرات:10", theme: "community", meaning: "Believers are but brothers", usageContext: "Unity", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I won't give up despite obstacles", theme: "challenges", difficulty: 2 },
      correct: { arabicText: "ولا تهنوا ولا تحزنوا", surahAyah: "آل عمران:139", theme: "challenges", meaning: "Do not weaken and do not grieve", usageContext: "Encouragement", wordCount: 4 },
      distractors: [
        { arabicText: "وسبح بحمد ربك", surahAyah: "الحجر:98", theme: "glorification", meaning: "Glorify with praise of your Lord", usageContext: "Praising Allah", wordCount: 3 },
        { arabicText: "استغفروا ربكم إنه كان غفارا", surahAyah: "نوح:10", theme: "repentance", meaning: "Seek forgiveness of your Lord, He is Forgiving", usageContext: "Asking forgiveness", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "Every hardship teaches me something", theme: "challenges", difficulty: 2 },
      correct: { arabicText: "وعسى أن تكرهوا شيئا وهو خير لكم", surahAyah: "البقرة:216", theme: "wisdom", meaning: "Perhaps you dislike something and it is good for you", usageContext: "Divine wisdom", wordCount: 6 },
      distractors: [
        { arabicText: "ربنا لا تؤاخذنا", surahAyah: "البقرة:286", theme: "supplication", meaning: "Our Lord do not impose blame", usageContext: "Seeking pardon", wordCount: 3 },
        { arabicText: "وما عند الله خير وأبقى", surahAyah: "القصص:60", theme: "reward", meaning: "What Allah has is better and lasting", usageContext: "Preferring hereafter", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I stay strong through this test", theme: "challenges", difficulty: 1 },
      correct: { arabicText: "إن الله مع الصابرين", surahAyah: "البقرة:153", theme: "patience", meaning: "Indeed Allah is with the patient", usageContext: "Encouragement in patience", wordCount: 4 },
      distractors: [
        { arabicText: "توكلت على الله", surahAyah: "الأعراف:89", theme: "trust", meaning: "I have relied upon Allah", usageContext: "Placing trust", wordCount: 3 },
        { arabicText: "ما شاء الله لا قوة إلا بالله", surahAyah: "الكهف:39", theme: "reliance", meaning: "What Allah willed, no power except by Allah", usageContext: "Acknowledging Allah's will", wordCount: 6 }
      ]
    },

    // SUCCESS Theme (5 exercises)
    {
      sentence: { englishText: "I achieved this with Allah's help", theme: "success", difficulty: 1 },
      correct: { arabicText: "الحمد لله الذي هدانا لهذا", surahAyah: "الأعراف:43", theme: "gratitude", meaning: "Praise to Allah who guided us to this", usageContext: "After success", wordCount: 5 },
      distractors: [
        { arabicText: "فاصبر إن وعد الله حق", surahAyah: "الروم:60", theme: "patience", meaning: "Be patient, Allah's promise is true", usageContext: "Trusting promise", wordCount: 5 },
        { arabicText: "وتوكل على الحي الذي لا يموت", surahAyah: "الفرقان:58", theme: "trust", meaning: "Rely upon the Ever-Living", usageContext: "Trusting Allah", wordCount: 6 }
      ]
    },
    {
      sentence: { englishText: "All success comes from Allah alone", theme: "success", difficulty: 2 },
      correct: { arabicText: "وما النصر إلا من عند الله", surahAyah: "آل عمران:126", theme: "success", meaning: "Victory comes only from Allah", usageContext: "Attributing success", wordCount: 6 },
      distractors: [
        { arabicText: "إن مع العسر يسرا", surahAyah: "الشرح:6", theme: "hope", meaning: "With hardship comes ease", usageContext: "During difficulties", wordCount: 4 },
        { arabicText: "واستغفروا ربكم ثم توبوا إليه", surahAyah: "هود:3", theme: "repentance", meaning: "Seek forgiveness then repent to Him", usageContext: "Seeking forgiveness", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "May my achievements be accepted", theme: "success", difficulty: 2 },
      correct: { arabicText: "ربنا تقبل منا إنك أنت السميع العليم", surahAyah: "البقرة:127", theme: "acceptance", meaning: "Our Lord accept from us, You are Hearing Knowing", usageContext: "Seeking acceptance", wordCount: 6 },
      distractors: [
        { arabicText: "ربنا آتنا في الآخرة حسنة", surahAyah: "البقرة:201", theme: "supplication", meaning: "Our Lord give us good in hereafter", usageContext: "Dua for afterlife", wordCount: 5 },
        { arabicText: "رب اجعلني مقيم الصلاة", surahAyah: "إبراهيم:40", theme: "worship", meaning: "My Lord make me establisher of prayer", usageContext: "Personal dua", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I remain humble after this victory", theme: "success", difficulty: 2 },
      correct: { arabicText: "فسبح بحمد ربك واستغفره", surahAyah: "النصر:3", theme: "humility", meaning: "Glorify with praise of your Lord and seek His forgiveness", usageContext: "After success", wordCount: 4 },
      distractors: [
        { arabicText: "ولله العزة ولرسوله", surahAyah: "المنافقون:8", theme: "honor", meaning: "To Allah belongs honor and to His Messenger", usageContext: "Divine honor", wordCount: 3 },
        { arabicText: "إن الله لا يحب المستكبرين", surahAyah: "النحل:23", theme: "humility", meaning: "Allah does not love the arrogant", usageContext: "Warning against arrogance", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I strive for true success in both worlds", theme: "success", difficulty: 2 },
      correct: { arabicText: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة", surahAyah: "البقرة:201", theme: "success", meaning: "Our Lord give us good in this world and hereafter", usageContext: "Comprehensive dua", wordCount: 6 },
      distractors: [
        { arabicText: "واعبدوا الله ولا تشركوا به شيئا", surahAyah: "النساء:36", theme: "worship", meaning: "Worship Allah and associate nothing with Him", usageContext: "Pure worship", wordCount: 6 },
        { arabicText: "ومن يتق الله يجعل له مخرجا", surahAyah: "الطلاق:2", theme: "piety", meaning: "Whoever fears Allah He makes way out", usageContext: "Divine promise", wordCount: 6 }
      ]
    },

    // LEARNING Theme (5 exercises)
    {
      sentence: { englishText: "I want to increase my knowledge", theme: "learning", difficulty: 1 },
      correct: { arabicText: "وقل رب زدني علما", surahAyah: "طه:114", theme: "learning", meaning: "Say: My Lord increase me in knowledge", usageContext: "Seeking knowledge", wordCount: 4 },
      distractors: [
        { arabicText: "ربنا افتح بيننا بالحق", surahAyah: "الأعراف:89", theme: "judgment", meaning: "Our Lord decide between us in truth", usageContext: "Seeking judgment", wordCount: 4 },
        { arabicText: "وأنيبوا إلى ربكم", surahAyah: "الزمر:54", theme: "repentance", meaning: "Turn in repentance to your Lord", usageContext: "Returning to Allah", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "Help me understand what I study", theme: "learning", difficulty: 2 },
      correct: { arabicText: "رب اشرح لي صدري", surahAyah: "طه:25", theme: "learning", meaning: "My Lord expand my chest", usageContext: "Seeking understanding", wordCount: 4 },
      distractors: [
        { arabicText: "ربنا لا تزغ قلوبنا", surahAyah: "آل عمران:8", theme: "guidance", meaning: "Our Lord do not deviate our hearts", usageContext: "Seeking steadfastness", wordCount: 4 },
        { arabicText: "واجعلنا للمتقين إماما", surahAyah: "الفرقان:74", theme: "leadership", meaning: "Make us example for righteous", usageContext: "Seeking leadership", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I learn from every experience", theme: "learning", difficulty: 2 },
      correct: { arabicText: "إن في ذلك لآيات لقوم يتفكرون", surahAyah: "الرعد:3", theme: "learning", meaning: "Indeed in that are signs for people who reflect", usageContext: "Encouraging reflection", wordCount: 6 },
      distractors: [
        { arabicText: "واذكر ربك كثيرا", surahAyah: "آل عمران:41", theme: "remembrance", meaning: "Remember your Lord abundantly", usageContext: "Constant remembrance", wordCount: 3 },
        { arabicText: "وما خلقت الجن والإنس", surahAyah: "الذاريات:56", theme: "purpose", meaning: "I did not create jinn and mankind", usageContext: "Purpose of creation", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "May Allah grant me wisdom", theme: "learning", difficulty: 2 },
      correct: { arabicText: "ومن يؤت الحكمة فقد أوتي خيرا كثيرا", surahAyah: "البقرة:269", theme: "wisdom", meaning: "Whoever is given wisdom has been given much good", usageContext: "Value of wisdom", wordCount: 6 },
      distractors: [
        { arabicText: "ربنا وابعث فيهم رسولا", surahAyah: "البقرة:129", theme: "guidance", meaning: "Our Lord and send among them messenger", usageContext: "Seeking guidance", wordCount: 4 },
        { arabicText: "إن الله غفور رحيم", surahAyah: "البقرة:173", theme: "forgiveness", meaning: "Indeed Allah is Forgiving Merciful", usageContext: "Divine attributes", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I seek beneficial knowledge", theme: "learning", difficulty: 2 },
      correct: { arabicText: "ربنا لا تزغ قلوبنا بعد إذ هديتنا", surahAyah: "آل عمران:8", theme: "learning", meaning: "Our Lord do not deviate our hearts after You have guided us", usageContext: "Seeking steadfastness", wordCount: 6 },
      distractors: [
        { arabicText: "وأقيموا الصلاة وآتوا الزكاة", surahAyah: "البقرة:43", theme: "worship", meaning: "Establish prayer and give zakah", usageContext: "Religious duties", wordCount: 4 },
        { arabicText: "سبحان ربي العظيم", surahAyah: "derived", theme: "glorification", meaning: "Glory to my Lord the Great", usageContext: "In ruku", wordCount: 3 }
      ]
    },

    // RELATIONSHIPS Theme (5 exercises)
    {
      sentence: { englishText: "I want peace in my relationships", theme: "relationships", difficulty: 2 },
      correct: { arabicText: "والصلح خير", surahAyah: "النساء:128", theme: "relationships", meaning: "Reconciliation is best", usageContext: "Resolving conflicts", wordCount: 2 },
      distractors: [
        { arabicText: "واعفوا واصفحوا", surahAyah: "البقرة:109", theme: "forgiveness", meaning: "Pardon and overlook", usageContext: "Forgiving others", wordCount: 2 },
        { arabicText: "إنما المؤمنون إخوة", surahAyah: "الحجرات:10", theme: "community", meaning: "Believers are but brothers", usageContext: "Unity", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "May Allah bless my marriage", theme: "relationships", difficulty: 2 },
      correct: { arabicText: "ربنا هب لنا من أزواجنا وذرياتنا قرة أعين", surahAyah: "الفرقان:74", theme: "family", meaning: "Our Lord grant us from spouses and offspring comfort of eyes", usageContext: "Praying for family", wordCount: 6 },
      distractors: [
        { arabicText: "رب اجعلني مقيم الصلاة ومن ذريتي", surahAyah: "إبراهيم:40", theme: "worship", meaning: "My Lord make me establisher of prayer and offspring", usageContext: "For righteous children", wordCount: 6 },
        { arabicText: "ربنا اغفر لنا ولوالدينا", surahAyah: "نوح:28", theme: "forgiveness", meaning: "Our Lord forgive us and parents", usageContext: "Family forgiveness", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I forgive those who wronged me", theme: "relationships", difficulty: 2 },
      correct: { arabicText: "فمن عفا وأصلح فأجره على الله", surahAyah: "الشورى:40", theme: "forgiveness", meaning: "Whoever pardons and makes reconciliation, reward is with Allah", usageContext: "Forgiving others", wordCount: 6 },
      distractors: [
        { arabicText: "إن الله يحب المحسنين", surahAyah: "البقرة:195", theme: "goodness", meaning: "Allah loves the doers of good", usageContext: "Divine love", wordCount: 4 },
        { arabicText: "وقولوا للناس حسنا", surahAyah: "البقرة:83", theme: "kindness", meaning: "Speak to people good words", usageContext: "Good speech", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I treat people with kindness", theme: "relationships", difficulty: 1 },
      correct: { arabicText: "وقولوا للناس حسنا", surahAyah: "البقرة:83", theme: "kindness", meaning: "Speak to people good words", usageContext: "Good treatment", wordCount: 3 },
      distractors: [
        { arabicText: "واصبروا إن الله مع الصابرين", surahAyah: "الأنفال:46", theme: "patience", meaning: "Be patient, Allah is with patient ones", usageContext: "Encouraging patience", wordCount: 5 },
        { arabicText: "ولا تستوي الحسنة ولا السيئة", surahAyah: "فصلت:34", theme: "morality", meaning: "Good and evil are not equal", usageContext: "Choosing good", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "May Allah strengthen our bonds", theme: "relationships", difficulty: 2 },
      correct: { arabicText: "واعتصموا بحبل الله جميعا ولا تفرقوا", surahAyah: "آل عمران:103", theme: "unity", meaning: "Hold firmly to rope of Allah together and do not divide", usageContext: "Calling to unity", wordCount: 6 },
      distractors: [
        { arabicText: "وتعاونوا على البر والتقوى", surahAyah: "المائدة:2", theme: "cooperation", meaning: "Cooperate in righteousness and piety", usageContext: "Encouraging cooperation", wordCount: 4 },
        { arabicText: "وأطيعوا الله والرسول", surahAyah: "آل عمران:132", theme: "obedience", meaning: "Obey Allah and the Messenger", usageContext: "Following guidance", wordCount: 3 }
      ]
    },

    // PRAYER Theme (5 exercises)
    {
      sentence: { englishText: "I establish my prayers regularly", theme: "prayer", difficulty: 1 },
      correct: { arabicText: "وأقيموا الصلاة وآتوا الزكاة", surahAyah: "البقرة:43", theme: "prayer", meaning: "Establish prayer and give zakah", usageContext: "Religious duties", wordCount: 4 },
      distractors: [
        { arabicText: "واستعينوا بالصبر والصلاة", surahAyah: "البقرة:45", theme: "guidance", meaning: "Seek help through patience and prayer", usageContext: "Divine assistance", wordCount: 3 },
        { arabicText: "ولله على الناس حج البيت", surahAyah: "آل عمران:97", theme: "pilgrimage", meaning: "For Allah is pilgrimage to House", usageContext: "Hajj obligation", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "May my prayer be accepted", theme: "prayer", difficulty: 2 },
      correct: { arabicText: "رب اجعلني مقيم الصلاة ومن ذريتي", surahAyah: "إبراهيم:40", theme: "prayer", meaning: "My Lord make me establisher of prayer and offspring", usageContext: "Dua for prayer", wordCount: 6 },
      distractors: [
        { arabicText: "ربنا تقبل منا إنك أنت السميع العليم", surahAyah: "البقرة:127", theme: "acceptance", meaning: "Our Lord accept from us, You are Hearing Knowing", usageContext: "Seeking acceptance", wordCount: 6 },
        { arabicText: "رب أوزعني أن أشكر نعمتك", surahAyah: "النمل:19", theme: "gratitude", meaning: "My Lord enable me to be grateful", usageContext: "Gratitude for blessings", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "Prayer brings me peace and focus", theme: "prayer", difficulty: 2 },
      correct: { arabicText: "ألا بذكر الله تطمئن القلوب", surahAyah: "الرعد:28", theme: "prayer", meaning: "Indeed by remembrance of Allah hearts are assured", usageContext: "Finding peace", wordCount: 5 },
      distractors: [
        { arabicText: "واذكر اسم ربك بكرة وأصيلا", surahAyah: "الإنسان:25", theme: "remembrance", meaning: "Remember name of your Lord morning and evening", usageContext: "Constant remembrance", wordCount: 5 },
        { arabicText: "فاصبر على ما يقولون", surahAyah: "ق:39", theme: "patience", meaning: "Be patient over what they say", usageContext: "Enduring criticism", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I turn to prayer in times of need", theme: "prayer", difficulty: 1 },
      correct: { arabicText: "واستعينوا بالصبر والصلاة", surahAyah: "البقرة:45", theme: "prayer", meaning: "Seek help through patience and prayer", usageContext: "Divine assistance", wordCount: 3 },
      distractors: [
        { arabicText: "ادعوني أستجب لكم", surahAyah: "غافر:60", theme: "supplication", meaning: "Call upon Me I will respond", usageContext: "Divine promise", wordCount: 3 },
        { arabicText: "إن الله سميع الدعاء", surahAyah: "إبراهيم:39", theme: "supplication", meaning: "Indeed Allah is Hearing of supplication", usageContext: "Divine hearing", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I remember Allah throughout my day", theme: "prayer", difficulty: 2 },
      correct: { arabicText: "فاذكروني أذكركم واشكروا لي", surahAyah: "البقرة:152", theme: "remembrance", meaning: "Remember Me I will remember you and be grateful to Me", usageContext: "Divine remembrance", wordCount: 5 },
      distractors: [
        { arabicText: "واذكر ربك في نفسك", surahAyah: "الأعراف:205", theme: "remembrance", meaning: "Remember your Lord within yourself", usageContext: "Private remembrance", wordCount: 4 },
        { arabicText: "سبحان الله والحمد لله", surahAyah: "derived", theme: "glorification", meaning: "Glory to Allah and praise to Allah", usageContext: "Combined dhikr", wordCount: 4 }
      ]
    },

    // CHARITY Theme (5 exercises)
    {
      sentence: { englishText: "I give to those in need", theme: "charity", difficulty: 1 },
      correct: { arabicText: "وآتوا الزكاة", surahAyah: "البقرة:43", theme: "charity", meaning: "Give zakah", usageContext: "Obligatory charity", wordCount: 2 },
      distractors: [
        { arabicText: "وأقيموا الصلاة", surahAyah: "البقرة:43", theme: "prayer", meaning: "Establish prayer", usageContext: "Religious duty", wordCount: 2 },
        { arabicText: "اتقوا الله حق تقاته", surahAyah: "آل عمران:102", theme: "piety", meaning: "Fear Allah as He should be feared", usageContext: "Encouraging piety", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "May Allah bless what I give", theme: "charity", difficulty: 2 },
      correct: { arabicText: "وما تنفقوا من خير فلأنفسكم", surahAyah: "البقرة:272", theme: "charity", meaning: "Whatever you spend of good is for yourselves", usageContext: "Benefit of charity", wordCount: 6 },
      distractors: [
        { arabicText: "إن الله يحب المتصدقين", surahAyah: "derived", theme: "charity", meaning: "Indeed Allah loves those who give charity", usageContext: "Divine love", wordCount: 4 },
        { arabicText: "والله يرزق من يشاء بغير حساب", surahAyah: "البقرة:212", theme: "provision", meaning: "Allah provides for whom He wills without account", usageContext: "Divine provision", wordCount: 6 }
      ]
    },
    {
      sentence: { englishText: "Helping others brings me joy", theme: "charity", difficulty: 2 },
      correct: { arabicText: "ويؤثرون على أنفسهم ولو كان بهم خصاصة", surahAyah: "الحشر:9", theme: "charity", meaning: "They prefer over themselves even though they are in need", usageContext: "Selfless giving", wordCount: 6 },
      distractors: [
        { arabicText: "إن الله يحب المحسنين", surahAyah: "البقرة:195", theme: "goodness", meaning: "Allah loves the doers of good", usageContext: "Divine love", wordCount: 4 },
        { arabicText: "وأحسنوا إن الله يحب المحسنين", surahAyah: "البقرة:195", theme: "goodness", meaning: "Do good, Allah loves good-doers", usageContext: "Encouraging goodness", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I spend in Allah's way", theme: "charity", difficulty: 2 },
      correct: { arabicText: "وأنفقوا في سبيل الله", surahAyah: "البقرة:195", theme: "charity", meaning: "Spend in way of Allah", usageContext: "Charitable spending", wordCount: 4 },
      distractors: [
        { arabicText: "وجاهدوا في سبيل الله", surahAyah: "المائدة:35", theme: "struggle", meaning: "Strive in way of Allah", usageContext: "Spiritual struggle", wordCount: 4 },
        { arabicText: "واعبدوا الله ولا تشركوا", surahAyah: "النساء:36", theme: "worship", meaning: "Worship Allah and do not associate", usageContext: "Pure worship", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "Generosity purifies my wealth", theme: "charity", difficulty: 2 },
      correct: { arabicText: "خذ من أموالهم صدقة تطهرهم", surahAyah: "التوبة:103", theme: "charity", meaning: "Take from their wealth charity purifying them", usageContext: "Purpose of charity", wordCount: 5 },
      distractors: [
        { arabicText: "والله يضاعف لمن يشاء", surahAyah: "البقرة:261", theme: "reward", meaning: "Allah multiplies for whom He wills", usageContext: "Divine increase", wordCount: 4 },
        { arabicText: "وما تقدموا لأنفسكم من خير", surahAyah: "البقرة:110", theme: "goodness", meaning: "Whatever good you put forth for yourselves", usageContext: "Reward for good deeds", wordCount: 6 }
      ]
    },

    // REFLECTION Theme (5 exercises)
    {
      sentence: { englishText: "I reflect on Allah's signs in creation", theme: "reflection", difficulty: 2 },
      correct: { arabicText: "أفلا ينظرون إلى الإبل كيف خلقت", surahAyah: "الغاشية:17", theme: "reflection", meaning: "Do they not look at camels how they were created", usageContext: "Pondering creation", wordCount: 6 },
      distractors: [
        { arabicText: "إن في خلق السماوات والأرض", surahAyah: "آل عمران:190", theme: "reflection", meaning: "Indeed in creation of heavens and earth", usageContext: "Signs of Allah", wordCount: 5 },
        { arabicText: "سبحان الذي خلق الأزواج", surahAyah: "يس:36", theme: "glorification", meaning: "Glory to Him who created pairs", usageContext: "Praising Creator", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I think deeply about my purpose", theme: "reflection", difficulty: 2 },
      correct: { arabicText: "وما خلقت الجن والإنس إلا ليعبدون", surahAyah: "الذاريات:56", theme: "purpose", meaning: "I did not create jinn and mankind except to worship", usageContext: "Purpose of existence", wordCount: 6 },
      distractors: [
        { arabicText: "أفحسبتم أنما خلقناكم عبثا", surahAyah: "المؤمنون:115", theme: "purpose", meaning: "Did you think We created you aimlessly", usageContext: "Purposeful creation", wordCount: 5 },
        { arabicText: "الذي خلق الموت والحياة", surahAyah: "الملك:2", theme: "creation", meaning: "Who created death and life", usageContext: "Purpose of life", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "Every moment is a blessing to consider", theme: "reflection", difficulty: 2 },
      correct: { arabicText: "وإن تعدوا نعمة الله لا تحصوها", surahAyah: "النحل:18", theme: "gratitude", meaning: "If you count Allah's blessings you cannot enumerate them", usageContext: "Countless blessings", wordCount: 6 },
      distractors: [
        { arabicText: "فبأي آلاء ربكما تكذبان", surahAyah: "الرحمن:13", theme: "gratitude", meaning: "Which blessings will you deny", usageContext: "Reflecting on blessings", wordCount: 4 },
        { arabicText: "لئن شكرتم لأزيدنكم", surahAyah: "إبراهيم:7", theme: "gratitude", meaning: "If you are grateful I will increase you", usageContext: "Promise of more blessings", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I ponder the lessons in the Quran", theme: "reflection", difficulty: 2 },
      correct: { arabicText: "أفلا يتدبرون القرآن", surahAyah: "النساء:82", theme: "reflection", meaning: "Do they not ponder the Quran", usageContext: "Encouraging reflection", wordCount: 3 },
      distractors: [
        { arabicText: "إن هذا القرآن يهدي", surahAyah: "الإسراء:9", theme: "guidance", meaning: "Indeed this Quran guides", usageContext: "Quran's purpose", wordCount: 4 },
        { arabicText: "كتاب أنزلناه إليك مبارك", surahAyah: "ص:29", theme: "blessing", meaning: "Blessed Book We revealed to you", usageContext: "Quran's nature", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I contemplate my actions before Allah", theme: "reflection", difficulty: 2 },
      correct: { arabicText: "يا أيها الذين آمنوا اتقوا الله ولتنظر نفس ما قدمت لغد", surahAyah: "الحشر:18", theme: "reflection", meaning: "O believers fear Allah and let soul look what it has put forth for tomorrow", usageContext: "Self-accountability", wordCount: 6 },
      distractors: [
        { arabicText: "واتقوا يوما ترجعون فيه إلى الله", surahAyah: "البقرة:281", theme: "judgment", meaning: "Fear a day you will return to Allah", usageContext: "Day of Judgment", wordCount: 6 },
        { arabicText: "وكل شيء أحصيناه في إمام مبين", surahAyah: "يس:12", theme: "accountability", meaning: "We have enumerated everything in clear record", usageContext: "Divine record", wordCount: 5 }
      ]
    },

    // GRATITUDE (Additional) Theme (5 exercises)
    {
      sentence: { englishText: "Every breath is a gift from Allah", theme: "gratitude", difficulty: 2 },
      correct: { arabicText: "فاذكروا آلاء الله", surahAyah: "الأعراف:74", theme: "gratitude", meaning: "Remember favors of Allah", usageContext: "Recalling blessings", wordCount: 3 },
      distractors: [
        { arabicText: "واشكروا نعمت الله", surahAyah: "النحل:114", theme: "gratitude", meaning: "Be grateful for blessing of Allah", usageContext: "Expressing gratitude", wordCount: 3 },
        { arabicText: "سبحان الله وبحمده", surahAyah: "derived", theme: "glorification", meaning: "Glory to Allah and praise Him", usageContext: "Remembrance", wordCount: 3 }
      ]
    },
    {
      sentence: { englishText: "I'm blessed beyond measure", theme: "gratitude", difficulty: 1 },
      correct: { arabicText: "وأسبغ عليكم نعمه ظاهرة وباطنة", surahAyah: "لقمان:20", theme: "gratitude", meaning: "He lavished upon you blessings apparent and unapparent", usageContext: "Divine generosity", wordCount: 5 },
      distractors: [
        { arabicText: "وما بكم من نعمة فمن الله", surahAyah: "النحل:53", theme: "gratitude", meaning: "Whatever blessing you have is from Allah", usageContext: "Source of blessings", wordCount: 6 },
        { arabicText: "الحمد لله الذي أنعم علينا", surahAyah: "derived", theme: "gratitude", meaning: "Praise to Allah who blessed us", usageContext: "Thanking Allah", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "Thank you Allah for everything", theme: "gratitude", difficulty: 1 },
      correct: { arabicText: "الحمد لله على كل حال", surahAyah: "derived", theme: "gratitude", meaning: "Praise Allah in all circumstances", usageContext: "General gratitude", wordCount: 4 },
      distractors: [
        { arabicText: "والحمد لله رب العالمين", surahAyah: "الفاتحة:2", theme: "gratitude", meaning: "All praise to Allah Lord of worlds", usageContext: "Complete gratitude", wordCount: 4 },
        { arabicText: "فلله الحمد رب السماوات", surahAyah: "الجاثية:36", theme: "gratitude", meaning: "To Allah is praise Lord of heavens", usageContext: "Praising Allah", wordCount: 4 }
      ]
    },
    {
      sentence: { englishText: "I appreciate the small things in life", theme: "gratitude", difficulty: 2 },
      correct: { arabicText: "لئن شكرتم لأزيدنكم ولئن كفرتم", surahAyah: "إبراهيم:7", theme: "gratitude", meaning: "If you are grateful I will increase you but if you deny", usageContext: "Consequence of gratitude", wordCount: 5 },
      distractors: [
        { arabicText: "واشكروا لي ولا تكفرون", surahAyah: "البقرة:152", theme: "gratitude", meaning: "Be grateful to Me and do not deny", usageContext: "Command to be grateful", wordCount: 5 },
        { arabicText: "فاذكروني أذكركم", surahAyah: "البقرة:152", theme: "remembrance", meaning: "Remember Me I will remember you", usageContext: "Divine remembrance", wordCount: 2 }
      ]
    },
    {
      sentence: { englishText: "Gratitude fills my heart with peace", theme: "gratitude", difficulty: 2 },
      correct: { arabicText: "فبذكر الله تطمئن القلوب", surahAyah: "derived", theme: "gratitude", meaning: "By remembrance of Allah hearts find peace", usageContext: "Finding peace", wordCount: 4 },
      distractors: [
        { arabicText: "ألا بذكر الله تطمئن القلوب", surahAyah: "الرعد:28", theme: "peace", meaning: "Indeed by remembrance of Allah hearts are assured", usageContext: "Finding peace", wordCount: 5 },
        { arabicText: "والذين آمنوا وتطمئن قلوبهم بذكر الله", surahAyah: "الرعد:28", theme: "peace", meaning: "Those who believed and hearts assured by remembrance of Allah", usageContext: "Peaceful hearts", wordCount: 6 }
      ]
    },

    // RESILIENCE Theme (5 exercises)
    {
      sentence: { englishText: "I bounce back from setbacks", theme: "resilience", difficulty: 2 },
      correct: { arabicText: "فإن مع العسر يسرا إن مع العسر يسرا", surahAyah: "الشرح:5-6", theme: "resilience", meaning: "Indeed with hardship comes ease, indeed with hardship comes ease", usageContext: "Repeated reassurance", wordCount: 6 },
      distractors: [
        { arabicText: "لا يكلف الله نفسا إلا وسعها", surahAyah: "البقرة:286", theme: "mercy", meaning: "Allah does not burden soul beyond capacity", usageContext: "Divine mercy", wordCount: 6 },
        { arabicText: "واصبر وما صبرك إلا بالله", surahAyah: "النحل:127", theme: "patience", meaning: "Be patient, your patience is only by Allah", usageContext: "Seeking Allah's help", wordCount: 6 }
      ]
    },
    {
      sentence: { englishText: "Difficulties make me stronger", theme: "resilience", difficulty: 2 },
      correct: { arabicText: "ولنبلونكم بشيء من الخوف والجوع", surahAyah: "البقرة:155", theme: "resilience", meaning: "We will test you with something of fear and hunger", usageContext: "Nature of tests", wordCount: 6 },
      distractors: [
        { arabicText: "أحسب الناس أن يتركوا", surahAyah: "العنكبوت:2", theme: "test", meaning: "Do people think they will be left", usageContext: "Life as test", wordCount: 5 },
        { arabicText: "ولا تهنوا في ابتغاء القوم", surahAyah: "النساء:104", theme: "resilience", meaning: "Do not weaken in pursuing people", usageContext: "Perseverance", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I don't let failures define me", theme: "resilience", difficulty: 2 },
      correct: { arabicText: "ولا تهنوا ولا تحزنوا وأنتم الأعلون", surahAyah: "آل عمران:139", theme: "resilience", meaning: "Do not weaken and do not grieve and you are superior", usageContext: "Encouragement", wordCount: 6 },
      distractors: [
        { arabicText: "إنما يوفى الصابرون أجرهم", surahAyah: "الزمر:10", theme: "patience", meaning: "Indeed patient will be given reward", usageContext: "Reward for patience", wordCount: 5 },
        { arabicText: "فإذا عزمت فتوكل على الله", surahAyah: "آل عمران:159", theme: "trust", meaning: "When you have decided then rely upon Allah", usageContext: "After decision", wordCount: 5 }
      ]
    },
    {
      sentence: { englishText: "I keep going despite obstacles", theme: "resilience", difficulty: 2 },
      correct: { arabicText: "ولا تيأسوا من روح الله", surahAyah: "يوسف:87", theme: "hope", meaning: "Do not despair of Allah's mercy", usageContext: "Maintaining hope", wordCount: 5 },
      distractors: [
        { arabicText: "إن نصر الله قريب", surahAyah: "البقرة:214", theme: "hope", meaning: "Indeed Allah's help is near", usageContext: "Imminent relief", wordCount: 4 },
        { arabicText: "وبشر الصابرين", surahAyah: "البقرة:155", theme: "patience", meaning: "Give good tidings to patient ones", usageContext: "Reward for patience", wordCount: 2 }
      ]
    },
    {
      sentence: { englishText: "Every challenge shapes my character", theme: "resilience", difficulty: 2 },
      correct: { arabicText: "ولنبلونكم حتى نعلم المجاهدين منكم", surahAyah: "محمد:31", theme: "test", meaning: "We will test you until We make evident strivers among you", usageContext: "Purpose of trials", wordCount: 6 },
      distractors: [
        { arabicText: "الذي خلق الموت والحياة ليبلوكم", surahAyah: "الملك:2", theme: "test", meaning: "Who created death and life to test you", usageContext: "Purpose of life", wordCount: 6 },
        { arabicText: "أم حسبتم أن تدخلوا الجنة", surahAyah: "البقرة:214", theme: "test", meaning: "Or do you think you will enter Paradise", usageContext: "Need for trials", wordCount: 6 }
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
      
      // Generate 3rd distractor - pick from pool
      const allExpressions = [
        { arabicText: "سبحان الله", surahAyah: "derived", theme: "glorification", meaning: "Glory to Allah", usageContext: "Praising Allah", wordCount: 2 },
        { arabicText: "لا حول ولا قوة إلا بالله", surahAyah: "الكهف:39", theme: "reliance", meaning: "No power except by Allah", usageContext: "Acknowledging dependence", wordCount: 6 },
        { arabicText: "إنا لله", surahAyah: "البقرة:156", theme: "patience", meaning: "We belong to Allah", usageContext: "In calamity", wordCount: 2 },
        { arabicText: "توكلت على الله", surahAyah: "الأعراف:89", theme: "trust", meaning: "I have relied upon Allah", usageContext: "Placing trust", wordCount: 3 },
        { arabicText: "ربنا افتح بيننا", surahAyah: "الأعراف:89", theme: "judgment", meaning: "Our Lord decide between us", usageContext: "Seeking judgment", wordCount: 3 }
      ];
      
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
  
  console.log(`\n🎉 Successfully created ${successCount}/50 additional exercises!`);
  console.log(`📊 Total exercises now in database: ${successCount + 50}`);
  process.exit(0);
}

seed50MoreExercises().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
