import type { Player, Position, TeamSquad } from "./types";

function p(
  id: string,
  name: string,
  pos: Position,
  number: number,
): Player {
  return { id, name, pos, number };
}

/** 11 人槽位角色顺序：门将 + 4 后卫 + 3 中场 + 3 前锋 */
export const DEFAULT_FORMATION_SLOTS: { role: Position; label: string }[] = [
  { role: "GK", label: "门将" },
  { role: "DF", label: "后卫" },
  { role: "DF", label: "后卫" },
  { role: "DF", label: "后卫" },
  { role: "DF", label: "后卫" },
  { role: "MF", label: "中场" },
  { role: "MF", label: "中场" },
  { role: "MF", label: "中场" },
  { role: "FW", label: "前锋" },
  { role: "FW", label: "前锋" },
  { role: "FW", label: "前锋" },
];

const BRA: TeamSquad = {
  id: "BRA",
  name: "巴西",
  short: "BRA",
  players: [
    p("bra-alisson", "阿利松", "GK", 1),
    p("bra-ederson", "埃德森", "GK", 23),
    p("bra-marquinhos", "马尔基尼奥斯", "DF", 4),
    p("bra-militao", "米利唐", "DF", 3),
    p("bra-bremer", "布雷默", "DF", 4),
    p("bra-danilo", "达尼洛", "DF", 2),
    p("bra-arana", "阿拉纳", "DF", 16),
    p("bra-guimaraes", "吉马良斯", "MF", 5),
    p("bra-paqueta", "帕奎塔", "MF", 10),
    p("bra-casemiro", "卡塞米罗", "MF", 8),
    p("bra-gerson", "热尔松", "MF", 17),
    p("bra-raphinha", "拉菲尼亚", "FW", 11),
    p("bra-vini", "维尼修斯", "FW", 7),
    p("bra-rodrygo", "罗德里戈", "FW", 9),
    p("bra-martinelli", "马丁内利", "FW", 18),
    p("bra-endrick", "恩德里克", "FW", 19),
    p("bra-richarlison", "理查利森", "FW", 20),
    p("bra-bruno", "布鲁诺·吉马良斯", "MF", 6),
    p("bra-nino", "尼诺", "DF", 14),
    p("bra-weverton", "韦弗顿", "GK", 12),
    p("bra-gabriel", "加布里埃尔", "DF", 6),
  ],
};

const ARG: TeamSquad = {
  id: "ARG",
  name: "阿根廷",
  short: "ARG",
  players: [
    p("arg-martinez", "埃米利亚诺·马丁内斯", "GK", 23),
    p("arg-rulli", "鲁利", "GK", 12),
    p("arg-romero", "罗梅罗", "DF", 13),
    p("arg-otamendi", "奥塔门迪", "DF", 19),
    p("arg-molina", "莫利纳", "DF", 26),
    p("arg-tagliafico", "塔利亚菲科", "DF", 3),
    p("arg-acuna", "阿库尼亚", "DF", 8),
    p("arg-montiel", "蒙铁尔", "DF", 4),
    p("arg-de paul", "德保罗", "MF", 7),
    p("arg-mcallister", "麦卡利斯特", "MF", 20),
    p("arg-enzo", "恩佐·费尔南德斯", "MF", 24),
    p("arg-paredes", "帕雷德斯", "MF", 5),
    p("arg-palomino", "帕洛米诺", "DF", 6),
    p("arg-messi", "梅西", "FW", 10),
    p("arg-alvarez", "阿尔瓦雷斯", "FW", 9),
    p("arg-dybala", "迪巴拉", "FW", 21),
    p("arg-lautaro", "劳塔罗", "FW", 22),
    p("arg-garnacho", "加纳乔", "FW", 17),
    p("arg-di maria", "迪马利亚", "FW", 11),
    p("arg-correa", "科雷亚", "FW", 15),
  ],
};

const FRA: TeamSquad = {
  id: "FRA",
  name: "法国",
  short: "FRA",
  players: [
    p("fra-maignan", "迈尼昂", "GK", 16),
    p("fra-areola", "阿雷奥拉", "GK", 23),
    p("fra-upamecano", "于帕梅卡诺", "DF", 2),
    p("fra-kounde", "孔德", "DF", 5),
    p("fra-konate", "科纳特", "DF", 24),
    p("fra-hernandez-l", "卢卡斯·埃尔南德斯", "DF", 21),
    p("fra-hernandez-t", "特奥·埃尔南德斯", "DF", 22),
    p("fra-pavard", "帕瓦尔", "DF", 2),
    p("fra-tchouameni", "琼阿梅尼", "MF", 8),
    p("fra-rabiot", "拉比奥", "MF", 14),
    p("fra-camavinga", "卡马文加", "MF", 6),
    p("fra-zaire-emery", "扎伊尔-埃梅里", "MF", 17),
    p("fra-griezmann", "格列兹曼", "MF", 7),
    p("fra-mbappe", "姆巴佩", "FW", 10),
    p("fra-dembele", "登贝莱", "FW", 11),
    p("fra-giroud", "吉鲁", "FW", 9),
    p("fra-muani", "穆阿尼", "FW", 12),
    p("fra-thuram", "小图拉姆", "FW", 13),
    p("fra-saliba", "萨利巴", "DF", 17),
    p("fra-disasi", "迪萨西", "DF", 3),
  ],
};

const GER: TeamSquad = {
  id: "GER",
  name: "德国",
  short: "GER",
  players: [
    p("ger-neuer", "诺伊尔", "GK", 1),
    p("ger-ter-stegen", "特尔施特根", "GK", 22),
    p("ger-rudiger", "吕迪格", "DF", 2),
    p("ger-tah", "若纳坦·塔", "DF", 4),
    p("ger-schlotterbeck", "施洛特贝克", "DF", 23),
    p("ger-raum", "劳姆", "DF", 3),
    p("ger-kimmich", "基米希", "MF", 6),
    p("ger-goretzka", "格雷茨卡", "MF", 8),
    p("ger-gundogan", "京多安", "MF", 21),
    p("ger-musiala", "穆西亚拉", "MF", 14),
    p("ger-wirtz", "维尔茨", "MF", 7),
    p("ger-brandt", "布兰特", "MF", 19),
    p("ger-havertz", "哈弗茨", "FW", 7),
    p("ger-fullkrug", "菲尔克鲁格", "FW", 9),
    p("ger-sane", "萨内", "FW", 10),
    p("ger-muller", "托马斯·穆勒", "FW", 13),
    p("ger-undav", "昂达夫", "FW", 26),
    p("ger-henrichs", "亨里希斯", "DF", 20),
    p("ger-antony", "安东尼奥·吕迪格替补位", "DF", 15),
    p("ger-behrens", "贝伦斯", "FW", 24),
  ],
};

const ESP: TeamSquad = {
  id: "ESP",
  name: "西班牙",
  short: "ESP",
  players: [
    p("esp-simon", "乌奈·西蒙", "GK", 23),
    p("esp-raya", "拉亚", "GK", 13),
    p("esp-laporte", "拉波尔特", "DF", 24),
    p("esp-le normand", "勒诺尔芒", "DF", 3),
    p("esp-cucurella", "库库雷利亚", "DF", 24),
    p("esp-carvajal", "卡瓦哈尔", "DF", 2),
    p("esp-navas", "纳瓦斯", "DF", 22),
    p("esp-rodri", "罗德里", "MF", 16),
    p("esp-pedri", "佩德里", "MF", 26),
    p("esp-gavi", "加维", "MF", 9),
    p("esp-ruiz", "法比安·鲁伊斯", "MF", 8),
    p("esp-merino", "梅里诺", "MF", 6),
    p("esp-zubimendi", "苏比门迪", "MF", 4),
    p("esp-yamal", "亚马尔", "FW", 19),
    p("esp-morata", "莫拉塔", "FW", 7),
    p("esp-williams", "尼科·威廉斯", "FW", 17),
    p("esp-olmo", "奥尔莫", "FW", 10),
    p("esp-torres", "费兰·托雷斯", "FW", 11),
    p("esp-joselu", "何塞卢", "FW", 9),
    p("esp-grimaldo", "格里马尔多", "DF", 12),
  ],
};

const ENG: TeamSquad = {
  id: "ENG",
  name: "英格兰",
  short: "ENG",
  players: [
    p("eng-pickford", "皮克福德", "GK", 1),
    p("eng-ramsdale", "拉姆斯代尔", "GK", 22),
    p("eng-walker", "沃克", "DF", 2),
    p("eng-stones", "斯通斯", "DF", 5),
    p("eng-maguire", "马奎尔", "DF", 6),
    p("eng-shaw", "卢克·肖", "DF", 3),
    p("eng-trippier", "特里皮尔", "DF", 12),
    p("eng-rice", "赖斯", "MF", 4),
    p("eng-bellingham", "贝林厄姆", "MF", 10),
    p("eng-alexander-arnold", "阿诺德", "MF", 8),
    p("eng-gallagher", "加拉格尔", "MF", 16),
    p("eng-mainoo", "梅努", "MF", 26),
    p("eng-foden", "福登", "FW", 11),
    p("eng-saka", "萨卡", "FW", 7),
    p("eng-kane", "凯恩", "FW", 9),
    p("eng-watkins", "沃特金斯", "FW", 19),
    p("eng-tony", "伊万·托尼", "FW", 17),
    p("eng-grealish", "格拉利什", "FW", 7),
    p("eng-gomez", "戈麦斯", "DF", 14),
    p("eng-colwill", "科尔威尔", "DF", 15),
  ],
};

export const SQUAD_CATALOG: Record<string, TeamSquad> = {
  BRA,
  ARG,
  FRA,
  GER,
  ESP,
  ENG,
};

export const SQUAD_TEAM_LIST: TeamSquad[] = Object.values(SQUAD_CATALOG);

const POS_CYCLE: Position[] = [
  "GK",
  "DF",
  "DF",
  "DF",
  "DF",
  "MF",
  "MF",
  "MF",
  "MF",
  "FW",
  "FW",
  "FW",
  "FW",
  "FW",
  "FW",
  "FW",
  "FW",
  "FW",
  "FW",
  "FW",
];

export function buildGenericSquad(id: string, name: string, short: string): TeamSquad {
  const players: Player[] = POS_CYCLE.map((pos, i) => ({
    id: `${id.toLowerCase()}-gen-${i + 1}`,
    name: `${name} · 球员 ${i + 1}`,
    pos,
    number: i + 1,
  }));
  return { id, name, short, players };
}

export function getSquadById(teamId: string, displayName?: string): TeamSquad {
  const key = teamId.toUpperCase();
  const hit = SQUAD_CATALOG[key];
  if (hit) return hit;
  const name = displayName ?? teamId;
  return buildGenericSquad(key, name, key);
}
