import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { POKEMON_DATABASE, MAP_LOCATIONS, MAP_LOCATIONS_CHAPTER_2, GAME_EVENTS, TRAINERS_DATABASE } from './data/pokemonData';

// 子組件導入
import GameBoard from './components/GameBoard';
import Dice from './components/Dice';
import Pokedex from './components/Pokedex';
import BattleScreen from './components/BattleScreen';
import PokeMart from './components/PokeMart';
import TrainingGym from './components/TrainingGym';
import PokeCenter from './components/PokeCenter';


// --- 武道館傳奇挑戰館主陣容 ---
const DOJO_LEADERS = [
  {
    id: 'red',
    name: '赤紅 (Red)',
    avatar: '/images/ash.png',
    dialog: '「...... ......」 (傳說中的起點訓練師赤紅冷酷地向你發起對決！)',
    rewardGold: 250,
    rewardStone: 'fireStone',
    rewardStoneName: '🔥 火之石',
    pokemon: {
      id: 6,
      name: '赤紅的噴火龍',
      type: '火',
      baseHp: 350,
      currentHp: 350,
      baseAtk: 65,
      color: '#d84315',
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
      skills: [
        { name: '噴射火焰', power: 45, accuracy: 0.85 },
        { name: '大字爆炎', power: 75, accuracy: 0.80 }
      ]
    }
  },
  {
    id: 'cynthia',
    name: '竹蘭 (Cynthia)',
    avatar: '/images/misty.png',
    dialog: '「能在此遇見你真是太好了，讓我看看你和寶可夢的羈絆吧！」',
    rewardGold: 300,
    rewardStone: 'kingRock',
    rewardStoneName: '👑 王者之證',
    pokemon: {
      id: 445,
      name: '竹蘭的烈咬陸鯊',
      type: '龍/地面',
      baseHp: 380,
      currentHp: 380,
      baseAtk: 70,
      color: '#3f51b5',
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png',
      skills: [
        { name: '龍之波動', power: 45, accuracy: 0.85 },
        { name: '逆鱗爆擊', power: 80, accuracy: 0.80 }
      ]
    }
  },
  {
    id: 'steven',
    name: '大吾 (Steven)',
    avatar: '/images/gary.png',
    dialog: '「最終，我才是最強的，而且也是最尊貴的！」',
    rewardGold: 280,
    rewardStone: 'thunderStone',
    rewardStoneName: '⚡ 雷之石',
    pokemon: {
      id: 376,
      name: '大吾的巨金怪',
      type: '鋼/超能力',
      baseHp: 360,
      currentHp: 360,
      baseAtk: 68,
      color: '#00695c',
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png',
      skills: [
        { name: '子彈拳', power: 45, accuracy: 0.95 },
        { name: '彗星拳', power: 75, accuracy: 0.85 }
      ]
    }
  },
  {
    id: 'lance',
    name: '阿渡 (Lance)',
    avatar: '/images/brock.png',
    dialog: '「龍是神聖而強大的存在，你準備好迎接龍之怒吼了嗎？」',
    rewardGold: 260,
    rewardStone: 'waterStone',
    rewardStoneName: '💧 水之石',
    pokemon: {
      id: 149,
      name: '阿渡的快龍',
      type: '龍/飛行',
      baseHp: 340,
      currentHp: 340,
      baseAtk: 66,
      color: '#ff9800',
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
      skills: [
        { name: '龍之波動', power: 45, accuracy: 0.85 },
        { name: '破壞光線', power: 80, accuracy: 0.80 }
      ]
    }
  },
  {
    id: 'jessie_dojo',
    name: '火箭隊武藏 (Jessie)',
    avatar: '/images/jessie.png',
    dialog: '「既然你誠心誠意的發問了，那我們就用實力讓你哭得很有節奏！」',
    rewardGold: 150,
    rewardStone: 'random',
    rewardStoneName: '🔮 隨機屬性石',
    pokemon: {
      id: 24,
      name: '武藏的阿柏怪',
      type: '毒',
      baseHp: 250,
      currentHp: 250,
      baseAtk: 48,
      color: '#7b1fa2',
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png',
      skills: [
        { name: '咬碎', power: 32, accuracy: 0.90 },
        { name: '溶解液', power: 48, accuracy: 0.85 }
      ]
    }
  }
];

