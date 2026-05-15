/**
 * 2026 美加墨世界杯 · 48 强数据层
 * 分组来源：FIFA 官方抽签结果（2025-12）及 MLS / Yahoo Sports 等公开报道汇总。
 * 说明：欧洲附加赛 / 洲际附加赛席位以 EU_PO_* / FIFA_PO_* 占位；其球员为示意译名。
 * 其余球队：在公开国脚名单基础上做结构化整理；身价单位为百万欧元，为赛前估算量级。
 */

/** @typedef {'GK'|'DF'|'MF'|'FW'} WcPos */
/** @typedef {{速度:number,射门:number,传球:number,盘带:number,防守:number,力量:number}} WcStats */
/** @typedef {{id:string,name:string,position:WcPos,age:number,value:number,avatar:string,ovr:number,stats:WcStats,tags:[string,string,string]}} WCPlayer */

export const GROUPS_2026 = [
  {
    letter: "A",
    teams: [
      { id: "MEX", name: "墨西哥" },
      { id: "RSA", name: "南非" },
      { id: "KOR", name: "韩国" },
      { id: "EU_PO_D", name: "欧洲附加赛D档胜者（待定）" },
    ],
  },
  {
    letter: "B",
    teams: [
      { id: "CAN", name: "加拿大" },
      { id: "EU_PO_A", name: "欧洲附加赛A档胜者（待定）" },
      { id: "QAT", name: "卡塔尔" },
      { id: "SUI", name: "瑞士" },
    ],
  },
  {
    letter: "C",
    teams: [
      { id: "BRA", name: "巴西" },
      { id: "MAR", name: "摩洛哥" },
      { id: "HAI", name: "海地" },
      { id: "SCO", name: "苏格兰" },
    ],
  },
  {
    letter: "D",
    teams: [
      { id: "USA", name: "美国" },
      { id: "PAR", name: "巴拉圭" },
      { id: "AUS", name: "澳大利亚" },
      { id: "EU_PO_C", name: "欧洲附加赛C档胜者（待定）" },
    ],
  },
  {
    letter: "E",
    teams: [
      { id: "GER", name: "德国" },
      { id: "CUW", name: "库拉索" },
      { id: "CIV", name: "科特迪瓦" },
      { id: "ECU", name: "厄瓜多尔" },
    ],
  },
  {
    letter: "F",
    teams: [
      { id: "NED", name: "荷兰" },
      { id: "JPN", name: "日本" },
      { id: "EU_PO_B", name: "欧洲附加赛B档胜者（待定）" },
      { id: "TUN", name: "突尼斯" },
    ],
  },
  {
    letter: "G",
    teams: [
      { id: "BEL", name: "比利时" },
      { id: "EGY", name: "埃及" },
      { id: "IRN", name: "伊朗" },
      { id: "NZL", name: "新西兰" },
    ],
  },
  {
    letter: "H",
    teams: [
      { id: "ESP", name: "西班牙" },
      { id: "CPV", name: "佛得角" },
      { id: "KSA", name: "沙特阿拉伯" },
      { id: "URU", name: "乌拉圭" },
    ],
  },
  {
    letter: "I",
    teams: [
      { id: "FRA", name: "法国" },
      { id: "SEN", name: "塞内加尔" },
      { id: "FIFA_PO_2", name: "洲际附加赛2胜者（待定）" },
      { id: "NOR", name: "挪威" },
    ],
  },
  {
    letter: "J",
    teams: [
      { id: "ARG", name: "阿根廷" },
      { id: "ALG", name: "阿尔及利亚" },
      { id: "AUT", name: "奥地利" },
      { id: "JOR", name: "约旦" },
    ],
  },
  {
    letter: "K",
    teams: [
      { id: "POR", name: "葡萄牙" },
      { id: "FIFA_PO_1", name: "洲际附加赛1胜者（待定）" },
      { id: "UZB", name: "乌兹别克斯坦" },
      { id: "COL", name: "哥伦比亚" },
    ],
  },
  {
    letter: "L",
    teams: [
      { id: "ENG", name: "英格兰" },
      { id: "CRO", name: "克罗地亚" },
      { id: "GHA", name: "加纳" },
      { id: "PAN", name: "巴拿马" },
    ],
  },
];

