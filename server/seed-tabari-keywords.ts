/**
 * seed-tabari-keywords.ts
 * Seeds accepted_keywords and rejected_keywords for Al-Fatiha (surah 1)
 * and Juz Amma surahs (93–114), based on Tafsir al-Tabari commentary.
 * Run via the admin route or startup.
 */

import { db } from "./db";
import { tabariExercises } from "@shared/schema";
import { eq, and } from "drizzle-orm";

interface KeywordSeed {
  surahNumber: number;
  correctWord: string;
  acceptedKeywords: string;
  rejectedKeywords: string;
  approvedMeaning: string;
}

const ALL_KEYWORDS: KeywordSeed[] = [
  // ── Surah 1: Al-Fatiha ──────────────────────────────────────────────────
  {
    surahNumber: 1,
    correctWord: "بِسْمِ",
    acceptedKeywords: "name, bismillah, in the name of, beginning, seeking blessing",
    rejectedKeywords: "praise, worship, end",
    approvedMeaning: "In the name of — beginning any action by invoking the name of Allah to seek His blessing and assistance",
  },
  {
    surahNumber: 1,
    correctWord: "اللَّهِ",
    acceptedKeywords: "Allah, God, the divine, the one, deity, creator",
    rejectedKeywords: "partner, associate, multiple gods",
    approvedMeaning: "Allah — the proper name of the one true God, free of partners, the Creator and Sustainer of all",
  },
  {
    surahNumber: 1,
    correctWord: "الرَّحْمَٰنِ",
    acceptedKeywords: "mercy, compassion, divine mercy, rahman, all-merciful, vast mercy",
    rejectedKeywords: "punishment, wrath, anger, vengeance",
    approvedMeaning: "The All-Merciful — one of Allah's names indicating vast, encompassing mercy extended to all creation",
  },
  {
    surahNumber: 1,
    correctWord: "الرَّحِيمِ",
    acceptedKeywords: "merciful, compassion, mercy, believers, rahim, special mercy",
    rejectedKeywords: "punishment, severity, wrath",
    approvedMeaning: "The Most Merciful — indicating special mercy bestowed particularly upon the believers",
  },
  {
    surahNumber: 1,
    correctWord: "الْحَمْدُ",
    acceptedKeywords: "praise, gratitude, thanks, thankfulness, hamd, glorification",
    rejectedKeywords: "worship only, prayer only",
    approvedMeaning: "Praise and gratitude — affirming that all perfect praise and thankfulness belong exclusively to Allah",
  },
  {
    surahNumber: 1,
    correctWord: "رَبِّ",
    acceptedKeywords: "lord, sustainer, owner, master, rabb, creator, nurturer",
    rejectedKeywords: "tyrant, oppressor, ruler only",
    approvedMeaning: "Lord and Sustainer — the one who created, owns, and nurtures all of creation",
  },
  {
    surahNumber: 1,
    correctWord: "الْعَٰلَمِينَ",
    acceptedKeywords: "worlds, creation, all beings, universe, creatures, mankind, jinn",
    rejectedKeywords: "only humans, only visible world",
    approvedMeaning: "The worlds — encompassing all that Allah created including humans, jinn, angels, and all other beings",
  },
  {
    surahNumber: 1,
    correctWord: "مَٰلِكِ",
    acceptedKeywords: "master, sovereign, king, owner, authority, judgment, malik",
    rejectedKeywords: "mercy, forgiveness (in isolation), no accountability",
    approvedMeaning: "Master and sovereign — the absolute owner and sovereign authority on the Day of Judgment",
  },
  {
    surahNumber: 1,
    correctWord: "يَوْمِ",
    acceptedKeywords: "day, judgment, accountability, recompense, resurrection",
    rejectedKeywords: "worldly life, no afterlife",
    approvedMeaning: "The Day — referring to the Day of Judgment when all deeds will be accounted for",
  },
  {
    surahNumber: 1,
    correctWord: "الدِّينِ",
    acceptedKeywords: "judgment, recompense, reckoning, accountability, din, reward, punishment",
    rejectedKeywords: "religion only, worship only, no accountability",
    approvedMeaning: "Recompense and judgment — the day when every soul receives the full recompense for its deeds",
  },
  {
    surahNumber: 1,
    correctWord: "نَعْبُدُ",
    acceptedKeywords: "worship, serve, devote, ibadah, obedience, submit",
    rejectedKeywords: "praise only, remember only",
    approvedMeaning: "We worship — singling out Allah alone for all acts of devotion and servitude",
  },
  {
    surahNumber: 1,
    correctWord: "نَسْتَعِينُ",
    acceptedKeywords: "seek help, rely, assistance, isti'ana, depend, trust",
    rejectedKeywords: "worship, praise, self-reliance",
    approvedMeaning: "We seek help — turning exclusively to Allah for aid, support, and enabling of all affairs",
  },
  {
    surahNumber: 1,
    correctWord: "اهْدِنَا",
    acceptedKeywords: "guide, guidance, straight path, hidayah, direct, lead",
    rejectedKeywords: "forgive only, provide only",
    approvedMeaning: "Guide us — a supplication asking Allah to keep us steadfast on and directed toward the straight path",
  },
  {
    surahNumber: 1,
    correctWord: "الصِّرَاطَ",
    acceptedKeywords: "path, way, road, sirat, straight, direction",
    rejectedKeywords: "knowledge only, belief only without action",
    approvedMeaning: "The path — the clear and straight road of righteous belief and action that leads to Allah's pleasure",
  },
  {
    surahNumber: 1,
    correctWord: "الْمُسْتَقِيمَ",
    acceptedKeywords: "straight, upright, correct, right, direct, without deviation",
    rejectedKeywords: "crooked, deviant, wrong",
    approvedMeaning: "The straight — the path that is upright, free of deviation, leading directly to success in this life and the next",
  },
  {
    surahNumber: 1,
    correctWord: "أَنْعَمْتَ",
    acceptedKeywords: "blessed, favor, grace, ni'mah, bestowed, given",
    rejectedKeywords: "punished, tested without blessing",
    approvedMeaning: "You have blessed — referring to those upon whom Allah has bestowed His grace, favor, and guidance",
  },
  {
    surahNumber: 1,
    correctWord: "الْمَغْضُوبِ",
    acceptedKeywords: "wrath, anger, incurred wrath, maghdub, deviated from truth knowingly",
    rejectedKeywords: "blessed, guided, innocent",
    approvedMeaning: "Those who incurred wrath — those who knew the truth but deliberately rejected it",
  },
  {
    surahNumber: 1,
    correctWord: "الضَّالِّينَ",
    acceptedKeywords: "astray, lost, misguided, dallin, ignorant, erred",
    rejectedKeywords: "guided, blessed, sinful knowingly",
    approvedMeaning: "Those who went astray — those who lost the correct path through ignorance or error without deliberate rejection",
  },

  // ── Surah 93: Ad-Duha ───────────────────────────────────────────────────
  {
    surahNumber: 93,
    correctWord: "الضُّحَىٰ",
    acceptedKeywords: "morning, forenoon, morning light, brightness, day, duha",
    rejectedKeywords: "night, darkness, evening",
    approvedMeaning: "The morning light (Ad-Duha) — Allah swears by the bright forenoon as a sign of His blessings and favor",
  },
  {
    surahNumber: 93,
    correctWord: "وَدَّعَكَ",
    acceptedKeywords: "forsaken, abandoned, left you, farewell, neglected",
    rejectedKeywords: "helped, supported, guided",
    approvedMeaning: "Has not forsaken you — a reassurance to the Prophet that Allah has neither abandoned nor neglected him",
  },
  {
    surahNumber: 93,
    correctWord: "الْآخِرَةُ",
    acceptedKeywords: "hereafter, afterlife, next world, akhira, eternal life",
    rejectedKeywords: "worldly life, dunya, this world only",
    approvedMeaning: "The Hereafter — the everlasting life that is better and more enduring than this temporary world",
  },
  {
    surahNumber: 93,
    correctWord: "يَتِيمًا",
    acceptedKeywords: "orphan, fatherless, destitute child, yatim",
    rejectedKeywords: "wealthy, supported, cared for at birth",
    approvedMeaning: "An orphan — the Prophet was an orphan whom Allah sheltered, reminding him to treat orphans with kindness",
  },
  {
    surahNumber: 93,
    correctWord: "فَأَغْنَىٰ",
    acceptedKeywords: "enriched, made self-sufficient, provided for, gave enough",
    rejectedKeywords: "impoverished, deprived, left needy",
    approvedMeaning: "He enriched you — Allah provided the Prophet with sufficiency after poverty, calling him to gratitude",
  },

  // ── Surah 94: Ash-Sharh ─────────────────────────────────────────────────
  {
    surahNumber: 94,
    correctWord: "شَرَحْنَا",
    acceptedKeywords: "expanded, opened, widened, sharh, relieved, enlightened",
    rejectedKeywords: "constricted, closed, narrowed",
    approvedMeaning: "We expanded — Allah opened the Prophet's breast with faith, prophethood, and light of guidance",
  },
  {
    surahNumber: 94,
    correctWord: "وِزْرَكَ",
    acceptedKeywords: "burden, load, weight, sin, heavy responsibility",
    rejectedKeywords: "ease, lightness, comfort",
    approvedMeaning: "Your burden — the heavy burden of ignorance before revelation that Allah lifted from the Prophet",
  },
  {
    surahNumber: 94,
    correctWord: "الْعُسْرِ",
    acceptedKeywords: "hardship, difficulty, ease after hardship, usr, struggle",
    rejectedKeywords: "ease only, no difficulty",
    approvedMeaning: "Hardship — every difficulty is paired with ease, a divine promise of relief after trial",
  },
  {
    surahNumber: 94,
    correctWord: "فَانصَبْ",
    acceptedKeywords: "strive, work hard, exert yourself, persevere, toil",
    rejectedKeywords: "rest, relax, stop working",
    approvedMeaning: "So strive — after completing one task, the believer is commanded to continue with diligent effort",
  },

  // ── Surah 95: At-Tin ────────────────────────────────────────────────────
  {
    surahNumber: 95,
    correctWord: "التِّينِ",
    acceptedKeywords: "fig, tin, blessed land, Syria, place of revelation",
    rejectedKeywords: "olive, sinai, mecca",
    approvedMeaning: "The fig — an oath by the fig, symbolizing the blessed land of Syria where prophets were sent",
  },
  {
    surahNumber: 95,
    correctWord: "تَقْوِيمٍ",
    acceptedKeywords: "best form, finest mold, upright nature, taqwim, best constitution",
    rejectedKeywords: "worst form, degraded, animal-like",
    approvedMeaning: "Best of molds — mankind was created in the finest and most upright physical and moral constitution",
  },
  {
    surahNumber: 95,
    correctWord: "سَافِلِينَ",
    acceptedKeywords: "lowest, degraded, debased, reduced, asfal, worst state",
    rejectedKeywords: "elevated, honored, raised",
    approvedMeaning: "The lowest of the low — those who reject faith and good deeds are reduced to the most degraded state",
  },
  {
    surahNumber: 95,
    correctWord: "الْحَاكِمِينَ",
    acceptedKeywords: "best of judges, wisest judge, just ruler, hakim",
    rejectedKeywords: "unjust, oppressor, arbitrary",
    approvedMeaning: "The best of judges — Allah is the most just and wise Judge whose decisions are always perfectly equitable",
  },

  // ── Surah 96: Al-Alaq ───────────────────────────────────────────────────
  {
    surahNumber: 96,
    correctWord: "اقْرَأْ",
    acceptedKeywords: "read, recite, proclaim, iqra, knowledge, learn",
    rejectedKeywords: "silence, ignorance, refuse",
    approvedMeaning: "Read — the first revealed word commanding the Prophet and all believers to seek knowledge",
  },
  {
    surahNumber: 96,
    correctWord: "عَلَقٍ",
    acceptedKeywords: "clinging clot, alaq, embryo, blood clot, human origin",
    rejectedKeywords: "fully formed, fully grown, light",
    approvedMeaning: "A clinging clot — mankind was created from a clinging clot of blood, showing Allah's power and humbling human pride",
  },
  {
    surahNumber: 96,
    correctWord: "الْقَلَمِ",
    acceptedKeywords: "pen, writing, knowledge, qalam, learning, scripture",
    rejectedKeywords: "ignorance, oral only, no writing",
    approvedMeaning: "The pen — Allah taught by the pen, making writing the instrument of knowledge and civilization",
  },
  {
    surahNumber: 96,
    correctWord: "لَيَطْغَىٰ",
    acceptedKeywords: "transgresses, rebels, becomes arrogant, tughyan, exceeds limits",
    rejectedKeywords: "humbled, obedient, grateful",
    approvedMeaning: "Verily man transgresses — wealth and self-sufficiency lead man to arrogance and rebellion against Allah",
  },

  // ── Surah 97: Al-Qadr ───────────────────────────────────────────────────
  {
    surahNumber: 97,
    correctWord: "الْقَدْرِ",
    acceptedKeywords: "decree, power, destiny, night of power, qadr, honor, value",
    rejectedKeywords: "ordinary night, insignificant, no decree",
    approvedMeaning: "The Night of Decree — the night the Quran was revealed, better than a thousand months in worship",
  },
  {
    surahNumber: 97,
    correctWord: "الْمَلَٰئِكَةُ",
    acceptedKeywords: "angels, malaika, messengers of Allah, heavenly beings",
    rejectedKeywords: "jinn, humans, devils",
    approvedMeaning: "The angels — they descend on Laylat al-Qadr carrying the divine decrees with the permission of Allah",
  },
  {
    surahNumber: 97,
    correctWord: "سَلَٰمٌ",
    acceptedKeywords: "peace, tranquility, safety, salam, blessing, security",
    rejectedKeywords: "punishment, war, disturbance",
    approvedMeaning: "Peace — the Night of Qadr is characterized by complete peace and tranquility until dawn",
  },

  // ── Surah 98: Al-Bayyinah ────────────────────────────────────────────────
  {
    surahNumber: 98,
    correctWord: "الْبَيِّنَةُ",
    acceptedKeywords: "clear evidence, clear proof, bayyinah, manifest sign, messenger",
    rejectedKeywords: "ambiguity, doubt, unclear",
    approvedMeaning: "The clear evidence — the Prophet Muhammad as a clear proof and messenger reciting purified scriptures",
  },
  {
    surahNumber: 98,
    correctWord: "مُخْلِصِينَ",
    acceptedKeywords: "sincere, devoted, pure worship, ikhlas, wholeheartedly",
    rejectedKeywords: "hypocritical, showing off, insincere",
    approvedMeaning: "Sincere devotees — mankind was commanded only to worship Allah with sincere, exclusive devotion",
  },
  {
    surahNumber: 98,
    correctWord: "الْبَرِيَّةِ",
    acceptedKeywords: "creation, creatures, mankind, all beings, bariyya",
    rejectedKeywords: "angels only, jinn only",
    approvedMeaning: "The best of creation — the believers who do good deeds are the finest of all Allah's creatures",
  },

  // ── Surah 99: Az-Zalzalah ────────────────────────────────────────────────
  {
    surahNumber: 99,
    correctWord: "زُلْزِلَتِ",
    acceptedKeywords: "shaken, quaked, earthquake, zalzala, convulsion",
    rejectedKeywords: "still, calm, peaceful",
    approvedMeaning: "When the earth is shaken — the violent earthquake on the Day of Judgment that signals the end of the world",
  },
  {
    surahNumber: 99,
    correctWord: "أَثْقَالَهَا",
    acceptedKeywords: "burdens, loads, weights, dead, what is inside, atqal",
    rejectedKeywords: "empty, light, surface only",
    approvedMeaning: "Its burdens — the earth will throw out the dead buried within it for the resurrection",
  },
  {
    surahNumber: 99,
    correctWord: "أَخْبَارَهَا",
    acceptedKeywords: "news, tidings, what happened upon it, akhbar, testimony",
    rejectedKeywords: "silent, concealment, no record",
    approvedMeaning: "Its news — the earth will testify about every deed done upon it on the Day of Resurrection",
  },
  {
    surahNumber: 99,
    correctWord: "ذَرَّةٍ",
    acceptedKeywords: "atom, particle, speck, dharra, smallest amount, tiny",
    rejectedKeywords: "large, major, significant only",
    approvedMeaning: "An atom's weight — even the smallest deed, good or evil, will be shown and reckoned on the Day of Judgment",
  },

  // ── Surah 100: Al-Adiyat ─────────────────────────────────────────────────
  {
    surahNumber: 100,
    correctWord: "الْعَادِيَاتِ",
    acceptedKeywords: "chargers, galloping horses, adiyat, rushing steeds, cavalry",
    rejectedKeywords: "stationary, slow, still",
    approvedMeaning: "The chargers — Allah swears by the charging warhorses, symbolizing striving in His cause",
  },
  {
    surahNumber: 100,
    correctWord: "لَكَنُودٌ",
    acceptedKeywords: "ungrateful, kanud, unthankful, denying blessings, ingrate",
    rejectedKeywords: "grateful, thankful, acknowledging",
    approvedMeaning: "Truly ungrateful — man is naturally inclined toward ingratitude for the blessings of his Lord",
  },
  {
    surahNumber: 100,
    correctWord: "الْقُبُورُ",
    acceptedKeywords: "graves, tombs, buried, qubur, resurrection from graves",
    rejectedKeywords: "alive, living, no afterlife",
    approvedMeaning: "The graves — what is within the graves will be brought forth on the Day of Resurrection for judgment",
  },

  // ── Surah 101: Al-Qari'ah ────────────────────────────────────────────────
  {
    surahNumber: 101,
    correctWord: "الْقَارِعَةُ",
    acceptedKeywords: "striking calamity, qaria, day of judgment, hammering event, the blow",
    rejectedKeywords: "mercy, ease, calm event",
    approvedMeaning: "The Striking Calamity — one of the names of the Day of Judgment, emphasizing its terrifying impact",
  },
  {
    surahNumber: 101,
    correctWord: "الْمَوَازِينُ",
    acceptedKeywords: "scales, balance, mawazin, weighing deeds, judgment",
    rejectedKeywords: "no reckoning, arbitrary, unfair",
    approvedMeaning: "The scales — deeds are weighed on the Day of Judgment; heavy scales mean success and light scales mean loss",
  },
  {
    surahNumber: 101,
    correctWord: "هَاوِيَةٌ",
    acceptedKeywords: "abyss, pit, hawiyah, deep fall, hellfire, doom",
    rejectedKeywords: "paradise, mercy, elevation",
    approvedMeaning: "The abyss — one whose deeds are light will fall into the pit, a name for the blazing Hellfire",
  },

  // ── Surah 102: At-Takathur ───────────────────────────────────────────────
  {
    surahNumber: 102,
    correctWord: "التَّكَاثُرُ",
    acceptedKeywords: "rivalry, competition for increase, mutual boasting, takathur, accumulation",
    rejectedKeywords: "contentment, moderation, generosity",
    approvedMeaning: "Rivalry for increase — the mutual boasting and competition for worldly wealth distracts man from Allah",
  },
  {
    surahNumber: 102,
    correctWord: "الْمَقَابِرَ",
    acceptedKeywords: "graves, maqabir, burial, death, until you die",
    rejectedKeywords: "life, continued living, no end",
    approvedMeaning: "The graves — this rivalry occupies man until death itself, wasting his life on fleeting competition",
  },
  {
    surahNumber: 102,
    correctWord: "الْجَحِيمَ",
    acceptedKeywords: "hellfire, jahim, blazing fire, punishment",
    rejectedKeywords: "paradise, reward, safety",
    approvedMeaning: "The Hellfire — those who are heedless will certainly see it; it is a vivid warning to the ungrateful",
  },
  {
    surahNumber: 102,
    correctWord: "النَّعِيمِ",
    acceptedKeywords: "blessings, bounties, naim, comfort, favors, pleasures",
    rejectedKeywords: "suffering, deprivation, hardship",
    approvedMeaning: "The blessings — on the Day of Judgment, man will be asked about every blessing he was given in this world",
  },

  // ── Surah 103: Al-Asr ────────────────────────────────────────────────────
  {
    surahNumber: 103,
    correctWord: "الْعَصْرِ",
    acceptedKeywords: "time, era, age, asr, passing of time, afternoon",
    rejectedKeywords: "eternity, no time, static",
    approvedMeaning: "By time — Allah swears by time itself, which witnesses the loss of those who misuse it",
  },
  {
    surahNumber: 103,
    correctWord: "خُسْرٍ",
    acceptedKeywords: "loss, ruin, khusr, failure, doom, destruction",
    rejectedKeywords: "success, profit, gain",
    approvedMeaning: "In loss — all of mankind is in a state of loss except those who fulfill the four conditions of salvation",
  },
  {
    surahNumber: 103,
    correctWord: "وَتَوَاصَوْا",
    acceptedKeywords: "enjoin, counsel each other, mutual exhortation, tawasi, encourage",
    rejectedKeywords: "isolate, ignore others, silent",
    approvedMeaning: "Enjoining one another — believers must mutually exhort each other to truth and patience as a communal duty",
  },
  {
    surahNumber: 103,
    correctWord: "بِالصَّبْرِ",
    acceptedKeywords: "patience, perseverance, sabr, steadfastness, endurance",
    rejectedKeywords: "impatience, despair, giving up",
    approvedMeaning: "Patience — steadfast endurance in obedience to Allah, in avoiding sin, and under trials is a pillar of salvation",
  },

  // ── Surah 104: Al-Humazah ────────────────────────────────────────────────
  {
    surahNumber: 104,
    correctWord: "هُمَزَةٍ",
    acceptedKeywords: "slanderer, backbiter, humazah, defamer, one who mocks",
    rejectedKeywords: "praiser, kind-speaker, silent",
    approvedMeaning: "The slanderer — one who habitually attacks others' honor through backbiting and verbal mockery",
  },
  {
    surahNumber: 104,
    correctWord: "جَمَعَ",
    acceptedKeywords: "accumulated, hoarded, gathered, amassed, jama'a, wealth-obsessed",
    rejectedKeywords: "spent, gave in charity, generous",
    approvedMeaning: "He who amasses — the one who piles up wealth and counts it obsessively, neglecting the rights of others",
  },
  {
    surahNumber: 104,
    correctWord: "الْحُطَمَةِ",
    acceptedKeywords: "crushing fire, hutamah, crushing, consuming, blazing, shattering",
    rejectedKeywords: "gentle, mild, light",
    approvedMeaning: "The Crushing Fire — a name for Hellfire that crushes and consumes everything thrown into it",
  },

  // ── Surah 105: Al-Fil ────────────────────────────────────────────────────
  {
    surahNumber: 105,
    correctWord: "الْفِيلِ",
    acceptedKeywords: "elephant, fil, army of elephants, abraha, attack on mecca",
    rejectedKeywords: "horses, camels, infantry only",
    approvedMeaning: "The elephant — the army of Abraha that came with elephants to destroy the Kaaba was destroyed by Allah",
  },
  {
    surahNumber: 105,
    correctWord: "أَبَابِيلَ",
    acceptedKeywords: "flocks, birds in flocks, ababeel, groups, swarms",
    rejectedKeywords: "single bird, one, alone",
    approvedMeaning: "Flocks of birds — Allah sent birds in flocks that bombarded Abraha's army with stones of baked clay",
  },
  {
    surahNumber: 105,
    correctWord: "سِجِّيلٍ",
    acceptedKeywords: "baked clay, sijjil, hardened clay stones, projectiles",
    rejectedKeywords: "arrows, spears, water",
    approvedMeaning: "Baked clay — the birds dropped stones of baked clay upon the army, destroying them utterly",
  },

  // ── Surah 106: Quraysh ───────────────────────────────────────────────────
  {
    surahNumber: 106,
    correctWord: "قُرَيْشٍ",
    acceptedKeywords: "quraysh, tribe, mecca, prophet's tribe, arab tribe, custodians of kaaba",
    rejectedKeywords: "outsiders, non-arab, enemies of mecca",
    approvedMeaning: "Quraysh — the noble tribe entrusted with the Kaaba, who received Allah's protection and provision",
  },
  {
    surahNumber: 106,
    correctWord: "إِيلَٰفِهِمْ",
    acceptedKeywords: "covenant, custom, security, ilaf, familiarity, safe passage, agreement",
    rejectedKeywords: "war, conflict, no trade",
    approvedMeaning: "Their custom — the security pact that allowed Quraysh to travel safely for trade in winter and summer",
  },
  {
    surahNumber: 106,
    correctWord: "الْجُوعِ",
    acceptedKeywords: "hunger, famine, starvation, joo', food, provision",
    rejectedKeywords: "abundance, overeating, wealth",
    approvedMeaning: "Hunger — Allah fed them from hunger and gave them safety, so they should worship Him alone in gratitude",
  },

  // ── Surah 107: Al-Ma'un ──────────────────────────────────────────────────
  {
    surahNumber: 107,
    correctWord: "الدِّينِ",
    acceptedKeywords: "judgment, religion, din, day of recompense, accountability",
    rejectedKeywords: "no judgment, no afterlife, worldly only",
    approvedMeaning: "The Day of Judgment — denying the religion means denying the accountability of the Day of Recompense",
  },
  {
    surahNumber: 107,
    correctWord: "الْيَتِيمَ",
    acceptedKeywords: "orphan, yatim, fatherless child, vulnerable, needy",
    rejectedKeywords: "wealthy, cared for, adult",
    approvedMeaning: "The orphan — the one who denies judgment harshly pushes away the orphan rather than showing compassion",
  },
  {
    surahNumber: 107,
    correctWord: "الْمَاعُونَ",
    acceptedKeywords: "small kindnesses, ma'un, charitable aid, basic help, utensils, charity",
    rejectedKeywords: "major gift, refusing all giving, large donation",
    approvedMeaning: "Small kindnesses — withholding even small acts of neighborly help is a sign of the hypocrite",
  },

  // ── Surah 108: Al-Kawthar ────────────────────────────────────────────────
  {
    surahNumber: 108,
    correctWord: "الْكَوْثَرَ",
    acceptedKeywords: "abundance, kawthar, river in paradise, immense good, blessing",
    rejectedKeywords: "deprivation, loss, little",
    approvedMeaning: "Al-Kawthar — a river of immense good in Paradise granted to the Prophet as a divine gift",
  },
  {
    surahNumber: 108,
    correctWord: "فَصَلِّ",
    acceptedKeywords: "pray, perform salah, worship, salli, gratitude through prayer",
    rejectedKeywords: "neglect prayer, no worship",
    approvedMeaning: "So pray — in gratitude for the gift of Al-Kawthar, the Prophet and believers are commanded to pray",
  },
  {
    surahNumber: 108,
    correctWord: "الْأَبْتَرُ",
    acceptedKeywords: "cut off, abtar, without progeny, legacy severed, forgotten",
    rejectedKeywords: "remembered, legacy continuing, honored",
    approvedMeaning: "The one cut off — it is the Prophet's enemy, not the Prophet, who is truly cut off and forgotten",
  },

  // ── Surah 109: Al-Kafirun ────────────────────────────────────────────────
  {
    surahNumber: 109,
    correctWord: "الْكَٰفِرُونَ",
    acceptedKeywords: "disbelievers, kafirun, rejecters of faith, unbelievers",
    rejectedKeywords: "believers, muslims, people of faith",
    approvedMeaning: "The disbelievers — those who persistently reject faith; this surah declares a clear separation from their false worship",
  },
  {
    surahNumber: 109,
    correctWord: "تَعْبُدُونَ",
    acceptedKeywords: "what you worship, your worship, idols, ta'budun, false deities",
    rejectedKeywords: "Allah, true worship, monotheism",
    approvedMeaning: "What you worship — the disbelievers' objects of worship are fundamentally different from what the believers worship",
  },
  {
    surahNumber: 109,
    correctWord: "دِينِكُمْ",
    acceptedKeywords: "your religion, your way, dinukum, belief system, your faith",
    rejectedKeywords: "our religion, shared faith",
    approvedMeaning: "Your religion — a declaration of total separation: to you your religion and to me mine, no compromise in faith",
  },

  // ── Surah 110: An-Nasr ───────────────────────────────────────────────────
  {
    surahNumber: 110,
    correctWord: "النَّصْرُ",
    acceptedKeywords: "help, victory, nasr, divine support, triumph, conquest",
    rejectedKeywords: "defeat, failure, loss",
    approvedMeaning: "The help and victory — Allah's promised victory and the conquest of Mecca was a sign of the mission's completion",
  },
  {
    surahNumber: 110,
    correctWord: "أَفْوَاجًا",
    acceptedKeywords: "multitudes, groups, crowds, afwaj, flocks, masses entering islam",
    rejectedKeywords: "individuals, few, one by one",
    approvedMeaning: "In multitudes — after the conquest, people entered Islam in great crowds, fulfilling the divine promise",
  },
  {
    surahNumber: 110,
    correctWord: "فَسَبِّحْ",
    acceptedKeywords: "glorify, tasbih, praise, exalt, celebrate Allah's perfection",
    rejectedKeywords: "complain, boast, remain silent",
    approvedMeaning: "Glorify — after victory, the Prophet is commanded to glorify Allah, recognizing it is His power, not human might",
  },

  // ── Surah 111: Al-Masad ──────────────────────────────────────────────────
  {
    surahNumber: 111,
    correctWord: "تَبَّتْ",
    acceptedKeywords: "perish, ruined, tabbat, destroyed, doomed, wretched",
    rejectedKeywords: "succeed, prosper, be guided",
    approvedMeaning: "May he perish — a declaration of ruin upon Abu Lahab who actively opposed the Prophet and rejected Islam",
  },
  {
    surahNumber: 111,
    correctWord: "مَالُهُ",
    acceptedKeywords: "wealth, his money, maluhu, riches, property",
    rejectedKeywords: "good deeds, faith, piety",
    approvedMeaning: "His wealth — neither the great wealth of Abu Lahab nor anything else availed him against Allah's judgment",
  },
  {
    surahNumber: 111,
    correctWord: "الْمَسَدِ",
    acceptedKeywords: "palm fiber, masad, rope of twisted strands, fuel wood gatherer",
    rejectedKeywords: "gold, silk, honor",
    approvedMeaning: "Twisted fiber — Abu Lahab's wife will carry firewood in Hellfire with a rope of twisted palm fiber around her neck",
  },

  // ── Surah 112: Al-Ikhlas ─────────────────────────────────────────────────
  {
    surahNumber: 112,
    correctWord: "أَحَدٌ",
    acceptedKeywords: "one, unique, ahad, singular, indivisible, only one",
    rejectedKeywords: "multiple, partners, divided, trinity",
    approvedMeaning: "One — Allah is absolutely one, unique, and indivisible; there is nothing like unto Him",
  },
  {
    surahNumber: 112,
    correctWord: "الصَّمَدُ",
    acceptedKeywords: "eternal, self-sufficient, samad, the one who is sought, needless, refuge",
    rejectedKeywords: "needy, dependent, temporary",
    approvedMeaning: "The Eternal — Allah is Al-Samad: the one upon whom all creation depends while He depends on none",
  },
  {
    surahNumber: 112,
    correctWord: "يُولَدْ",
    acceptedKeywords: "begotten, born, born from, parentage, offspring",
    rejectedKeywords: "created, sent, existed eternally",
    approvedMeaning: "Was not begotten — Allah was not born and has no children; He is entirely free from such human attributes",
  },
  {
    surahNumber: 112,
    correctWord: "كُفُوًا",
    acceptedKeywords: "equal, comparable, kufuwan, equivalent, like, match",
    rejectedKeywords: "inferior, superior to something, has a match",
    approvedMeaning: "An equal — there is absolutely nothing comparable or equivalent to Allah in any aspect of existence",
  },

  // ── Surah 113: Al-Falaq ──────────────────────────────────────────────────
  {
    surahNumber: 113,
    correctWord: "الْفَلَقِ",
    acceptedKeywords: "daybreak, falaq, dawn, splitting, morning light, cleaving",
    rejectedKeywords: "night, darkness, sunset",
    approvedMeaning: "The daybreak — seeking refuge in the Lord of the splitting dawn, the creator of all light and life",
  },
  {
    surahNumber: 113,
    correctWord: "غَاسِقٍ",
    acceptedKeywords: "darkness, night, gasiq, evil of darkness, the night as it spreads",
    rejectedKeywords: "light, day, safety",
    approvedMeaning: "Darkness as it spreads — the evil that lurks and spreads in the night, from which one seeks Allah's protection",
  },
  {
    surahNumber: 113,
    correctWord: "النَّفَّٰثَٰتِ",
    acceptedKeywords: "those who blow on knots, naffathat, witches, sorcery, black magic",
    rejectedKeywords: "healers, honest, innocent",
    approvedMeaning: "Those who blow on knots — practitioners of sorcery who use knotted cords as a means of harmful magic",
  },
  {
    surahNumber: 113,
    correctWord: "حَاسِدٍ",
    acceptedKeywords: "envy, envier, hasid, jealousy, ill-wishing",
    rejectedKeywords: "love, goodwill, generosity",
    approvedMeaning: "An envier — envy is a spiritual disease that harms the envious person and can bring harm to the envied",
  },

  // ── Surah 114: An-Nas ────────────────────────────────────────────────────
  {
    surahNumber: 114,
    correctWord: "النَّاسِ",
    acceptedKeywords: "mankind, people, nas, humanity, all humans",
    rejectedKeywords: "jinn only, angels, animals",
    approvedMeaning: "Mankind — the surah addresses all of humanity, seeking refuge in the Lord, King, and God of all people",
  },
  {
    surahNumber: 114,
    correctWord: "الْوَسْوَاسِ",
    acceptedKeywords: "whispering, waswas, insinuation, evil whisper, temptation",
    rejectedKeywords: "loud command, open call, guidance",
    approvedMeaning: "The whisperer — the chief evil is the subtle whisper of Shaytan that creeps into the hearts of people",
  },
  {
    surahNumber: 114,
    correctWord: "الْخَنَّاسِ",
    acceptedKeywords: "one who retreats, khannas, withdrawing devil, sneaky, retreats at dhikr",
    rejectedKeywords: "constant, open, persistent openly",
    approvedMeaning: "The retreating one — Shaytan withdraws when Allah is remembered, then returns when heedlessness sets in",
  },
  {
    surahNumber: 114,
    correctWord: "الْجِنَّةِ",
    acceptedKeywords: "jinn, jinnah, unseen beings, spirits, from among jinn",
    rejectedKeywords: "humans, angels, visible",
    approvedMeaning: "The jinn — evil whispering comes from both jinn and human devils; both are sources of harm to beware of",
  },
];

