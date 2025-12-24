export interface ChineseQuranicWord {
  id: number;
  chinese: string;
  arabic: string;
  meaning: string;
  derivatives: { arabic: string; chinese: string }[];
}

export const chineseQuranicWords: ChineseQuranicWord[] = [
  {
    id: 1,
    chinese: "安拉",
    arabic: "الله",
    meaning: "真主",
    derivatives: [
      { arabic: "لله", chinese: "属于真主" },
      { arabic: "بالله", chinese: "凭真主/以真主起誓" }
    ]
  },
  {
    id: 2,
    chinese: "伊斯兰",
    arabic: "الإسلام",
    meaning: "伊斯兰/归顺真主",
    derivatives: [
      { arabic: "أسلم", chinese: "归顺/信教" },
      { arabic: "سِلم", chinese: "和平/和解" }
    ]
  },
  {
    id: 3,
    chinese: "穆斯林",
    arabic: "مسلم",
    meaning: "穆斯林/信士(广义)",
    derivatives: [
      { arabic: "مسلمين", chinese: "穆斯林们" },
      { arabic: "إسلام", chinese: "伊斯兰" }
    ]
  },
  {
    id: 4,
    chinese: "伊玛目",
    arabic: "إمام",
    meaning: "伊玛目/领拜者/领袖",
    derivatives: [
      { arabic: "أئمة", chinese: "诸伊玛目/领袖们" },
      { arabic: "أمام", chinese: "在前面" }
    ]
  },
  {
    id: 5,
    chinese: "哈里发",
    arabic: "خليفة",
    meaning: "哈里发/继承者/代治者",
    derivatives: [
      { arabic: "خلائف", chinese: "继承者们" },
      { arabic: "خلف", chinese: "在后/继承" }
    ]
  },
  {
    id: 6,
    chinese: "乌玛",
    arabic: "أمة",
    meaning: "乌玛/社群/民族",
    derivatives: [
      { arabic: "أمم", chinese: "万民/诸民族" },
      { arabic: "أمتي", chinese: "我的社群" }
    ]
  },
  {
    id: 7,
    chinese: "古兰经",
    arabic: "قرآن",
    meaning: "《古兰经》",
    derivatives: [
      { arabic: "قرأ", chinese: "诵读/阅读" },
      { arabic: "قراءة", chinese: "诵读/阅读(名词)" }
    ]
  },
  {
    id: 8,
    chinese: "苏拉",
    arabic: "سورة",
    meaning: "章/苏拉",
    derivatives: [
      { arabic: "سور", chinese: "诸章" },
      { arabic: "سورةً", chinese: "一章(作状语/用法)" }
    ]
  },
  {
    id: 9,
    chinese: "阿亚",
    arabic: "آية",
    meaning: "节(经文)/迹象",
    derivatives: [
      { arabic: "آيات", chinese: "经文/迹象(复数)" },
      { arabic: "آيتي", chinese: "我的迹象/我的经文" }
    ]
  },
  {
    id: 10,
    chinese: "哈迪斯",
    arabic: "حديث",
    meaning: "圣训/言语/叙述",
    derivatives: [
      { arabic: "أحاديث", chinese: "许多叙述/圣训(复数)" },
      { arabic: "يُحدّث", chinese: "讲述/叙述" }
    ]
  },
  {
    id: 11,
    chinese: "沙里亚",
    arabic: "شريعة",
    meaning: "教法/法度",
    derivatives: [
      { arabic: "شرع", chinese: "制定/开始立法" },
      { arabic: "شرائع", chinese: "法度(复数)" }
    ]
  },
  {
    id: 12,
    chinese: "吉哈德",
    arabic: "جهاد",
    meaning: "奋斗/努力(宗教语境)",
    derivatives: [
      { arabic: "يجاهد", chinese: "奋斗/力争" },
      { arabic: "مجاهد", chinese: "奋斗者" }
    ]
  },
  {
    id: 13,
    chinese: "艾赞",
    arabic: "أذان",
    meaning: "宣礼/唤礼",
    derivatives: [
      { arabic: "مؤذن", chinese: "宣礼员" },
      { arabic: "أذّن", chinese: "宣告/宣礼" }
    ]
  },
  {
    id: 14,
    chinese: "萨拉特",
    arabic: "صلاة",
    meaning: "礼拜/拜功",
    derivatives: [
      { arabic: "صلوات", chinese: "多次礼拜" },
      { arabic: "يصلّي", chinese: "做礼拜" }
    ]
  },
  {
    id: 15,
    chinese: "沙渥姆",
    arabic: "صوم",
    meaning: "斋戒",
    derivatives: [
      { arabic: "صيام", chinese: "斋戒(名词)" },
      { arabic: "صائم", chinese: "守斋者" }
    ]
  },
  {
    id: 16,
    chinese: "赖买丹",
    arabic: "رمضان",
    meaning: "斋月",
    derivatives: [
      { arabic: "شهرُ رمضان", chinese: "斋月" },
      { arabic: "في رمضان", chinese: "在斋月里" }
    ]
  },
  {
    id: 17,
    chinese: "扎卡特",
    arabic: "زكاة",
    meaning: "天课/净财",
    derivatives: [
      { arabic: "يزكّي", chinese: "净化/交天课" },
      { arabic: "تزكية", chinese: "净化(名词)" }
    ]
  },
  {
    id: 18,
    chinese: "萨达卡",
    arabic: "صدقة",
    meaning: "施舍",
    derivatives: [
      { arabic: "يتصدّق", chinese: "施舍" },
      { arabic: "صدقات", chinese: "施舍(复数)" }
    ]
  },
  {
    id: 19,
    chinese: "欧木赖",
    arabic: "عمرة",
    meaning: "小朝/副朝",
    derivatives: [
      { arabic: "يعتمر", chinese: "行小朝" },
      { arabic: "معتمر", chinese: "行小朝者" }
    ]
  },
  {
    id: 20,
    chinese: "伊德",
    arabic: "عيد",
    meaning: "节日/尔德",
    derivatives: [
      { arabic: "أعياد", chinese: "节日(复数)" },
      { arabic: "عيدٌ مبارك", chinese: "祝节日吉庆" }
    ]
  },
  {
    id: 21,
    chinese: "色兰",
    arabic: "سلام",
    meaning: "平安/问安",
    derivatives: [
      { arabic: "السلام عليكم", chinese: "愿平安临到你们" },
      { arabic: "سلامًا", chinese: "平安地/以平安(表达)" }
    ]
  },
  {
    id: 22,
    chinese: "达瓦",
    arabic: "دعوة",
    meaning: "宣教/呼唤",
    derivatives: [
      { arabic: "دعا", chinese: "呼唤/祈祷" },
      { arabic: "دعاء", chinese: "祈祷(名词)" }
    ]
  },
  {
    id: 23,
    chinese: "迪克尔",
    arabic: "ذكر",
    meaning: "记念真主",
    derivatives: [
      { arabic: "يذكر", chinese: "记念/提及" },
      { arabic: "ذِكرى", chinese: "记念/提醒" }
    ]
  },
  {
    id: 24,
    chinese: "特斯必赫",
    arabic: "تسبيح",
    meaning: "赞颂( سبحان الله )",
    derivatives: [
      { arabic: "سبّح", chinese: "赞颂" },
      { arabic: "يسبّح", chinese: "他赞颂" }
    ]
  },
  {
    id: 25,
    chinese: "提拉沃",
    arabic: "تلاوة",
    meaning: "诵读(经文)",
    derivatives: [
      { arabic: "تلا", chinese: "诵读" },
      { arabic: "يتلو", chinese: "他诵读" }
    ]
  },
  {
    id: 26,
    chinese: "讨白",
    arabic: "توبة",
    meaning: "悔改",
    derivatives: [
      { arabic: "تاب", chinese: "悔改了" },
      { arabic: "يتوب", chinese: "他悔改" }
    ]
  },
  {
    id: 27,
    chinese: "卡菲勒",
    arabic: "كافر",
    meaning: "不信者",
    derivatives: [
      { arabic: "كفار", chinese: "不信者们" },
      { arabic: "كفر", chinese: "不信/遮蔽(名词)" }
    ]
  },
  {
    id: 28,
    chinese: "尼法格",
    arabic: "نفاق",
    meaning: "伪信/两面性",
    derivatives: [
      { arabic: "منافق", chinese: "伪信者" },
      { arabic: "ينافق", chinese: "伪装/两面" }
    ]
  },
  {
    id: 29,
    chinese: "舍克",
    arabic: "شرك",
    meaning: "以物配主",
    derivatives: [
      { arabic: "مشرك", chinese: "配主者" },
      { arabic: "أشرك", chinese: "配主了" }
    ]
  },
  {
    id: 30,
    chinese: "萨旦",
    arabic: "شيطان",
    meaning: "恶魔/撒旦",
    derivatives: [
      { arabic: "شياطين", chinese: "恶魔们" },
      { arabic: "شيطاني", chinese: "恶魔般的" }
    ]
  },
  {
    id: 31,
    chinese: "伊布力斯",
    arabic: "إبليس",
    meaning: "易卜劣斯",
    derivatives: [
      { arabic: "إبليسَ", chinese: "易卜劣斯(宾格常见)" },
      { arabic: "من إبليس", chinese: "来自易卜劣斯/关于他" }
    ]
  },
  {
    id: 32,
    chinese: "努尔",
    arabic: "نور",
    meaning: "光明",
    derivatives: [
      { arabic: "أنوار", chinese: "光明们" },
      { arabic: "منير", chinese: "发光的/照明的" }
    ]
  },
  {
    id: 33,
    chinese: "沙布尔",
    arabic: "صبر",
    meaning: "忍耐/坚忍",
    derivatives: [
      { arabic: "صابر", chinese: "忍耐者" },
      { arabic: "يصبر", chinese: "他忍耐" }
    ]
  },
  {
    id: 34,
    chinese: "阿德勒",
    arabic: "عدل",
    meaning: "公正/公平",
    derivatives: [
      { arabic: "عادل", chinese: "公正的" },
      { arabic: "يعدل", chinese: "他公平行事" }
    ]
  },
  {
    id: 35,
    chinese: "卡达尔",
    arabic: "قدر",
    meaning: "定量/前定",
    derivatives: [
      { arabic: "يقدّر", chinese: "衡量/注定" },
      { arabic: "تقدير", chinese: "安排/估量" }
    ]
  },
  {
    id: 36,
    chinese: "卡勒布",
    arabic: "قلب",
    meaning: "心灵",
    derivatives: [
      { arabic: "قلوب", chinese: "心(复数)" },
      { arabic: "يقلب", chinese: "翻转/改变" }
    ]
  },
  {
    id: 37,
    chinese: "巴伊",
    arabic: "باطل",
    meaning: "虚妄/错误",
    derivatives: [
      { arabic: "يبطل", chinese: "使无效/作废" },
      { arabic: "إبطال", chinese: "废除/使无效" }
    ]
  },
  {
    id: 38,
    chinese: "巴拉卡",
    arabic: "بركة",
    meaning: "福分/吉庆",
    derivatives: [
      { arabic: "مبارك", chinese: "有福的" },
      { arabic: "بركات", chinese: "福分(复数)" }
    ]
  },
  {
    id: 39,
    chinese: "巴尔扎赫",
    arabic: "برزخ",
    meaning: "阴阳界间隔/屏障",
    derivatives: [
      { arabic: "حاجز", chinese: "屏障(近义)" },
      { arabic: "بينهما برزخ", chinese: "两者之间有屏障" }
    ]
  },
  {
    id: 40,
    chinese: "拜西拉",
    arabic: "بصيرة",
    meaning: "洞察/明证",
    derivatives: [
      { arabic: "بصير", chinese: "洞察的" },
      { arabic: "يبصر", chinese: "看见/领悟" }
    ]
  },
  {
    id: 41,
    chinese: "巴舍",
    arabic: "بشر",
    meaning: "人类",
    derivatives: [
      { arabic: "بشير", chinese: "报喜者" },
      { arabic: "تبشير", chinese: "报喜/佳音" }
    ]
  },
  {
    id: 42,
    chinese: "赫勒格",
    arabic: "خلق",
    meaning: "创造",
    derivatives: [
      { arabic: "خالق", chinese: "创造者" },
      { arabic: "مخلوق", chinese: "被造物" }
    ]
  },
  {
    id: 43,
    chinese: "克塔布",
    arabic: "كتاب",
    meaning: "经典/书",
    derivatives: [
      { arabic: "كتب", chinese: "写/规定" },
      { arabic: "مكتوب", chinese: "写下的/注定的" }
    ]
  },
  {
    id: 44,
    chinese: "马斯吉德",
    arabic: "مسجد",
    meaning: "清真寺",
    derivatives: [
      { arabic: "مساجد", chinese: "清真寺(复数)" },
      { arabic: "سجود", chinese: "叩头/叩拜" }
    ]
  },
  {
    id: 45,
    chinese: "克尔白",
    arabic: "كعبة",
    meaning: "克尔白/天房",
    derivatives: [
      { arabic: "البيت", chinese: "天房(常用称呼)" },
      { arabic: "حول الكعبة", chinese: "围绕克尔白" }
    ]
  },
  {
    id: 46,
    chinese: "阿德",
    arabic: "أحد",
    meaning: "独一/唯一",
    derivatives: [
      { arabic: "واحد", chinese: "唯一" },
      { arabic: "وحده", chinese: "单独地/唯独他" }
    ]
  },
  {
    id: 47,
    chinese: "阿黑赖",
    arabic: "آخرة",
    meaning: "后世",
    derivatives: [
      { arabic: "الآخر", chinese: "最后的/末后的" },
      { arabic: "آخِر", chinese: "最后(形容/名词)" }
    ]
  },
  {
    id: 48,
    chinese: "阿拉明",
    arabic: "عالمين",
    meaning: "众世界/万世",
    derivatives: [
      { arabic: "عالَم", chinese: "世界" },
      { arabic: "العالم", chinese: "世界(集合)" }
    ]
  },
  {
    id: 49,
    chinese: "沙哈达",
    arabic: "شهادة",
    meaning: "作证/证言",
    derivatives: [
      { arabic: "شهد", chinese: "作证" },
      { arabic: "شاهد", chinese: "证人/见证者" }
    ]
  },
  {
    id: 50,
    chinese: "沙希德",
    arabic: "شهيد",
    meaning: "殉教者/见证者",
    derivatives: [
      { arabic: "شهداء", chinese: "殉教者们" },
      { arabic: "مشهود", chinese: "被见证的/可见证的" }
    ]
  }
];

export function getChineseWordByIndex(index: number): ChineseQuranicWord {
  return chineseQuranicWords[index % chineseQuranicWords.length];
}

export function getRandomChineseWord(): ChineseQuranicWord {
  return chineseQuranicWords[Math.floor(Math.random() * chineseQuranicWords.length)];
}
