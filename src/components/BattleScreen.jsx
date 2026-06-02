import { useState, useCallback } from 'react';

const BattleScreen = ({ wildPokemon, partner, bag, onBattleEnd, updateBag, damagePartner, healPartner }) => {
  const [wildHp, setWildHp] = useState(wildPokemon.baseHp);
  const [battleLog, setBattleLog] = useState(`野生的 ${wildPokemon.name} 出現了！`);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [battleState, setBattleState] = useState('fighting'); // fighting, caught, failed, run

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
          setBattleLog(`成功擊敗了野生的 ${wildPokemon.name}！並將其收服！🎉`);
          setBattleState('caught');
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

  // 使用回復藥水 (用 useCallback 封裝，依類型回復百分比最大 HP)
  const handleUsePotionType = useCallback((potionType) => {
    const qty = bag[potionType] || 0;
    if (!isMyTurn || battleState !== 'fighting' || qty <= 0) return;
    if (partner.hp >= partner.maxHp) {
      setBattleLog('夥伴寶可夢的體力已經是滿的了！');
      return;
    }

    setIsMyTurn(false);
    updateBag(potionType, -1);
    
    let healPercent = 0.3;
    let potionName = '普通傷藥';
    if (potionType === 'superPotion') {
      healPercent = 0.6;
      potionName = '好傷藥';
    } else if (potionType === 'maxPotion') {
      healPercent = 1.0;
      potionName = '全滿藥';
    }

    const healAmount = Math.round(partner.maxHp * healPercent);
    const actualHeal = Math.min(healAmount, partner.maxHp - partner.hp);
    healPartner(actualHeal);

    setBattleLog(`使用了「${potionName}」！為 ${partner.name} 回復了 ${actualHeal} 點體力 (${Math.round(healPercent * 100)}%)。`);

    setTimeout(() => {
      wildPokemonAttack();
    }, 1200);
  }, [isMyTurn, battleState, bag, partner.hp, partner.maxHp, partner.name, updateBag, healPartner, wildPokemonAttack]);

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
              <div style={{ fontWeight: 800, fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
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
            {/* 若已被收服，則顯示收服成功的金色發光徽章 */}
            {battleState === 'caught' ? (
              <div className="glass-panel" style={{ 
                padding: '20px 10px', 
                border: '2px solid var(--neon-green)',
                background: 'rgba(57, 255, 20, 0.05)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 0 15px rgba(57, 255, 20, 0.3)',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <img 
                  src={wildPokemon.sprite} 
                  alt={wildPokemon.name} 
                  style={{ width: '100px', height: '100px', filter: 'drop-shadow(0 0 10px rgba(57, 255, 20, 0.5))', objectFit: 'contain' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 900, color: 'var(--neon-green)' }}>
                  💚 收服成功！已加入夥伴陣容
                </span>
              </div>
            ) : (
              <>
                <div className="pokemon-status-card">
                  <div style={{ fontWeight: 800, fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
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
                  style={{ transition: 'opacity 0.5s ease', objectFit: 'contain' }}
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

              {/* 使用藥水或道具 */}
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '8px' }}>使用回復道具：</div>
              <div className="action-buttons" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <button 
                  className="neon-button"
                  style={{ borderColor: 'var(--neon-green)', color: 'var(--neon-green)', padding: '6px 4px', fontSize: '11px' }}
                  disabled={!isMyTurn || (bag.potion || 0) <= 0}
                  onClick={() => handleUsePotionType('potion')}
                >
                  🧪 傷藥 (30%)<br />
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>餘 {(bag.potion || 0)} 瓶</span>
                </button>
                <button 
                  className="neon-button"
                  style={{ borderColor: '#ffeb3b', color: '#ffeb3b', padding: '6px 4px', fontSize: '11px' }}
                  disabled={!isMyTurn || (bag.superPotion || 0) <= 0}
                  onClick={() => handleUsePotionType('superPotion')}
                >
                  🧪 好傷藥 (60%)<br />
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>餘 {(bag.superPotion || 0)} 瓶</span>
                </button>
                <button 
                  className="neon-button"
                  style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)', padding: '6px 4px', fontSize: '11px' }}
                  disabled={!isMyTurn || (bag.maxPotion || 0) <= 0}
                  onClick={() => handleUsePotionType('maxPotion')}
                >
                  🧪 全滿藥 (100%)<br />
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>餘 {(bag.maxPotion || 0)} 瓶</span>
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
              <p style={{ color: 'var(--neon-red)', fontSize: '13px', marginBottom: '10px' }}>夥伴全部失去了戰鬥意志，你損失了一半的金幣，並將被護送到寶可夢中心治療。</p>
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
