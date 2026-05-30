import { useState, useEffect, useRef } from 'react';
import './App.css';
import { POKEMON_DATABASE, MAP_LOCATIONS, GAME_EVENTS } from './data/pokemonData';

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
  
  // 我方夥伴寶可夢 (出戰主力)
  const [partner, setPartner] = useState(null);

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

  // 1. 選擇初始夥伴寶可夢
  const handleSelectPartner = (poke) => {
    const partnerData = {
      ...poke,
      level: 5,
      hp: poke.baseHp,
      maxHp: poke.baseHp,
      atk: poke.baseAtk
    };
    setPartner(partnerData);
    setCaughtIds([poke.id]); // 初始夥伴直接登錄圖鑑
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

    // 成功捕捉
    if (success && caughtId) {
      if (!caughtIds.includes(caughtId)) {
        const nextCaught = [...caughtIds, caughtId];
        setCaughtIds(nextCaught);
        
        // 檢查是否收集齊全 9 隻寶可夢
        if (nextCaught.length === POKEMON_DATABASE.length) {
          setTimeout(() => {
            setActiveModal('victory');
          }, 600);
        }
      }
    }

    // 戰鬥倒下失敗懲罰
    if (status === 'defeated') {
      setGold(prev => Math.max(0, prev - 100)); // 損失 100 金幣
      // 體力設為 1 滴血，並強制傳送到最近的寶可夢中心 (格 8)
      setPartner(prev => ({
        ...prev,
        hp: 1
      }));
      setPlayerPos(8);
      setTimeout(() => {
        setActiveModal('center');
      }, 600);
    }
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
        <GameBoard playerPos={playerPos}>
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
              <div className="panel-header">
                <span>出戰夥伴</span>
                <span className="partner-level">Lv.{partner.level}</span>
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
                  <div>精靈球數量</div>
                  <div className="val" style={{ color: 'var(--neon-blue)' }}>🔴 {bag.pokeball + bag.greatBall + bag.ultraBall}</div>
                </div>
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

      {/* 1. 遊戲起始：夥伴寶可夢三選一 */}
      {activeModal === 'partnerSelect' && (
        <div className="overlay-screen">
          <div className="screen-card glass-panel" style={{ maxWidth: '550px' }}>
            <div className="panel-header" style={{ justifyContent: 'center' }}>
              <span className="pixel-title" style={{ fontSize: '15px' }}>🌟 選擇你的初始冒險夥伴 🌟</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '10px 0 20px' }}>
              大木博士：「哈囉！歡迎來到寶可夢大富翁世界！在開始冒險之前，請從以下三隻極具潛力的寶可夢中選擇一隻做為你的出戰夥伴！」
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              {POKEMON_DATABASE.slice(0, 3).map((poke) => (
                <div 
                  key={poke.id} 
                  className="glass-panel"
                  style={{ 
                    padding: '15px 10px', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    border: `1px solid ${poke.color}30`,
                    background: `linear-gradient(185deg, ${poke.color}08, rgba(0,0,0,0.4))`
                  }}
                  onClick={() => handleSelectPartner(poke)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = poke.color;
                    e.currentTarget.style.boxShadow = `0 0 12px ${poke.color}40`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = poke.color + '30';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <img src={poke.sprite} alt={poke.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                  <div style={{ fontWeight: 800, fontSize: '14px', marginTop: '8px', color: poke.color }}>{poke.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{poke.type}屬性</div>
                </div>
              ))}
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

    </div>
  );
}

export default App;
