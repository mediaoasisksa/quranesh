/**
 * Adds missing Tabari / Self-Explanation translation keys to every
 * language block in client/src/lib/translations.ts.
 *
 * Run:  node scripts/add-tabari-translation-keys.mjs
 */
import fs from "fs";

const FILE = "client/src/lib/translations.ts";

// ── All new keys with translations per language ───────────────────────────────
const NEW_KEYS = {
  en: {
    tabariVocabularyTitle: "Tafsir al-Tabari Vocabulary",
    tabariVocabularyDesc: "Multiple-choice questions on Quranic word meanings sourced exclusively from Tafsir al-Tabari",
    tabariVocabularyPageDesc: "Find the exact Arabic word meaning in its Quranic verse — sourced from Tafsir al-Tabari",
    tabariVocabularyFooter: "Exercises covering Surah Al-Fatiha (1) and Surahs 93–114 — sourced exclusively from Tafsir al-Tabari",
    selfExplanationDashDesc: "Choose the correct Quranic word, then explain why it fits the verse — evaluated against Tafsir al-Tabari reference data by AI.",
    aiGraded: "AI-graded",
    tabariSource: "Tabari source",
    tabariScoreCorrect: "correct",
    tabariScoreAnswered: "answered",
    tabariReset: "Reset",
    tabariQuestion: "Question",
    tabariLoadingNext: "Loading next exercise…",
    tabariCouldNotLoad: "Could not load exercise. Please try again.",
    tabariAllExhaustedTitle: "All exercises completed!",
    tabariAllExhaustedDesc: "You have answered all available exercises in this session.",
    tabariStartNewSession: "Start New Session",
    tabariCheckingAnswer: "Checking your answer…",
    tabariCorrectFeedback: "Correct!",
    tabariIncorrectFeedback: "Not quite",
    tabariMultiVerseContext: "Multi-verse context",
  },
  ar: {
    tabariVocabularyTitle: "مفردات تفسير الطبري",
    tabariVocabularyDesc: "أسئلة اختيار من متعدد حول معاني الكلمات القرآنية مستقاة حصرياً من تفسير الطبري",
    tabariVocabularyPageDesc: "ابحث عن المعنى الدقيق للكلمة العربية في آيتها القرآنية — مستقى من تفسير الطبري",
    tabariVocabularyFooter: "تمارين تغطي سورة الفاتحة والسور من 93 إلى 114 — مستقاة حصرياً من تفسير الطبري",
    selfExplanationDashDesc: "اختر الكلمة القرآنية الصحيحة، ثم اشرح لماذا تناسب الآية — يُقيَّم تفسيرك بالذكاء الاصطناعي مقابل بيانات تفسير الطبري.",
    aiGraded: "مُقيَّم بالذكاء الاصطناعي",
    tabariSource: "مصدر الطبري",
    tabariScoreCorrect: "صحيح",
    tabariScoreAnswered: "أُجيب عليها",
    tabariReset: "إعادة تعيين",
    tabariQuestion: "السؤال",
    tabariLoadingNext: "تحميل التمرين التالي…",
    tabariCouldNotLoad: "تعذّر تحميل التمرين. يرجى المحاولة مجدداً.",
    tabariAllExhaustedTitle: "أنهيت جميع التمارين!",
    tabariAllExhaustedDesc: "لقد أجبت على جميع التمارين المتاحة في هذه الجلسة.",
    tabariStartNewSession: "بدء جلسة جديدة",
    tabariCheckingAnswer: "جارٍ التحقق من إجابتك…",
    tabariCorrectFeedback: "صحيح!",
    tabariIncorrectFeedback: "ليس تماماً",
    tabariMultiVerseContext: "سياق متعدد الآيات",
  },
  id: {
    tabariVocabularyTitle: "Kosakata Tafsir al-Tabari",
    tabariVocabularyDesc: "Pertanyaan pilihan ganda tentang makna kata Qurani yang bersumber eksklusif dari Tafsir al-Tabari",
    tabariVocabularyPageDesc: "Temukan makna kata Arab yang tepat dalam ayatnya — bersumber dari Tafsir al-Tabari",
    tabariVocabularyFooter: "Latihan mencakup Surah Al-Fatihah (1) dan Surah 93–114 — bersumber eksklusif dari Tafsir al-Tabari",
    selfExplanationDashDesc: "Pilih kata Qurani yang benar, lalu jelaskan mengapa cocok dengan ayat — dievaluasi dengan AI berdasarkan data referensi Tafsir al-Tabari.",
    aiGraded: "Dinilai AI",
    tabariSource: "Sumber Tabari",
    tabariScoreCorrect: "benar",
    tabariScoreAnswered: "dijawab",
    tabariReset: "Atur ulang",
    tabariQuestion: "Pertanyaan",
    tabariLoadingNext: "Memuat latihan berikutnya…",
    tabariCouldNotLoad: "Gagal memuat latihan. Silakan coba lagi.",
    tabariAllExhaustedTitle: "Semua latihan selesai!",
    tabariAllExhaustedDesc: "Anda telah menjawab semua latihan yang tersedia dalam sesi ini.",
    tabariStartNewSession: "Mulai Sesi Baru",
    tabariCheckingAnswer: "Memeriksa jawaban Anda…",
    tabariCorrectFeedback: "Benar!",
    tabariIncorrectFeedback: "Hampir benar",
    tabariMultiVerseContext: "Konteks multi-ayat",
  },
  tr: {
    tabariVocabularyTitle: "Taberi Tefsiri Kelime Hazinesi",
    tabariVocabularyDesc: "Yalnızca Taberi Tefsiri'nden alınan Kuranik kelime anlamlarına dair çoktan seçmeli sorular",
    tabariVocabularyPageDesc: "Kuranik ayetindeki kelimenin tam Arapça anlamını bulun — Taberi Tefsiri'nden alınmıştır",
    tabariVocabularyFooter: "El-Fatiha (1) ve 93–114 surelerini kapsayan egzersizler — yalnızca Taberi Tefsiri'nden",
    selfExplanationDashDesc: "Doğru Kuranik kelimeyi seç, ardından neden ayete uyduğunu açıkla — açıklaman AI tarafından Taberi Tefsiri referans verileriyle değerlendirilir.",
    aiGraded: "AI tarafından değerlendirildi",
    tabariSource: "Taberi kaynağı",
    tabariScoreCorrect: "doğru",
    tabariScoreAnswered: "yanıtlandı",
    tabariReset: "Sıfırla",
    tabariQuestion: "Soru",
    tabariLoadingNext: "Sonraki egzersiz yükleniyor…",
    tabariCouldNotLoad: "Egzersiz yüklenemedi. Lütfen tekrar deneyin.",
    tabariAllExhaustedTitle: "Tüm egzersizler tamamlandı!",
    tabariAllExhaustedDesc: "Bu oturumdaki tüm mevcut egzersizleri yanıtladınız.",
    tabariStartNewSession: "Yeni Oturum Başlat",
    tabariCheckingAnswer: "Cevabınız kontrol ediliyor…",
    tabariCorrectFeedback: "Doğru!",
    tabariIncorrectFeedback: "Tam değil",
    tabariMultiVerseContext: "Çok ayetli bağlam",
  },
  zh: {
    tabariVocabularyTitle: "塔巴里注释词汇",
    tabariVocabularyDesc: "专门来源于塔巴里注释的古兰经词义多项选择题",
    tabariVocabularyPageDesc: "在古兰经经文中查找准确的阿拉伯语词义——来源于塔巴里注释",
    tabariVocabularyFooter: "涵盖法提哈章（1）和第93–114章的练习——专门来源于塔巴里注释",
    selfExplanationDashDesc: "选择正确的古兰经单词，然后解释为什么它适合这段经文——通过AI对照塔巴里注释参考数据评估。",
    aiGraded: "AI评分",
    tabariSource: "塔巴里来源",
    tabariScoreCorrect: "正确",
    tabariScoreAnswered: "已回答",
    tabariReset: "重置",
    tabariQuestion: "问题",
    tabariLoadingNext: "加载下一道练习…",
    tabariCouldNotLoad: "无法加载练习，请重试。",
    tabariAllExhaustedTitle: "所有练习已完成！",
    tabariAllExhaustedDesc: "您已完成本次课程中所有可用练习。",
    tabariStartNewSession: "开始新课程",
    tabariCheckingAnswer: "正在检查您的答案…",
    tabariCorrectFeedback: "正确！",
    tabariIncorrectFeedback: "不太对",
    tabariMultiVerseContext: "多节上下文",
  },
  sw: {
    tabariVocabularyTitle: "Msamiati wa Tafsiri ya Tabari",
    tabariVocabularyDesc: "Maswali ya chaguo nyingi kuhusu maana za maneno ya Kiqurani yanayotoka peke yake kwenye Tafsiri ya Tabari",
    tabariVocabularyPageDesc: "Pata maana halisi ya neno la Kiarabu katika aya yake — kutoka Tafsiri ya Tabari",
    tabariVocabularyFooter: "Mazoezi yanayoshughulikia Surah Al-Fatiha (1) na Surah 93–114 — kutoka peke yake Tafsiri ya Tabari",
    selfExplanationDashDesc: "Chagua neno sahihi la Kiqurani, kisha eleza kwa nini linafaa aya — tathminiwa na AI dhidi ya data ya kumbukumbu ya Tafsiri ya Tabari.",
    aiGraded: "Imepimwa na AI",
    tabariSource: "Chanzo cha Tabari",
    tabariScoreCorrect: "sahihi",
    tabariScoreAnswered: "imejibiwa",
    tabariReset: "Weka upya",
    tabariQuestion: "Swali",
    tabariLoadingNext: "Inapakia zoezi lijalo…",
    tabariCouldNotLoad: "Haikuweza kupakia zoezi. Tafadhali jaribu tena.",
    tabariAllExhaustedTitle: "Mazoezi yote yamekamilika!",
    tabariAllExhaustedDesc: "Umejibu mazoezi yote yanayopatikana katika kipindi hiki.",
    tabariStartNewSession: "Anza Kipindi Kipya",
    tabariCheckingAnswer: "Inakagua jibu lako…",
    tabariCorrectFeedback: "Sahihi!",
    tabariIncorrectFeedback: "Si sahihi kabisa",
    tabariMultiVerseContext: "Muktadha wa aya nyingi",
  },
  so: {
    tabariVocabularyTitle: "Qaamuuska Tafsiirka al-Tabari",
    tabariVocabularyDesc: "Su'aalo doorasho badan oo ku saabsan macnaynta erayada Quraanka ee ka imanaya Tafsiirka al-Tabari kaliya",
    tabariVocabularyPageDesc: "Hel macnaha saxda ah ee erayga Carabiga ee aayaddii — ka socota Tafsiirka al-Tabari",
    tabariVocabularyFooter: "Tababarro daboolaya Suurat Al-Faatixa (1) iyo Suuradaha 93–114 — ka soo baxay Tafsiirka al-Tabari",
    selfExplanationDashDesc: "Dooro erayga Quraanka ee saxda ah, kadibna sharax sababta uu u habboon yahay aayaddaas — waxaa qiimeeysa AI oo u haya xogta tixraaca Tafsiirka al-Tabari.",
    aiGraded: "AI ayaa qiimeeyay",
    tabariSource: "Isha Tabari",
    tabariScoreCorrect: "saxan",
    tabariScoreAnswered: "la jawaabay",
    tabariReset: "Dib u deji",
    tabariQuestion: "Su'aal",
    tabariLoadingNext: "Waxaa la soo rarayo tababarka xiga…",
    tabariCouldNotLoad: "Tababarka lama soo qaadi karin. Fadlan isku day mar kale.",
    tabariAllExhaustedTitle: "Dhammaan tababarrada waa la dhammeeyay!",
    tabariAllExhaustedDesc: "Waad ka jawaabatay dhammaan tababarrada la heli karo xilligaan.",
    tabariStartNewSession: "Bilow Xilli Cusub",
    tabariCheckingAnswer: "Jawaabkaaga waxaa la hubinayaa…",
    tabariCorrectFeedback: "Saxan!",
    tabariIncorrectFeedback: "Kuma dhaafin",
    tabariMultiVerseContext: "Mowqifka aayado badan",
  },
  bs: {
    tabariVocabularyTitle: "Rječnik Tefsira al-Tabari",
    tabariVocabularyDesc: "Pitanja višestrukog izbora o značenjima kur'anskih riječi koja potiču isključivo iz Tefsira al-Tabari",
    tabariVocabularyPageDesc: "Pronađi tačno arapsko značenje riječi u njenom kur'anskom ajetu — iz Tefsira al-Tabari",
    tabariVocabularyFooter: "Vježbe koje obuhvataju Suru Al-Fatihu (1) i Sure 93–114 — isključivo iz Tefsira al-Tabari",
    selfExplanationDashDesc: "Odaberi ispravnu kur'ansku riječ, zatim objasni zašto odgovara ajetu — evaluirano AI-om u odnosu na referentne podatke Tefsira al-Tabari.",
    aiGraded: "Ocijenio AI",
    tabariSource: "Izvor Tabari",
    tabariScoreCorrect: "tačno",
    tabariScoreAnswered: "odgovoreno",
    tabariReset: "Resetuj",
    tabariQuestion: "Pitanje",
    tabariLoadingNext: "Učitava se sljedeća vježba…",
    tabariCouldNotLoad: "Vježba se nije mogla učitati. Pokušaj ponovo.",
    tabariAllExhaustedTitle: "Sve vježbe su završene!",
    tabariAllExhaustedDesc: "Odgovorili ste na sve dostupne vježbe u ovoj sesiji.",
    tabariStartNewSession: "Pokreni novu sesiju",
    tabariCheckingAnswer: "Provjerava se vaš odgovor…",
    tabariCorrectFeedback: "Tačno!",
    tabariIncorrectFeedback: "Nije baš",
    tabariMultiVerseContext: "Kontekst više ajeta",
  },
  sq: {
    tabariVocabularyTitle: "Fjalori i Tefsirit al-Tabari",
    tabariVocabularyDesc: "Pyetje me zgjedhje të shumëfishtë mbi kuptimet e fjalëve kuranore të marra ekskluzivisht nga Tefsiri al-Tabari",
    tabariVocabularyPageDesc: "Gjej kuptimin e saktë arabisht të fjalës në ajetin e saj kuranor — nga Tefsiri al-Tabari",
    tabariVocabularyFooter: "Ushtrime që mbulojnë Suren Al-Fatihah (1) dhe Suret 93–114 — ekskluzivisht nga Tefsiri al-Tabari",
    selfExplanationDashDesc: "Zgjidh fjalën e saktë kuranore, pastaj shpjego pse i përshtatet ajetit — vlerësohet nga AI kundrejt të dhënave referencë të Tefsirit al-Tabari.",
    aiGraded: "Vlerësuar nga AI",
    tabariSource: "Burimi Tabari",
    tabariScoreCorrect: "saktë",
    tabariScoreAnswered: "u përgjigj",
    tabariReset: "Rivendos",
    tabariQuestion: "Pyetje",
    tabariLoadingNext: "Po ngarkohet ushtrimi tjetër…",
    tabariCouldNotLoad: "Ushtrimi nuk mund të ngarkohej. Ju lutemi provoni përsëri.",
    tabariAllExhaustedTitle: "Të gjitha ushtrimet u kryen!",
    tabariAllExhaustedDesc: "Ju i keni përgjigju të gjitha ushtrimeve të disponueshme në këtë sesion.",
    tabariStartNewSession: "Fillo Sesion të Ri",
    tabariCheckingAnswer: "Po kontrollohet përgjigja juaj…",
    tabariCorrectFeedback: "Saktë!",
    tabariIncorrectFeedback: "Jo fare",
    tabariMultiVerseContext: "Kontekst me shumë ajete",
  },
  ru: {
    tabariVocabularyTitle: "Словарный запас Тафсира ат-Табари",
    tabariVocabularyDesc: "Вопросы с несколькими вариантами ответа о значениях коранических слов, взятые исключительно из Тафсира ат-Табари",
    tabariVocabularyPageDesc: "Найди точное значение арабского слова в его коранском аяте — из Тафсира ат-Табари",
    tabariVocabularyFooter: "Упражнения, охватывающие суру Аль-Фатиха (1) и суры 93–114 — исключительно из Тафсира ат-Табари",
    selfExplanationDashDesc: "Выбери правильное коранское слово, затем объясни, почему оно подходит к аяту — оценивается ИИ по справочным данным Тафсира ат-Табари.",
    aiGraded: "Оценено ИИ",
    tabariSource: "Источник Табари",
    tabariScoreCorrect: "правильно",
    tabariScoreAnswered: "отвечено",
    tabariReset: "Сбросить",
    tabariQuestion: "Вопрос",
    tabariLoadingNext: "Загружается следующее упражнение…",
    tabariCouldNotLoad: "Не удалось загрузить упражнение. Пожалуйста, попробуйте снова.",
    tabariAllExhaustedTitle: "Все упражнения завершены!",
    tabariAllExhaustedDesc: "Вы ответили на все доступные упражнения в этом сеансе.",
    tabariStartNewSession: "Начать новый сеанс",
    tabariCheckingAnswer: "Проверяется ваш ответ…",
    tabariCorrectFeedback: "Правильно!",
    tabariIncorrectFeedback: "Не совсем",
    tabariMultiVerseContext: "Контекст нескольких аятов",
  },
  ur: {
    tabariVocabularyTitle: "تفسیر الطبری کا ذخیرہ الفاظ",
    tabariVocabularyDesc: "قرآنی الفاظ کے معانی پر کثیر انتخابی سوالات جو صرف تفسیر الطبری سے ماخوذ ہیں",
    tabariVocabularyPageDesc: "قرآنی آیت میں عربی لفظ کا درست معنی تلاش کریں — تفسیر الطبری سے ماخوذ",
    tabariVocabularyFooter: "سورہ الفاتحہ (1) اور سورۃ 93–114 پر مشتمل مشقیں — صرف تفسیر الطبری سے",
    selfExplanationDashDesc: "درست قرآنی لفظ چنیں، پھر بتائیں کہ یہ آیت میں کیوں موزوں ہے — AI کے ذریعے تفسیر الطبری کے حوالہ جاتی ڈیٹا کے خلاف جائزہ لیا جائے گا۔",
    aiGraded: "AI نے جانچا",
    tabariSource: "طبری ماخذ",
    tabariScoreCorrect: "درست",
    tabariScoreAnswered: "جواب دیا",
    tabariReset: "دوبارہ ترتیب دیں",
    tabariQuestion: "سوال",
    tabariLoadingNext: "اگلی مشق لوڈ ہو رہی ہے…",
    tabariCouldNotLoad: "مشق لوڈ نہیں ہو سکی۔ براہ کرم دوبارہ کوشش کریں۔",
    tabariAllExhaustedTitle: "تمام مشقیں مکمل ہو گئیں!",
    tabariAllExhaustedDesc: "آپ نے اس سیشن میں تمام دستیاب مشقوں کے جوابات دے دیے ہیں۔",
    tabariStartNewSession: "نیا سیشن شروع کریں",
    tabariCheckingAnswer: "آپ کا جواب چیک کیا جا رہا ہے…",
    tabariCorrectFeedback: "درست!",
    tabariIncorrectFeedback: "بالکل نہیں",
    tabariMultiVerseContext: "متعدد آیات کا سیاق",
  },
  bn: {
    tabariVocabularyTitle: "তাফসীর আল-তাবারি শব্দভান্ডার",
    tabariVocabularyDesc: "শুধুমাত্র তাফসীর আল-তাবারি থেকে নেওয়া কুরআনিক শব্দের অর্থের উপর বহু নির্বাচনী প্রশ্ন",
    tabariVocabularyPageDesc: "কুরআনের আয়াতে আরবি শব্দের সঠিক অর্থ খুঁজুন — তাফসীর আল-তাবারি থেকে",
    tabariVocabularyFooter: "সুরা আল-ফাতিহা (১) এবং সুরা ৯৩–১১৪ কভার করা অনুশীলন — শুধুমাত্র তাফসীর আল-তাবারি থেকে",
    selfExplanationDashDesc: "সঠিক কুরআনিক শব্দটি বেছে নিন, তারপর ব্যাখ্যা করুন কেন এটি আয়াতের সাথে মানায় — AI দ্বারা তাফসীর আল-তাবারি রেফারেন্স ডেটার বিপরীতে মূল্যায়িত।",
    aiGraded: "AI দ্বারা মূল্যায়িত",
    tabariSource: "তাবারি উৎস",
    tabariScoreCorrect: "সঠিক",
    tabariScoreAnswered: "উত্তর দেওয়া হয়েছে",
    tabariReset: "রিসেট",
    tabariQuestion: "প্রশ্ন",
    tabariLoadingNext: "পরবর্তী অনুশীলন লোড হচ্ছে…",
    tabariCouldNotLoad: "অনুশীলন লোড করা যায়নি। আবার চেষ্টা করুন।",
    tabariAllExhaustedTitle: "সব অনুশীলন সম্পন্ন!",
    tabariAllExhaustedDesc: "আপনি এই সেশনে সব উপলব্ধ অনুশীলনের উত্তর দিয়েছেন।",
    tabariStartNewSession: "নতুন সেশন শুরু করুন",
    tabariCheckingAnswer: "আপনার উত্তর যাচাই করা হচ্ছে…",
    tabariCorrectFeedback: "সঠিক!",
    tabariIncorrectFeedback: "ঠিক নয়",
    tabariMultiVerseContext: "বহু আয়াতের প্রসঙ্গ",
  },
  ms: {
    tabariVocabularyTitle: "Kosa Kata Tafsir al-Tabari",
    tabariVocabularyDesc: "Soalan pelbagai pilihan tentang makna perkataan Qurani yang bersumber eksklusif dari Tafsir al-Tabari",
    tabariVocabularyPageDesc: "Cari makna kata Arab yang tepat dalam ayatnya — bersumber dari Tafsir al-Tabari",
    tabariVocabularyFooter: "Latihan merangkumi Surah Al-Fatihah (1) dan Surah 93–114 — eksklusif dari Tafsir al-Tabari",
    selfExplanationDashDesc: "Pilih perkataan Qurani yang betul, kemudian jelaskan mengapa ia sesuai dengan ayat — dinilai oleh AI berbanding data rujukan Tafsir al-Tabari.",
    aiGraded: "Dinilai AI",
    tabariSource: "Sumber Tabari",
    tabariScoreCorrect: "betul",
    tabariScoreAnswered: "dijawab",
    tabariReset: "Tetapkan Semula",
    tabariQuestion: "Soalan",
    tabariLoadingNext: "Memuatkan latihan seterusnya…",
    tabariCouldNotLoad: "Tidak dapat memuatkan latihan. Sila cuba lagi.",
    tabariAllExhaustedTitle: "Semua latihan selesai!",
    tabariAllExhaustedDesc: "Anda telah menjawab semua latihan yang tersedia dalam sesi ini.",
    tabariStartNewSession: "Mulakan Sesi Baharu",
    tabariCheckingAnswer: "Menyemak jawapan anda…",
    tabariCorrectFeedback: "Betul!",
    tabariIncorrectFeedback: "Tidak tepat",
    tabariMultiVerseContext: "Konteks berbilang ayat",
  },
  sus: {
    tabariVocabularyTitle: "Tafsir al-Tabari Kuma Sɛnkɛ",
    tabariVocabularyDesc: "Ɲɛnamaya suaru Tafsir al-Tabari na bɔra kuma Kuraan ya",
    tabariVocabularyPageDesc: "Wo kuma Arabu wɔ ayati kɔnɔ — Tafsir al-Tabari na bɔra",
    tabariVocabularyFooter: "Tɛmɛya Al-Fatiha (1) ni Sure 93–114 — Tafsir al-Tabari na bɔra",
    selfExplanationDashDesc: "Sigi kuma wɔ Kuraan ya, na a yɛrɛ kuma ra fɔ a lɔ ayati kɔnɔ — AI ye qiimeli a li Tafsir al-Tabari xui ma.",
    aiGraded: "AI ye qiimeli",
    tabariSource: "Tabari bɔ yi",
    tabariScoreCorrect: "tixi",
    tabariScoreAnswered: "jaabi birin",
    tabariReset: "Sɔtɔ",
    tabariQuestion: "Suaru",
    tabariLoadingNext: "Tɛmɛya xɔdi yiɛtɛ do…",
    tabariCouldNotLoad: "Tɛmɛya mɔ bɔ. Wo kɛrɛ taa.",
    tabariAllExhaustedTitle: "Tɛmɛya birin dɔxɔma!",
    tabariAllExhaustedDesc: "I ye tɛmɛya birin jaabi fɔlɔ.",
    tabariStartNewSession: "Sɔtɔ Tɛmɛya Suban",
    tabariCheckingAnswer: "I jaabi xɔlikɛ…",
    tabariCorrectFeedback: "Tixi!",
    tabariIncorrectFeedback: "Mɔ tixi sɔxɔ",
    tabariMultiVerseContext: "Ayati kelenkelenŋa",
  },
  fr: {
    tabariVocabularyTitle: "Vocabulaire du Tafsir al-Tabari",
    tabariVocabularyDesc: "Questions à choix multiples sur les significations des mots coraniques tirées exclusivement du Tafsir al-Tabari",
    tabariVocabularyPageDesc: "Trouvez la signification exacte du mot arabe dans son verset coranique — issu du Tafsir al-Tabari",
    tabariVocabularyFooter: "Exercices couvrant la Sourate Al-Fatiha (1) et les Sourates 93–114 — exclusivement du Tafsir al-Tabari",
    selfExplanationDashDesc: "Choisissez le mot coranique correct, puis expliquez pourquoi il convient au verset — évalué par l'IA par rapport aux données de référence du Tafsir al-Tabari.",
    aiGraded: "Évalué par IA",
    tabariSource: "Source Tabari",
    tabariScoreCorrect: "correct",
    tabariScoreAnswered: "répondu",
    tabariReset: "Réinitialiser",
    tabariQuestion: "Question",
    tabariLoadingNext: "Chargement de l'exercice suivant…",
    tabariCouldNotLoad: "Impossible de charger l'exercice. Veuillez réessayer.",
    tabariAllExhaustedTitle: "Tous les exercices terminés !",
    tabariAllExhaustedDesc: "Vous avez répondu à tous les exercices disponibles dans cette session.",
    tabariStartNewSession: "Démarrer une nouvelle session",
    tabariCheckingAnswer: "Vérification de votre réponse…",
    tabariCorrectFeedback: "Correct !",
    tabariIncorrectFeedback: "Pas tout à fait",
    tabariMultiVerseContext: "Contexte multi-versets",
  },
  hi: {
    tabariVocabularyTitle: "तफ़सीर अल-तबरी शब्दावली",
    tabariVocabularyDesc: "केवल तफ़सीर अल-तबरी से ली गई कुरआनी शब्दों के अर्थों पर बहुविकल्पीय प्रश्न",
    tabariVocabularyPageDesc: "कुरआनी आयत में अरबी शब्द का सटीक अर्थ खोजें — तफ़सीर अल-तबरी से",
    tabariVocabularyFooter: "सूरा अल-फातिहा (1) और सूरा 93–114 को कवर करने वाले अभ्यास — केवल तफ़सीर अल-तबरी से",
    selfExplanationDashDesc: "सही कुरआनी शब्द चुनें, फिर बताएं कि यह आयत में क्यों उचित है — AI द्वारा तफ़सीर अल-तबरी संदर्भ डेटा के विरुद्ध मूल्यांकन किया जाएगा।",
    aiGraded: "AI द्वारा मूल्यांकित",
    tabariSource: "तबरी स्रोत",
    tabariScoreCorrect: "सही",
    tabariScoreAnswered: "उत्तर दिया",
    tabariReset: "रीसेट करें",
    tabariQuestion: "प्रश्न",
    tabariLoadingNext: "अगला अभ्यास लोड हो रहा है…",
    tabariCouldNotLoad: "अभ्यास लोड नहीं हो सका। कृपया पुनः प्रयास करें।",
    tabariAllExhaustedTitle: "सभी अभ्यास पूर्ण!",
    tabariAllExhaustedDesc: "आपने इस सत्र में सभी उपलब्ध अभ्यासों के उत्तर दे दिए हैं।",
    tabariStartNewSession: "नया सत्र शुरू करें",
    tabariCheckingAnswer: "आपका उत्तर जाँचा जा रहा है…",
    tabariCorrectFeedback: "सही!",
    tabariIncorrectFeedback: "बिल्कुल नहीं",
    tabariMultiVerseContext: "बहु-आयत संदर्भ",
  },
  ky: {
    tabariVocabularyTitle: "Тафсир ат-Табари сөздүгү",
    tabariVocabularyDesc: "Куран сөздөрүнүн маанилери боюнча көп тандоолуу суроолор, Тафсир ат-Табаридан гана алынган",
    tabariVocabularyPageDesc: "Куран аятындагы арабча сөздүн так маанисин табыңыз — Тафсир ат-Табаридан",
    tabariVocabularyFooter: "Фатиха сүрөсүн (1) жана 93–114 сүрөлөрдү камтыган машыгуулар — Тафсир ат-Табаридан гана",
    selfExplanationDashDesc: "Туура Куран сөзүн тандаңыз, анан ал аятка эмнеге ылайыктуу экенин түшүндүрүңүз — AI тарабынан Тафсир ат-Табари маалыматтарына карата баалоо жүргүзүлөт.",
    aiGraded: "AI баалады",
    tabariSource: "Табари булагы",
    tabariScoreCorrect: "туура",
    tabariScoreAnswered: "жооп берилди",
    tabariReset: "Баштапкы абалга кайтаруу",
    tabariQuestion: "Суроо",
    tabariLoadingNext: "Кийинки машыгуу жүктөлүүдө…",
    tabariCouldNotLoad: "Машыгуу жүктөлгөн жок. Кайра аракет кылыңыз.",
    tabariAllExhaustedTitle: "Бардык машыгуулар аяктады!",
    tabariAllExhaustedDesc: "Сиз бул сеанстагы бардык жеткиликтүү машыгууларга жооп бердиңиз.",
    tabariStartNewSession: "Жаңы сеансты баштоо",
    tabariCheckingAnswer: "Жообуңуз текшерилүүдө…",
    tabariCorrectFeedback: "Туура!",
    tabariIncorrectFeedback: "Так эмес",
    tabariMultiVerseContext: "Бир нече аяттын контексти",
  },
};

// ── Inject into translations.ts ───────────────────────────────────────────────

let content = fs.readFileSync(FILE, "utf8");

for (const [lang, keys] of Object.entries(NEW_KEYS)) {
  // Find the LAST key in each language block and append after it
  // Strategy: find the closing of each lang block and insert before it
  // Each block ends with: \n  },\n (either followed by next lang or by };)

  // Build the injection string
  const injection = Object.entries(keys)
    .map(([k, v]) => `    ${k}: "${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",`)
    .join("\n");

  // Find the language block's last line before its closing brace
  // Pattern: we look for the lang block and find where signupStudentCreated is (last key)
  // Actually we'll find the closing of the block more reliably using a marker

  // Find: the signupStudentCreated key in this language's block
  // The language blocks are separated by:  },\n  nextlang: {
  // We find the block by looking for `  lang: {` and then finding its closing `  },`

  // Simple approach: find `    signupStudentCreated: "..."\n  },` for this lang
  // and insert the new keys before `  },`

  // Find the position of the lang block start
  const langStart = content.indexOf(`\n  ${lang}: {`);
  if (langStart === -1) {
    console.warn(`⚠️  Language "${lang}" not found — skipping`);
    continue;
  }

  // Find the closing of this block: next `\n  },` after langStart
  const blockClose = content.indexOf("\n  },\n", langStart + 1);
  if (blockClose === -1) {
    console.warn(`⚠️  Could not find closing for "${lang}" — skipping`);
    continue;
  }

  // Check if keys already exist (idempotent)
  const firstKey = Object.keys(keys)[0];
  const blockContent = content.slice(langStart, blockClose);
  if (blockContent.includes(`    ${firstKey}:`)) {
    console.log(`✓ "${lang}" already has new keys — skipping`);
    continue;
  }

  // Insert before the closing brace
  content =
    content.slice(0, blockClose) +
    "\n" + injection +
    content.slice(blockClose);

  console.log(`✓ Added ${Object.keys(keys).length} keys to "${lang}"`);
}

fs.writeFileSync(FILE, content);
console.log("\n✅ Done. translations.ts updated.");
