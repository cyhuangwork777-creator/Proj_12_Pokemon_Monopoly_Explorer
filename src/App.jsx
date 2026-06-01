import { useState, useEffect, useRef } from 'react';
import './App.css';
import { POKEMON_DATABASE, MAP_LOCATIONS, GAME_EVENTS, TRAINERS_DATABASE } from './data/pokemonData';

// 子組件導入
import GameBoard from './components/GameBoard';
import Dice from './components/Dice';
import Pokedex from './components/Pokedex';
import BattleScreen from './components/BattleScreen';
import PokeMart from './components/PokeMart';
import TrainingGym from './components/TrainingGym';
import PokeCenter from './components/PokeCenter';

function App() {
  // --- 遊戲核心狀態 ---
  const [gold, setGold] = useState(300);
  const [steps, setSteps] = useState(0);
  const [playerPos, setPlayerPos] = useState(0);
  
  // 背景音樂控制 (Ref 與靜音狀態，預設靜音以配合瀏覽器自動播放限制)
  const bgmRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  
  // 背包道具
  const [bag, setBag] = useState({
    pokeball: 5,
    greatBall: 2,
    ultraBall: 0,
    potion: 2
  });

  // 已收服的寶可夢 ID 列表
  const [caughtIds, setCaughtIds] = useState([]);
  
  // 當前選定的訓練師
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  // 玩家擁建立的所有寶可夢列表 (含等級、經驗值等個體屬性)
  const [myPokemons, setMyPokemons] = useState([]);
  
  // 我方夥伴寶可夢 (出戰主力)
  const [partner, setPartner] = useState(null);

  // 正在進行進化的寶可夢數據 (用於光芒進化特效 Overlay)
  const [evolvingData, setEvolvingData] = useState(null);

  // --- 視窗狀態控制 ---
  const [activeModal, setActiveModal] = useState('partnerSelect'); // partnerSelect, battle, mart, gym, center, event, victory
  
  // 遭遇中的野生寶可夢
  const [wildPokemon, setWildPokemon] = useState(null);
  
  // 當前隨機事件
  const [currentEvent, setCurrentEvent] = useState(null);

  // --- 骰子移動狀態 ---
  const [isRolling, setIsRolling] = useState(false);
  const [rollValue, setRollValue] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [remainingSteps, setRemainingSteps] = useState(0);

  // --- 音樂播放控制 Effects ---
  
  // 1. 初始化與同步靜音狀態
  useEffect(() => {
    if (!bgmRef.current) {
      bgmRef.current = new Audio();
      bgmRef.current.loop = true;
      bgmRef.current.volume = 0.22; // 設定舒適的 22% 音量
    }
    bgmRef.current.muted = isMuted;
  }, [isMuted]);

  // 2. 根據當前遊戲畫面 (activeModal) 與狀態自動流暢切換音軌
  useEffect(() => {
    if (!bgmRef.current) return;

    // 以 const 宣告純函數，徹底避免 Let 無效賦值的警告
    const getTargetSrc = () => {
      if (activeModal === 'partnerSelect') return '/audio/title_theme.m4a';
      if (activeModal === 'battle') return '/audio/battle_theme.m4a';
      if (activeModal === 'center') return '/audio/center_theme.m4a';
      if (activeModal === 'victory') return '/audio/title_theme.m4a';
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

    // 當選定初始夥伴（有夥伴）或是處於選定畫面時，自動嘗試播放
    if (partner || activeModal === 'partnerSelect') {
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
  const handleLandingEvent = (pos) => {
    const currentCell = MAP_LOCATIONS[pos];

    // A. 地形格：有機會觸發野生寶可夢遭遇
    if (['grass', 'water', 'rock', 'cave'].includes(currentCell.type)) {
      const rand = Math.random();
      if (rand < 0.85) { // 85% 機率遭遇
        // 隨機抽選該格子配置的出沒寶可夢之一
        const pokemonId = currentCell.pokemonIds[Math.floor(Math.random() * currentCell.pokemonIds.length)];
        const wildBase = POKEMON_DATABASE.find(p => p.id === pokemonId);
        
        // 複製野生寶可夢數值
        setWildPokemon({
          ...wildBase,
          baseHp: Math.round(wildBase.baseHp * (0.9 + Math.random() * 0.2)), // HP 稍微隨機浮動
          currentHp: wildBase.baseHp
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
  };

  // 4. 一格一格前進的大富翁移動邏輯 (使用 React useEffect 進行標準副作用控制)
  useEffect(() => {
    if (remainingSteps <= 0) return;

    const timer = setTimeout(() => {
      // 純數學計算出下一步位置，完全避免 state updater 中的副作用
      const nextPos = (playerPos + 1) % 16;
      setPlayerPos(nextPos);
      
      if (nextPos === 0) {
        setGold((prevGold) => prevGold + 200);
      }

      setRemainingSteps((prev) => prev - 1);

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
  }, [remainingSteps, isMoving, playerPos]);

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
  const handleBattleEnd = ({ success, caughtId, status }) => {
    setActiveModal(null);
    setWildPokemon(null);

    // 成功捕捉並擊敗野生寶可夢
    if (success && caughtId) {
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
  };

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

  // 訓練夥伴提升數值
  const trainPartner = (statKey, amount) => {
    setPartner(prev => {
      if (statKey === 'skills') {
        // 所有招式威力加成
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
        // 如果是提升最大 HP，也把當前 HP 回滿或按比例提升
        hp: statKey === 'maxHp' ? prev.hp + amount : prev.hp
      };
    });
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
        <GameBoard playerPos={playerPos} isMoving={isMoving} trainerAvatar={selectedTrainer?.avatar}>
          <span className="center-title">冒險控制中心</span>
          
          <Dice 
            rollValue={rollValue} 
            isRolling={isRolling} 
            onRoll={rollDice} 
          />
          
          <button 
            className="neon-button" 
            onClick={rollDice} 
            disabled={isRolling || isMoving || !!activeModal}
            style={{ width: '120px' }}
          >
            {isMoving ? '移動中...' : '拋擲骰子'}
          </button>
        </GameBoard>

        {/* 右側資訊側欄 */}
        <div className="sidebar">
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
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 4. 訓練場彈窗 */}
      {activeModal === 'gym' && partner && (
        <TrainingGym
          gold={gold}
          partner={partner}
          updateGold={updateGold}
          trainPartner={trainPartner}
          handleLevelUp={handleLevelUp}
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
                setBag({ pokeball: 5, greatBall: 2, ultraBall: 0, potion: 2 });
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

    </div>
  );
}

export default App;
