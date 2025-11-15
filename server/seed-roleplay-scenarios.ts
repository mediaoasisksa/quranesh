import { db } from "./db";
import { roleplayScenarios } from "@shared/schema";

async function seedRoleplayScenarios() {
  console.log("🎭 Seeding 50 psychological roleplay scenarios...\n");

  const scenarios = [
    // Scenarios 1-10: Academic and Career Challenges
    {
      scenario: "صديقك رسب في اختبار مصيري، ويشعر انه فاشل ولا مستقبل له، ويقول: تعبت من المحاولة. استخدم كلمات او جملة من القران تعيد بناء الامل والثقة بالنفس.",
      scenarioEn: "Your friend failed a critical exam and feels like a failure with no future, saying: 'I'm tired of trying.' Use words or phrases from the Quran to rebuild hope and self-confidence.",
      theme: "hope",
      psychologicalDepth: "Dealing with academic failure and loss of hope",
      difficulty: 2,
    },
    {
      scenario: "والد زميلك فقد عمله فجأة، والبيت كله يعيش قلقا ماليا، وزميلك يسالك: هل سيضيع مستقبلنا؟ قدم له ردا مستندا الى القران يخفف قلقه على الرزق.",
      scenarioEn: "Your colleague's father suddenly lost his job, and the whole family is experiencing financial anxiety. Your colleague asks: 'Will our future be lost?' Provide a Quran-based response to ease their worry about sustenance.",
      theme: "trust",
      psychologicalDepth: "Financial anxiety and trust in divine provision",
      difficulty: 2,
    },
    {
      scenario: "فتاة تقارن نفسها بصديقاتها في وسائل التواصل، وتشعر بالنقص لان حياتها ليست جميلة مثلهم. استخدم جملة قرانية تساعدها على تقبل ذاتها وعدم قياس قيمتها بالمظاهر.",
      scenarioEn: "A girl compares herself to her friends on social media and feels inadequate because her life isn't as beautiful as theirs. Use a Quranic phrase to help her accept herself and not measure her worth by appearances.",
      theme: "self_worth",
      psychologicalDepth: "Social comparison and self-acceptance",
      difficulty: 2,
    },
    {
      scenario: "طفل في المدرسة يتعرض للتنمر من بعض زملائه، ويبدأ يصدق انه ضعيف واقل قيمة. اكتب ردا من القران يعزز كرامته الانسانية وقيمته عند الله.",
      scenarioEn: "A child in school is being bullied by some classmates and starts believing he is weak and of less value. Write a Quranic response that reinforces his human dignity and worth in Allah's eyes.",
      theme: "dignity",
      psychologicalDepth: "Bullying and human dignity",
      difficulty: 1,
    },
    {
      scenario: "طالب يعيش قلقا مستمرا من المستقبل الدراسي والوظيفي، ويسالك: ماذا لو فشلت في كل شيء؟ استخدم كلمات من القران تبني لديه مفهوم التوكل مع الاخذ بالاسباب.",
      scenarioEn: "A student experiences constant anxiety about academic and professional future, asking: 'What if I fail at everything?' Use Quranic words to build the concept of trust in Allah while taking action.",
      theme: "anxiety",
      psychologicalDepth: "Future anxiety and balanced approach to effort and trust",
      difficulty: 2,
    },
    {
      scenario: "شاب فقد اقرب اصدقائه في حادث، ويشعر بحزن عميق وغضب من القدر. استخدم اية او جملة قرانية تساعده على فهم معنى الابتلاء والصبر على الفقد.",
      scenarioEn: "A young man lost his closest friend in an accident and feels deep sadness and anger at fate. Use a Quranic verse or phrase to help him understand the meaning of trial and patience with loss.",
      theme: "grief",
      psychologicalDepth: "Processing grief and anger at divine decree",
      difficulty: 3,
    },
    {
      scenario: "ام فقدت جنينها مرارا، وتقول لك: لماذا يحرمني الله من الامومة؟ اكتب لها ردا من القران يواسي حزنها ويربط قلبها بحكمة الله ورحمته.",
      scenarioEn: "A mother who has lost her fetus repeatedly says: 'Why does Allah deprive me of motherhood?' Write a Quranic response that consoles her grief and connects her heart to Allah's wisdom and mercy.",
      theme: "acceptance",
      psychologicalDepth: "Recurrent loss and questioning divine wisdom",
      difficulty: 4,
    },
    {
      scenario: "مراهق يشاهد اخبار الحروب والظلم في العالم، ويقول: اين عدل الله؟ استخدم كلمات من القران تشرح له معنى الابتلاء والعدل الالهي في الدنيا والاخرة.",
      scenarioEn: "A teenager watches news of wars and injustice in the world and asks: 'Where is Allah's justice?' Use Quranic words to explain the meaning of trial and divine justice in this life and the hereafter.",
      theme: "faith",
      psychologicalDepth: "Theodicy and understanding divine justice",
      difficulty: 3,
    },
    {
      scenario: "طالبة متفوقة تشعر بضغوط كبيرة من والديها للحفاظ على الدرجة الاولى دائما، وتخاف من خيبتهم. اكتب ردا قرانيا يخفف ضغط الكمال ويعيد ترتيب الاولويات.",
      scenarioEn: "An excellent student feels great pressure from her parents to always maintain first place and fears disappointing them. Write a Quranic response that eases perfectionism and realigns priorities.",
      theme: "balance",
      psychologicalDepth: "Perfectionism and parental pressure",
      difficulty: 2,
    },
    {
      scenario: "شاب على وشك الزواج يشعر بخوف شديد من المسؤولية ومن الفشل كزوج واب. استخدم جملة من القران تبني عنده الاطمئنان والاستعانة بالله في بناء البيت.",
      scenarioEn: "A young man about to marry feels extreme fear of responsibility and failure as a husband and father. Use a Quranic phrase to build reassurance and reliance on Allah in building a home.",
      theme: "trust",
      psychologicalDepth: "Pre-marriage anxiety and fear of failure",
      difficulty: 2,
    },

    // Scenarios 11-20: Relationships and Social Challenges
    {
      scenario: "زوجان يعيشان خلافات متكررة، وكل واحد يلقي اللوم على الاخر، ويفكران في الطلاق. اكتب خطابا قصيرا من القران يذكرهما بمبدأ الاحسان والصبر في العلاقة الزوجية.",
      scenarioEn: "A couple experiences repeated conflicts, each blaming the other, and they're considering divorce. Write a brief Quranic message reminding them of the principle of excellence and patience in marital relationship.",
      theme: "patience",
      psychologicalDepth: "Marital conflict resolution and mutual blame",
      difficulty: 3,
    },
    {
      scenario: "شابة تشعر بانها قبيحة، وترى ان قيمتها في شكلها فقط، وتقول: لا احد سيحبني. استخدم جملة قرانية تعيد تعريف الجمال والقيمة الحقيقية للانسان.",
      scenarioEn: "A young woman feels ugly and sees her value only in her appearance, saying: 'No one will love me.' Use a Quranic phrase to redefine beauty and the true value of a person.",
      theme: "self_worth",
      psychologicalDepth: "Body image issues and self-worth",
      difficulty: 2,
    },
    {
      scenario: "مراهق مدمن على الهاتف والالعاب، يشعر بالندم لكنه يقول: لا استطيع التوقف. قدم له رسالة من القران تعينه على مجاهدة النفس وتنظيم الوقت.",
      scenarioEn: "A teenager addicted to phone and games feels regret but says: 'I can't stop.' Provide a Quranic message to help them struggle with themselves and organize their time.",
      theme: "self_control",
      psychologicalDepth: "Digital addiction and self-regulation",
      difficulty: 2,
    },
    {
      scenario: "طالب يدرس في دولة اجنبية يشعر بالوحدة الشديدة والغربة الداخلية، ويسالك: لماذا اشعر انني مقطوع عن الجميع؟ استخدم كلمات من القران تمنحه شعورا بالمصاحبة الالهية وعدم الوحدة.",
      scenarioEn: "A student studying abroad feels intense loneliness and internal alienation, asking: 'Why do I feel cut off from everyone?' Use Quranic words to give a sense of divine companionship and non-aloneness.",
      theme: "companionship",
      psychologicalDepth: "Loneliness and spiritual connection",
      difficulty: 2,
    },
    {
      scenario: "ام غاضبة جدا من تصرفات ابنها المراهق، وتفكر ان تقسو عليه بقوة. اكتب لها ردا من القران يوازن بين التربية والحلم والرفق.",
      scenarioEn: "A mother is very angry at her teenage son's behavior and considers being harsh with him. Write a Quranic response that balances discipline with clemency and gentleness.",
      theme: "compassion",
      psychologicalDepth: "Parental anger and balanced discipline",
      difficulty: 2,
    },
    {
      scenario: "شاب تصيبه وساوس فكرية عن وجود الله وفائدة الدعاء، ويخجل من الاعتراف بذلك. استخدم جملة قرانية ترسخ معنى القرب الالهي وسماع الدعاء.",
      scenarioEn: "A young man experiences intellectual doubts about Allah's existence and the benefit of supplication, and feels ashamed to admit it. Use a Quranic phrase to establish the meaning of divine closeness and answered prayers.",
      theme: "faith",
      psychologicalDepth: "Religious doubts and spiritual crisis",
      difficulty: 3,
    },
    {
      scenario: "طفل صغير يخاف من الامتحانات ويصاب بآلام في بطنه من التوتر. اكتب له ردا بسيطا من القران يشرح له معنى الاستعانة والثقة بالله مع الاستعداد الجيد.",
      scenarioEn: "A young child fears exams and gets stomach aches from tension. Write a simple Quranic response explaining the meaning of seeking help and trust in Allah along with good preparation.",
      theme: "trust",
      psychologicalDepth: "Test anxiety in children",
      difficulty: 1,
    },
    {
      scenario: "رائد اعمال شاب خسر ماله في مشروع اول، ويشعر بالخجل من الناس ويريد الانسحاب من عالم الاعمال. استخدم كلمات من القران تشجعه على النهوض بعد الفشل.",
      scenarioEn: "A young entrepreneur lost money in a first project, feels ashamed of people, and wants to withdraw from business. Use Quranic words to encourage rising after failure.",
      theme: "resilience",
      psychologicalDepth: "Business failure and shame resilience",
      difficulty: 2,
    },
    {
      scenario: "شخص تعرض لحادث ترك عنده اعاقة دائمة، ويقول: حياتي انتهت. اكتب له رسالة من القران تعيد تعريف معنى الكرامة والنجاح بعيدا عن الشكل الجسدي.",
      scenarioEn: "Someone experienced an accident that left a permanent disability, saying: 'My life is over.' Write a Quranic message redefining dignity and success beyond physical form.",
      theme: "acceptance",
      psychologicalDepth: "Disability acceptance and redefined success",
      difficulty: 3,
    },
    {
      scenario: "طالبة حاولت حفظ القران مرارا، ثم توقفت، وتشعر بالاستسلام وتقول: لست من اهل القران. استخدم جملة قرانية تبعث فيها العزيمة للعودة ولو بخطوات صغيرة.",
      scenarioEn: "A female student tried to memorize Quran repeatedly then stopped, feels surrender and says: 'I'm not among Quran's people.' Use a Quranic phrase to revive determination to return even with small steps.",
      theme: "perseverance",
      psychologicalDepth: "Spiritual goal abandonment and renewal",
      difficulty: 2,
    },

    // Scenarios 21-30: Spiritual and Emotional Crises
    {
      scenario: "مريض مقبل على عملية جراحية كبيرة، ويخاف من الموت اثناءها. اكتب له ردا من القران يطمئنه بمعنى الاجل والاعتماد على الله.",
      scenarioEn: "A patient facing major surgery fears death during it. Write a Quranic response to reassure about the appointed term and reliance on Allah.",
      theme: "trust",
      psychologicalDepth: "Mortality anxiety and surrender",
      difficulty: 2,
    },
    {
      scenario: "زوجان انتظرا الانجاب سنوات طويلة، وبدأت الشكوك تتسلل الى علاقتهما وثقتهما بالله. استخدم كلمات من القران تعيد الامل وتوسع افق الرضا بقضاء الله.",
      scenarioEn: "A couple waited for childbirth for many years, and doubts started creeping into their relationship and trust in Allah. Use Quranic words to restore hope and expand the horizon of contentment with Allah's decree.",
      theme: "acceptance",
      psychologicalDepth: "Infertility and relationship strain",
      difficulty: 3,
    },
    {
      scenario: "طالبة اجبرت على تخصص جامعي لا تحبه، وتشعر انها سجينة هذا الطريق. اكتب ردا قرانيا يساعدها على رؤية الفرص في الواقع الذي بين يديها.",
      scenarioEn: "A student forced into a university major she doesn't love feels imprisoned by this path. Write a Quranic response helping her see opportunities in her current reality.",
      theme: "acceptance",
      psychologicalDepth: "Forced choices and finding meaning",
      difficulty: 2,
    },
    {
      scenario: "صديق لك تعرض لخيانة من اقرب الناس اليه، ويقول: لن اثق باحد بعد اليوم. استخدم جملة قرانية تعالج جرح الخيانة دون ان تدعوه للسذاجة.",
      scenarioEn: "Your friend experienced betrayal from his closest people, saying: 'I'll never trust anyone again.' Use a Quranic phrase to heal betrayal's wound without calling for naivety.",
      theme: "healing",
      psychologicalDepth: "Trust betrayal and balanced wisdom",
      difficulty: 3,
    },
    {
      scenario: "شاب يشعر برغبة قوية في الانتقام ممن اساء اليه، ويخطط لاذيتهم. اكتب له ردا من القران يوازن بين حقه في الانتصار وفضل العفو وكظم الغيظ.",
      scenarioEn: "A young man feels a strong desire for revenge against those who wronged him and plans to harm them. Write a Quranic response balancing his right to justice with the virtue of forgiveness and restraining anger.",
      theme: "forgiveness",
      psychologicalDepth: "Anger management and moral choice",
      difficulty: 3,
    },
    {
      scenario: "فتاة تعيش قلقا دائماً من المستقبل، تفكر كثيرا في ما سيحدث بعد عشر سنوات، ولا تستمتع بحياتها الان. استخدم كلمات من القران تعيدها الى الحاضر وتعلمها حسن الظن بالله.",
      scenarioEn: "A girl experiences constant future anxiety, thinks much about what will happen in ten years, and doesn't enjoy her life now. Use Quranic words to return her to the present and teach good expectations of Allah.",
      theme: "mindfulness",
      psychologicalDepth: "Future anxiety and present moment awareness",
      difficulty: 2,
    },
    {
      scenario: "طفل يسالك: لماذا يخلق الله الزلازل والكوارث التي يموت فيها الابرياء؟ اكتب له اجابة بسيطة من القران تناسب عمره وتفتح عقله لمعنى الدنيا والاخرة.",
      scenarioEn: "A child asks you: 'Why does Allah create earthquakes and disasters where innocent people die?' Write a simple Quranic answer suitable for their age opening their mind to the meaning of this life and the hereafter.",
      theme: "faith",
      psychologicalDepth: "Childhood theodicy questions",
      difficulty: 2,
    },
    {
      scenario: "مراهق غاضب من والده المتشدد، ويقول: اكره الدين لان ابي ينسب قسوته الى الدين. استخدم جملة قرانية تفصل بين سلوك البشر وتعاليم الدين وتدعوه للعدل في الحكم.",
      scenarioEn: "A teenager angry at his strict father says: 'I hate religion because my father attributes his harshness to religion.' Use a Quranic phrase separating human behavior from religious teachings and calling for fair judgment.",
      theme: "justice",
      psychologicalDepth: "Religious trauma from authority figures",
      difficulty: 3,
    },
    {
      scenario: "شخص يقول لك: اشعر ان الله لا يحبني، كل شيء يسير ضدي. اكتب له ردا من القران يصحح صورة الله في قلبه ويبين سعة الرحمة.",
      scenarioEn: "Someone tells you: 'I feel Allah doesn't love me, everything goes against me.' Write a Quranic response correcting the image of Allah in their heart and showing the vastness of mercy.",
      theme: "mercy",
      psychologicalDepth: "Distorted God-image and divine love",
      difficulty: 3,
    },
    {
      scenario: "شخص يعترف لك بانه وقع في معصية كبيرة، ويشعر بالعار واليأس من المغفرة، ويقول: ربنا لن يغفر لي. قدم له ردا من القران يعالج اليأس ويوقظ الامل في التوبة.",
      scenarioEn: "Someone confesses falling into a major sin, feels shame and despair of forgiveness, saying: 'Our Lord won't forgive me.' Provide a Quranic response treating despair and awakening hope in repentance.",
      theme: "hope",
      psychologicalDepth: "Guilt and despair of divine mercy",
      difficulty: 3,
    },

    // Scenarios 31-40: Self-Transformation and Growth
    {
      scenario: "شاب يتوب ثم يعود للذنب نفسه، فيشعر بالخجل ولا يريد ان يدعو او يصلي. استخدم كلمات من القران تشجعه على الاستمرار في التوبة وعدم الاستسلام للذنب.",
      scenarioEn: "A young man repents then returns to the same sin, feels shame and doesn't want to supplicate or pray. Use Quranic words encouraging continued repentance and not surrendering to sin.",
      theme: "perseverance",
      psychologicalDepth: "Relapse cycles and spiritual resilience",
      difficulty: 3,
    },
    {
      scenario: "طالبة جامعية تشعر بالاحتراق الدراسي، تفكر في ترك الدراسة رغم قرب تخرجها. اكتب لها ردا قرانيا يوازن بين الراحة المؤقتة والصبر على المشوار.",
      scenarioEn: "A university student feels academic burnout, considers quitting despite nearing graduation. Write a Quranic response balancing temporary relief and patience through the journey.",
      theme: "patience",
      psychologicalDepth: "Burnout and completion motivation",
      difficulty: 2,
    },
    {
      scenario: "رجل متقاعد يشعر انه اصبح بلا فائدة بعد خروجه من العمل، ويقضي يومه في الفراغ. استخدم جملة من القران تعطيه معنى جديدا للمرحلة المتقدمة من العمر.",
      scenarioEn: "A retired man feels useless after leaving work and spends his day in idleness. Use a Quranic phrase giving new meaning to the advanced age phase.",
      theme: "purpose",
      psychologicalDepth: "Retirement identity crisis and purpose",
      difficulty: 2,
    },
    {
      scenario: "ام لطفل كثير الحركة وصعب المراس، فقدت صبرها وتشعر بالذنب لانها تصرخ كثيرا. اكتب لها ردا من القران يشجعها على الصبر وطلب العون من الله في التربية.",
      scenarioEn: "A mother of a hyperactive difficult child lost patience and feels guilty for shouting a lot. Write a Quranic response encouraging patience and seeking Allah's help in parenting.",
      theme: "patience",
      psychologicalDepth: "Parental guilt and patience restoration",
      difficulty: 2,
    },
    {
      scenario: "موظف يتعرض للظلم في عمله من مديره، ولا يستطيع ترك الوظيفة، ويشعر بالقهـر. استخدم كلمات من القران تمنحه معنى الصبر على الظلم مع البحث عن حلول.",
      scenarioEn: "An employee faces injustice at work from his manager, can't leave the job, and feels oppressed. Use Quranic words giving meaning to patience with injustice while seeking solutions.",
      theme: "patience",
      psychologicalDepth: "Workplace injustice and empowerment",
      difficulty: 2,
    },
    {
      scenario: "مريض مزمن تعب من طول العلاج، ويقول: سئمت من الدعاء والدواء. اكتب له رسالة من القران تجدد معنى الصبر والرجاء في قلبه.",
      scenarioEn: "A chronic patient tired of long treatment says: 'I'm fed up with supplication and medicine.' Write a Quranic message renewing the meaning of patience and hope in their heart.",
      theme: "hope",
      psychologicalDepth: "Chronic illness fatigue and spiritual renewal",
      difficulty: 3,
    },
    {
      scenario: "شخص تسيطر عليه افكار الموت، يخاف ان يخرج من البيت او ينام وحيدا. استخدم جملة قرانية تساعده على التعامل مع فكرة الموت بهدوء ايماني.",
      scenarioEn: "Someone dominated by death thoughts, fears leaving home or sleeping alone. Use a Quranic phrase helping deal with the idea of death with faithful calmness.",
      theme: "peace",
      psychologicalDepth: "Death anxiety and existential fear",
      difficulty: 3,
    },
    {
      scenario: "شاب يشعر انه غير مرئي في اسرته، لا يسمعه احد، ولا يقدر احد افكاره. اكتب له ردا من القران يعلمه ان قيمته لا تتوقف على انتباه الناس.",
      scenarioEn: "A young man feels invisible in his family, no one hears him, no one values his thoughts. Write a Quranic response teaching that his value doesn't depend on people's attention.",
      theme: "self_worth",
      psychologicalDepth: "Family invisibility and intrinsic worth",
      difficulty: 2,
    },
    {
      scenario: "امرأة مطلقة تواجه نظرات قاسية من المجتمع والاقارب، وتشعر بالخجل من وضعها العائلي. استخدم كلمات من القران ترفع عنها الوصمة وتعزز هويتها كعبد لله قبل اي صفة اجتماعية.",
      scenarioEn: "A divorced woman faces harsh looks from society and relatives, feels ashamed of her family status. Use Quranic words removing stigma and strengthening her identity as Allah's servant before any social label.",
      theme: "dignity",
      psychologicalDepth: "Social stigma and identity beyond labels",
      difficulty: 3,
    },
    {
      scenario: "طالب مجتهد من اسرة فقيرة، يشعر بالخجل من فقره امام زملائه الاغنياء. اكتب له ردا قرانيا يعيد تعريف الكرامة والفضل بعيدا عن المال.",
      scenarioEn: "A diligent student from a poor family feels ashamed of poverty before wealthy classmates. Write a Quranic response redefining dignity and virtue away from wealth.",
      theme: "dignity",
      psychologicalDepth: "Economic shame and reframed worth",
      difficulty: 2,
    },

    // Scenarios 41-50: Advanced Psychological Depth
    {
      scenario: "مهاجر بعيد عن وطنه، يواجه صعوبات في اللغة والعمل، ويفكر ان يستسلم ويعود رغم حاجته للبقاء. استخدم جملة من القران توازنه بين الصبر والبحث عن الخير في مكانه.",
      scenarioEn: "An immigrant far from homeland, faces language and work difficulties, considers surrendering and returning despite needing to stay. Use a Quranic phrase balancing patience and seeking good in their place.",
      theme: "resilience",
      psychologicalDepth: "Migration challenges and perseverance",
      difficulty: 3,
    },
    {
      scenario: "داعية او معلم يبذل جهدا كبيرا في التوجيه، لكنه يرى استجابة ضعيفة، ويشعر بالاحباط. اكتب له ردا من القران يذكره بدوره وحدود مسؤوليته امام هداية الناس.",
      scenarioEn: "A preacher or teacher exerts great effort in guidance but sees weak response and feels frustrated. Write a Quranic response reminding of their role and responsibility limits before people's guidance.",
      theme: "acceptance",
      psychologicalDepth: "Mission fatigue and outcome detachment",
      difficulty: 3,
    },
    {
      scenario: "فتاة تركت الحجاب لفترة ثم عادت اليه، لكنها تحس بالذنب الشديد من الماضي وتخاف الا يقبل الله توبتها. استخدم كلمات من القران تطمئنها وتشجعها على الثبات.",
      scenarioEn: "A girl left hijab for a period then returned to it, but feels intense guilt from the past and fears Allah won't accept her repentance. Use Quranic words to reassure and encourage steadfastness.",
      theme: "mercy",
      psychologicalDepth: "Past regret and divine acceptance",
      difficulty: 3,
    },
    {
      scenario: "شاب يعيش في بيئة مليئة بالمعاصي والاستهزاء بالدين، ويخاف ان يضعف ايمانه مع الوقت. اكتب له ردا من القران يقويه على الثبات وعلى اختيار الصحبة الصالحة.",
      scenarioEn: "A young man lives in an environment full of sins and mockery of religion, fears his faith will weaken over time. Write a Quranic response strengthening him on steadfastness and choosing righteous companionship.",
      theme: "faith",
      psychologicalDepth: "Environmental pressures and faith preservation",
      difficulty: 3,
    },
    {
      scenario: "رجل يحمل سرا قديما في ماضيه يشعر بسببه بالخزي، ولا يجرؤ على ذكره لاحد. استخدم جملة قرانية تفتح له باب المصارحة مع الله والتوبة الصادقة.",
      scenarioEn: "A man carries an old secret in his past causing shame, and doesn't dare mention it to anyone. Use a Quranic phrase opening the door of honesty with Allah and sincere repentance.",
      theme: "healing",
      psychologicalDepth: "Hidden shame and confession to divine",
      difficulty: 4,
    },
    {
      scenario: "شخص يقول: استطيع ان اسامح الاخرين لكنني لا استطيع ان اسامح نفسي على ما فعلت. اكتب له ردا من القران يساعده على قبول نفسه بعد التوبة.",
      scenarioEn: "Someone says: 'I can forgive others but can't forgive myself for what I did.' Write a Quranic response helping self-acceptance after repentance.",
      theme: "self_compassion",
      psychologicalDepth: "Self-unforgiveness and mercy internalization",
      difficulty: 4,
    },
    {
      scenario: "اب فقد وظيفته ولا يريد ان يقلق اطفاله، فيخفي حزنه وقلقه، لكنه ينهار داخليا. استخدم كلمات من القران تمنحه شعورا بالسند الالهي مع السعي للرزق.",
      scenarioEn: "A father lost his job and doesn't want to worry his children, so hides his sadness and anxiety, but collapses internally. Use Quranic words giving a sense of divine support with seeking provision.",
      theme: "trust",
      psychologicalDepth: "Provider anxiety and silent suffering",
      difficulty: 3,
    },
    {
      scenario: "طالب طب نادم على اختيار تخصص متعب، يدرس فقط لارضاء اهله، ويشعر انه سجين طريق لا يحبه. اكتب له ردا قرانيا يساعده على اتخاذ قرار متزن بين رغبته ومسؤوليته.",
      scenarioEn: "A medical student regrets choosing a tiring specialty, studies only to please family, feels imprisoned in a path he doesn't love. Write a Quranic response helping balanced decision between desire and responsibility.",
      theme: "wisdom",
      psychologicalDepth: "Career regret and autonomy vs duty",
      difficulty: 3,
    },
    {
      scenario: "شريك في مشروع تجاري خسر اموال بعض الناس بسبب قرارات خاطئة، ويشعر بذنب عميق وخوف من مواجهة اصحاب الحقوق. استخدم جملة من القران توجهه للتوبة ورد المظالم مع الرجاء.",
      scenarioEn: "A business partner lost some people's money due to wrong decisions, feels deep guilt and fear of facing rightful owners. Use a Quranic phrase directing to repentance and restitution with hope.",
      theme: "justice",
      psychologicalDepth: "Financial responsibility and moral repair",
      difficulty: 4,
    },
    {
      scenario: "شاب يتابع اخبار الحروب والظلم كل يوم، ويشعر بالعجز والاحباط، ويسالك: ماذا يفيد ان ادعو او اتصدق وانا فرد ضعيف؟ اكتب له ردا من القران يربط عمل الفرد الصغير بالميزان الكبير عند الله.",
      scenarioEn: "A young man follows war and injustice news daily, feels helplessness and frustration, asks: 'What's the use of praying or charity when I'm a weak individual?' Write a Quranic response connecting small individual action to the great scale at Allah.",
      theme: "impact",
      psychologicalDepth: "Global distress and individual agency",
      difficulty: 3,
    },
  ];

  try {
    for (const scenario of scenarios) {
      await db.insert(roleplayScenarios).values(scenario);
    }

    console.log(`✅ Successfully added ${scenarios.length} roleplay scenarios!`);
    console.log(`\n📊 Breakdown by theme:`);
    
    const themeCounts: Record<string, number> = {};
    scenarios.forEach(s => {
      themeCounts[s.theme] = (themeCounts[s.theme] || 0) + 1;
    });

    Object.entries(themeCounts).forEach(([theme, count]) => {
      console.log(`   ${theme}: ${count} scenarios`);
    });

  } catch (error) {
    console.error("❌ Error seeding roleplay scenarios:", error);
    process.exit(1);
  }
}

seedRoleplayScenarios()
  .then(() => {
    console.log("\n🎉 Roleplay scenarios seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });
