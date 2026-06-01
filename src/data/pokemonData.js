// 訓練師資料庫 (5 位經典角色)
export const TRAINERS_DATABASE = [
  {
    id: 'ash',
    name: '小智',
    partnerId: 25, // 皮卡丘
    avatar: '/images/ash.png',
    title: '真新鎮的熱血訓練師',
    desc: '目標是成為世界第一的寶可夢大師！初始夥伴為速度極快的皮卡丘。',
    color: '#ff9800'
  },
  {
    id: 'misty',
    name: '小霞',
    partnerId: 7, // 傑尼龜
    avatar: '/images/misty.png',
    title: '華藍道館的水系美少女',
    desc: '活潑好勝的水系大師，初始夥伴為高防禦力、高生命值的傑尼龜。',
    color: '#2196f3'
  },
  {
    id: 'brock',
    name: '小剛',
    partnerId: 74, // 小拳石
    avatar: '/images/brock.png',
    title: '深灰道館的沉穩飼育家',
    desc: '體貼可靠的岩石系大師，初始夥伴為防禦如鐵壁般堅實的小拳石。',
    color: '#9e9e9e'
  },
  {
    id: 'gary',
    name: '小茂',
    partnerId: 4, // 小火龍
    avatar: '/images/gary.png',
    title: '高傲自信的天才宿敵',
    desc: '小智實力強勁的宿敵，初始夥伴為基礎攻擊力極高、招式猛烈的小火龍。',
    color: '#e91e63'
  },
  {
    id: 'jessie',
    name: '武藏',
    partnerId: 23, // 阿柏蛇
    avatar: '/images/jessie.png',
    title: '😈 迷人反派火箭隊隊員',
    desc: '「既然你誠心誠意的發問了！」初始夥伴為劇毒無比、擅長逆襲的阿柏蛇。',
    color: '#9c27b0'
  }
];