export async function seedTabariKeywords(): Promise<{ updated: number; skipped: number }> {
  let updated = 0;
  let skipped = 0;

  for (const seed of ALL_KEYWORDS) {
    try {
      const matches = await db
        .select({
          id: tabariExercises.id,
          acceptedKeywords: tabariExercises.acceptedKeywords,
          rejectedKeywords: tabariExercises.rejectedKeywords,
          approvedMeaning: tabariExercises.approvedMeaning,
          approvedContextReason: tabariExercises.approvedContextReason,
        })
        .from(tabariExercises)
        .where(
          and(
            eq(tabariExercises.surahNumber, seed.surahNumber),
            eq(tabariExercises.correctWord, seed.correctWord),
          )
        );

      for (const exercise of matches) {
        const patch: Record<string, string> = {};
        if (!exercise.acceptedKeywords) patch.acceptedKeywords = seed.acceptedKeywords;
        if (!exercise.rejectedKeywords) patch.rejectedKeywords = seed.rejectedKeywords;
        if (!exercise.approvedMeaning) patch.approvedMeaning = seed.approvedMeaning;
        // approvedContextReason serves as ground truth for the LLM evaluator.
        // We reuse approvedMeaning when no separate reason has been curated.
        if (!exercise.approvedContextReason) patch.approvedContextReason = seed.approvedMeaning;

        if (Object.keys(patch).length === 0) {
          skipped++;
          continue;
        }

        await db
          .update(tabariExercises)
          .set(patch)
          .where(eq(tabariExercises.id, exercise.id));
        updated++;
      }
    } catch (err: any) {
      console.error(`[seed-tabari-keywords] Error for surah ${seed.surahNumber} word "${seed.correctWord}":`, err?.message);
    }
  }

  console.log(`[seed-tabari-keywords] Done: updated=${updated} skipped=${skipped}`);
  return { updated, skipped };
}
