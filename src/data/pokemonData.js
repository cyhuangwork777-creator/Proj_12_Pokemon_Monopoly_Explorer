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
  },
  // ==================== 第二篇章新增 30 隻寶可夢 ====================
  // --- 1. 超音蝠系列 ---
  {
    id: 41,
    name: '超音蝠',
    type: '毒/飛行',
    baseHp: 110,
    baseAtk: 18,
    rarity: 'Common',
    catchRate: 0.65,
    skills: [
      { name: '吸血', power: 12, accuracy: 0.95 },
      { name: '超音波', power: 18, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/41.png',
    color: '#9c27b0',
    evolvesTo: 42,
    evolveLevel: 22,
    evolveCost: 150
  },
  {
    id: 42,
    name: '大嘴蝠',
    type: '毒/飛行',
    baseHp: 165,
    baseAtk: 32,
    rarity: 'Uncommon',
    catchRate: 0.35,
    skills: [
      { name: '超音波', power: 18, accuracy: 0.85 },
      { name: '空氣利刃', power: 35, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/42.png',
    color: '#7b1fa2',
    evolvesTo: 169,
    evolveLevel: 38,
    evolveCost: 350
  },
  {
    id: 169,
    name: '叉字蝠',
    type: '毒/飛行',
    baseHp: 245,
    baseAtk: 52,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '空氣利刃', power: 35, accuracy: 0.90 },
      { name: '十字毒刃', power: 65, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/169.png',
    color: '#4a148c',
    evolvesTo: null
  },
  // --- 2. 咕妞妞系列 ---
  {
    id: 293,
    name: '咕妞妞',
    type: '一般',
    baseHp: 130,
    baseAtk: 20,
    rarity: 'Common',
    catchRate: 0.60,
    skills: [
      { name: '拍擊', power: 15, accuracy: 0.95 },
      { name: '迴音', power: 22, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/293.png',
    color: '#f06292',
    evolvesTo: 294,
    evolveLevel: 20,
    evolveCost: 150
  },
  {
    id: 294,
    name: '吼爆彈',
    type: '一般',
    baseHp: 190,
    baseAtk: 34,
    rarity: 'Uncommon',
    catchRate: 0.35,
    skills: [
      { name: '迴音', power: 22, accuracy: 0.90 },
      { name: '巨聲', power: 42, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/294.png',
    color: '#ec407a',
    evolvesTo: 295,
    evolveLevel: 40,
    evolveCost: 350
  },
  {
    id: 295,
    name: '爆音怪',
    type: '一般',
    baseHp: 280,
    baseAtk: 55,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '巨聲', power: 42, accuracy: 0.85 },
      { name: '爆音波', power: 75, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/295.png',
    color: '#d81b60',
    evolvesTo: null
  },
  // --- 3. 無極汰那系列 ---
  {
    id: 890,
    name: '無極汰那',
    type: '毒/龍',
    baseHp: 280,
    baseAtk: 60,
    rarity: 'Epic',
    catchRate: 0.05,
    skills: [
      { name: '龍之波動', power: 35, accuracy: 0.90 },
      { name: '極巨炮', power: 65, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/890.png',
    color: '#4a148c',
    evolvesTo: 8900,
    evolveLevel: 55,
    evolveCost: 1000
  },
  {
    id: 8900,
    name: '無極巨化無極汰那',
    type: '毒/龍',
    baseHp: 500,
    baseAtk: 95,
    rarity: 'Legendary',
    catchRate: 0.01,
    skills: [
      { name: '極巨炮', power: 65, accuracy: 0.85 },
      { name: '無極光束', power: 99, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10157.png',
    color: '#1a237e',
    evolvesTo: null
  },
  // --- 4. 卡拉卡拉系列 ---
  {
    id: 104,
    name: '卡拉卡拉',
    type: '地面',
    baseHp: 120,
    baseAtk: 22,
    rarity: 'Common',
    catchRate: 0.55,
    skills: [
      { name: '骨頭頭槌', power: 18, accuracy: 0.90 },
      { name: '骨棒亂打', power: 26, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/104.png',
    color: '#8d6e63',
    evolvesTo: 105,
    evolveLevel: 28,
    evolveCost: 250
  },
  {
    id: 105,
    name: '嘎啦嘎啦',
    type: '地面',
    baseHp: 180,
    baseAtk: 40,
    rarity: 'Uncommon',
    catchRate: 0.30,
    skills: [
      { name: '骨棒亂打', power: 26, accuracy: 0.85 },
      { name: '骨頭迴力鏢', power: 48, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/105.png',
    color: '#5d4037',
    evolvesTo: null
  },
  // --- 5. 伊布系列 (多分支指定進化) ---
  {
    id: 133,
    name: '伊布',
    type: '一般',
    baseHp: 120,
    baseAtk: 22,
    rarity: 'Uncommon',
    catchRate: 0.40,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '渴望', power: 24, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
    color: '#a1887f',
    evolvesTo: 'branch', // 特殊分支標記
    evolveLevel: 20,
    evolveCost: 300
  },
  {
    id: 134,
    name: '水伊布',
    type: '水',
    baseHp: 260,
    baseAtk: 50,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '水之波動', power: 38, accuracy: 0.85 },
      { name: '水炮', power: 75, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png',
    color: '#2196f3',
    evolvesTo: null
  },
  {
    id: 135,
    name: '雷伊布',
    type: '電',
    baseHp: 180,
    baseAtk: 58,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '電擊', power: 20, accuracy: 0.95 },
      { name: '十萬伏特', power: 55, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png',
    color: '#ffeb3b',
    evolvesTo: null
  },
  {
    id: 136,
    name: '火伊布',
    type: '火',
    baseHp: 180,
    baseAtk: 62,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '火花', power: 28, accuracy: 0.85 },
      { name: '大字爆炎', power: 78, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png',
    color: '#ff9800',
    evolvesTo: null
  },
  // --- 6. 寶寶丁系列 ---
  {
    id: 174,
    name: '寶寶丁',
    type: '妖精',
    baseHp: 140,
    baseAtk: 12,
    rarity: 'Common',
    catchRate: 0.70,
    skills: [
      { name: '拍擊', power: 12, accuracy: 0.95 },
      { name: '唱歌', power: 15, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/174.png',
    color: '#f8bbd0',
    evolvesTo: 39,
    evolveLevel: 12,
    evolveCost: 100
  },
  {
    id: 39,
    name: '胖丁',
    type: '妖精',
    baseHp: 200,
    baseAtk: 22,
    rarity: 'Common',
    catchRate: 0.50,
    skills: [
      { name: '唱歌', power: 15, accuracy: 0.80 },
      { name: '巨聲', power: 35, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
    color: '#f48fb1',
    evolvesTo: 40,
    evolveLevel: 30,
    evolveCost: 250
  },
  {
    id: 40,
    name: '胖可丁',
    type: '妖精',
    baseHp: 290,
    baseAtk: 45,
    rarity: 'Uncommon',
    catchRate: 0.25,
    skills: [
      { name: '巨聲', power: 35, accuracy: 0.85 },
      { name: '嬉鬧', power: 65, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/40.png',
    color: '#f06292',
    evolvesTo: null
  },
  // --- 7. 喵喵系列 ---
  {
    id: 52,
    name: '喵喵',
    type: '一般',
    baseHp: 110,
    baseAtk: 20,
    rarity: 'Common',
    catchRate: 0.60,
    skills: [
      { name: '抓', power: 15, accuracy: 0.95 },
      { name: '聚寶功', power: 25, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png',
    color: '#fff59d',
    evolvesTo: 53,
    evolveLevel: 28,
    evolveCost: 200
  },
  {
    id: 53,
    name: '貓老大',
    type: '一般',
    baseHp: 175,
    baseAtk: 38,
    rarity: 'Uncommon',
    catchRate: 0.30,
    skills: [
      { name: '聚寶功', power: 25, accuracy: 0.90 },
      { name: '劈開', power: 45, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/53.png',
    color: '#fbc02d',
    evolvesTo: null
  },
  // --- 8. 袋獸系列 (超級進化) ---
  {
    id: 115,
    name: '袋獸',
    type: '一般',
    baseHp: 210,
    baseAtk: 40,
    rarity: 'Epic',
    catchRate: 0.15,
    skills: [
      { name: '擊掌奇襲', power: 22, accuracy: 0.95 },
      { name: '報恩', power: 45, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png',
    color: '#d7ccc8',
    evolvesTo: 1150,
    evolveLevel: 42,
    evolveCost: 600
  },
  {
    id: 1150,
    name: '超級袋獸',
    type: '一般',
    baseHp: 310,
    baseAtk: 65,
    rarity: 'Epic',
    catchRate: 0.05,
    skills: [
      { name: '報恩', power: 45, accuracy: 0.90 },
      { name: '百萬噸拳擊', power: 75, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10039.png',
    color: '#8d6e63',
    evolvesTo: null
  },
  // --- 9. 波波系列 ---
  {
    id: 16,
    name: '波波',
    type: '飛行',
    baseHp: 100,
    baseAtk: 18,
    rarity: 'Common',
    catchRate: 0.65,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '電光一閃', power: 22, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png',
    color: '#ffe0b2',
    evolvesTo: 17,
    evolveLevel: 18,
    evolveCost: 150
  },
  {
    id: 17,
    name: '比比鳥',
    type: '飛行',
    baseHp: 155,
    baseAtk: 30,
    rarity: 'Uncommon',
    catchRate: 0.35,
    skills: [
      { name: '電光一閃', power: 22, accuracy: 0.90 },
      { name: '翅膀攻擊', power: 38, accuracy: 0.95 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png',
    color: '#ffb74d',
    evolvesTo: 18,
    evolveLevel: 36,
    evolveCost: 350
  },
  {
    id: 18,
    name: '大比鳥',
    type: '飛行',
    baseHp: 235,
    baseAtk: 50,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '翅膀攻擊', power: 38, accuracy: 0.95 },
      { name: '暴風', power: 72, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png',
    color: '#f57c00',
    evolvesTo: null
  },
  // --- 10. 綠毛蟲系列 ---
  {
    id: 10,
    name: '綠毛蟲',
    type: '蟲',
    baseHp: 90,
    baseAtk: 12,
    rarity: 'Common',
    catchRate: 0.70,
    skills: [
      { name: '撞擊', power: 12, accuracy: 0.95 },
      { name: '吐絲', power: 15, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png',
    color: '#a5d6a7',
    evolvesTo: 11,
    evolveLevel: 7,
    evolveCost: 50
  },
  {
    id: 11,
    name: '鐵甲蛹',
    type: '蟲',
    baseHp: 110,
    baseAtk: 15,
    rarity: 'Common',
    catchRate: 0.50,
    skills: [
      { name: '變硬', power: 10, accuracy: 0.99 },
      { name: '撞擊', power: 15, accuracy: 0.95 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/11.png',
    color: '#81c784',
    evolvesTo: 12,
    evolveLevel: 10,
    evolveCost: 100
  },
  {
    id: 12,
    name: '巴大蝶',
    type: '蟲/飛行',
    baseHp: 180,
    baseAtk: 38,
    rarity: 'Uncommon',
    catchRate: 0.30,
    skills: [
      { name: '幻象光線', power: 32, accuracy: 0.90 },
      { name: '蝶舞烈風', power: 55, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png',
    color: '#4caf50',
    evolvesTo: null
  },
  // --- 11. 咬咬龜系列 ---
  {
    id: 833,
    name: '咬咬龜',
    type: '水',
    baseHp: 125,
    baseAtk: 24,
    rarity: 'Common',
    catchRate: 0.55,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '水槍', power: 22, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/833.png',
    color: '#80deea',
    evolvesTo: 834,
    evolveLevel: 22,
    evolveCost: 200
  },
  {
    id: 834,
    name: '暴噬龜',
    type: '水/岩石',
    baseHp: 205,
    baseAtk: 46,
    rarity: 'Uncommon',
    catchRate: 0.28,
    skills: [
      { name: '水之波動', power: 36, accuracy: 0.85 },
      { name: '雙重撕咬', power: 62, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/834.png',
    color: '#00838f',
    evolvesTo: null
  },
  // --- 12. 波加曼系列 ---
  {
    id: 393,
    name: '波加曼',
    type: '水',
    baseHp: 120,
    baseAtk: 22,
    rarity: 'Common',
    catchRate: 0.55,
    skills: [
      { name: '拍擊', power: 15, accuracy: 0.95 },
      { name: '泡沫', power: 24, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png',
    color: '#29b6f6',
    evolvesTo: 394,
    evolveLevel: 16,
    evolveCost: 200
  },
  {
    id: 394,
    name: '波皇子',
    type: '水',
    baseHp: 175,
    baseAtk: 34,
    rarity: 'Uncommon',
    catchRate: 0.32,
    skills: [
      { name: '泡沫', power: 24, accuracy: 0.85 },
      { name: '潮旋', power: 45, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/394.png',
    color: '#0288d1',
    evolvesTo: 395,
    evolveLevel: 36,
    evolveCost: 400
  },
  {
    id: 395,
    name: '帝王拿波',
    type: '水/鋼',
    baseHp: 265,
    baseAtk: 54,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '潮旋', power: 45, accuracy: 0.90 },
      { name: '鋼翼加農', power: 75, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/395.png',
    color: '#01579b',
    evolvesTo: null
  },
  // --- 13. 小貓怪系列 ---
  {
    id: 403,
    name: '小貓怪',
    type: '電',
    baseHp: 115,
    baseAtk: 24,
    rarity: 'Common',
    catchRate: 0.60,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '電光', power: 25, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/403.png',
    color: '#80deea',
    evolvesTo: 404,
    evolveLevel: 15,
    evolveCost: 180
  },
  {
    id: 404,
    name: '勒克貓',
    type: '電',
    baseHp: 170,
    baseAtk: 38,
    rarity: 'Uncommon',
    catchRate: 0.32,
    skills: [
      { name: '電光', power: 25, accuracy: 0.90 },
      { name: '雷電牙', power: 45, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/404.png',
    color: '#26c6da',
    evolvesTo: 405,
    evolveLevel: 30,
    evolveCost: 350
  },
  {
    id: 405,
    name: '倫琴貓',
    type: '電',
    baseHp: 250,
    baseAtk: 58,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '雷電牙', power: 45, accuracy: 0.85 },
      { name: '瘋狂伏特', power: 75, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/405.png',
    color: '#0097a7',
    evolvesTo: null
  },
  // --- 14. 單卵細胞球系列 ---
  {
    id: 577,
    name: '單卵細胞球',
    type: '超能力',
    baseHp: 110,
    baseAtk: 22,
    rarity: 'Common',
    catchRate: 0.60,
    skills: [
      { name: '念力', power: 15, accuracy: 0.95 },
      { name: '幻象光線', power: 26, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/577.png',
    color: '#e0f2f1',
    evolvesTo: 578,
    evolveLevel: 32,
    evolveCost: 250
  },
  {
    id: 578,
    name: '雙卵細胞球',
    type: '超能力',
    baseHp: 165,
    baseAtk: 38,
    rarity: 'Uncommon',
    catchRate: 0.30,
    skills: [
      { name: '幻象光線', power: 26, accuracy: 0.90 },
      { name: '精神強念', power: 48, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/578.png',
    color: '#b2dfdb',
    evolvesTo: 579,
    evolveLevel: 41,
    evolveCost: 400
  },
  {
    id: 579,
    name: '人造細胞球',
    type: '超能力',
    baseHp: 270,
    baseAtk: 56,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '精神強念', power: 48, accuracy: 0.85 },
      { name: '精神擊破', power: 75, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/579.png',
    color: '#004d40',
    evolvesTo: null
  },
  // --- 15. 大岩蛇系列 ---
  {
    id: 95,
    name: '大岩蛇',
    type: '岩石/地面',
    baseHp: 130,
    baseAtk: 20,
    rarity: 'Uncommon',
    catchRate: 0.45,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '落石', power: 28, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png',
    color: '#b0bec5',
    evolvesTo: 208,
    evolveLevel: 35,
    evolveCost: 400
  },
  {
    id: 208,
    name: '大鋼蛇',
    type: '鋼/地面',
    baseHp: 240,
    baseAtk: 48,
    rarity: 'Rare',
    catchRate: 0.18,
    skills: [
      { name: '落石', power: 28, accuracy: 0.85 },
      { name: '鐵尾重擊', power: 65, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/208.png',
    color: '#546e7a',
    evolvesTo: null
  },
  // --- 16. 龜腳腳系列 ---
  {
    id: 688,
    name: '龜腳腳',
    type: '岩石/水',
    baseHp: 115,
    baseAtk: 24,
    rarity: 'Common',
    catchRate: 0.55,
    skills: [
      { name: '抓', power: 15, accuracy: 0.95 },
      { name: '貝殼夾擊', power: 28, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/688.png',
    color: '#cfd8dc',
    evolvesTo: 689,
    evolveLevel: 39,
    evolveCost: 350
  },
  {
    id: 689,
    name: '雙足龜腳腳',
    type: '岩石/水',
    baseHp: 215,
    baseAtk: 50,
    rarity: 'Uncommon',
    catchRate: 0.25,
    skills: [
      { name: '貝殼夾擊', power: 28, accuracy: 0.90 },
      { name: '岩崩裂地', power: 60, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/689.png',
    color: '#90a4ae',
    evolvesTo: null
  },
  // --- 17. 鐵啞鈴/巨金怪系列 ---
  {
    id: 374,
    name: '鐵啞鈴',
    type: '鋼/超能力',
    baseHp: 130,
    baseAtk: 24,
    rarity: 'Uncommon',
    catchRate: 0.35,
    skills: [
      { name: '猛撞', power: 18, accuracy: 0.85 },
      { name: '念力力場', power: 26, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/374.png',
    color: '#b2dfdb',
    evolvesTo: 375,
    evolveLevel: 20,
    evolveCost: 300
  },
  {
    id: 375,
    name: '金屬怪',
    type: '鋼/超能力',
    baseHp: 190,
    baseAtk: 40,
    rarity: 'Rare',
    catchRate: 0.20,
    skills: [
      { name: '念力力場', power: 26, accuracy: 0.90 },
      { name: '子彈拳', power: 45, accuracy: 0.95 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/375.png',
    color: '#80cbc4',
    evolvesTo: 376,
    evolveLevel: 45,
    evolveCost: 550
  },
  {
    id: 376,
    name: '巨金怪',
    type: '鋼/超能力',
    baseHp: 290,
    baseAtk: 64,
    rarity: 'Epic',
    catchRate: 0.08,
    skills: [
      { name: '子彈拳', power: 45, accuracy: 0.95 },
      { name: '彗星拳', power: 75, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png',
    color: '#00695c',
    evolvesTo: null
  },
  // --- 18. 鯉魚王系列 ---
  {
    id: 129,
    name: '鯉魚王',
    type: '水',
    baseHp: 60,
    baseAtk: 2,
    rarity: 'Common',
    catchRate: 0.85,
    skills: [
      { name: '水花濺起', power: 1, accuracy: 0.99 },
      { name: '撞擊', power: 10, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png',
    color: '#ff8a80',
    evolvesTo: 130,
    evolveLevel: 20,
    evolveCost: 350
  },
  {
    id: 130,
    name: '暴鯉龍',
    type: '水/飛行',
    baseHp: 280,
    baseAtk: 60,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '咬碎', power: 35, accuracy: 0.90 },
      { name: '破壞光線', power: 80, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png',
    color: '#29b6f6',
    evolvesTo: null
  },
  // --- 19. 拉普拉斯系列 ---
  {
    id: 131,
    name: '拉普拉斯',
    type: '水/冰',
    baseHp: 280,
    baseAtk: 42,
    rarity: 'Epic',
    catchRate: 0.15,
    skills: [
      { name: '水槍', power: 22, accuracy: 0.95 },
      { name: '冰凍光束', power: 52, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png',
    color: '#82b1ff',
    evolvesTo: 1310,
    evolveLevel: 42,
    evolveCost: 650
  },
  {
    id: 1310,
    name: '超極巨拉普拉斯',
    type: '水/冰',
    baseHp: 420,
    baseAtk: 65,
    rarity: 'Epic',
    catchRate: 0.05,
    skills: [
      { name: '冰凍光束', power: 52, accuracy: 0.90 },
      { name: '極光旋律', power: 78, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10204.png',
    color: '#2979ff',
    evolvesTo: null
  },
  // --- 20. 蛋蛋系列 ---
  {
    id: 102,
    name: '蛋蛋',
    type: '草/超能力',
    baseHp: 130,
    baseAtk: 22,
    rarity: 'Common',
    catchRate: 0.55,
    skills: [
      { name: '催眠術', power: 10, accuracy: 0.80 },
      { name: '念力', power: 25, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/102.png',
    color: '#f8bbd0',
    evolvesTo: 103,
    evolveLevel: 30,
    evolveCost: 250
  },
  {
    id: 103,
    name: '椰蛋樹',
    type: '草/超能力',
    baseHp: 210,
    baseAtk: 46,
    rarity: 'Uncommon',
    catchRate: 0.28,
    skills: [
      { name: '念力', power: 25, accuracy: 0.90 },
      { name: '精神強念', power: 56, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/103.png',
    color: '#81c784',
    evolvesTo: null
  },
  // --- 21. 美路坦系列 ---
  {
    id: 808,
    name: '美路坦',
    type: '鋼',
    baseHp: 130,
    baseAtk: 24,
    rarity: 'Rare',
    catchRate: 0.25,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '電擊小鋼拳', power: 30, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/808.png',
    color: '#cfd8dc',
    evolvesTo: 809,
    evolveLevel: 40,
    evolveCost: 600
  },
  {
    id: 809,
    name: '美錄梅塔',
    type: '鋼',
    baseHp: 290,
    baseAtk: 62,
    rarity: 'Epic',
    catchRate: 0.08,
    skills: [
      { name: '電擊小鋼拳', power: 30, accuracy: 0.90 },
      { name: '鋼拳鋼碎', power: 75, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/809.png',
    color: '#90a4ae',
    evolvesTo: null
  },
  // --- 22. 故勒頓系列 ---
  {
    id: 1007,
    name: '故勒頓-限制形態',
    type: '格鬥/龍',
    baseHp: 210,
    baseAtk: 45,
    rarity: 'Legendary',
    catchRate: 0.08,
    skills: [
      { name: '岩石封鎖', power: 25, accuracy: 0.90 },
      { name: '全開猛撞', power: 55, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1007.png',
    color: '#ff5722',
    evolvesTo: 10070,
    evolveLevel: 50,
    evolveCost: 800
  },
  {
    id: 10070,
    name: '故勒頓-頂點形態',
    type: '格鬥/龍',
    baseHp: 320,
    baseAtk: 72,
    rarity: 'Legendary',
    catchRate: 0.03,
    skills: [
      { name: '全開猛撞', power: 55, accuracy: 0.85 },
      { name: '鬥破星辰', power: 85, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10260.png',
    color: '#d84315',
    evolvesTo: null
  },
  // --- 23. 密勒頓系列 ---
  {
    id: 1008,
    name: '密勒頓-限制形態',
    type: '電/龍',
    baseHp: 210,
    baseAtk: 45,
    rarity: 'Legendary',
    catchRate: 0.08,
    skills: [
      { name: '電光閃爍', power: 25, accuracy: 0.90 },
      { name: '全速猛撞', power: 55, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1008.png',
    color: '#3f51b5',
    evolvesTo: 10080,
    evolveLevel: 50,
    evolveCost: 800
  },
  {
    id: 10080,
    name: '密勒頓-頂點形態',
    type: '電/龍',
    baseHp: 320,
    baseAtk: 72,
    rarity: 'Legendary',
    catchRate: 0.03,
    skills: [
      { name: '全速猛撞', power: 55, accuracy: 0.85 },
      { name: '雷霆怒轟', power: 85, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10261.png',
    color: '#283593',
    evolvesTo: null
  },
  // --- 24. 猛擂鼓系列 ---
  {
    id: 1021,
    name: '猛擂鼓',
    type: '電/龍',
    baseHp: 230,
    baseAtk: 48,
    rarity: 'Epic',
    catchRate: 0.12,
    skills: [
      { name: '雷電打擊', power: 30, accuracy: 0.90 },
      { name: '迅雷轟擊', power: 58, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1021.png',
    color: '#ffeb3b',
    evolvesTo: 10210,
    evolveLevel: 45,
    evolveCost: 650
  },
  {
    id: 10210,
    name: '猛擂鼓-雷雨形態',
    type: '電/龍',
    baseHp: 330,
    baseAtk: 70,
    rarity: 'Epic',
    catchRate: 0.05,
    skills: [
      { name: '迅雷轟擊', power: 58, accuracy: 0.85 },
      { name: '終極狂雷', power: 85, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1021.png',
    color: '#fbc02d',
    evolvesTo: null
  },
  // --- 25. 姆克兒系列 ---
  {
    id: 396,
    name: '姆克兒',
    type: '一般/飛行',
    baseHp: 95,
    baseAtk: 18,
    rarity: 'Common',
    catchRate: 0.65,
    skills: [
      { name: '撞擊', power: 12, accuracy: 0.95 },
      { name: '起風', power: 22, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/396.png',
    color: '#cfd8dc',
    evolvesTo: 397,
    evolveLevel: 14,
    evolveCost: 150
  },
  {
    id: 397,
    name: '姆克鳥',
    type: '一般/飛行',
    baseHp: 145,
    baseAtk: 28,
    rarity: 'Uncommon',
    catchRate: 0.35,
    skills: [
      { name: '起風', power: 22, accuracy: 0.90 },
      { name: '翅膀攻擊', power: 36, accuracy: 0.95 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/397.png',
    color: '#b0bec5',
    evolvesTo: 398,
    evolveLevel: 34,
    evolveCost: 350
  },
  {
    id: 398,
    name: '姆克鷹',
    type: '一般/飛行',
    baseHp: 225,
    baseAtk: 48,
    rarity: 'Rare',
    catchRate: 0.15,
    skills: [
      { name: '翅膀攻擊', power: 36, accuracy: 0.95 },
      { name: '勇鳥猛攻', power: 72, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/398.png',
    color: '#78909c',
    evolvesTo: null
  },
  // --- 26. 冰雪龍系列 ---
  {
    id: 698,
    name: '冰雪龍',
    type: '岩石/冰',
    baseHp: 135,
    baseAtk: 22,
    rarity: 'Common',
    catchRate: 0.50,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '細雪', power: 25, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/698.png',
    color: '#e0f7fa',
    evolvesTo: 699,
    evolveLevel: 39,
    evolveCost: 350
  },
  {
    id: 699,
    name: '冰雪巨龍',
    type: '岩石/冰',
    baseHp: 245,
    baseAtk: 48,
    rarity: 'Uncommon',
    catchRate: 0.22,
    skills: [
      { name: '細雪', power: 25, accuracy: 0.90 },
      { name: '暴風雪', power: 65, accuracy: 0.80 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/699.png',
    color: '#b2ebf2',
    evolvesTo: null
  },
  // --- 27. 寶寶暴龍系列 ---
  {
    id: 696,
    name: '寶寶暴龍',
    type: '岩石/龍',
    baseHp: 120,
    baseAtk: 25,
    rarity: 'Common',
    catchRate: 0.50,
    skills: [
      { name: '撞擊', power: 15, accuracy: 0.95 },
      { name: '咬住', power: 28, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/696.png',
    color: '#ffe0b2',
    evolvesTo: 697,
    evolveLevel: 39,
    evolveCost: 350
  },
  {
    id: 697,
    name: '怪顎龍',
    type: '岩石/龍',
    baseHp: 220,
    baseAtk: 52,
    rarity: 'Uncommon',
    catchRate: 0.22,
    skills: [
      { name: '咬住', power: 28, accuracy: 0.90 },
      { name: '強壯下顎咬碎', power: 68, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/697.png',
    color: '#ffb74d',
    evolvesTo: null
  },
  // --- 28. 科斯莫古系列 ---
  {
    id: 789,
    name: '科斯莫古',
    type: '超能力',
    baseHp: 110,
    baseAtk: 12,
    rarity: 'Rare',
    catchRate: 0.30,
    skills: [
      { name: '瞬間移動', power: 5, accuracy: 0.99 },
      { name: '星光躍遷', power: 20, accuracy: 0.90 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/789.png',
    color: '#ede7f6',
    evolvesTo: 790,
    evolveLevel: 30,
    evolveCost: 400
  },
  {
    id: 790,
    name: '科斯莫姆',
    type: '超能力',
    baseHp: 160,
    baseAtk: 24,
    rarity: 'Epic',
    catchRate: 0.15,
    skills: [
      { name: '宇宙重力', power: 22, accuracy: 0.90 },
      { name: '星光凝聚', power: 42, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/790.png',
    color: '#d1c4e9',
    evolvesTo: 792,
    evolveLevel: 53,
    evolveCost: 750
  },
  {
    id: 792,
    name: '露奈雅拉',
    type: '超能力/幽靈',
    baseHp: 320,
    baseAtk: 68,
    rarity: 'Legendary',
    catchRate: 0.03,
    skills: [
      { name: '暗影之光', power: 55, accuracy: 0.90 },
      { name: '星之耀斑', power: 85, accuracy: 0.85 }
    ],
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png',
    color: '#7e57c2',
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
  { id: 9, name: '枯葉市港口 (Port)', type: 'port', desc: '⚓ 可搭乘聖特安努號前往第二大陸 (需持船票與許可證)', color: '#00bcd4' },
  { id: 10, name: '友好商店', type: 'mart', desc: '購買精靈球與回復藥水', color: '#03a9f4' },
  { id: 11, name: '岩山隧道', type: 'rock', terrain: '山岩', desc: '岩石與毒系野生寶可夢出沒地', color: '#9e9e9e', pokemonIds: [74, 23] },
  { id: 12, name: '寶可夢訓練場', type: 'gym', desc: '付費訓練，升級與進化寶可夢', color: '#ff9800' },
  { id: 13, name: '雙子島深處', type: 'water', terrain: '水域', desc: '水與稀有野生寶可夢出沒地', color: '#2196f3', pokemonIds: [7, 143] },
  { id: 14, name: '隨機事件', type: 'event', desc: '命運與機會的考驗', color: '#e91e63' },
  { id: 15, name: '華藍洞窟', type: 'cave', terrain: '洞穴', desc: '傳說級寶可夢的沉睡之地', color: '#795548', pokemonIds: [94, 150] }
];

// 第二大陸地圖定義 (28格)
export const MAP_LOCATIONS_CHAPTER_2 = [
  { id: 0, name: '新大陸起點 (START)', type: 'start', desc: '經過或停留獲得 300 金幣', color: '#ff5722' },
  { id: 1, name: '神奧起始森林', type: 'grass', terrain: '草叢', desc: '野生小貓怪與咕妞妞出沒地 (Lv.20+)', color: '#4caf50', pokemonIds: [403, 293] },
  { id: 2, name: '友好商店', type: 'mart', desc: '購買回復藥水與高級道具', color: '#03a9f4' },
  { id: 3, name: '荒蕪山脈', type: 'rock', terrain: '山岩', desc: '野生大岩蛇與卡拉卡拉出沒地 (Lv.22+)', color: '#9e9e9e', pokemonIds: [95, 104] },
  { id: 4, name: '屬性石礦場 (Mine)', type: 'stoneMine', desc: '⛏️ 停留可花費 50 G 進行採礦，有機率挖到火/雷/水之石', color: '#607d8b' },
  { id: 5, name: '濱海市水域', type: 'water', terrain: '水域', desc: '野生波加曼與咬咬龜出沒地 (Lv.20+)', color: '#2196f3', pokemonIds: [393, 833] },
  { id: 6, name: '隨機事件', type: 'event', desc: '新大陸的命運與考驗', color: '#e91e63' },
  { id: 7, name: '火山熔岩深處', type: 'cave', terrain: '洞穴', desc: '野生超音蝠與綠毛蟲出沒地 (Lv.24+)', color: '#795548', pokemonIds: [41, 10] },
  { id: 8, name: '寶可夢培育屋 (Daycare)', type: 'daycare', desc: '🏠 停留可寄養備用寶可夢，每擲一次骰子在背景吸取 EXP！', color: '#ffc107' },
  { id: 9, name: '神奧電廠', type: 'grass', terrain: '草叢', desc: '野生小貓怪與皮卡丘出沒地 (Lv.25+)', color: '#4caf50', pokemonIds: [403, 25] },
  { id: 10, name: '友好商店', type: 'mart', desc: '購買回復藥水與高級道具', color: '#03a9f4' },
  { id: 11, name: '鋼鐵山脈', type: 'rock', terrain: '山岩', desc: '準神鐵啞鈴與隆隆石出沒地 (Lv.26+)', color: '#9e9e9e', pokemonIds: [374, 75] },
  { id: 12, name: '訓練師武道館 (Dojo)', type: 'dojo', desc: '🥋 挑戰駐防傳奇館主(赤紅/竹蘭/大吾/阿渡/武藏)，贏取巨額獎金與屬性石！', color: '#ff9800' },
  { id: 13, name: '神奧港口 (Port)', type: 'port', desc: '⚓ 可免費搭乘聖特安努號返回枯葉市港口', color: '#00bcd4' },
  { id: 14, name: '隨機事件', type: 'event', desc: '新大陸的命運與考驗', color: '#e91e63' },
  { id: 15, name: '深邃遺跡', type: 'cave', terrain: '洞穴', desc: '野生單卵細胞球與耿鬼出沒地 (Lv.28+)', color: '#795548', pokemonIds: [577, 94] },
  { id: 16, name: '寶可夢中心', type: 'center', desc: '免費回復所有寶可夢的體力', color: '#e91e63' },
  { id: 17, name: '迷幻草叢', type: 'grass', terrain: '草叢', desc: '野生寶寶丁與妙蛙草出沒地 (Lv.28+)', color: '#4caf50', pokemonIds: [174, 2] },
  { id: 18, name: '友好商店', type: 'mart', desc: '購買回復藥水與高級道具', color: '#03a9f4' },
  { id: 19, name: '天冠山麓', type: 'rock', terrain: '山岩', desc: '野生龜腳腳與大岩蛇出沒地 (Lv.30+)', color: '#9e9e9e', pokemonIds: [688, 95] },
  { id: 20, name: '屬性石礦場 (Mine)', type: 'stoneMine', desc: '⛏️ 停留可花費 50 G 進行採礦，有機率挖到火/雷/水之石', color: '#607d8b' },
  { id: 21, name: '帕底亞湖泊', type: 'water', terrain: '水域', desc: '史詩級拉普拉斯與鯉魚王出沒地 (Lv.32+)', color: '#2196f3', pokemonIds: [131, 129] },
  { id: 22, name: '隨機事件', type: 'event', desc: '新大陸的命運與考驗', color: '#e91e63' },
  { id: 23, name: '帕底亞巨洞', type: 'cave', terrain: '洞穴', desc: '野生科斯莫古與袋獸出沒地 (Lv.35+)', color: '#795548', pokemonIds: [789, 115] },
  { id: 24, name: '寶可夢中心', type: 'center', desc: '免費回復所有寶可夢的體力', color: '#e91e63' },
  { id: 25, name: '露天草地', type: 'grass', terrain: '草叢', desc: '野生蛋蛋與伊布出沒地 (Lv.30+)', color: '#4caf50', pokemonIds: [102, 133] },
  { id: 26, name: '隨機事件', type: 'event', desc: '新大陸的命運與考驗', color: '#e91e63' },
  { id: 27, name: '零之秘境', type: 'cave', terrain: '洞穴', desc: '古神雙翼密勒頓、故勒頓與無極汰那甦醒之地 (Lv.45+)', color: '#795548', pokemonIds: [1008, 1007, 890] }
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
