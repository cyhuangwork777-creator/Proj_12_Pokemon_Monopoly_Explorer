import { useState, useCallback } from 'react';

const BattleScreen = ({ wildPokemon, partner, bag, onBattleEnd, updateBag, damagePartner, healPartner }) => {
  const [wildHp, setWildHp] = useState(wildPokemon.baseHp);
  const [battleLog, setBattleLog] = useState(`野生的 ${wildPokemon.name} 出現了！`);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [isThrowing, setIsThrowing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [, setShakeCount] = useState(0); // 移除 unused var 警告，使用簡短更新
  const [battleState, setBattleState] = useState('fighting'); // fighting, throwing, caught, failed, run

  // 野生寶可夢回合反擊 (用 useCallback 封裝，解決 Math.random 靜態 purity 檢查問題)
  const wildPokemonAttack = useCallback(() => {
    if (wildHp <= 0 || battleState !== 'fighting') return;

    // 隨機挑選技能
    const skill = wildPokemon.skills[Math.floor(Math.random() * wildPokemon.skills.length)];
    const isHit = Math.random() < skill.accuracy;

    setTimeout(() => {
      if (isHit) {
        // 傷害浮動 +-15%
        const dmg = Math.round(skill.power * (0.85 + Math.random() * 0.3));
        const nextHp = Math.max(0, partner.hp - dmg);
        
        damagePartner(dmg); // 直接呼叫父組件方法修改 state，會自動同步回 partner.hp
        
        setBattleLog(`${wildPokemon.name} 使用了「${skill.name}」！造成了 ${dmg} 點傷害。`);

        if (nextHp <= 0) {
          setTimeout(() => {
            setBattleLog(`我方的 ${partner.name} 倒下了... 戰鬥失敗。`);
            setBattleState('failed');
          }, 1200);
        } else {
          setIsMyTurn(true);
        }
      } else {
        setBattleLog(`${wildPokemon.name} 使用了「${skill.name}」，但是沒有命中！`);
        setIsMyTurn(true);
      }
    }, 1000);
  }, [wildHp, battleState, wildPokemon, partner.hp, partner.name, damagePartner]);

  // 我方點擊攻擊 (用 useCallback 封裝)
  const handleAttack = useCallback((skill) => {
    if (!isMyTurn || battleState !== 'fighting') return;
    setIsMyTurn(false);

    const isHit = Math.random() < skill.accuracy;
    if (isHit) {
      const dmg = Math.round(skill.power * (0.85 + Math.random() * 0.3));
      const nextHp = Math.max(0, wildHp - dmg);
      setWildHp(nextHp);
      setBattleLog(`夥伴 ${partner.name} 使用了「${skill.name}」！造成了 ${dmg} 點傷害。`);

      if (nextHp <= 0) {
        setTimeout(() => {
          setBattleLog(`${wildPokemon.name} 體力不支倒下了！趕快趁現在丟精靈球捕捉，或者將其擊敗！`);
          setWildHp(1); // 留 1 滴血供玩家捕捉
          setIsMyTurn(true);
        }, 1200);
      } else {
        setTimeout(() => {
          wildPokemonAttack();
        }, 1200);
      }
    } else {
      setBattleLog(`夥伴 ${partner.name} 使用了「${skill.name}」，但是揮空了！`);
      setTimeout(() => {
        wildPokemonAttack();
      }, 1200);
    }
  }, [isMyTurn, battleState, wildHp, partner.name, wildPokemon.name, wildPokemonAttack]);

  // 使用回復傷藥 (用 useCallback 封裝)
  const handleUsePotion = useCallback(() => {
    if (!isMyTurn || battleState !== 'fighting' || bag.potion <= 0) return;
    if (partner.hp >= partner.maxHp) {
      setBattleLog('夥伴寶可夢的體力已經是滿的了！');
      return;
    }

    setIsMyTurn(false);
    updateBag('potion', -1);
    
    const actualHeal = Math.min(60, partner.maxHp - partner.hp);
    healPartner(actualHeal);

    setBattleLog(`使用了「傷藥」！為 ${partner.name} 回復了 ${actualHeal} 點體力。`);

    setTimeout(() => {
      wildPokemonAttack();
    }, 1200);
  }, [isMyTurn, battleState, bag.potion, partner.hp, partner.maxHp, partner.name, updateBag, healPartner, wildPokemonAttack]);

  // 結算捕捉機率 (用 useCallback 封裝)
  const calculateCatch = useCallback((ballType) => {
    const ballMultiplier = ballType === 'pokeball' ? 1.0 : ballType === 'greatBall' ? 1.6 : 2.6;
    const hpFactor = 1.0 + (1.0 - wildHp / wildPokemon.baseHp) * 2.0;
    const finalRate = wildPokemon.catchRate * ballMultiplier * hpFactor;
    const roll = Math.random();

    console.log(`捕捉計算：基礎=${wildPokemon.catchRate}, 球種倍率=${ballMultiplier}, HP加成=${hpFactor.toFixed(2)}, 最終機率=${(finalRate*100).toFixed(1)}%, 隨機數=${roll.toFixed(3)}`);

    if (roll < finalRate) {
      setBattleLog(`太棒了！成功收服 ${wildPokemon.name}！🎉`);
      setBattleState('caught');
    } else {
      setBattleLog(`哎呀！${wildPokemon.name} 從精靈球裡掙脫了！`);
      setBattleState('fighting');
      
      setTimeout(() => {
        wildPokemonAttack();
      }, 1000);
    }
  }, [wildHp, wildPokemon, wildPokemonAttack]);

  const getBallName = (type) => {
    if (type === 'pokeball') return '普通精靈球';
    if (type === 'greatBall') return '超級球';
    if (type === 'ultraBall') return '高級球';
    return '精靈球';
  };

  // 投擲精靈球 (用 useCallback 封裝)
  const handleThrowBall = useCallback((ballType) => {
    if (!isMyTurn || battleState !== 'fighting' || bag[ballType] <= 0) return;
    setIsMyTurn(false);
    updateBag(ballType, -1);
    setBattleState('throwing');
    setIsThrowing(true);
    setBattleLog(`投出了「${getBallName(ballType)}」！`);

    // 遞迴搖晃精靈球 (移入 handleThrowBall 閉包內部，消滅依賴項警告與 TDZ 錯誤)
    function shakeLoop(count, ballType) {
      if (count <= 3) {
        setTimeout(() => {
          setShakeCount(count + 1);
          if (count === 1) setBattleLog(`搖晃中. . . 咻`);
          if (count === 2) setBattleLog(`搖晃中. . . 咻！緊張時刻！`);
          
          shakeLoop(count + 1, ballType);
        }, 600);
      } else {
        setTimeout(() => {
          setIsShaking(false);
          calculateCatch(ballType);
        }, 600);
      }
    }

    setTimeout(() => {
      setIsThrowing(false);
      setIsShaking(true);
      setShakeCount(1);
      setBattleLog(`搖晃中. . .`);
      shakeLoop(1, ballType);
    }, 800);
  }, [isMyTurn, battleState, bag, updateBag, calculateCatch]);

  return (
    <div className="overlay-screen">
      <div className="screen-card battle-screen-card glass-panel">
        
        {/* 頂部 */}
        <div className="panel-header">
          <span style={{ color: wildPokemon.color }}>⚔️ 野生寶可夢對戰</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            等級: {wildPokemon.rarity}
          </span>
        </div>

        {/* 戰鬥競技場 */}
        <div className="battle-arena">
          
          {/* 我方夥伴 */}
          <div className="battle-pokemon mine">
            <div className="pokemon-status-card">
              <div style={{ fontWeight: 800, fontSize: '13px', display: 'flex', justifycontent: 'space-between' }}>
                <span>{partner.name}</span>
                <span style={{ color: 'var(--neon-yellow)' }}>Lv.{partner.level}</span>
              </div>
              <div className="hp-bar-container">
                <div 
                  className={`hp-bar-fill ${partner.hp / partner.maxHp < 0.2 ? 'danger' : partner.hp / partner.maxHp < 0.5 ? 'warning' : ''}`}
                  style={{ width: `${(partner.hp / partner.maxHp) * 100}%` }}
                />
              </div>
              <div className="hp-text">
                <span>HP</span>
                <span>{partner.hp} / {partner.maxHp}</span>
              </div>
            </div>
            
            <img src={partner.sprite} alt={partner.name} />
          </div>

          {/* 野生寶可夢 */}
          <div className="battle-pokemon wild" style={{ position: 'relative' }}>
            {/* 投球與搖晃特效 */}
            {battleState === 'throwing' && (
              <div className="pokeball-throw-container">
                <div className={`pokeball-sprite ${isThrowing ? 'is-throwing' : ''} ${isShaking ? 'is-shaking' : ''}`} />
              </div>
            )}

            {/* 若已被收服，則不顯示寶可夢圖片，只顯示精靈球 */}
            {battleState === 'caught' ? (
              <div className="pokeball-throw-container">
                <div className="pokeball-sprite" style={{ transform: 'scale(1.2)' }} />
              </div>
            ) : (
              <>
                <div className="pokemon-status-card">
                  <div style={{ fontWeight: 800, fontSize: '13px', display: 'flex', justifycontent: 'space-between' }}>
                    <span>{wildPokemon.name}</span>
                    <span style={{ color: wildPokemon.color }}>{wildPokemon.type}屬性</span>
                  </div>
                  <div className="hp-bar-container">
                    <div 
                      className="hp-bar-fill"
                      style={{ 
                        width: `${(wildHp / wildPokemon.baseHp) * 100}%`,
                        backgroundColor: wildPokemon.color 
                      }}
                    />
                  </div>
                  <div className="hp-text">
                    <span>HP</span>
                    <span>{wildHp} / {wildPokemon.baseHp}</span>
                  </div>
                </div>
                
                <img 
                  src={wildPokemon.sprite} 
                  alt={wildPokemon.name} 
                  style={{ 
                    transition: 'opacity 0.5s ease',
                    opacity: battleState === 'throwing' && isShaking ? 0.3 : 1 
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* 戰鬥文字日誌 */}
        <div className="battle-log" style={{ marginTop: '15px' }}>
          {battleLog}
        </div>

        {/* 下方控制按鈕區 */}
        <div className="battle-controls">
          {battleState === 'fighting' && (
            <>
              {/* 我方招式攻擊按鈕 */}
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>選擇技能招式：</div>
              <div className="action-buttons">
                {partner.skills.map((skill, index) => (
                  <button 
                    key={index} 
                    className="neon-button" 
                    onClick={() => handleAttack(skill)}
                    disabled={!isMyTurn}
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                  >
                    {skill.name} (威力:{skill.power})
                  </button>
                ))}
              </div>

              {/* 使用精靈球或道具 */}
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '8px' }}>投擲精靈球 / 使用藥水：</div>
              <div className="action-buttons">
                <button 
                  className="neon-button"
                  style={{ borderSecondary: '1px solid #ff2a2a', color: '#ff4b4b', padding: '8px 12px', fontSize: '12px' }}
                  disabled={!isMyTurn || bag.pokeball <= 0}
                  onClick={() => handleThrowBall('pokeball')}
                >
                  🔴 普通球 ({bag.pokeball})
                </button>
                <button 
                  className="neon-button"
                  style={{ borderSecondary: '1px solid #2196f3', color: '#3fa9f5', padding: '8px 12px', fontSize: '12px' }}
                  disabled={!isMyTurn || bag.greatBall <= 0}
                  onClick={() => handleThrowBall('greatBall')}
                >
                  🔵 超級球 ({bag.greatBall})
                </button>
                <button 
                  className="neon-button"
                  style={{ borderSecondary: '1px solid var(--neon-yellow)', color: 'var(--neon-yellow)', padding: '8px 12px', fontSize: '12px' }}
                  disabled={!isMyTurn || bag.ultraBall <= 0}
                  onClick={() => handleThrowBall('ultraBall')}
                >
                  🟡 高級球 ({bag.ultraBall})
                </button>
                <button 
                  className="neon-button"
                  style={{ borderSecondary: '1px solid var(--neon-green)', color: 'var(--neon-green)', padding: '8px 12px', fontSize: '12px' }}
                  disabled={!isMyTurn || bag.potion <= 0}
                  onClick={handleUsePotion}
                >
                  🧪 傷藥 ({bag.potion})
                </button>
              </div>

              {/* 逃跑按鈕 */}
              <button 
                className="neon-button" 
                style={{ marginTop: '10px', borderColor: 'var(--text-muted)', color: 'var(--text-secondary)' }}
                onClick={() => onBattleEnd({ success: false, caughtId: null, status: 'escaped' })}
              >
                🏃 撤退逃跑
              </button>
            </>
          )}

          {/* 捕捉成功結算畫面 */}
          {battleState === 'caught' && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button 
                className="neon-button" 
                onClick={() => onBattleEnd({ success: true, caughtId: wildPokemon.id, status: 'caught' })}
              >
                登錄圖鑑並繼續旅程！
              </button>
            </div>
          )}

          {/* 戰鬥失敗結算畫面 */}
          {battleState === 'failed' && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <p style={{ color: 'var(--neon-red)', fontSize: '13px', marginBottom: '10px' }}>夥伴全部失去了戰鬥意志，你損失了 100 金幣，並將被護送到寶可夢中心治療。</p>
              <button 
                className="neon-button" 
                style={{ borderColor: 'var(--neon-red)', color: 'var(--neon-red)' }}
                onClick={() => onBattleEnd({ success: false, caughtId: null, status: 'defeated' })}
              >
                被擔架抬回寶可夢中心
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BattleScreen;
