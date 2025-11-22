import { db } from "./db";
import { roleplayScenarios } from "@shared/schema";

const newScenarios = [
  {
    scenario: "صديقك يسألك: لماذا تخفي كثيرا من أعمالك الصالحة ولا تخبر الناس عنها؟ اربط جوابك بوعد قرآني يدل على ان ثواب الاعمال المخفية اكبر مما نتخيل.",
    scenarioEn: "Your friend asks you: Why do you hide many of your good deeds and not tell people about them? Link your answer to a Quranic promise that shows the reward for hidden deeds is greater than we imagine.",
    theme: "sincerity",
    psychologicalDepth: "Addresses the psychological struggle between seeking recognition and maintaining sincerity in worship, teaching that hidden good deeds have unseen divine rewards.",
    difficulty: 3,
  },
  {
    scenario: "شخص يقول لك: 'اتعبتني الدنيا، هل هناك شيء في الاخرة يستحق هذا الصبر؟' اي جملة قرآنية تجيب بها لتبين ان ما اعده الله لا تدركه عيون الناس ولا عقولهم؟",
    scenarioEn: "Someone tells you: 'This worldly life has exhausted me, is there something in the afterlife worth this patience?' Which Quranic phrase would you use to show that what Allah has prepared cannot be perceived by people's eyes or minds?",
    theme: "hope",
    psychologicalDepth: "Confronts existential exhaustion and worldly fatigue by providing spiritual hope through divine promises of unimaginable rewards.",
    difficulty: 2,
  },
  {
    scenario: "تشرح لطالب غير عربي معنى 'جزاء من جنس العمل'، وتريد ان تربطها بعبارة قرآنية تبين ان الثواب نتيجة الاعمال. اي جزء من الآية تستخدم؟",
    scenarioEn: "You are explaining to a non-Arabic student the meaning of 'reward matching the deed', and you want to link it to a Quranic phrase showing that reward is the result of actions. Which part of the verse do you use?",
    theme: "faith",
    psychologicalDepth: "Teaches the principle of divine justice and causality, strengthening belief in accountability and motivating righteous action.",
    difficulty: 2,
  },
  {
    scenario: "طالب يسألك: 'هل يرى الانسان في الدنيا كل ما اعده الله له في الجنة؟' اختر جملة قرآنية قصيرة تبين ان ما اعده الله مخفي عن الابصار الان.",
    scenarioEn: "A student asks you: 'Does a person see in this world everything Allah has prepared for them in Paradise?' Choose a short Quranic phrase that shows what Allah has prepared is hidden from sight now.",
    theme: "trust",
    psychologicalDepth: "Develops patience and trust in the unseen, teaching contentment with not knowing everything while maintaining faith in divine promises.",
    difficulty: 2,
  },
  {
    scenario: "تتكلم عن 'قرة العين الحقيقية' وانها ليست في متع الدنيا الزائلة، بل في نعيم مدخر. اي جملة من الآية تجعلها جوابا تربويا لهذه الفكرة؟",
    scenarioEn: "You speak about 'true comfort of the eye' and that it is not in the fleeting pleasures of worldly life, but in stored blessings. Which phrase from the verse would you use as an educational answer to this idea?",
    theme: "contentment",
    psychologicalDepth: "Reframes the concept of happiness and satisfaction, shifting focus from temporary worldly pleasures to eternal spiritual rewards.",
    difficulty: 3,
  },
  {
    scenario: "مجموعة من الطلاب يسألونك: لماذا نركز في قرانش على النية والاخلاص والاعمال الخفية؟ اربط ذلك بجملة قرآنية تشير الى ان هناك ثوابا مخفيا لا تعلمه نفس.",
    scenarioEn: "A group of students asks you: Why do we focus in Quranesh on intention, sincerity, and hidden deeds? Link this to a Quranic phrase indicating there is a hidden reward that no soul knows.",
    theme: "sincerity",
    psychologicalDepth: "Reinforces the educational philosophy of internal spiritual development over external validation, cultivating intrinsic motivation for worship.",
    difficulty: 3,
  },
  {
    scenario: "تريد ان تختم درسا عن الصبر على الطاعة والابتلاء بجملة قرآنية تعطي وعدا عاما لكل صابر عامل. ما الجملة التي تختارها من هذه الآية؟",
    scenarioEn: "You want to conclude a lesson about patience in worship and tribulation with a Quranic phrase that gives a general promise to every patient doer. Which phrase would you choose from this verse?",
    theme: "patience",
    psychologicalDepth: "Provides spiritual closure and motivation, linking perseverance through hardship to divine recompense.",
    difficulty: 2,
  },
  {
    scenario: "طالب يسألك: 'هل يمكن لعقل الانسان ان يتصور تماما نعيم اهل الجنة؟' اجعله يجيب بجملة قرآنية مناسبة من الآية.",
    scenarioEn: "A student asks you: 'Can the human mind fully imagine the bliss of the people of Paradise?' Have them answer with an appropriate Quranic phrase from the verse.",
    theme: "faith",
    psychologicalDepth: "Acknowledges human cognitive limitations while strengthening faith in the transcendent nature of divine rewards beyond human comprehension.",
    difficulty: 2,
  },
  {
    scenario: "تشرح لطلابك ان الله يربط بين 'العمل' و'الجزاء' ربطا واضحا في نظم الآية. اطلب من الطالب ان يذكر الجملة القرآنية التي تجمع المعنيين معا.",
    scenarioEn: "You explain to your students that Allah links 'deed' and 'reward' clearly in the verse's structure. Ask the student to mention the Quranic phrase that combines both meanings together.",
    theme: "faith",
    psychologicalDepth: "Teaches theological concepts of divine justice and causality through linguistic analysis, deepening understanding of Quranic wisdom.",
    difficulty: 3,
  },
  {
    scenario: "شخص يعمل في الخير سرا ويخشى ان لا يقدره الناس، فبماذا تجيبه من القرآن لتربطه بثواب خاص مخفي؟",
    scenarioEn: "Someone does good deeds secretly and fears that people won't appreciate it. What would you answer from the Quran to connect them with a special hidden reward?",
    theme: "sincerity",
    psychologicalDepth: "Addresses the need for external validation and fear of being unappreciated, redirecting focus to divine recognition and secret rewards.",
    difficulty: 3,
  },
];

async function addSincerityScenariosToDatabase() {
  console.log("🌟 Adding 10 new sincerity-focused roleplay scenarios...");

  try {
    for (let i = 0; i < newScenarios.length; i++) {
      const scenario = newScenarios[i];
      await db.insert(roleplayScenarios).values(scenario);
      console.log(`✓ Added scenario ${i + 1}/10: ${scenario.theme}`);
    }

    console.log("\n✅ Successfully added all 10 scenarios!");
    console.log("📊 Summary:");
    console.log(`   - Total scenarios added: ${newScenarios.length}`);
    console.log(`   - Themes: sincerity (4), faith (3), hope (1), trust (1), contentment (1), patience (1)`);
    console.log(`   - All scenarios relate to Ayah: ﴿ فلا تعلم نفس ما أخفي لهم من قرة أعين جزاء بما كانوا يعملون ﴾`);
    
  } catch (error) {
    console.error("❌ Error adding scenarios:", error);
    throw error;
  }
}

addSincerityScenariosToDatabase()
  .then(() => {
    console.log("✓ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
