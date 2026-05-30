// 寶可夢基本資料庫
export const POKEMON_DATABASE = [
  {
    id: 1,
    name: '妙蛙種子',
    type: '草',
    baseHp: 120,
    baseAtk: 22,
    rarity: 'Common',
    catchRate: 0.6, // 基礎捕捉率 60%
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '藤鞭', power: 25, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    color: '#4caf50'
  },
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
    color: '#ff9800'
  },
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
    color: '#2196f3'
  },
  {
    id: 25,
    name: '皮卡丘',
    type: '電',
    baseHp: 100,
    baseAtk: 28,
    rarity: 'Uncommon',
    catchRate: 0.45, // 基礎捕捉率 45%
    skills: [
      { name: '電擊', power: 20, accuracy: 0.95 },
      { name: '十萬伏特', power: 35, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    color: '#ffeb3b'
  },
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
    color: '#e0c068'
  },
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
    color: '#9e9e9e'
  },
  {
    id: 143,
    name: '卡比獸',
    type: '一般',
    baseHp: 250,
    baseAtk: 22,
    rarity: 'Rare',
    catchRate: 0.25, // 基礎捕捉率 25%
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '泰山壓頂', power: 30, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
    color: '#009688'
  },
  {
    id: 94,
    name: '耿鬼',
    type: '幽靈',
    baseHp: 120,
    baseAtk: 32,
    rarity: 'Rare',
    catchRate: 0.2, // 基礎捕捉率 20%
    skills: [
      { name: '舔舌頭', power: 18, accuracy: 0.95 },
      { name: '暗影球', power: 38, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
    color: '#673ab7'
  },
  {
    id: 150,
    name: '超夢',
    type: '超能力',
    baseHp: 200,
    baseAtk: 45,
    rarity: 'Legendary',
    catchRate: 0.08, // 基礎捕捉率 8%
    skills: [
      { name: '念力', power: 25, accuracy: 0.95 },
      { name: '精神擊破', power: 50, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    color: '#e91e63'
  }
];

// 地圖格子定義 (16格)
export const MAP_LOCATIONS = [
  { id: 0, name: '起點 (START)', type: 'start', desc: '經過或停留獲得 200 金幣', color: '#ff5722' },
  { id: 1, name: '常青森林', type: 'grass', terrain: '草叢', desc: '草屬性野生寶可夢出沒地', color: '#4caf50', pokemonIds: [1, 25] },
  { id: 2, name: '友好商店', type: 'mart', desc: '購買精靈球與回復藥水', color: '#03a9f4' },
  { id: 3, name: '月見山', type: 'rock', terrain: '山岩', desc: '岩石與電屬性野生寶可夢出沒地', color: '#9e9e9e', pokemonIds: [74, 25] },
  { id: 4, name: '寶可夢訓練場', type: 'gym', desc: '付費訓練，提升寶可夢能力', color: '#ff9800' },
  { id: 5, name: '華藍市水域', type: 'water', terrain: '水域', desc: '水屬性野生寶可夢出沒地', color: '#2196f3', pokemonIds: [7, 54] },
  { id: 6, name: '隨機事件', type: 'event', desc: '命運與機會的考驗', color: '#e91e63' },
  { id: 7, name: '地底熔岩洞', type: 'cave', terrain: '洞穴', desc: '火與幽靈屬性野生寶可夢出沒地', color: '#795548', pokemonIds: [4, 94] },
  { id: 8, name: '寶可夢中心', type: 'center', desc: '免費回復所有寶可夢的體力', color: '#e91e63' },
  { id: 9, name: '互助草地', type: 'grass', terrain: '草叢', desc: '草與一般屬性野生寶可夢出沒地', color: '#4caf50', pokemonIds: [1, 143] },
  { id: 10, name: '友好商店', type: 'mart', desc: '購買精靈球與回復藥水', color: '#03a9f4' },
  { id: 11, name: '岩山隧道', type: 'rock', terrain: '山岩', desc: '岩石與一般屬性野生寶可夢出沒地', color: '#9e9e9e', pokemonIds: [74, 143] },
  { id: 12, name: '寶可夢訓練場', type: 'gym', desc: '付費訓練，提升寶可夢能力', color: '#ff9800' },
  { id: 13, name: '雙子島深處', type: 'water', terrain: '水域', desc: '水與稀有寶可夢出沒地', color: '#2196f3', pokemonIds: [7, 54, 143] },
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