function App() {
  // --- 遊戲核心狀態 ---
  const [gold, setGold] = useState(300);
  const [steps, setSteps] = useState(0);
  const [playerPos, setPlayerPos] = useState(0);
  
  // 背景音樂控制 (Ref 與靜音狀態，預設靜音以配合瀏覽器自動播放限制)
  const bgmRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  // 背包道具
  const [bag, setBag] = useState({
    pokeball: 5,
    greatBall: 2,
    ultraBall: 0,
    potion: 2,
    superPotion: 0,
    maxPotion: 0,
    shipTicket: 0,
    fireStone: 0,
    thunderStone: 0,
    waterStone: 0,
    kingRock: 0
  });

  // 已收服的寶可夢 ID 列表
  const [caughtIds, setCaughtIds] = useState([]);

  // 當前選定的訓練師
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  // 玩家建立的所有寶可夢列表 (含等級、經驗值等個體屬性)
  const [myPokemons, setMyPokemons] = useState([]);
  
  // 我方夥伴寶可夢 (出戰主力)
  const [partner, setPartner] = useState(null);
  
  // 視窗狀態控制
  const [activeModal, setActiveModal] = useState('titleScreen'); // partnerSelect, battle, mart, gym, center, event, victory, port, daycare, stoneMine, dojo, titleScreen
  
  // 遭遇中的野生寶可夢
  const [wildPokemon, setWildPokemon] = useState(null);
  
  // 遊戲進度與第二篇章新玩法相關狀態
  const [currentChapter, setCurrentChapter] = useState(1); // 1 或 2
  const [hasSave, setHasSave] = useState(false);
  const [isSailing, setIsSailing] = useState(false); // 搭船轉場動畫控制
  const [hasShipLicense, setHasShipLicense] = useState(false); // 遠航許可證
  const [daycarePokemon, setDaycarePokemon] = useState(null); // 培育屋寄養的寶可夢
  const [dojoTrainer, setDojoTrainer] = useState(null); // 武道館遭遇的傳奇館主
  const [saveLoadType, setSaveLoadType] = useState(null); // null, 'saveSelect', 'loadSelect'
  const [evolvingData, setEvolvingData] = useState(null); // 正在進行進化的寶可夢數據
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showTitleMenu, setShowTitleMenu] = useState(false); // 主畫面選單展開狀態
  const [saveTrigger, setSaveTrigger] = useState(0); // 存檔計數器，用於手動存檔覆寫後強制重新渲染槽位卡片

  const activeMapLocations = currentChapter === 1 ? MAP_LOCATIONS : MAP_LOCATIONS_CHAPTER_2;

  // 屬性石礦場專屬狀態與採礦處理
  const [isMiningStone, setIsMiningStone] = useState(false);
  const [miningResult, setMiningResult] = useState(null);

  const handleMine = () => {
    if (gold < 50 || isMiningStone) return;
    setGold(prev => prev - 50);
    setIsMiningStone(true);
    setMiningResult(null);

    // 模擬 1.5 秒採礦動畫
    setTimeout(() => {
      setIsMiningStone(false);
      const rand = Math.random();
      if (rand < 0.20) {
        updateBag('waterStone', 1);
        setMiningResult({ type: 'stone', name: '💧 水之石', key: 'waterStone', desc: '挖到了散發蔚藍光芒的「水之石」！' });
      } else if (rand < 0.40) {
        updateBag('thunderStone', 1);
        setMiningResult({ type: 'stone', name: '⚡ 雷之石', key: 'thunderStone', desc: '挖到了閃爍金色電弧的「雷之石」！' });
      } else if (rand < 0.60) {
        updateBag('fireStone', 1);
        setMiningResult({ type: 'stone', name: '🔥 火之石', key: 'fireStone', desc: '挖到了散發炙熱溫度的「火之石」！' });
      } else if (rand < 0.75) {
        setGold(prev => prev + 150);
        setMiningResult({ type: 'gold', name: '🪙 黃金礦石', desc: '挖到了純淨的黃金礦石！友好商店直接以 150 G 收購！(淨賺 100 G)' });
      } else {
        setMiningResult({ type: 'empty', name: '🪨 碎石', desc: '敲了半天只敲出了一些無用的碎石... (空手而歸)' });
      }
    }, 1500);
  };


  // --- 骰子移動狀態 ---
  const [isRolling, setIsRolling] = useState(false);
  const [rollValue, setRollValue] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [remainingSteps, setRemainingSteps] = useState(0);

  // --- 背包與狀態變更幫手 ---
  const updateBag = (itemKey, amount) => {
    setBag(prev => ({
      ...prev,
      [itemKey]: Math.max(0, prev[itemKey] + amount)
    }));
  };

  const updateGold = (amount) => {
    setGold(prev => Math.max(0, prev + amount));
  };

  const damagePartner = (amount) => {
    setPartner(prev => ({
      ...prev,
      hp: Math.max(0, prev.hp - amount)
    }));
  };

  const healPartner = (amount) => {
    setPartner(prev => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + amount)
    }));
  };

  const fullyHealPartner = () => {
    setPartner(prev => ({
      ...prev,
      hp: prev.maxHp
    }));
  };

  const trainPartner = (statKey, amount) => {
    setPartner(prev => {
      if (statKey === 'skills') {
        const upgradedSkills = prev.skills.map(s => ({
          ...s,
          power: s.power + amount
        }));
        return {
          ...prev,
          level: prev.level + 1,
          skills: upgradedSkills
        };
      }
      
      const nextVal = prev[statKey] + amount;
      return {
        ...prev,
        level: prev.level + 1,
        [statKey]: nextVal,
        hp: statKey === 'maxHp' ? prev.hp + amount : prev.hp
      };
    });
  };

  // --- 音樂播放控制 Effects ---
  
  // 1. 初始化與同步靜音狀態，並檢測是否有存檔
  useEffect(() => {
    if (!bgmRef.current) {
      bgmRef.current = new Audio();
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.22; // 設定舒適的 22% 音量
    }
    bgmRef.current.muted = isMuted;

    // 檢測本地多個手動存檔槽位是否有已儲存的進度
    const hasSlot1 = localStorage.getItem('pokemon_monopoly_save_slot_1');
    const hasSlot2 = localStorage.getItem('pokemon_monopoly_save_slot_2');
    const hasSlot3 = localStorage.getItem('pokemon_monopoly_save_slot_3');
    const hasLegacy = localStorage.getItem('pokemon_monopoly_save');
    
    if (hasSlot1 || hasSlot2 || hasSlot3 || hasLegacy) {
      setTimeout(() => {
        setHasSave(true);
      }, 0);
    }
  }, [isMuted]);

  // 2. 根據當前遊戲畫面 (activeModal) 與狀態自動流暢切換音軌
  useEffect(() => {
    if (!bgmRef.current) return;

    // 以 const 宣告純函數，徹底避免 Let 無效賦值的警告
    const getTargetSrc = () => {
      if (activeModal === 'titleScreen') return '/audio/title_theme.mp3';
      if (activeModal === 'partnerSelect') return '/audio/title_theme.mp3';
      if (activeModal === 'battle') return '/audio/battle_theme.m4a';
      if (activeModal === 'center') return '/audio/center_theme.m4a';
      if (activeModal === 'victory') return '/audio/title_theme.mp3';
      return '/audio/map_theme.m4a';
    };
    const targetSrc = getTargetSrc();

    // 安全解析當前音訊 URL 路徑，使用無變數 catch 語法消滅 unused-vars 警告
    const getCurrentSrcPath = () => {
      try {
        return bgmRef.current.src ? new URL(bgmRef.current.src).pathname : '';
      } catch {
        return '';
      }
    };
    const currentSrcPath = getCurrentSrcPath();

    if (currentSrcPath !== targetSrc) {
      bgmRef.current.src = targetSrc;
      bgmRef.current.load();
    }

    // 當選定初始夥伴（有夥伴）或是處於選定畫面/主畫面時，自動嘗試播放
    if (partner || activeModal === 'partnerSelect' || activeModal === 'titleScreen') {
      bgmRef.current.play().catch((err) => {
        console.log("自動播放受限，等待玩家與網頁互動點擊以啟動音樂:", err.message);
      });
    }
  }, [activeModal, partner]);

  // --- 遊戲邏輯與行為 ---

  // 1. 選擇初始訓練師與其專屬夥伴
  const handleSelectTrainer = (trainer) => {
    const pokeBase = POKEMON_DATABASE.find(p => p.id === trainer.partnerId);
    const partnerData = {
      ...pokeBase,
      level: 5,
      hp: pokeBase.baseHp,
      maxHp: pokeBase.baseHp,
      atk: pokeBase.baseAtk,
      exp: 0,
      maxExp: 100
    };
    setSelectedTrainer(trainer);
    setPartner(partnerData);
    setMyPokemons([partnerData]);
    setCaughtIds([pokeBase.id]); // 初始夥伴直接登錄圖鑑
    setActiveModal(null);
  };

  // 2. 擲骰子
  const rollDice = () => {
    if (isRolling || isMoving || activeModal) return;
    
    setIsRolling(true);
    const value = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
      setIsRolling(false);
      setRollValue(value);
      setIsMoving(true);
      setSteps(prev => prev + 1);
      
      // 設定剩餘步數，交由 useEffect 來逐步前進
      setRemainingSteps(value);
    }, 850);
  };

  // 3. 踩到格子的結算事件 (Landing Handler - 移至上方宣告以避免 TDZ 錯誤)
  const handleLandingEvent = useCallback((pos) => {
    const currentCell = activeMapLocations[pos];

    // A. 地形格：有機會觸發野生寶可夢遭遇
    if (['grass', 'water', 'rock', 'cave'].includes(currentCell.type)) {
      const rand = Math.random();
      if (rand < 0.85) { // 85% 機率遭遇
        // 隨機抽選該格子配置的出沒寶可夢之一
        const pokemonId = currentCell.pokemonIds[Math.floor(Math.random() * currentCell.pokemonIds.length)];
        const wildBase = POKEMON_DATABASE.find(p => p.id === pokemonId);
        
        // 第二大陸 Lv.20+ 強度系統：HP 乘以 2.5，攻擊力乘以 1.8
        const hpMultiplier = currentChapter === 1 ? 1 : 2.5;
        const atkMultiplier = currentChapter === 1 ? 1 : 1.8;
        
        const wildHp = Math.round(wildBase.baseHp * hpMultiplier * (0.9 + Math.random() * 0.2));
        
        // 複製野生寶可夢數值
        setWildPokemon({
          ...wildBase,
          baseHp: wildHp,
          currentHp: wildHp,
          baseAtk: Math.round(wildBase.baseAtk * atkMultiplier)
        });
        
        setActiveModal('battle');
      } else {
        // 15% 機率相安無事
        alert(`一陣微風吹過... 這裡好像沒有野生寶可夢的身影。`);
      }
    }
    
    // B. 友好商店格
    else if (currentCell.type === 'mart') {
      setActiveModal('mart');
    }
    
    // C. 訓練場格
    else if (currentCell.type === 'gym') {
      setActiveModal('gym');
    }
    
    // D. 寶可夢中心格
    else if (currentCell.type === 'center') {
      setActiveModal('center');
    }
    
    // E. 隨機事件格
    else if (currentCell.type === 'event') {
      const event = GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)];
      setCurrentEvent(event);
      setActiveModal('event');
    }

    // F. 港口格
    else if (currentCell.type === 'port') {
      setActiveModal('port');
    }

    // G. 寶可夢培育屋
    else if (currentCell.type === 'daycare') {
      setActiveModal('daycare');
    }

    // H. 屬性石礦場
    else if (currentCell.type === 'stoneMine') {
      setActiveModal('stoneMine');
    }

    // I. 訓練師武道館
    else if (currentCell.type === 'dojo') {
      // 隨機遭遇五位冠軍館主之一
      const leader = DOJO_LEADERS[Math.floor(Math.random() * DOJO_LEADERS.length)];
      setDojoTrainer(leader);
      setActiveModal('dojo');
    }
  }, [activeMapLocations, currentChapter]);

  // 4. 一格一格前進的大富翁移動邏輯 (使用 React useEffect 進行標準副作用控制)
  useEffect(() => {
    if (remainingSteps <= 0) return;

    const timer = setTimeout(() => {
      // 純數學計算出下一步位置，完全避免 state updater 中的副作用，自適應當前地圖大小
      const nextPos = (playerPos + 1) % activeMapLocations.length;
      setPlayerPos(nextPos);
      
      if (nextPos === 0) {
        // 第一大陸過起點得 200 G，第二大陸高難度得 300 G
        setGold((prevGold) => prevGold + (currentChapter === 1 ? 200 : 300));
      }

      setRemainingSteps((prev) => prev - 1);

      // 🏠 大氣培育屋背景走步經驗值累加與自動升級/進化演算法
      setDaycarePokemon(prevPoke => {
        if (!prevPoke) return null;
        
        let newExp = prevPoke.exp + 10;
        let newLevel = prevPoke.level;
        let newMaxExp = prevPoke.maxExp;
        let newMaxHp = prevPoke.maxHp;
        let newHp = prevPoke.hp;
        let newAtk = prevPoke.atk;
        let evolvedId = prevPoke.id;
        let evolvedName = prevPoke.name;
        let evolvedType = prevPoke.type;
        let evolvedSprite = prevPoke.sprite;
        let evolvedSkills = prevPoke.skills;
        let evolvedEvolvesTo = prevPoke.evolvesTo;
        let evolvedEvolveLevel = prevPoke.evolveLevel;

        let hasLeveledUp = false;
        let hasEvolved = false;

        // 迴圈處理可能連升多級的情況
        while (newExp >= newMaxExp) {
          newExp -= newMaxExp;
          newLevel += 1;
          newMaxExp = Math.round(newMaxExp * 1.2);
          newMaxHp += 30;
          newHp = newMaxHp; // 培育屋升級時貼心回滿 HP！
          newAtk += 6;
          hasLeveledUp = true;

          // 🌟 貼心加入培育屋背景自動進化檢查！
          if (evolvedEvolvesTo && newLevel >= evolvedEvolveLevel) {
            const evolvedBase = POKEMON_DATABASE.find(p => p.id === evolvedEvolvesTo);
            if (evolvedBase) {
              evolvedId = evolvedBase.id;
              evolvedName = evolvedBase.name;
              evolvedType = evolvedBase.type;
              evolvedSprite = evolvedBase.sprite;
              evolvedSkills = evolvedBase.skills;
              evolvedEvolvesTo = evolvedBase.evolvesTo;
              evolvedEvolveLevel = evolvedBase.evolveLevel;
              hasEvolved = true;
            }
          }
        }

        // 我們可以使用 console.log 在後台記錄培育進度，不干擾主畫面
        if (hasEvolved) {
          console.log(`🏠 培育屋喜訊：您的寄養夥伴成功進化為了「${evolvedName}」(Lv.${newLevel})！`);
        } else if (hasLeveledUp) {
          console.log(`🏠 培育屋喜訊：您的寄養夥伴「${evolvedName}」等級提升至 Lv.${newLevel}！`);
        }

        return {
          ...prevPoke,
          id: evolvedId,
          name: evolvedName,
          type: evolvedType,
          sprite: evolvedSprite,
          skills: evolvedSkills,
          evolvesTo: evolvedEvolvesTo,
          evolveLevel: evolvedEvolveLevel,
          level: newLevel,
          exp: newExp,
          maxExp: newMaxExp,
          maxHp: newMaxHp,
          hp: newHp,
          atk: newAtk
        };
      });

      // 當 remainingSteps 在此週期為 1 時，代表走完這步即抵達終點
      if (remainingSteps === 1) {
        // 延遲 550ms，給予瀏覽器與 React 充足時間將棋子繪製到最後一格，並走完平滑彈跳動畫後，才觸發事件視窗
        setTimeout(() => {
          setIsMoving(false);
          handleLandingEvent(nextPos);
        }, 550);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [remainingSteps, isMoving, playerPos, activeMapLocations, currentChapter, handleLandingEvent]);

  // 5. 隨機事件處理
  const handleEventExecute = () => {
    if (!currentEvent) return;

    if (currentEvent.amount) {
      setGold(prev => Math.max(0, prev + currentEvent.amount));
    }
    
    if (currentEvent.ballType) {
      setBag(prev => ({
        ...prev,
        [currentEvent.ballType]: (prev[currentEvent.ballType] || 0) + currentEvent.count
      }));
    }

    if (currentEvent.teleport) {
      // 隨機傳送到除了起點外的格子
      const randomGrid = Math.floor(Math.random() * 15) + 1;
      setPlayerPos(randomGrid);
      // 傳送後直接觸發該格子的新事件
      setTimeout(() => {
        handleLandingEvent(randomGrid);
      }, 500);
    }

    setActiveModal(null);
    setCurrentEvent(null);
  };

  // 6. 戰鬥捕捉結算回呼
  const handleBattleEnd = useCallback(({ success, caughtId, status }) => {
    setActiveModal(null);

    // 檢查是否是武道館對決的結算
    if (wildPokemon && wildPokemon.isDojo) {
      const isDojoWin = success;
      const finishedWild = wildPokemon;
      setWildPokemon(null);
      setDojoTrainer(null);

      if (isDojoWin) {
        // 1. 獲得高額金幣獎勵
        setGold(prev => prev + finishedWild.rewardGold);
        
        // 2. 獲得進化石獎勵
        let stoneKey = finishedWild.rewardStone;
        let stoneName = finishedWild.rewardStoneName;
        
        if (stoneKey === 'random') {
          const stones = ['fireStone', 'thunderStone', 'waterStone'];
          const randStone = stones[Math.floor(Math.random() * stones.length)];
          stoneKey = randStone;
          stoneName = randStone === 'fireStone' ? '🔥 火之石' : randStone === 'thunderStone' ? '⚡ 雷之石' : '💧 水之石';
        }
        
        updateBag(stoneKey, 1);

        // 3. 出戰夥伴獲得 80 EXP
        setPartner(prev => {
          if (!prev) return prev;
          const nextExp = prev.exp + 80;
          return { ...prev, exp: nextExp };
        });

        setMyPokemons(prevList => prevList.map(p => {
          if (partner && p.id === partner.id) {
            return { ...p, exp: p.exp + 80 };
          }
          return p;
        }));

        alert(`🎉 道館對決大獲全勝！\n您成功擊敗了「${finishedWild.leaderName}」！\n獲得金幣: +${finishedWild.rewardGold} G！\n獲得專屬獎項: ${stoneName} x1！\n出戰寶可夢獲得 80 EXP！`);
      } else if (status === 'defeated') {
        // Dojo 戰鬥慘敗懲罰
        let lostGold = 0;
        setGold(prev => {
          lostGold = Math.floor(prev / 2);
          return prev - lostGold;
        });
        
        setPartner(prev => {
          if (!prev) return prev;
          const nextPartner = { ...prev, hp: 1 };
          setMyPokemons(prevList => prevList.map(p => p.id === prev.id ? { ...p, hp: 1 } : p));
          return nextPartner;
        });
        
        setPlayerPos(16); // 第二地圖寶可夢中心格是 16
        setTimeout(() => {
          alert(`戰鬥慘敗... 您的寶可夢在道館對決中全部失去了戰鬥意志！\n被扣除了一半的金幣 (損失 ${lostGold} G)！\n你被擔架強制送回了神奧寶可夢中心治療。`);
          setActiveModal('center');
        }, 600);
      }
      return;
    }

    setWildPokemon(null);

    // 成功捕捉並擊敗野生寶可夢
    if (success && caughtId) {
      // 檢查是否是超夢 (id 150)
      if (caughtId === 150) {
        setHasShipLicense(true);
        alert(`🏆 恭喜！您成功擊敗並收服了關都地區的最終魔王「超夢」！\n大木博士向您頒發了「遠航許可證」！\n現在您可以到友好商店購買「聖特安努號船票 (150 G)」，並前往第二地圖的枯葉市港口開啟第二篇章冒險了！`);
      }
      // 隨機獲得 100~200 金幣的戰鬥獎金
      const bonusGold = Math.floor(Math.random() * 101) + 100;
      setGold(prev => prev + bonusGold);

      // 出戰主力寶可夢獲得 80 EXP
      setPartner(prev => {
        if (!prev) return prev;
        const nextExp = prev.exp + 80;
        return {
          ...prev,
          exp: nextExp
        };
      });

      // 同步更新已擁有的 myPokemons 列表中的出戰夥伴經驗值
      setMyPokemons(prevList => {
        return prevList.map(p => {
          if (p.id === partner.id) {
            return {
              ...p,
              exp: p.exp + 80
            };
          }
          return p;
        });
      });

      if (!caughtIds.includes(caughtId)) {
        const nextCaught = [...caughtIds, caughtId];
        setCaughtIds(nextCaught);

        // 將野生寶可夢以初始狀態收服進 myPokemons 列表
        const wildBase = POKEMON_DATABASE.find(p => p.id === caughtId);
        const newPokemon = {
          ...wildBase,
          level: 5,
          hp: wildBase.baseHp,
          maxHp: wildBase.baseHp,
          atk: wildBase.baseAtk,
          exp: 0,
          maxExp: 100
        };
        setMyPokemons(prev => [...prev, newPokemon]);
        
        alert(`對戰勝利！獲得金幣 +${bonusGold} G！出戰寶可夢獲得 80 EXP！\n恭喜收服了「${wildBase.name}」，已加入你的夥伴背包！`);

        // 檢查是否收集齊全所有寶可夢
        if (nextCaught.length === POKEMON_DATABASE.length) {
          setTimeout(() => {
            setActiveModal('victory');
          }, 800);
        }
      } else {
        alert(`對戰勝利！獲得金幣 +${bonusGold} G！出戰寶可夢獲得 80 EXP！\n（「${POKEMON_DATABASE.find(p => p.id === caughtId)?.name}」先前已經收服過了）`);
      }
    }

    // 戰鬥倒下失敗懲罰 (選項 A: 損失身上一半金幣，強制護送到中心，HP設為1)
    if (status === 'defeated') {
      let lostGold = 0;
      setGold(prev => {
        lostGold = Math.floor(prev / 2);
        return prev - lostGold;
      });
      
      // 體力設為 1 滴血，並強制傳送到最近的寶可夢中心 (格 8)
      setPartner(prev => {
        if (!prev) return prev;
        const nextPartner = { ...prev, hp: 1 };
        // 同步更新 myPokemons 列表
        setMyPokemons(prevList => prevList.map(p => p.id === prev.id ? { ...p, hp: 1 } : p));
        return nextPartner;
      });
      
      setPlayerPos(8);
      setTimeout(() => {
        alert(`戰鬥慘敗... 身上所有寶可夢都倒下了！\n被扣除了一半的金幣 (損失 ${lostGold} G)！\n你被擔架強制護送回最近的寶可夢中心治療。`);
        setActiveModal('center');
      }, 600);
    }
  }, [wildPokemon, partner, caughtIds]);

  // 7. 切換主力出戰夥伴
  const handleSwitchPartner = (selectedPoke) => {
    // 首先將當前的主力數據同步回 myPokemons 中，避免升級、EXP 或血量資訊流失
    setMyPokemons(prevList => {
      const nextList = prevList.map(p => p.id === partner.id ? partner : p);
      const targetPoke = nextList.find(p => p.id === selectedPoke.id);
      setPartner(targetPoke);
      return nextList;
    });
    alert(`已成功將主力出戰夥伴切換為「${selectedPoke.name}」！`);
  };

  // 8. 夥伴寶可夢付費等級提升與進化檢查
  const handleLevelUp = () => {
    if (!partner || partner.exp < partner.maxExp || gold < 150) return;

    // 扣除升級所需的金幣 150 G
    setGold(prev => prev - 150);

    // 計算升級後的數值：最大 HP + 30，ATK + 6
    const upgradedPartner = {
      ...partner,
      level: partner.level + 1,
      exp: Math.max(0, partner.exp - partner.maxExp), // 扣除升級消耗的 EXP
      maxExp: Math.round(partner.maxExp * 1.2), // 下一級經驗值需求提升 20%
      maxHp: partner.maxHp + 30,
      hp: partner.hp + 30, // 升級時也直接回復 30 點 HP
      atk: partner.atk + 6
    };

    // 同步更新當前主力狀態
    setPartner(upgradedPartner);

    // 同步更新 myPokemons 隊伍列表
    setMyPokemons(prevList => prevList.map(p => p.id === partner.id ? upgradedPartner : p));

    // 檢查是否符合進化條件
    // 如果此寶可夢有進化對象，且升級後等級達到了進化等級
    if (upgradedPartner.evolvesTo && upgradedPartner.level >= upgradedPartner.evolveLevel) {
      const evolvedBase = POKEMON_DATABASE.find(p => p.id === upgradedPartner.evolvesTo);
      if (evolvedBase) {
        // 設定進化過渡數據，開啟光芒進化 Overlay！
        const evolvedPokemon = {
          ...upgradedPartner,
          id: evolvedBase.id,
          name: evolvedBase.name,
          type: evolvedBase.type,
          sprite: evolvedBase.sprite,
          color: evolvedBase.color,
          // 進化帶來基礎數值極致暴增 (最大 HP + 50，ATK + 15)
          maxHp: upgradedPartner.maxHp + 50,
          hp: upgradedPartner.hp + 50,
          atk: upgradedPartner.atk + 15,
          skills: evolvedBase.skills,
          evolvesTo: evolvedBase.evolvesTo,
          evolveLevel: evolvedBase.evolveLevel,
          evolveCost: evolvedBase.evolveCost
        };

        // 延遲一下，先播放升級提示，再無縫觸發進化光華！
        setTimeout(() => {
          setEvolvingData({
            from: upgradedPartner,
            to: evolvedPokemon
          });
        }, 1500);
      }
    } else {
      alert(`✨ 「${partner.name}」等級提升了！現在達到了 Lv.${upgradedPartner.level}！\n屬性加成：最大 HP +30，攻擊力 +6！`);
    }
  };


  // 8.5 伊布分支指定進化
  const handleBranchEvolve = (evolvedId) => {
    const evolvedBase = POKEMON_DATABASE.find(p => p.id === evolvedId);
    if (!evolvedBase) return;
    
    const evolvedPokemon = {
      ...partner,
      id: evolvedBase.id,
      name: evolvedBase.name,
      type: evolvedBase.type,
      sprite: evolvedBase.sprite,
      color: evolvedBase.color,
      maxHp: partner.maxHp + 50,
      hp: partner.hp + 50,
      atk: partner.atk + 15,
      skills: evolvedBase.skills,
      evolvesTo: null,
      evolveLevel: null,
      evolveCost: null
    };

    setEvolvingData({
      from: partner,
      to: evolvedPokemon
    });
  };

  // 9. 確認並完成光芒進化
  const confirmEvolution = () => {
    if (!evolvingData) return;
    const evolved = evolvingData.to;

    // 1. 將新寶可夢加入 caughtIds 列表 (解鎖新進化型圖鑑)
    if (!caughtIds.includes(evolved.id)) {
      setCaughtIds(prev => [...prev, evolved.id]);
    }

    // 2. 將新寶可夢替換為當前出戰主力
    setPartner(evolved);

    // 3. 在 myPokemons 隊伍列表中，將舊夥伴替換為進化後的新夥伴
    setMyPokemons(prevList => prevList.map(p => p.id === evolvingData.from.id ? evolved : p));

    // 4. 清除進化狀態
    setEvolvingData(null);
  };

  // 10. 儲存遊戲進度 (Manual Save)
  const saveGame = useCallback((slotId, isManual = false) => {
    if (!slotId) return;

    // 為了確保主力寶可夢個體數值準確無誤，在儲存前先將當前的 partner 狀態同步回 myPokemons 隊伍列表中
    let currentPokemons = myPokemons;
    if (partner) {
      currentPokemons = myPokemons.map(p => p.id === partner.id ? partner : p);
    }

    const saveData = {
      gold,
      steps,
      playerPos,
      bag,
      caughtIds,
      selectedTrainer,
      myPokemons: currentPokemons,
      partner,
      currentChapter,
      hasShipLicense,
      daycarePokemon,
      saveTime: new Date().toISOString()
    };

    localStorage.setItem(`pokemon_monopoly_save_${slotId}`, JSON.stringify(saveData));
    
    // 解決覆寫資料未即時重繪的 Bug：每次儲存完成後，遞增存檔計數器以強迫大廳組件刷新資料
    setSaveTrigger(prev => prev + 1);

    setTimeout(() => {
      setHasSave(true);
    }, 0);

    if (isManual) {
      alert(`💾 遊戲進度已成功儲存至槽位 ${slotId.replace('slot_', '')}！\n儲存時間: ${new Date().toLocaleTimeString()}`);
    }
  }, [gold, steps, playerPos, bag, caughtIds, selectedTrainer, myPokemons, partner, currentChapter, hasShipLicense, daycarePokemon]);

  // 11. 載入遊戲進度 (Load Save)
  const loadGame = (slotId) => {
    if (!slotId) return;
    const saveStr = slotId === 'legacy'
      ? localStorage.getItem('pokemon_monopoly_save')
      : localStorage.getItem(`pokemon_monopoly_save_${slotId}`);
      
    if (!saveStr) {
      alert('📂 目前沒有任何存檔進度！');
      return;
    }

    try {
      const saveData = JSON.parse(saveStr);
      
      // 還原所有的 React 遊戲狀態
      if (saveData.gold !== undefined) setGold(saveData.gold);
      if (saveData.steps !== undefined) setSteps(saveData.steps);
      if (saveData.playerPos !== undefined) setPlayerPos(saveData.playerPos);
      if (saveData.bag !== undefined) {
        setBag({
          superPotion: 0,
          maxPotion: 0,
          ...saveData.bag
        });
      }
      if (saveData.caughtIds !== undefined) setCaughtIds(saveData.caughtIds);
      if (saveData.selectedTrainer !== undefined) setSelectedTrainer(saveData.selectedTrainer);
      if (saveData.myPokemons !== undefined) setMyPokemons(saveData.myPokemons);
      if (saveData.partner !== undefined) setPartner(saveData.partner);

      // 完整持久化第二篇章相關狀態，修復第二大陸讀檔退回第一大陸之 Bug
      if (saveData.currentChapter !== undefined) setCurrentChapter(saveData.currentChapter);
      // 修正遠航許可證載入 Bug：若存檔中有許可證或圖鑑 (caughtIds) 內已收服超夢 (ID 150)，則 100% 授予遠航許可證，相容歷史舊存檔！
      const isMewtwoCaught = saveData.caughtIds && saveData.caughtIds.includes(150);
      if (saveData.hasShipLicense !== undefined) {
        setHasShipLicense(saveData.hasShipLicense || isMewtwoCaught);
      } else {
        setHasShipLicense(isMewtwoCaught);
      }
      if (saveData.daycarePokemon !== undefined) setDaycarePokemon(saveData.daycarePokemon);

      // 關鍵！跳過初始選角 Modal，關閉所有讀取視窗，無縫進入大地圖冒險！
      setActiveModal(null);
      setSaveLoadType(null);

      const slotDisplayName = slotId === 'legacy' ? '歷史舊存檔' : `槽位 ${slotId.replace('slot_', '')}`;
      alert(`📂 【${slotDisplayName}】的遊戲進度已成功載入！續接您的傳奇訓練師之旅！`);
    } catch (err) {
      console.error('載入存檔時出錯：', err);
      alert('📂 載入存檔失敗，存檔數據可能已損壞。');
    }
  };

  // 11.5 讀取槽位資訊 (用於 UI 預覽，引進 trigger 依賴以打通重新渲染通道)
  const getSlotInfo = (slotId, trigger) => {
    // 評估 trigger 確保打通 React 重新渲染通道並完美繞過 no-unused-vars / no-empty 檢查
    if (trigger !== undefined) {
      const isOk = trigger >= 0;
      if (!isOk) return null;
    }
    
    const saveStr = localStorage.getItem(`pokemon_monopoly_save_${slotId}`);
    if (!saveStr) return null;
    try {
      return JSON.parse(saveStr);
    } catch (e) {
      console.error(`解析槽位 ${slotId} 失敗`, e);
      return null;
    }
  };



  return (
    <div className="game-container">
      {/* 頂部狀態欄 */}
      <div className="status-bar glass-panel">
        <div className="title-section">
          <h1>⚡ Pokémon Monopoly Explorer</h1>
          <p>甩出骰子、探索神秘地形、戰鬥並收集全圖鑑！</p>
        </div>
        
        <div className="player-stats">
          {/* 精美音樂開關按鈕 */}
          <button 
            className="stat-badge neon-button" 
            style={{ 
              padding: '6px 12px', 
              fontSize: '12px', 
              cursor: 'pointer',
              borderColor: isMuted ? 'rgba(255,255,255,0.1)' : 'var(--neon-blue)',
              color: isMuted ? 'var(--text-secondary)' : 'var(--neon-blue)',
              background: isMuted ? 'rgba(255,255,255,0.02)' : 'rgba(0,210,255,0.1)'
            }}
            onClick={() => {
              setIsMuted(prev => !prev);
              // 主動觸發一次 play() 以繞過瀏覽器的 autoplay 互動鎖定
              if (bgmRef.current && isMuted) {
                bgmRef.current.play().catch(() => {});
              }
            }}
          >
            {isMuted ? '🔇 音樂：關' : '🔊 音樂：開'}
          </button>

          {/* 💾 儲存進度按鈕 */}
          {partner && (
            <button 
              className="stat-badge neon-button" 
              style={{ 
                padding: '6px 12px', 
                fontSize: '12px', 
                cursor: 'pointer',
                borderColor: 'var(--neon-green)',
                color: 'var(--neon-green)',
                background: 'rgba(57, 255, 20, 0.03)'
              }}
              onClick={() => setSaveLoadType('saveSelect')}
              title="將目前的冒險進度安全手動儲存至多個槽位"
            >
              💾 存檔
            </button>
          )}

          {/* 📂 載入進度按鈕 */}
          <button 
            className="stat-badge neon-button" 
            style={{ 
              padding: '6px 12px', 
              fontSize: '12px', 
              cursor: hasSave ? 'pointer' : 'not-allowed',
              borderColor: hasSave ? 'var(--neon-yellow)' : 'rgba(255,255,255,0.06)',
              color: hasSave ? 'var(--neon-yellow)' : 'var(--text-muted)',
              background: hasSave ? 'rgba(255, 238, 0, 0.03)' : 'rgba(255,255,255,0.01)',
              opacity: hasSave ? 1 : 0.4
            }}
            disabled={!hasSave}
            onClick={() => setSaveLoadType('loadSelect')}
            title={hasSave ? "選擇並載入特定槽位的傳奇進度" : "目前本機無任何存檔"}
          >
            📂 讀檔
          </button>

          <div className="stat-badge gold" title="冒險金幣，可用於友好商店與訓練場">
            💰 <span style={{ marginLeft: '4px' }}>{gold}</span> G
          </div>
          <div className="stat-badge steps" title="投擲骰子進行探索的總次數">
            🎲 <span style={{ marginLeft: '4px' }}>{steps}</span> 步
          </div>
          <div className="stat-badge pokedex" title="已成功收服並登錄至圖鑑的寶可夢數量">
            📖 <span style={{ marginLeft: '4px' }}>{caughtIds.length} / {POKEMON_DATABASE.length}</span> 隻
          </div>
        </div>
      </div>

      {/* 主體格局 */}
      <div className="main-layout">
        
        {/* 左側環形棋盤 */}
        <GameBoard playerPos={playerPos} isMoving={isMoving} trainerAvatar={selectedTrainer?.avatar} mapLocations={activeMapLocations} currentChapter={currentChapter}>
          <div className="map-core-landmark">
            <div className="landmark-badge">
              {currentChapter === 1 ? 'KANTO' : 'SINNOH'}
            </div>
            <h2 className="landmark-title">
              {currentChapter === 1 ? '關都地區' : '神奧地區'}
            </h2>
            <div className="landmark-subtitle">
              {currentChapter === 1 ? '⚓ 訓練師的蔚藍啟航之地' : '🏔️ 挑戰極限的終極之巔'}
            </div>
          </div>
        </GameBoard>

        {/* 右側資訊側欄 */}
        <div className="sidebar">
          {/* 🎲 冒險控制中心 (骰子面板獨立於棋盤外，防範平移鏡頭裁剪，提供 100% 穩定控制) */}
          <div className="adventure-control-panel glass-panel animate-float">
            <div className="panel-title-pixel">
              🎲 冒險控制中心
            </div>
            <div className="adventure-dice-box">
              <Dice 
                rollValue={rollValue} 
                isRolling={isRolling} 
                onRoll={rollDice} 
              />
            </div>
            <button 
              className="neon-button roll-action-btn" 
              onClick={rollDice} 
              disabled={isRolling || isMoving || !!activeModal}
              style={{ width: '100%', padding: '12px', fontSize: '13px' }}
            >
              {isMoving ? '🐾 角色移動中...' : '🎲 拋擲骰子 (ROLL)'}
            </button>
          </div>

          {/* 我的夥伴面板 */}
          {partner && (
            <div className="partner-panel glass-panel">
              <div className="panel-header" style={{ gap: '8px', display: 'flex', alignItems: 'center' }}>
                {selectedTrainer && (
                  <img 
                    src={selectedTrainer.avatar} 
                    alt={selectedTrainer.name} 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: `1.5px solid ${selectedTrainer.color}`
                    }}
                  />
                )}
                <span>{selectedTrainer ? `${selectedTrainer.name}的夥伴` : '出戰夥伴'}</span>
                <span className="partner-level" style={{ marginLeft: 'auto' }}>Lv.{partner.level}</span>
              </div>
              <div className="partner-avatar">
                <img src={partner.sprite} alt={partner.name} />
                <div className="partner-info">
                  <span className="partner-name">{partner.name}</span>
                  <span className="cell-desc" style={{ color: 'var(--neon-blue)', fontWeight: 800 }}>
                    {partner.type}屬性
                  </span>
                </div>
              </div>

              {/* 夥伴 HP 條 */}
              <div style={{ marginTop: '12px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span>生命值 HP</span>
                  <span>{partner.hp} / {partner.maxHp}</span>
                </div>
                <div className="hp-bar-container">
                  <div 
                    className={`hp-bar-fill ${partner.hp / partner.maxHp < 0.25 ? 'danger' : partner.hp / partner.maxHp < 0.5 ? 'warning' : ''}`}
                    style={{ width: `${(partner.hp / partner.maxHp) * 100}%` }}
                  />
                </div>
              </div>

              {/* 屬性格 */}
              <div className="partner-stats-grid">
                <div className="stat-box">
                  <div>基礎攻擊力</div>
                  <div className="val" style={{ color: 'var(--neon-orange)' }}>🗡️ {partner.atk}</div>
                </div>
                <div className="stat-box">
                  <div>夥伴經驗值</div>
                  <div className="val" style={{ color: 'var(--neon-blue)' }}>✨ {partner.exp} / {partner.maxExp}</div>
                </div>
              </div>
            </div>
          )}

          {/* 我的夥伴背包隊伍 (可以隨時切換主力) */}
          {myPokemons.length > 0 && (
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="panel-header" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800 }}>🎒 夥伴陣容背包 ({myPokemons.length})</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>點擊可隨時切換主力</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                {myPokemons.map((poke) => {
                  const isActive = poke.id === partner.id;
                  return (
                    <div
                      key={poke.id}
                      onClick={() => {
                        if (isActive) return;
                        handleSwitchPartner(poke);
                      }}
                      className="glass-panel"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        cursor: isActive ? 'default' : 'pointer',
                        borderColor: isActive ? 'var(--neon-green)' : 'rgba(255,255,255,0.06)',
                        background: isActive ? 'rgba(57, 255, 20, 0.05)' : 'rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.2s ease',
                        borderRadius: '8px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                          e.currentTarget.style.transform = 'translateX(2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                          e.currentTarget.style.transform = 'none';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img 
                          src={poke.sprite} 
                          alt={poke.name} 
                          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                        />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: poke.color }}>{poke.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            Lv.{poke.level} • {poke.type}系
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isActive ? (
                          <span style={{ fontSize: '10px', color: 'var(--neon-green)', fontWeight: 800, background: 'rgba(57, 255, 20, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            出戰中
                          </span>
                        ) : (
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                            點擊出戰
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 圖鑑進度面板 */}
          <Pokedex caughtIds={caughtIds} />
        </div>
      </div>

      {/* ==========================================
          各式各樣的彈窗與互動事件 (Modals)
          ========================================== */}

      {/* 0. 精美的主畫面 (Title Screen) */}
      {activeModal === 'titleScreen' && (
        <div 
          className="overlay-screen title-screen-overlay" 
          style={{ background: '#03040b', zIndex: 1100, padding: 0, overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => {
            // 🌈 遊戲設計大師全螢幕點擊互動保險：只要玩家點擊主畫面任何一處，若音樂目前為靜音或未播放，即主動嘗試解靜音並啟動音樂播放，繞過自動播放政策！
            if (isMuted) {
              setIsMuted(false);
              if (bgmRef.current) {
                bgmRef.current.muted = false;
                bgmRef.current.play().then(() => {
                  console.log("全螢幕互動點擊：背景音樂成功啟動！");
                }).catch(err => {
                  console.log("全螢幕互動點擊啟動背景音樂受阻：", err.message);
                });
              }
            }
          }}
        >
          {/* 🎵 右上角電競奢華霓虹音樂開關 (提供玩家主動控制，且預防預設靜音) */}
          <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1200 }}>
            <button 
              className="stat-badge neon-button" 
              style={{ 
                padding: '10px 18px', 
                fontSize: '14px', 
                cursor: 'pointer',
                borderColor: isMuted ? 'rgba(255,255,255,0.1)' : '#00e5ff',
                color: isMuted ? 'rgba(255,255,255,0.6)' : '#00e5ff',
                background: isMuted ? 'rgba(255,255,255,0.02)' : 'rgba(0,229,255,0.12)',
                boxShadow: isMuted ? 'none' : '0 0 15px rgba(0, 229, 255, 0.4)',
                borderRadius: '30px',
                transition: 'all 0.3s ease'
              }}
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡到全螢幕 onClick，防範衝突
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (bgmRef.current) {
                  bgmRef.current.muted = nextMute;
                  if (!nextMute) {
                    bgmRef.current.play().catch(err => console.log("音樂開關手動啟動失敗：", err.message));
                  }
                }
              }}
            >
              {isMuted ? '🔇 音樂：關' : '🔊 音樂：開'}
            </button>
          </div>
          
          {/* 1. 底層：滿版電競氛圍環境光 (Ambient blur background) */}
          <div className="title-ambient-bg" style={{ backgroundImage: 'url(/images/pokemon_title_169.png)' }}></div>
          <div className="title-ambient-overlay"></div>

          {/* 2. 頂層：前置大廳容器 (Lobby Container) */}
          <div className="title-lobby-container">
            
            {/* 上半部：精美高清全明星大亂鬥卡片 (Championship poster card) */}
            <div className="title-poster-wrapper animate-float">
              <img 
                src="/images/pokemon_title_169.png" 
                alt="Pokemon Championship Key Visual" 
                className="title-poster-card"
              />
              <div className="title-poster-neon-border"></div>
            </div>

            {/* 下半部：大氣文字、標題與選單互動 */}
            <div className="title-controls-zone">
              {/* 炫彩璀璨黃金霓虹主標題 */}
              <h1 className="title-game-logo">
                寶可夢大富翁
                <span className="title-subtitle">訓練師之巔 · 蔚藍啟航</span>
              </h1>

              <div className="title-menu-box">
                {/* 第一階段：點擊開始 */}
                {!showTitleMenu ? (
                  <div 
                    className="tap-to-start animate-pulse" 
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡到全螢幕 onClick
                      setShowTitleMenu(true);
                      // 玩家與網頁產生首次互動，強制解除靜音並順暢播放 BGM (無需重複 load 造成非同步中斷)
                      setIsMuted(false);
                      if (bgmRef.current) {
                        bgmRef.current.muted = false;
                        bgmRef.current.play().then(() => {
                          console.log("BGM 透過 TAP TO START 成功啟動播放！");
                        }).catch(err => {
                          console.log("BGM 透過 TAP TO START 播放失敗：", err.message);
                        });
                      }
                    }}
                  >
                    👉 點擊開始冒險 (Tap to Start) 👈
                  </div>
                ) : (
                  /* 第二階段：主功能按鈕 */
                  <div className="title-buttons-wrapper">
                    <button 
                      className="title-action-btn new-game-btn neon-btn-green"
                      onClick={() => {
                        setActiveModal('partnerSelect');
                      }}
                    >
                      🌟 玩新遊戲 (NEW GAME)
                    </button>
                    <button 
                      className="title-action-btn load-game-btn neon-btn-yellow"
                      onClick={() => {
                        setSaveLoadType('loadSelect');
                      }}
                    >
                      📂 載入進度 (LOAD GAME)
                    </button>
                  </div>
                )}
              </div>

              {/* 著作權聲明與底欄 */}
              <div className="title-footer-lobby">
                © 2026 David & Antigravity. All Rights Reserved. Sinnoh & Paldea Expansion.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 1. 遊戲起始：訓練師五選一 */}
      {activeModal === 'partnerSelect' && (
        <div className="overlay-screen">
          <div className="screen-card glass-panel" style={{ maxWidth: '950px', width: '90%' }}>
            <div className="panel-header" style={{ justifyContent: 'center' }}>
              <span className="pixel-title" style={{ fontSize: '18px', letterSpacing: '2px' }}>🌟 選擇你的傳奇訓練師 🌟</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '10px 0 25px', textAlign: 'center', lineHeight: '1.6' }}>
              大木博士：「哈囉！歡迎來到寶可夢大富翁世界！<br />
              這一次，請挑選你想扮演的<b>經典訓練師</b>。每位訓練師都有其獨特的初始夥伴與戰鬥流派特色！」
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
              {TRAINERS_DATABASE.map((trainer) => {
                const partnerBase = POKEMON_DATABASE.find(p => p.id === trainer.partnerId);
                return (
                  <div 
                    key={trainer.id} 
                    className="glass-panel trainer-select-card"
                    style={{ 
                      padding: '20px 12px', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      border: `1px solid ${trainer.color}30`,
                      background: `linear-gradient(180deg, ${trainer.color}0a 0%, rgba(0,0,0,0.6) 100%)`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '12px'
                    }}
                    onClick={() => handleSelectTrainer(trainer)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = trainer.color;
                      e.currentTarget.style.boxShadow = `0 8px 24px ${trainer.color}45`;
                      e.currentTarget.style.transform = 'translateY(-6px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = trainer.color + '30';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {/* 訓練師主題色發光背景圓 */}
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: trainer.color,
                      opacity: 0.1,
                      filter: 'blur(20px)',
                      zIndex: 0
                    }} />

                    {/* 訓練師頭像 */}
                    <div style={{ position: 'relative', zIndex: 1, marginBottom: '12px' }}>
                      <img 
                        src={trainer.avatar} 
                        alt={trainer.name} 
                        style={{ 
                          width: '90px', 
                          height: '90px', 
                          borderRadius: '50%', 
                          objectFit: 'cover',
                          border: `3px solid ${trainer.color}`,
                          boxShadow: `0 0 10px ${trainer.color}40`
                        }} 
                      />
                      {/* 初始夥伴小頭像掛件 */}
                      {partnerBase && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-5px',
                          right: '-5px',
                          background: 'rgba(5, 7, 18, 0.9)',
                          border: `1.5px solid ${partnerBase.color}`,
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                        }}>
                          <img 
                            src={partnerBase.sprite} 
                            alt={partnerBase.name} 
                            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                          />
                        </div>
                      )}
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
                      <div style={{ fontWeight: 900, fontSize: '16px', color: '#fff', marginBottom: '2px' }}>{trainer.name}</div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: trainer.color, 
                        fontWeight: 700, 
                        marginBottom: '8px',
                        background: `${trainer.color}15`,
                        padding: '2px 6px',
                        borderRadius: '10px',
                        display: 'inline-block'
                      }}>
                        {trainer.title}
                      </div>
                      
                      <div style={{ 
                        fontSize: '11px', 
                        color: 'var(--text-secondary)', 
                        lineHeight: '1.4',
                        height: '56px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: '10px',
                        padding: '0 4px'
                      }}>
                        {trainer.desc}
                      </div>

                      {partnerBase && (
                        <div style={{ 
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          paddingTop: '8px',
                          fontSize: '11px',
                          color: 'var(--text-muted)'
                        }}>
                          初始夥伴: <span style={{ color: partnerBase.color, fontWeight: 700 }}>{partnerBase.name}</span> ({partnerBase.type}系)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. 遭遇野生對戰捕捉彈窗 */}
      {activeModal === 'battle' && wildPokemon && partner && (
        <BattleScreen
          wildPokemon={wildPokemon}
          partner={partner}
          bag={bag}
          onBattleEnd={handleBattleEnd}
          updateBag={updateBag}
          damagePartner={damagePartner}
          healPartner={healPartner}
        />
      )}

      {/* 3. 友好商店彈窗 */}
      {activeModal === 'mart' && (
        <PokeMart
          gold={gold}
          bag={bag}
          updateBag={updateBag}
          updateGold={updateGold}
          hasShipLicense={hasShipLicense}
          currentChapter={currentChapter}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 4. 訓練場彈窗 */}
      {activeModal === 'gym' && partner && (
        <TrainingGym
          gold={gold}
          partner={partner}
          bag={bag}
          updateBag={updateBag}
          updateGold={updateGold}
          trainPartner={trainPartner}
          handleLevelUp={handleLevelUp}
          onBranchEvolve={handleBranchEvolve}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 5. 寶可夢中心恢復彈窗 */}
      {activeModal === 'center' && partner && (
        <PokeCenter
          partner={partner}
          fullyHealPartner={fullyHealPartner}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 6. 隨機事件彈窗 */}
      {activeModal === 'event' && currentEvent && (
        <div className="overlay-screen">
          <div className="screen-card glass-panel" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="panel-header" style={{ justifyContent: 'center' }}>
              <span style={{ color: 'var(--neon-purple)', fontSize: '16px' }}>❓ 隨機遭遇事件 (Event)</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
              <span style={{ fontSize: '48px' }}>🎲</span>
              
              <div style={{ fontSize: '13px', lineHeight: '1.6', fontWeight: 600 }}>
                {currentEvent.text}
              </div>

              <button className="neon-button" style={{ width: '100%' }} onClick={handleEventExecute}>
                確認並繼續
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. 終極收集齊全：勝利宣告畫面 */}
      {activeModal === 'victory' && (
        <div className="overlay-screen" style={{ background: 'rgba(5, 7, 18, 0.95)' }}>
          <div className="screen-card glass-panel congrats-card" style={{ maxWidth: '500px', borderColor: 'var(--neon-yellow)' }}>
            <span style={{ fontSize: '56px', animation: 'bounce 0.5s infinite alternate' }}>🏆</span>
            <div className="pixel-title">
              恭喜你！<br />
              成為寶可夢大師！🎉
            </div>
            
            <img src={POKEMON_DATABASE[8].sprite} alt="Mewtwo" /> {/* 超夢圖示 */}

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              你成功在大富翁地圖中探索所有險惡地形，<br />
              並以驚人的耐心與高超的策略收服了全圖鑑 <b>{POKEMON_DATABASE.length}</b> 隻寶可夢！<br />
              大木博士將為你的冒險歷程頒發終極榮譽徽章！
            </p>

            <div style={{ 
              background: 'rgba(255, 238, 0, 0.05)', 
              border: '1px solid var(--neon-yellow)',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '11px',
              color: 'var(--neon-yellow)',
              width: '100%'
            }}>
              ⭐ 冒險數據總結：總前進步數 {steps} 步，結餘金幣 {gold} G
            </div>

            <button 
              className="neon-button" 
              style={{ width: '100%', borderColor: 'var(--neon-yellow)', color: 'var(--neon-yellow)' }}
              onClick={() => {
                // 遊戲重新開始
                setGold(300);
                setSteps(0);
                setPlayerPos(0);
                setBag({
                  pokeball: 5,
                  greatBall: 2,
                  ultraBall: 0,
                  potion: 2,
                  superPotion: 0,
                  maxPotion: 0,
                  shipTicket: 0,
                  fireStone: 0,
                  thunderStone: 0,
                  waterStone: 0,
                  kingRock: 0
                });
                setCaughtIds([]);
                setPartner(null);
                setActiveModal('partnerSelect');
              }}
            >
              🔄 開啟新的冒險旅程
            </button>
          </div>
        </div>
      )}
      {/* 8. 光芒進化特效 Overlay */}
      {evolvingData && (
        <div className="overlay-screen" style={{ background: 'rgba(5, 7, 18, 0.96)', zIndex: 1000 }}>
          <div className="screen-card glass-panel evolution-card" style={{ 
            maxWidth: '550px', 
            textAlign: 'center', 
            border: `2px solid ${evolvingData.to.color}`,
            boxShadow: `0 0 30px ${evolvingData.to.color}60`,
            padding: '40px 30px'
          }}>
            {/* 進化光芒特效背景 */}
            <div className="evolution-glow-bg" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '350px',
              height: '350px',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${evolvingData.to.color}25 0%, transparent 70%)`,
              animation: 'spin 10s linear infinite',
              zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="pixel-title" style={{ color: 'var(--neon-yellow)', fontSize: '20px', animation: 'bounce 0.8s infinite alternate' }}>
                ✨ 噢！夥伴的樣子有點奇怪...！ ✨
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '10px 0 30px' }}>
                「{evolvingData.from.name}」在訓練場的激發下，體內深處湧現出了不可思議的強烈能量！
              </p>

              {/* 進化對比大圖區 */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', margin: '30px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img 
                    src={evolvingData.from.sprite} 
                    alt={evolvingData.from.name} 
                    style={{ width: '80px', height: '80px', objectFit: 'contain', opacity: 0.6 }} 
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>{evolvingData.from.name}</div>
                </div>

                <span style={{ fontSize: '28px', color: 'var(--neon-yellow)', animation: 'pulse 1s infinite' }}>➔</span>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img 
                    src={evolvingData.to.sprite} 
                    alt={evolvingData.to.name} 
                    className="evolved-pokemon-sprite"
                    style={{ 
                      width: '130px', 
                      height: '130px', 
                      objectFit: 'contain', 
                      filter: `drop-shadow(0 0 15px ${evolvingData.to.color})`,
                      animation: 'evolvePulse 2s infinite ease-in-out'
                    }} 
                  />
                  <div style={{ fontSize: '14px', fontWeight: 900, color: evolvingData.to.color, marginTop: '6px' }}>
                    {evolvingData.to.name} 🎉
                  </div>
                </div>
              </div>

              {/* 進化數值突破 */}
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.4)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '15px',
                fontSize: '12px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '25px'
              }}>
                <div style={{ color: 'var(--neon-yellow)', fontWeight: 800, textAlign: 'center', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px', marginBottom: '4px' }}>
                  📈 進化潛能全面解鎖！
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>最大生命值 Max HP</span>
                  <span style={{ color: 'var(--neon-green)', fontWeight: 800 }}>
                    {evolvingData.from.maxHp} ➔ {evolvingData.to.maxHp} (+50 點!)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>基礎攻擊力 ATK</span>
                  <span style={{ color: 'var(--neon-orange)', fontWeight: 800 }}>
                    {evolvingData.from.atk} ➔ {evolvingData.to.atk} (+15 點!)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>解鎖終極奧義招式</span>
                  <span style={{ color: evolvingData.to.color, fontWeight: 800 }}>
                    {evolvingData.to.skills[1]?.name || '終極技能'} (威力 {evolvingData.to.skills[1]?.power || 75}!)
                  </span>
                </div>
              </div>

              <button 
                className="neon-button" 
                style={{ width: '100%', borderColor: 'var(--neon-yellow)', color: 'var(--neon-yellow)' }}
                onClick={confirmEvolution}
              >
                ⚡ 太棒了！帶著新夥伴啟程冒險！ ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. 多槽位存取檔 Overlay */}
      {saveLoadType && (
        <div className="overlay-screen" style={{ background: 'rgba(5, 7, 18, 0.93)', zIndex: 1100 }}>
          <div className="screen-card glass-panel save-load-card" style={{ padding: '30px' }}>
            <div className="pixel-title" style={{ color: saveLoadType === 'saveSelect' ? 'var(--neon-green)' : 'var(--neon-yellow)', fontSize: '26px' }}>
              {saveLoadType === 'saveSelect' ? '💾 儲存遊戲進度' : '📂 載入遊戲進度'}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', textAlign: 'center', fontWeight: 600 }}>
              {saveLoadType === 'saveSelect' 
                ? '請選擇一個手動存檔槽位來保存您當前的冒險成果，這會避免任何背景自動覆蓋。' 
                : '請選擇一個歷史手動槽位或歷史存檔來還原您之前的精彩冒險旅程。'}
            </p>
 
            <div className="slots-container" style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', flexGrow: 1, overflowY: 'auto', paddingRight: '6px', marginBottom: '15px' }}>
              {['slot_1', 'slot_2', 'slot_3'].map((slotId) => {
                const info = getSlotInfo(slotId, saveTrigger);
                const isOccupied = !!info;
                const trainerColor = info?.selectedTrainer?.color || 'var(--text-muted)';
                const borderStyle = isOccupied 
                  ? { borderColor: trainerColor, boxShadow: `0 0 15px ${trainerColor}40` } 
                  : { borderColor: 'rgba(255,255,255,0.06)' };
 
                return (
                  <div 
                    key={slotId} 
                    className={`slot-item glass-panel ${isOccupied ? 'occupied' : 'empty'}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '24px 30px', /* 顯著增加 padding，原為 15px 20px */
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      border: '1.8px solid',
                      background: isOccupied ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                      position: 'relative',
                      ...borderStyle
                    }}
                  >
                    {/* 左側頭像 */}
                    <div style={{ marginRight: '24px', flexShrink: 0 }}>
                      {isOccupied && info.selectedTrainer?.avatar ? (
                        <img 
                          src={info.selectedTrainer.avatar} 
                          alt={info.selectedTrainer.name} 
                          style={{
                            width: '76px', /* 顯著放大，原為 56px */
                            height: '76px',
                            borderRadius: '50%',
                            border: `2.5px solid ${trainerColor}`,
                            boxShadow: `0 0 12px ${trainerColor}60`,
                            objectFit: 'cover',
                            background: 'rgba(0,0,0,0.3)'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '76px', /* 顯著放大，與有存檔時的 76px 對齊 */
                          height: '76px',
                          borderRadius: '50%',
                          border: '2.5px dashed rgba(255,255,255,0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          color: 'var(--text-muted)',
                          background: 'rgba(255,255,255,0.01)'
                        }}>
                          ❓
                        </div>
                      )}
                    </div>
 
                    {/* 中間存檔中繼資訊 */}
                    <div style={{ flexGrow: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>槽位 {slotId.replace('slot_', '')}</span>
                        {isOccupied && (
                          <span style={{ fontSize: '11.5px', padding: '3px 8px', borderRadius: '4px', background: `${trainerColor}20`, color: trainerColor, border: `1px solid ${trainerColor}40`, fontWeight: 800 }}>
                            {info.selectedTrainer.name}
                          </span>
                        )}
                      </div>
                      
                      {isOccupied ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 700 }}>
                          <div>👤 訓練師: <span style={{ color: trainerColor, fontWeight: 800 }}>{info.selectedTrainer.name}</span></div>
                          <div>💰 金幣: <span style={{ color: 'var(--neon-yellow)', fontWeight: 800 }}>{info.gold} G</span></div>
                          <div>🕒 時間: <span style={{ color: 'var(--text-muted)' }}>{new Date(info.saveTime).toLocaleString('zh-TW', { hour12: false })}</span></div>
                          <div>📖 圖鑑: <span style={{ color: 'var(--neon-blue)', fontWeight: 800 }}>{info.caughtIds?.length || 1} / {POKEMON_DATABASE.length} 隻</span></div>
                        </div>
                      ) : (
                        <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 600 }}>
                          ✨ [ 槽位空白 - 可建立新進度 ]
                        </div>
                      )}
                    </div>

                    {/* 右側按鈕動作 */}
                    <div style={{ marginLeft: '15px', flexShrink: 0 }}>
                      {saveLoadType === 'saveSelect' ? (
                        <button 
                          className="neon-button" 
                          style={{
                            padding: '6px 12px',
                            fontSize: '11px',
                            borderColor: isOccupied ? 'var(--neon-red)' : 'var(--neon-green)',
                            color: isOccupied ? 'var(--neon-red)' : 'var(--neon-green)',
                            background: isOccupied ? 'rgba(255, 7, 58, 0.05)' : 'rgba(57, 255, 20, 0.05)',
                          }}
                          onClick={() => {
                            if (isOccupied) {
                              if (window.confirm(`⚠️ 您確定要覆蓋 槽位 ${slotId.replace('slot_', '')} 的存檔嗎？\n這將永遠刪除該槽位中【${info.selectedTrainer.name}】的進度。`)) {
                                saveGame(slotId, true);
                              }
                            } else {
                              saveGame(slotId, true);
                            }
                          }}
                        >
                          {isOccupied ? '⚠️ 覆蓋存檔' : '💾 儲存至此'}
                        </button>
                      ) : (
                        <button 
                          className="neon-button" 
                          disabled={!isOccupied}
                          style={{
                            padding: '6px 12px',
                            fontSize: '11px',
                            borderColor: isOccupied ? 'var(--neon-yellow)' : 'rgba(255,255,255,0.06)',
                            color: isOccupied ? 'var(--neon-yellow)' : 'var(--text-muted)',
                            background: isOccupied ? 'rgba(255, 238, 0, 0.05)' : 'rgba(255,255,255,0.01)',
                            opacity: isOccupied ? 1 : 0.4,
                            cursor: isOccupied ? 'pointer' : 'not-allowed'
                          }}
                          onClick={() => loadGame(slotId)}
                        >
                          📂 載入進度
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Legacy 歷史相容性存檔單獨呈列 */}
              {saveLoadType === 'loadSelect' && localStorage.getItem('pokemon_monopoly_save') && (() => {
                const info = getSlotInfo('legacy', saveTrigger);
                if (!info) return null;
                const trainerColor = info.selectedTrainer?.color || 'var(--neon-purple)';
                return (
                  <div 
                    className="slot-item glass-panel occupied legacy-slot"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: '1.5px dashed var(--neon-purple)',
                      background: 'rgba(156, 39, 176, 0.02)',
                      marginTop: '10px'
                    }}
                  >
                    <div style={{ marginRight: '20px', flexShrink: 0 }}>
                      {info.selectedTrainer?.avatar ? (
                        <img 
                          src={info.selectedTrainer.avatar} 
                          alt={info.selectedTrainer.name} 
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            border: `2px solid var(--neon-purple)`,
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{ width: '46px', height: '46px', borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❓</div>
                      )}
                    </div>

                    <div style={{ flexGrow: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--neon-purple)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>⚡ 偵測到歷史舊存檔</span>
                        <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '3px', background: 'rgba(156, 39, 176, 0.15)', color: 'var(--neon-purple)' }}>
                          舊制相容
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 10px', fontSize: '10px', color: 'var(--text-secondary)' }}>
                        <div>👤 角色: <span style={{ color: trainerColor }}>{info.selectedTrainer?.name || '未知'}</span></div>
                        <div>💰 金幣: {info.gold} G</div>
                        <div>🕒 時間: <span style={{ color: 'var(--text-muted)' }}>{info.saveTime ? new Date(info.saveTime).toLocaleString('zh-TW', { hour12: false }) : '未知'}</span></div>
                        <div>📖 圖鑑: {info.caughtIds?.length || 1} 隻</div>
                      </div>
                    </div>

                    <div style={{ marginLeft: '15px', flexShrink: 0 }}>
                      <button 
                        className="neon-button" 
                        style={{
                          padding: '5px 10px',
                          fontSize: '10px',
                          borderColor: 'var(--neon-purple)',
                          color: 'var(--neon-purple)',
                          background: 'rgba(156, 39, 176, 0.05)'
                        }}
                        onClick={() => {
                          if (window.confirm('🔮 載入歷史舊存檔將把您帶回先前的旅程。載入後，若要永久保留此進度，請手動儲存至 Slot 1~3！')) {
                            loadGame('legacy');
                          }
                        }}
                      >
                        📂 載入 Legacy
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 底部關閉按鈕 */}
            <div style={{ marginTop: '25px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <button 
                className="neon-button" 
                style={{ 
                  borderColor: 'var(--text-secondary)', 
                  color: 'var(--text-secondary)',
                  background: 'rgba(255,255,255,0.02)',
                  minWidth: '120px'
                }} 
                onClick={() => setSaveLoadType(null)}
              >
                ❌ 關閉視窗
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 寶可夢培育屋 (Daycare) 彈窗 */}
      {activeModal === 'daycare' && (
        <div className="overlay-screen" style={{ background: 'rgba(5, 7, 18, 0.90)', zIndex: 1050 }}>
          <div className="screen-card glass-panel" style={{ maxWidth: '520px', padding: '30px', borderColor: '#ffc107' }}>
            <span style={{ fontSize: '48px', animation: 'bounce 0.8s infinite alternate', display: 'block', marginBottom: '10px' }}>🏠</span>
            <div className="pixel-title" style={{ color: '#ffc107', fontSize: '20px' }}>
              🏠 寶可夢培育屋 (Daycare)
            </div>
            
            <div style={{ margin: '15px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', textAlign: 'left' }}>
              培育屋夫婦：「哈囉！歡迎光臨培育屋！在這裡你可以將閒置的寶可夢夥伴寄存給我們。<b>在大地圖上每走一步，寄養的夥伴都會在背景吸取 10 EXP！</b>再次前來時只需支付少許費用即可領回！」
            </div>

            {daycarePokemon ? (
              // 已經寄存了寶可夢
              <div style={{ background: 'rgba(255, 193, 7, 0.05)', border: '1px solid #ffc107', borderRadius: '12px', padding: '16px', marginTop: '15px', textAlign: 'left' }}>
                <div style={{ fontWeight: 900, color: '#ffc107', fontSize: '14px', borderBottom: '1px solid rgba(255,193,7,0.15)', paddingBottom: '8px', marginBottom: '10px' }}>
                  📈 正在寄養的夥伴：
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={daycarePokemon.sprite} alt={daycarePokemon.name} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '15px' }}>{daycarePokemon.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      等級: <span style={{ color: '#ffc107', fontWeight: 800 }}>Lv.{daycarePokemon.level}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      當前經驗值: {daycarePokemon.exp} / {daycarePokemon.maxExp} EXP
                    </div>
                  </div>
                  <button 
                    className="neon-button" 
                    disabled={gold < 50}
                    style={{ borderColor: gold >= 50 ? '#ffc107' : 'rgba(255,255,255,0.06)', color: gold >= 50 ? '#ffc107' : 'var(--text-muted)' }}
                    onClick={() => {
                      setGold(prev => prev - 50);
                      setMyPokemons(prev => [...prev, daycarePokemon]);
                      setDaycarePokemon(null);
                      alert(`🏠 成功領回「${daycarePokemon.name}」！\n支付了手續費 50 G。夥伴已被接回您的陣容背包中！`);
                      setActiveModal(null);
                    }}
                  >
                    💰 50 G 領回
                  </button>
                </div>
              </div>
            ) : (
              // 沒有寄存寶可夢
              <div style={{ marginTop: '15px', textAlign: 'left' }}>
                <div style={{ fontWeight: 900, fontSize: '13px', color: '#fff', marginBottom: '8px' }}>
                  選擇要寄存的寶可夢 (主力出戰夥伴除外，且身上需保留至少一隻)：
                </div>
                
                {myPokemons.filter(p => p.id !== partner?.id).length > 0 && myPokemons.length > 1 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                    {myPokemons.filter(p => p.id !== partner?.id).map((poke) => (
                      <div 
                        key={poke.id}
                        className="glass-panel"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={poke.sprite} alt={poke.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: poke.color }}>{poke.name}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Lv.{poke.level} • {poke.type}系</div>
                          </div>
                        </div>
                        <button 
                          className="neon-button" 
                          style={{ padding: '4px 10px', fontSize: '11px', borderColor: '#ffc107', color: '#ffc107' }}
                          onClick={() => {
                            setDaycarePokemon(poke);
                            setMyPokemons(prev => prev.filter(p => p.id !== poke.id));
                            alert(`🏠 寄存成功！\n「${poke.name}」已交由培育屋夫婦代為照顧！牠將在背景吸取經驗值！`);
                            setActiveModal(null);
                          }}
                        >
                          🏠 寄存此夥伴
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', textAlign: 'center' }}>
                    ⚠️ 背包中無其他可寄存夥伴 (主力夥伴/初始怪無法被寄養，且身上必須留一隻)。
                  </div>
                )}
              </div>
            )}

            <button 
              className="neon-button" 
              style={{ width: '100%', marginTop: '20px', borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)' }}
              onClick={() => setActiveModal(null)}
            >
              ❌ 關閉培育屋
            </button>
          </div>
        </div>
      )}

      {/* 屬性石礦場 (Stone Mine) 彈窗 */}
      {activeModal === 'stoneMine' && (
        <div className="overlay-screen" style={{ background: 'rgba(5, 7, 18, 0.90)', zIndex: 1050 }}>
          <div className="screen-card glass-panel" style={{ maxWidth: '480px', padding: '30px', borderColor: '#607d8b', textAlign: 'center' }}>
            <span style={{ fontSize: '48px', animation: isMiningStone ? 'bounce 0.2s infinite' : 'none', display: 'block', marginBottom: '10px' }}>
              {isMiningStone ? '⛏️' : '⛏️'}
            </span>
            <div className="pixel-title" style={{ color: '#607d8b', fontSize: '20px' }}>
              ⛏️ 屬性石礦場 (Stone Mine)
            </div>
            
            <div style={{ margin: '15px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              歡迎來到高山礦場！這裡富含地底能量，每次敲擊花費 <b>50 G</b>，有機率挖到極其罕見的<b>火/雷/水之屬性進化石</b>，這也是進化伊布的關鍵道具！
            </div>

            {/* 背包現有寶石展示 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '16px' }}>🔥</span>
                <span style={{ fontWeight: 800, color: '#ff9800' }}>火之石</span>
                <span style={{ color: '#fff', fontWeight: 900 }}>{bag.fireStone || 0} 顆</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '16px' }}>⚡</span>
                <span style={{ fontWeight: 800, color: '#ffeb3b' }}>雷之石</span>
                <span style={{ color: '#fff', fontWeight: 900 }}>{bag.thunderStone || 0} 顆</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '16px' }}>💧</span>
                <span style={{ fontWeight: 800, color: '#2196f3' }}>水之石</span>
                <span style={{ color: '#fff', fontWeight: 900 }}>{bag.waterStone || 0} 顆</span>
              </div>
            </div>

            {/* 採礦動畫或結果 */}
            {isMiningStone && (
              <div style={{ padding: '20px', fontSize: '14px', color: 'var(--neon-blue)', fontWeight: 800 }}>
                咚！鏘！正在用力開鑿岩石中... ⛏️💨
              </div>
            )}

            {!isMiningStone && miningResult && (
              <div style={{
                background: miningResult.type === 'stone' ? 'rgba(0,210,255,0.06)' : miningResult.type === 'gold' ? 'rgba(255,238,0,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${miningResult.type === 'stone' ? 'var(--neon-blue)' : miningResult.type === 'gold' ? 'var(--neon-yellow)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px',
                animation: 'slide-up 0.3s ease'
              }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>
                  {miningResult.type === 'stone' ? '✨' : miningResult.type === 'gold' ? '💰' : '🪨'}
                </span>
                <div style={{ fontWeight: 900, fontSize: '14px', color: miningResult.type === 'stone' ? 'var(--neon-blue)' : miningResult.type === 'gold' ? 'var(--neon-yellow)' : '#fff' }}>
                  {miningResult.name}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {miningResult.desc}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                className="neon-button" 
                disabled={gold < 50 || isMiningStone}
                style={{ flex: 1, borderColor: gold >= 50 ? '#607d8b' : 'rgba(255,255,255,0.06)', color: gold >= 50 ? '#607d8b' : 'var(--text-muted)' }}
                onClick={handleMine}
              >
                ⛏️ 50 G 開鑿礦石
              </button>
              <button 
                className="neon-button" 
                disabled={isMiningStone}
                style={{ flex: 1, borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)' }}
                onClick={() => {
                  setMiningResult(null);
                  setActiveModal(null);
                }}
              >
                ❌ 離開礦場
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 訓練師武道館 (Battle Dojo) 彈窗 */}
      {activeModal === 'dojo' && dojoTrainer && (
        <div className="overlay-screen" style={{ background: 'rgba(5, 7, 18, 0.90)', zIndex: 1050 }}>
          <div className="screen-card glass-panel" style={{ maxWidth: '520px', width: '90%', padding: '30px', borderColor: '#ff9800' }}>
            <span style={{ fontSize: '48px', animation: 'bounce 0.8s infinite alternate', display: 'block', marginBottom: '10px' }}>🥋</span>
            <div className="pixel-title" style={{ color: '#ff9800', fontSize: '20px' }}>
              🥋 訓練師武道館 (Battle Dojo)
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
              {/* 館主肖像與對話 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '12px', width: '100%', border: '1px solid rgba(255,152,0,0.15)' }}>
                <img 
                  src={dojoTrainer.avatar} 
                  alt={dojoTrainer.name} 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3.5px solid #ff9800', boxShadow: '0 0 10px rgba(255,152,0,0.3)' }} 
                />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: '15px', color: '#ff9800' }}>{dojoTrainer.name}</div>
                  <p style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                    {dojoTrainer.dialog}
                  </p>
                </div>
              </div>

              {/* 館主陣容與戰勝獎勵 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', fontSize: '11px', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>🛡️ 館主守備寶可夢</div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '12px' }}>{dojoTrainer.pokemon.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {dojoTrainer.pokemon.type}系 • HP: {dojoTrainer.pokemon.baseHp}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 152, 0, 0.04)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255, 152, 0, 0.15)' }}>
                  <div style={{ color: '#ff9800', fontWeight: 800, marginBottom: '4px' }}>🏆 戰勝專屬獎勵</div>
                  <div style={{ fontWeight: 800, color: 'var(--neon-yellow)' }}>💰 金幣: +{dojoTrainer.rewardGold} G</div>
                  <div style={{ color: 'var(--neon-blue)', fontWeight: 800, fontSize: '10px', marginTop: '2px' }}>
                    🎁 道具: {dojoTrainer.rewardStoneName}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', width: '100%', marginTop: '10px' }}>
                <button 
                  className="neon-button" 
                  style={{ flex: 1, borderColor: '#ff9800', color: '#ff9800', background: 'rgba(255, 152, 0, 0.05)' }}
                  onClick={() => {
                    // 開始特殊的 Dojo 對決！
                    setWildPokemon({
                      ...dojoTrainer.pokemon,
                      isDojo: true,
                      rewardGold: dojoTrainer.rewardGold,
                      rewardStone: dojoTrainer.rewardStone,
                      rewardStoneName: dojoTrainer.rewardStoneName,
                      leaderName: dojoTrainer.name
                    });
                    setActiveModal('battle');
                  }}
                >
                  ⚔️ 接受對決挑戰！
                </button>
                <button 
                  className="neon-button" 
                  style={{ flex: 1, borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)' }}
                  onClick={() => {
                    alert('您默默避開了館主的視線... 溜出了武道館。');
                    setActiveModal(null);
                  }}
                >
                  🏃 暫時避戰離開
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

            {/* 9.5 枯葉市/神奧港口 (Port) 互動彈窗 */}
      {activeModal === 'port' && (
        <div className="overlay-screen" style={{ background: 'rgba(5, 7, 18, 0.90)', zIndex: 1050 }}>
          <div className="screen-card glass-panel" style={{ maxWidth: '480px', textAlign: 'center', borderColor: 'var(--neon-blue)', padding: '30px' }}>
            <span style={{ fontSize: '48px', animation: 'bounce 0.8s infinite alternate', display: 'block', marginBottom: '10px' }}>⚓</span>
            <div className="pixel-title" style={{ color: 'var(--neon-blue)', fontSize: '20px', marginTop: '10px' }}>
              {currentChapter === 1 ? '⚓ 枯葉市港口 (Port)' : '⚓ 神奧港口 (Port)'}
            </div>
            
            <div style={{ margin: '18px 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', textAlign: 'center' }}>
              {currentChapter === 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span>大名鼎鼎的「聖特安努號」豪華郵輪正停泊在此！</span>
                  <span>此郵輪將帶您橫渡海洋，前往野生寶可夢等級 <b>Lv.20+ 以上</b> 的神奧第二大陸。</span>
                  <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🔑 遠航許可證：</span>
                      {hasShipLicense ? <span style={{ color: 'var(--neon-green)', fontWeight: 800 }}>已獲得 ✅</span> : <span style={{ color: 'var(--neon-red)' }}>未獲得 ❌ (需在第一地圖擊敗超夢)</span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>🎫 聖特安努號船票：</span>
                      {bag.shipTicket > 0 ? <span style={{ color: 'var(--neon-green)', fontWeight: 800 }}>有船票 (餘 {bag.shipTicket} 張) ✅</span> : <span style={{ color: 'var(--neon-red)' }}>無船票 ❌ (可於友好商店花費 150 G 購買)</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <span>聖特安努號正靜靜停靠，隨時等待載您返回關都地區。</span>
                  <div style={{ marginTop: '12px', color: 'var(--neon-yellow)', fontWeight: 800 }}>
                    🌟 往返航程免費，不需要任何船票！
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              {currentChapter === 1 ? (
                <button 
                  className="neon-button" 
                  disabled={!hasShipLicense || bag.shipTicket <= 0}
                  style={{ 
                    flex: 1, 
                    borderColor: (hasShipLicense && bag.shipTicket > 0) ? 'var(--neon-blue)' : 'rgba(255,255,255,0.06)',
                    color: (hasShipLicense && bag.shipTicket > 0) ? 'var(--neon-blue)' : 'var(--text-muted)',
                    cursor: (hasShipLicense && bag.shipTicket > 0) ? 'pointer' : 'not-allowed',
                    opacity: (hasShipLicense && bag.shipTicket > 0) ? 1 : 0.4
                  }}
                  onClick={() => {
                    // 扣除一張船票
                    updateBag('shipTicket', -1);
                    setActiveModal(null);
                    setIsSailing(true);
                    
                    // 3 秒後進行大陸轉移
                    setTimeout(() => {
                      setCurrentChapter(2);
                      setPlayerPos(13); // 移動至第二大陸的港口 ID 13
                      setIsSailing(false);
                    }, 3000);
                  }}
                >
                  🚢 登船啟航
                </button>
              ) : (
                <button 
                  className="neon-button" 
                  style={{ flex: 1, borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}
                  onClick={() => {
                    setActiveModal(null);
                    setIsSailing(true);
                    
                    // 3 秒後返回第一大陸
                    setTimeout(() => {
                      setCurrentChapter(1);
                      setPlayerPos(9); // 返回第一大陸的港口 ID 9
                      setIsSailing(false);
                    }, 3000);
                  }}
                >
                  🚢 登船返回關都
                </button>
              )}
              
              <button 
                className="neon-button" 
                style={{ flex: 1, borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)' }}
                onClick={() => setActiveModal(null)}
              >
                ❌ 留在本地
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. 搭船航行轉場動畫 Overlay */}
      {isSailing && (
        <div className="overlay-screen sailing-overlay" style={{ background: 'rgba(5, 7, 18, 0.95)', zIndex: 1200 }}>
          <div className="sailing-container" style={{ textAlign: 'center', position: 'relative' }}>
            {/* 3D 船隻插畫 */}
            <div className="sailing-ship-wrapper" style={{ position: 'relative', marginBottom: '30px' }}>
              <img 
                src="/images/cruise_ship_voyage.png" 
                alt="聖特安努號" 
                className="sailing-ship-img"
                style={{
                  width: '380px',
                  borderRadius: '16px',
                  boxShadow: '0 8px 30px rgba(0, 210, 255, 0.3)',
                  border: '2.5px solid var(--neon-blue)'
                }}
              />
              {/* 海浪泡泡 */}
              <div className="sailing-bubbles"></div>
            </div>

            <div className="pixel-title" style={{ fontSize: '28px', color: 'var(--neon-blue)', textShadow: '0 0 15px rgba(0, 210, 255, 0.6)', animation: 'bounce 0.8s infinite alternate' }}>
              🚢 聖特安努號 遠航中... 🌊
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '15px', letterSpacing: '2px', lineHeight: '1.8' }}>
              「嗚——！」汽笛長鳴！正在乘風破浪穿梭於蔚藍大海...<br />
              <span style={{ color: 'var(--neon-yellow)' }}>
                {currentChapter === 1 ? '✨ 即將踏上高難度的神奧新大陸！ ✨' : '✨ 即將返回關都枯葉市港口！ ✨'}
              </span>
            </p>

            <div className="sailing-progress-bar" style={{
              width: '260px',
              height: '6px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '3px',
              margin: '25px auto 0',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div className="sailing-progress-line" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                background: 'linear-gradient(90deg, var(--neon-blue), var(--neon-yellow))',
                width: '100%',
                animation: 'sailingProgress 3s linear'
              }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
