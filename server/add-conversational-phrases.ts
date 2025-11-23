import { db } from "./db";
import { phrases } from "@shared/schema";

const newPhrases = [
  {
    arabicText: "لَعَلَّكُم تَعقِلونَ",
    englishTranslation: "So that you may understand / use reason",
    surahAyah: "Al-Baqarah 2:73, 2:242 and others",
    lifeApplication: "When you want listeners to comprehend your message with intellect and reasoning. Used to encourage critical thinking and understanding.",
    category: "short",
    difficulty: 2,
    symbolicMeaning: "Invitation to intellectual engagement and mindful comprehension",
    isPracticalDailyUse: 1,
    usageDomain: "teaching, persuasion, explanation",
    register: "formal",
  },
  {
    arabicText: "نَحنُ نَقُصُّ عَلَيكَ أَحسَنَ القَصَصِ",
    englishTranslation: "We relate to you the best of stories",
    surahAyah: "Yusuf 12:3",
    lifeApplication: "When you want to tell someone a beautiful or meaningful story. Expresses the value and beauty of the narrative you're about to share.",
    category: "short",
    difficulty: 2,
    symbolicMeaning: "Appreciation for storytelling as a means of wisdom and moral teaching",
    isPracticalDailyUse: 1,
    usageDomain: "storytelling, teaching, sharing experiences",
    register: "formal",
  },
  {
    arabicText: "وَإِن كُنتَ مِن قَبلِهِ لَمِنَ الغافِلينَ",
    englishTranslation: "And indeed you were, before this, among the heedless",
    surahAyah: "Yusuf 12:3",
    lifeApplication: "When you want to express that you were previously unaware or heedless but then learned and understood something important.",
    category: "short",
    difficulty: 3,
    symbolicMeaning: "Acknowledgment of past ignorance and celebration of newfound awareness",
    isPracticalDailyUse: 1,
    usageDomain: "self-reflection, learning, personal growth",
    register: "formal",
  },
  {
    arabicText: "يا أَبَتِ",
    englishTranslation: "O my father",
    surahAyah: "Yusuf 12:4, Maryam 19:42-45, and others",
    lifeApplication: "A tender and respectful way to address one's father, combining affection with honor. Used when speaking to or calling one's father.",
    category: "short",
    difficulty: 1,
    symbolicMeaning: "Respectful and loving address to a father figure",
    isPracticalDailyUse: 1,
    usageDomain: "family, addressing elders",
    register: "conversational",
  },
  {
    arabicText: "يا بُنَيَّ",
    englishTranslation: "O my dear son / my child",
    surahAyah: "Luqman 31:13, 31:16-17, and others",
    lifeApplication: "A tender and affectionate way to address one's son or a young person. Expresses care, guidance, and paternal affection.",
    category: "short",
    difficulty: 1,
    symbolicMeaning: "Affectionate address to a child or younger person, implying mentorship and care",
    isPracticalDailyUse: 1,
    usageDomain: "family, mentoring, guidance",
    register: "conversational",
  },
  {
    arabicText: "لا تَقصُص رُؤياكَ",
    englishTranslation: "Do not relate your vision / dream",
    surahAyah: "Yusuf 12:5",
    lifeApplication: "Advice not to reveal one's plans, dreams, or visions to everyone. Used to counsel discretion and protection of one's aspirations from envy or harm.",
    category: "short",
    difficulty: 2,
    symbolicMeaning: "Wisdom of protecting one's dreams and plans from those who might wish ill",
    isPracticalDailyUse: 1,
    usageDomain: "advice, protection, discretion",
    register: "formal",
  },
  {
    arabicText: "فَيَكيدوا لَكَ كَيداً",
    englishTranslation: "And they will plot against you a plot",
    surahAyah: "Yusuf 12:5",
    lifeApplication: "Warning about hidden schemes or plots against you. Used to alert someone about potential deception or conspiracy.",
    category: "short",
    difficulty: 2,
    symbolicMeaning: "Awareness of hidden dangers and the need for vigilance",
    isPracticalDailyUse: 1,
    usageDomain: "warning, caution, awareness",
    register: "formal",
  },
  {
    arabicText: "إِنَّ الشَّيطانَ لِلإِنسانِ عَدُوٌّ مُبينٌ",
    englishTranslation: "Indeed, Satan is to mankind a clear enemy",
    surahAyah: "Yusuf 12:5",
    lifeApplication: "Reminder that Satan is humanity's true and obvious enemy. Used to attribute temptation or wrongdoing to satanic influence and to warn against evil.",
    category: "short",
    difficulty: 2,
    symbolicMeaning: "Recognition of the spiritual battle and the need to resist evil temptations",
    isPracticalDailyUse: 1,
    usageDomain: "warning, spiritual guidance, moral teaching",
    register: "formal",
  },
  {
    arabicText: "وَكَذلِكَ يَجتَبيكَ",
    englishTranslation: "And thus will your Lord choose you",
    surahAyah: "Yusuf 12:6",
    lifeApplication: "Expression indicating that someone is being chosen or selected. Used to convey divine or special selection and honor.",
    category: "short",
    difficulty: 2,
    symbolicMeaning: "Divine selection and favor, recognition of special purpose",
    isPracticalDailyUse: 1,
    usageDomain: "encouragement, recognition, spiritual growth",
    register: "formal",
  },
  {
    arabicText: "تَأويلَ الأَحاديثِ",
    englishTranslation: "The interpretation of narratives / dreams",
    surahAyah: "Yusuf 12:6, 12:21",
    lifeApplication: "Reference to the interpretation or explanation of stories, dreams, or events. Used when requesting or discussing the meaning behind narratives.",
    category: "short",
    difficulty: 3,
    symbolicMeaning: "Seeking deeper meaning and understanding beyond surface appearances",
    isPracticalDailyUse: 1,
    usageDomain: "explanation, interpretation, wisdom",
    register: "formal",
  },
  {
    arabicText: "يُتِمَّ نِعمَتَهُ",
    englishTranslation: "He completes His favor / blessing",
    surahAyah: "Yusuf 12:6, Al-Ma'idah 5:3",
    lifeApplication: "Expression meaning 'to complete a favor or blessing.' Used when someone completes their kindness or when acknowledging the completion of divine blessings.",
    category: "short",
    difficulty: 2,
    symbolicMeaning: "Completion and perfection of divine grace and blessings",
    isPracticalDailyUse: 1,
    usageDomain: "gratitude, blessing, completion",
    register: "formal",
  },
  {
    arabicText: "آياتٍ لِلسّائِلينَ",
    englishTranslation: "Signs for those who inquire / ask",
    surahAyah: "Yusuf 12:7",
    lifeApplication: "Reference to signs, lessons, or evidence for those who seek understanding. Used when pointing to clear indicators or lessons for thoughtful seekers.",
    category: "short",
    difficulty: 2,
    symbolicMeaning: "Knowledge and wisdom revealed to those who genuinely seek understanding",
    isPracticalDailyUse: 1,
    usageDomain: "teaching, guidance, evidence",
    register: "formal",
  },
  {
    arabicText: "وَنَحنُ عُصبَةٌ",
    englishTranslation: "While we are a group / strong band",
    surahAyah: "Yusuf 12:8",
    lifeApplication: "Expression indicating you are a strong group or united team. Used to emphasize collective strength, unity, and solidarity.",
    category: "short",
    difficulty: 2,
    symbolicMeaning: "Strength in unity and collective effort",
    isPracticalDailyUse: 1,
    usageDomain: "teamwork, unity, strength",
    register: "conversational",
  },
];

async function addConversationalPhrasesToDatabase() {
  console.log("🌟 Adding 13 new conversational Quranic phrases...");

  try {
    for (let i = 0; i < newPhrases.length; i++) {
      const phrase = newPhrases[i];
      await db.insert(phrases).values(phrase);
      console.log(`✓ Added phrase ${i + 1}/13: ${phrase.arabicText}`);
    }

    console.log("\n✅ Successfully added all 13 phrases!");
    console.log("📊 Summary:");
    console.log(`   - Total phrases added: ${newPhrases.length}`);
    console.log(`   - All from Surah Yusuf and other Surahs`);
    console.log(`   - Themes: understanding, storytelling, family relations, wisdom, guidance, unity`);
    console.log(`   - Usage domains: teaching, family, advice, warning, spiritual growth`);
    
  } catch (error) {
    console.error("❌ Error adding phrases:", error);
    throw error;
  }
}

addConversationalPhrasesToDatabase()
  .then(() => {
    console.log("✓ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