// 寶可夢基本資料庫 (擴充至 20 隻，含完整三階段/二階段進化鏈)
export const POKEMON_DATABASE = [
  // --- 草系進化鏈 ---
  {
    id: 1,
    name: '妙蛙種子',
    type: '草',
    baseHp: 120,
    baseAtk: 22,
    rarity: 'Common',
    catchRate: 0.6,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '藤鞭', power: 25, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    color: '#4caf50',
    evolvesTo: 2,
    evolveLevel: 16,
    evolveCost: 200
  },
  {
    id: 2,
    name: '妙蛙草',
    type: '草',
    baseHp: 180,
    baseAtk: 35,
    rarity: 'Uncommon',
    catchRate: 0.35,
    skills: [
      { name: '藤鞭', power: 25, accuracy: 0.90 },
      { name: '飛葉快刀', power: 40, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
    color: '#388e3c',
    evolvesTo: 3,
    evolveLevel: 32,
    evolveCost: 400
  },
  {
    id: 3,
    name: '妙蛙花',
    type: '草',
    baseHp: 270,
    baseAtk: 56,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '飛葉快刀', power: 40, accuracy: 0.85 },
      { name: '陽光烈焰', power: 75, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
    color: '#2e7d32',
    evolvesTo: null
  },

  // --- 火系進化鏈 ---
  {
    id: 4,
    name: '小火龍',
    type: '火',
    baseHp: 110,
    baseAtk: 25,
    rarity: 'Common',
    catchRate: 0.6,
    skills: [
      { name: '抓', power: 15, accuracy: 0.95 },
      { name: '火花', power: 28, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    color: '#ff9800',
    evolvesTo: 5,
    evolveLevel: 16,
    evolveCost: 200
  },
  {
    id: 5,
    name: '火恐龍',
    type: '火',
    baseHp: 170,
    baseAtk: 38,
    rarity: 'Uncommon',
    catchRate: 0.35,
    skills: [
      { name: '火花', power: 28, accuracy: 0.85 },
      { name: '噴射火焰', power: 45, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png',
    color: '#f57c00',
    evolvesTo: 6,
    evolveLevel: 36,
    evolveCost: 400
  },
  {
    id: 6,
    name: '噴火龍',
    type: '火',
    baseHp: 250,
    baseAtk: 58,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '噴射火焰', power: 45, accuracy: 0.85 },
      { name: '大字爆炎', power: 75, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    color: '#d84315',
    evolvesTo: null
  },

  // --- 水系進化鏈 ---
  {
    id: 7,
    name: '傑尼龜',
    type: '水',
    baseHp: 130,
    baseAtk: 20,
    rarity: 'Common',
    catchRate: 0.6,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '水槍', power: 24, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    color: '#2196f3',
    evolvesTo: 8,
    evolveLevel: 16,
    evolveCost: 200
  },
  {
    id: 8,
    name: '卡咪龜',
    type: '水',
    baseHp: 190,
    baseAtk: 32,
    rarity: 'Uncommon',
    catchRate: 0.35,
    skills: [
      { name: '水槍', power: 24, accuracy: 0.90 },
      { name: '水之波動', power: 38, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png',
    color: '#1976d2',
    evolvesTo: 9,
    evolveLevel: 36,
    evolveCost: 400
  },
  {
    id: 9,
    name: '水箭龜',
    type: '水',
    baseHp: 280,
    baseAtk: 52,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '水之波動', power: 38, accuracy: 0.85 },
      { name: '水炮', power: 75, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
    color: '#0d47a1',
    evolvesTo: null
  },

  // --- 電系進化鏈 ---
  {
    id: 25,
    name: '皮卡丘',
    type: '電',
    baseHp: 100,
    baseAtk: 28,
    rarity: 'Uncommon',
    catchRate: 0.45,
    skills: [
      { name: '電擊', power: 20, accuracy: 0.95 },
      { name: '十萬伏特', power: 35, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    color: '#ffeb3b',
    evolvesTo: 26,
    evolveLevel: 22,
    evolveCost: 250
  },
  {
    id: 26,
    name: '雷丘',
    type: '電',
    baseHp: 180,
    baseAtk: 46,
    rarity: 'Rare',
    catchRate: 0.18,
    skills: [
      { name: '十萬伏特', power: 35, accuracy: 0.80 },
      { name: '打雷', power: 70, accuracy: 0.75 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png',
    color: '#fbc02d',
    evolvesTo: null
  },

  // --- 岩石系進化鏈 ---
  {
    id: 74,
    name: '小拳石',
    type: '岩石',
    baseHp: 150,
    baseAtk: 18,
    rarity: 'Common',
    catchRate: 0.55,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '落石', power: 25, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png',
    color: '#9e9e9e',
    evolvesTo: 75,
    evolveLevel: 25,
    evolveCost: 200
  },
  {
    id: 75,
    name: '隆隆石',
    type: '岩石',
    baseHp: 210,
    baseAtk: 32,
    rarity: 'Uncommon',
    catchRate: 0.32,
    skills: [
      { name: '落石', power: 25, accuracy: 0.85 },
      { name: '岩石爆擊', power: 42, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/75.png',
    color: '#757575',
    evolvesTo: 76,
    evolveLevel: 36,
    evolveCost: 400
  },
  {
    id: 76,
    name: '隆隆岩',
    type: '岩石',
    baseHp: 300,
    baseAtk: 50,
    rarity: 'Rare',
    catchRate: 0.12,
    skills: [
      { name: '岩石爆擊', power: 42, accuracy: 0.80 },
      { name: '地震', power: 72, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/76.png',
    color: '#424242',
    evolvesTo: null
  },

  // --- 毒系進化鏈 (武藏夥伴) ---
  {
    id: 23,
    name: '阿柏蛇',
    type: '毒',
    baseHp: 115,
    baseAtk: 23,
    rarity: 'Common',
    catchRate: 0.55,
    skills: [
      { name: '毒針', power: 18, accuracy: 0.95 },
      { name: '咬住', power: 25, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/23.png',
    color: '#9c27b0',
    evolvesTo: 24,
    evolveLevel: 22,
    evolveCost: 200
  },
  {
    id: 24,
    name: '阿柏怪',
    type: '毒',
    baseHp: 195,
    baseAtk: 40,
    rarity: 'Rare',
    catchRate: 0.20,
    skills: [
      { name: '咬碎', power: 32, accuracy: 0.90 },
      { name: '溶解液', power: 48, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png',
    color: '#7b1fa2',
    evolvesTo: null
  },

  // --- 獨立寶可夢 (無進化) ---
  {
    id: 54,
    name: '可達鴨',
    type: '水',
    baseHp: 140,
    baseAtk: 18,
    rarity: 'Common',
    catchRate: 0.55,
    skills: [
      { name: '抓', power: 15, accuracy: 0.95 },
      { name: '念力', power: 22, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png',
    color: '#e0c068',
    evolvesTo: null
  },
  {
    id: 143,
    name: '卡比獸',
    type: '一般',
    baseHp: 250,
    baseAtk: 22,
    rarity: 'Rare',
    catchRate: 0.25,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '泰山壓頂', power: 30, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
    color: '#009688',
    evolvesTo: null
  },
  {
    id: 94,
    name: '耿鬼',
    type: '幽靈',
    baseHp: 120,
    baseAtk: 32,
    rarity: 'Rare',
    catchRate: 0.2,
    skills: [
      { name: '舔舌頭', power: 18, accuracy: 0.95 },
      { name: '暗影球', power: 38, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
    color: '#673ab7',
    evolvesTo: null
  },
  {
    id: 150,
    name: '超夢',
    type: '超能力',
    baseHp: 200,
    baseAtk: 45,
    rarity: 'Legendary',
    catchRate: 0.08,
    skills: [
      { name: '念力', power: 25, accuracy: 0.95 },
      { name: '精神擊破', power: 50, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    color: '#e91e63',
    evolvesTo: null
  }
];

// 地圖格子定義 (16格)
export const MAP_LOCATIONS = [
  { id: 0, name: '起點 (START)', type: 'start', desc: '經過或停留獲得 200 金幣', color: '#ff5722' },
  { id: 1, name: '常青森林', type: 'grass', terrain: '草叢', desc: '草與電系野生寶可夢出沒地', color: '#4caf50', pokemonIds: [1, 25] },
  { id: 2, name: '友好商店', type: 'mart', desc: '購買精靈球與回復藥水', color: '#03a9f4' },
  { id: 3, name: '月見山', type: 'rock', terrain: '山岩', desc: '岩石與毒系野生寶可夢出沒地', color: '#9e9e9e', pokemonIds: [74, 23] },
  { id: 4, name: '寶可夢訓練場', type: 'gym', desc: '付費訓練，升級與進化寶可夢', color: '#ff9800' },
  { id: 5, name: '華藍市水域', type: 'water', terrain: '水域', desc: '水與一般系野生寶可夢出沒地', color: '#2196f3', pokemonIds: [7, 54] },
  { id: 6, name: '隨機事件', type: 'event', desc: '命運與機會的考驗', color: '#e91e63' },
  { id: 7, name: '地底熔岩洞', type: 'cave', terrain: '洞穴', desc: '火與幽靈系野生寶可夢出沒地', color: '#795548', pokemonIds: [4, 94] },
  { id: 8, name: '寶可夢中心', type: 'center', desc: '免費回復所有寶可夢的體力', color: '#e91e63' },
  { id: 9, name: '互助草地', type: 'grass', terrain: '草叢', desc: '草與一般系野生寶可夢出沒地', color: '#4caf50', pokemonIds: [1, 143] },
  { id: 10, name: '友好商店', type: 'mart', desc: '購買精靈球與回復藥水', color: '#03a9f4' },
  { id: 11, name: '岩山隧道', type: 'rock', terrain: '山岩', desc: '岩石與毒系野生寶可夢出沒地', color: '#9e9e9e', pokemonIds: [74, 23] },
  { id: 12, name: '寶可夢訓練場', type: 'gym', desc: '付費訓練，升級與進化寶可夢', color: '#ff9800' },
  { id: 13, name: '雙子島深處', type: 'water', terrain: '水域', desc: '水與稀有野生寶可夢出沒地', color: '#2196f3', pokemonIds: [7, 143] },
  { id: 14, name: '隨機事件', type: 'event', desc: '命運與機會的考驗', color: '#e91e63' },
  { id: 15, name: '華藍洞窟', type: 'cave', terrain: '洞穴', desc: '傳說級寶可夢的沉睡之地', color: '#795548', pokemonIds: [94, 150] }
];

// 隨機事件列表
export const GAME_EVENTS = [
  { type: 'bonus', text: '大木博士送來了贊助！獲得 150 金幣。', amount: 150 },
  { type: 'penalty', text: '遇到火箭隊攔路打劫！失去 100 金幣。', amount: -100 },
  { type: 'item', text: '在路邊撿到了一顆「超級球」！', ballType: 'greatBall', count: 1 },
  { type: 'item', text: '在草叢裡撿到了一瓶「傷藥」！', ballType: 'potion', count: 1 },
  { type: 'teleport', text: '踩到傳送機！被隨機傳送到地圖的另一端。', teleport: true },
  { type: 'lucky', text: '路上撿到發光的進化石，幸運賣掉獲得 200 金幣！', amount: 200 }
];