const TIER_OVR = {
  BRA: 89,
  ARG: 89,
  FRA: 89,
  ENG: 88,
  ESP: 88,
  GER: 87,
  POR: 87,
  NED: 86,
  BEL: 86,
  USA: 84,
  MEX: 83,
  COL: 84,
  URU: 83,
  CRO: 82,
  SUI: 82,
  KOR: 81,
  JPN: 81,
  AUS: 79,
  CAN: 81,
  MAR: 82,
  SEN: 81,
  NOR: 81,
  AUT: 80,
  ECU: 79,
  PAR: 78,
  IRN: 78,
  EGY: 77,
  ALG: 76,
  GHA: 76,
  TUN: 76,
  UZB: 76,
  NZL: 71,
  RSA: 72,
  CPV: 74,
  KSA: 75,
  PAN: 73,
  HAI: 69,
  JOR: 72,
  CIV: 78,
  CUW: 71,
  QAT: 72,
  SCO: 78,
  EU_PO_A: 74,
  EU_PO_B: 74,
  EU_PO_C: 74,
  EU_PO_D: 74,
  FIFA_PO_1: 73,
  FIFA_PO_2: 73,
};

function hash32(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function pickTags(pos, rnd) {
  const pools = {
    GK: [
      ["门线反应", "出击果断", "长传发动"],
      ["指挥防线", "点球专家", "高空统治"],
      ["稳健摘球", "脚下出球", "大赛气质"],
    ],
    DF: [
      ["上抢凶狠", "回追速度", "空中对抗"],
      ["铲断精准", "边路往返", "战术纪律"],
      ["出球中卫", "对抗强硬", "定位球威胁"],
    ],
    MF: [
      ["中场大脑", "纵向推进", "远射重炮"],
      ["覆盖面积大", "反抢积极", "转移调度"],
      ["组织核心", "直塞穿透", "节奏控制"],
    ],
    FW: [
      ["速度奇快", "单刀冷静", "反越位嗅觉"],
      ["支点做球", "头球轰炸", "背身护球"],
      ["内切射门", "一对一爆破", "无球拉扯"],
    ],
  };
  const arr = pools[pos];
  return arr[Math.floor(rnd() * arr.length)];
}

function statsFrom(pos, ovr, rnd) {
  const base = ovr - 6 + rnd() * 12;
  const bump = (a, b) => clamp(base * a + b * 10, 35, 96);
  if (pos === "GK") {
    return {
      速度: bump(0.45, rnd() * 0.4),
      射门: bump(0.25, rnd() * 0.2),
      传球: bump(0.55, rnd() * 0.5),
      盘带: bump(0.35, rnd() * 0.3),
      防守: bump(0.85, rnd() * 0.6),
      力量: bump(0.7, rnd() * 0.4),
    };
  }
  if (pos === "DF") {
    return {
      速度: bump(0.55, rnd() * 0.5),
      射门: bump(0.35, rnd() * 0.3),
      传球: bump(0.55, rnd() * 0.45),
      盘带: bump(0.45, rnd() * 0.35),
      防守: bump(0.88, rnd() * 0.55),
      力量: bump(0.78, rnd() * 0.45),
    };
  }
  if (pos === "MF") {
    return {
      速度: bump(0.62, rnd() * 0.55),
      射门: bump(0.55, rnd() * 0.5),
      传球: bump(0.82, rnd() * 0.6),
      盘带: bump(0.7, rnd() * 0.55),
      防守: bump(0.62, rnd() * 0.5),
      力量: bump(0.6, rnd() * 0.45),
    };
  }
  return {
    速度: bump(0.78, rnd() * 0.6),
    射门: bump(0.82, rnd() * 0.65),
    传球: bump(0.62, rnd() * 0.5),
    盘带: bump(0.78, rnd() * 0.6),
    防守: bump(0.42, rnd() * 0.35),
    力量: bump(0.68, rnd() * 0.5),
  };
}

function avatar(teamId, pid) {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(`${teamId}:${pid}`)}&backgroundColor=020617`;
}

/** 20 行：name|POS|age|value|ovr */
function parseCsvRoster(teamId, csv) {
  const lines = csv
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const rnd = mulberry32(hash32(teamId + ":csv"));
  return lines.map((line, i) => {
    const [name, position, ageS, valueS, ovrS] = line.split("|").map((s) => s.trim());
    const age = clamp(Number(ageS), 16, 42);
    const value = Math.max(0.2, Number(valueS));
    const ovr = clamp(Number(ovrS), 55, 96);
    const pid = `${teamId}-${String(i + 1).padStart(2, "0")}`;
    const tags = pickTags(/** @type {WcPos} */ (position), rnd);
    return {
      id: pid,
      name,
      position: /** @type {WcPos} */ (position),
      age,
      value,
      avatar: avatar(teamId, pid),
      ovr,
      stats: statsFrom(/** @type {WcPos} */ (position), ovr, rnd),
      tags,
    };
  });
}

const CURATED = {
  MEX: `吉列尔莫·奥乔亚|GK|39|1.1|82
路易斯·马查因|GK|34|0.9|78
约翰·巴斯克斯|DF|30|2.8|79
塞萨尔·蒙特斯|DF|27|3.5|80
赫苏斯·加利亚多|DF|30|2.2|78
豪尔赫·桑切斯|DF|27|2.0|77
赫苏斯·安古洛|DF|25|3.2|78
埃德松·阿尔瓦雷斯|MF|27|28|84
路易斯·查韦斯|MF|28|9|81
卡洛斯·罗德里格斯|MF|27|6|79
埃里克·古铁雷斯|MF|29|5|78
罗伯托·阿尔瓦拉多|MF|30|7|80
乌利尔·安图纳|MF|27|4|77
劳尔·希门尼斯|FW|33|6|79
圣地亚哥·希门尼斯|FW|23|35|82
亨利·马丁|FW|31|4|76
胡利安·基尼奥内斯|FW|25|8|78
亚历克西斯·维加|FW|26|7|79
罗伯托·德拉罗萨|FW|24|3|74
欧弗利·佩拉尔塔|FW|22|2.5|73`,

  BRA: `阿利松|GK|31|28|89
埃德森|GK|31|25|88
布雷默|DF|27|45|86
加布里埃尔|DF|26|38|85
马尔基尼奥斯|DF|30|32|87
达尼洛|DF|33|9|82
阿拉纳|DF|31|7|80
吉马良斯|MF|26|55|86
帕奎塔|MF|27|48|85
卡塞米罗|MF|32|22|84
安德烈|MF|22|40|83
罗德里戈|FW|23|95|88
维尼修斯|FW|24|150|91
拉菲尼亚|FW|27|65|87
马丁内利|FW|23|70|86
恩德里克|FW|18|45|80
埃瓦尼尔森|FW|24|28|82
佩德罗|FW|27|22|81
理查利森|FW|27|25|82
热苏斯|FW|27|30|83`,

  ARG: `埃米利亚诺·马丁内斯|GK|32|28|88
赫罗尼莫·鲁利|GK|32|6|80
克里斯蒂安·罗梅罗|DF|26|65|87
尼古拉斯·奥塔门迪|DF|36|4|82
纳韦尔·莫利纳|DF|26|18|83
马科斯·阿库尼亚|DF|33|8|81
尼古拉斯·塔利亚菲科|DF|32|7|80
贡萨洛·蒙铁尔|DF|27|9|81
恩佐·费尔南德斯|MF|23|75|86
亚历克西斯·麦卡利斯特|MF|25|70|85
罗德里戈·德保罗|MF|30|35|84
莱安德罗·帕雷德斯|MF|30|12|81
吉奥瓦尼·洛塞尔索|MF|28|18|82
梅西|FW|37|35|92
劳塔罗·马丁内斯|FW|27|95|89
胡利安·阿尔瓦雷斯|FW|24|90|88
保罗·迪巴拉|FW|30|25|85
安赫尔·迪马利亚|FW|36|8|83
亚历杭德罗·加纳乔|FW|20|55|84
尼古拉斯·冈萨雷斯|FW|26|22|82`,

  FRA: `迈克·迈尼昂|GK|29|45|89
阿方斯·阿雷奥拉|GK|31|9|82
威廉·萨利巴|DF|23|80|88
达约特·于帕梅卡诺|DF|25|55|86
儒勒·孔德|DF|25|60|87
卢卡斯·埃尔南德斯|DF|28|35|84
特奥·埃尔南德斯|DF|27|55|86
邦雅曼·帕瓦尔|DF|28|25|83
奥雷利安·琼阿梅尼|MF|24|90|87
爱德华多·卡马文加|MF|22|85|86
阿德里安·拉比奥|MF|29|25|84
科洛·穆阿尼|FW|25|70|86
奥斯曼·登贝莱|FW|27|60|87
基利安·姆巴佩|FW|25|180|93
安托万·格列兹曼|MF|33|25|86
奥利维尔·吉鲁|FW|38|4|81
马库斯·图拉姆|FW|27|35|84
奥斯曼·图拉姆|MF|22|40|83
布拉德利·巴尔科拉|FW|22|45|82
金斯利·科曼|FW|28|42|85`,

  GER: `曼努埃尔·诺伊尔|GK|38|2|85
马克-安德烈·特尔施特根|GK|32|12|87
安东尼奥·吕迪格|DF|31|40|88
若纳坦·塔|DF|28|35|84
尼科·施洛特贝克|DF|25|45|85
大卫·劳姆|DF|26|22|82
约书亚·基米希|MF|29|70|88
莱昂·格雷茨卡|MF|29|35|84
伊尔卡伊·京多安|MF|34|15|83
弗洛里安·维尔茨|MF|21|120|89
贾马尔·穆西亚拉|MF|21|110|89
凯·哈弗茨|FW|25|75|85
塞尔日·格纳布里|FW|29|35|84
勒鲁瓦·萨内|FW|28|60|86
尼克拉斯·菲尔克鲁格|FW|31|15|82
马克西米利安·拜尔|FW|22|25|80
本杰明·亨里希斯|DF|27|18|81
帕斯卡尔·格罗斯|MF|33|8|80
亚历山大·帕夫洛维奇|MF|20|35|81
克里斯·菲里希|MF|26|12|79`,
};

const SLOT_SEQ = ["GK", "DF", "DF", "DF", "DF", "MF", "MF", "MF", "FW", "FW", "FW"];

function generatedRoster(teamId, teamName) {
  const rnd = mulberry32(hash32(teamId + ":gen"));
  const base = TIER_OVR[teamId] ?? 74;
  const given = [
    "亚历杭德罗",
    "布鲁诺",
    "卡洛斯",
    "迭戈",
    "恩佐",
    "费德里科",
    "加布里埃尔",
    "胡安",
    "伊萨克",
    "若昂",
    "凯文",
    "莱昂",
    "马尔科",
    "尼古拉斯",
    "奥斯卡",
    "帕布罗",
    "罗德里戈",
    "托马斯",
    "维克托",
    "威廉",
  ];
  const sur = [
    "席尔瓦",
    "桑切斯",
    "罗德里格斯",
    "费尔南德斯",
    "冈萨雷斯",
    "马丁内斯",
    "洛佩斯",
    "佩雷斯",
    "迪亚斯",
    "戈麦斯",
  ];
  return SLOT_SEQ.map((position, i) => {
    const age = clamp(18 + rnd() * 18, 18, 39);
    const ovr = clamp(base - 6 + rnd() * 12, 58, 93);
    const value = Math.max(0.35, Number((ovr / 9 + rnd() * 8).toFixed(2)));
    const name = `${teamName}·${given[i]}·${sur[Math.floor(rnd() * sur.length)]}`;
    const pid = `${teamId}-${String(i + 1).padStart(2, "0")}`;
    const tags = pickTags(/** @type {WcPos} */ (position), rnd);
    return {
      id: pid,
      name,
      position: /** @type {WcPos} */ (position),
      age,
      value,
      avatar: avatar(teamId, pid),
      ovr,
      stats: statsFrom(/** @type {WcPos} */ (position), ovr, rnd),
      tags,
    };
  });
}

function rosterForTeam(teamId, teamName) {
  const hit = CURATED[teamId];
  if (hit) return parseCsvRoster(teamId, hit);
  return generatedRoster(teamId, teamName);
}

/** @type {Record<string, WCPlayer[]>} */
export const PLAYERS_BY_TEAM = Object.fromEntries(
  GROUPS_2026.flatMap((g) => g.teams.map((t) => [t.id, rosterForTeam(t.id, t.name)])),
);

export function getTeamPlayers(teamId) {
  return PLAYERS_BY_TEAM[teamId] ?? [];
}

export function getTeamName(teamId) {
  for (const g of GROUPS_2026) {
    const t = g.teams.find((x) => x.id === teamId);
    if (t) return t.name;
  }
  return teamId;
}

export function getAllTeamOptions() {
  const m = new Map();
  GROUPS_2026.forEach((g) => g.teams.forEach((t) => m.set(t.id, t.name)));
  return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1], "zh-CN"));
}
