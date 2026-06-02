import { useState } from 'react';

const TrainingGym = ({ gold, partner, bag, updateBag, updateGold, trainPartner, handleLevelUp, onBranchEvolve, onClose }) => {
  const [successMsg, setSuccessMsg] = useState('');

  const trainingOptions = [
    {
      key: 'hp',
      name: '重訓特訓 (HP 提升)',
      desc: '增加夥伴的最大生命值 (Max HP) +20 點。',
      cost: 100,
      action: () => {
        trainPartner('maxHp', 20);
        setSuccessMsg('✨ 特訓成功！最大 HP 提升了 20 點！');
      }
    },
    {
      key: 'atk',
      name: '沙袋特訓 (攻擊力提升)',
      desc: '增加夥伴的基礎攻擊力 (ATK) +4 點。',
      cost: 120,
      action: () => {
        trainPartner('atk', 4);
        setSuccessMsg('✨ 特訓成功！基礎攻擊力提升了 4 點！');
      }
    },
    {
      key: 'skill',
      name: '招式開發 (技能威力提升)',
      desc: '全面為夥伴所有的招式技能威力 (Power) +3 點。',
      cost: 150,
      action: () => {
        trainPartner('skills', 3);
        setSuccessMsg('✨ 特訓成功！招式威力全面提升了 3 點！');
      }
    }
  ];

  const handleTrain = (option) => {
    if (gold < option.cost) return;
    updateGold(-option.cost);
    option.action();
    
    // 自動清除成功訊息
    setTimeout(() => {
      setSuccessMsg('');
    }, 2500);
  };

  return (
    <div className="overlay-screen">
      <div className="screen-card glass-panel" style={{ maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="panel-header">
          <span style={{ color: 'var(--neon-purple)' }}>🏋️ 寶可夢訓練場 (Training Gym)</span>
          <span className="shop-item-price">💰 {gold} G</span>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '15px', textAlign: 'left' }}>
          歡迎來到道館訓練場！在這裡你可以為你的夥伴 <b>{partner.name}</b> (Lv.{partner.level}) 進行突破與基礎特訓！
        </div>

        {/* 限界突破！等級提升特訓 */}
        <div style={{
          background: partner.exp >= partner.maxExp ? 'linear-gradient(135deg, rgba(255,238,0,0.08), rgba(255,152,0,0.12))' : 'rgba(255,255,255,0.01)',
          border: partner.exp >= partner.maxExp ? '1px solid var(--neon-yellow)' : '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'left',
          boxShadow: partner.exp >= partner.maxExp ? '0 0 15px rgba(255, 238, 0, 0.25)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 900, fontSize: '13px', color: partner.exp >= partner.maxExp ? 'var(--neon-yellow)' : '#fff' }}>
              🌟 限界突破！等級提升 (Level Up)
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--neon-yellow)' }}>150 金幣</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
            當出戰夥伴的經驗值 (EXP) 蓄滿後，在此特訓可提升等級！<br />
            <b>屬性大幅提升：等級 +1，最大 HP +30，基礎 ATK +6！滿足條件將自動觸發進化！</b>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span>特訓經驗值 (EXP)</span>
                <span>{partner.exp} / {partner.maxExp}</span>
              </div>
              <div className="hp-bar-container" style={{ background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '5px' }}>
                <div 
                  className="hp-bar-fill" 
                  style={{ 
                    width: `${Math.min(100, (partner.exp / partner.maxExp) * 100)}%`,
                    background: partner.exp >= partner.maxExp ? 'linear-gradient(90deg, var(--neon-yellow), #ff9800)' : 'var(--neon-blue)',
                    boxShadow: partner.exp >= partner.maxExp ? '0 0 10px var(--neon-yellow)' : 'none',
                    borderRadius: '5px'
                  }}
                />
              </div>
            </div>

            <button
              className="neon-button"
              style={{ 
                padding: '8px 16px', 
                fontSize: '12px', 
                borderColor: partner.exp >= partner.maxExp ? 'var(--neon-yellow)' : 'rgba(255,255,255,0.1)',
                color: partner.exp >= partner.maxExp ? 'var(--neon-yellow)' : 'var(--text-muted)',
                background: partner.exp >= partner.maxExp ? 'rgba(255, 238, 0, 0.1)' : 'transparent',
                cursor: partner.exp >= partner.maxExp ? 'pointer' : 'not-allowed'
              }}
              disabled={partner.exp < partner.maxExp || gold < 150}
              onClick={() => {
                handleLevelUp();
                onClose();
              }}
            >
              升級特訓
            </button>
          </div>
        </div>

        {/* 伊布分支指定進化區 (Eevee Branch Evolution) */}
        {partner.id === 133 && partner.level >= 20 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08), rgba(156, 39, 176, 0.12))',
            border: '1.5px solid var(--neon-blue)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '20px',
            textAlign: 'left',
            boxShadow: '0 0 15px rgba(0, 210, 255, 0.25)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 900, fontSize: '13px', color: 'var(--neon-blue)' }}>
                🧬 伊布特殊分支指定進化
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                需消耗對應屬性進化石
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
              檢測到您的夥伴<b>伊布</b>已達 Lv.{partner.level}！請選擇您想讓牠進化成的屬性形態：
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* 水伊布 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>💧</span>
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ fontWeight: 800, color: '#2196f3' }}>水伊布 (Vaporeon)</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>水屬性 • 擅長高額生命與特防</div>
                  </div>
                </div>
                <button
                  className="neon-button"
                  style={{ 
                    padding: '4px 10px', 
                    fontSize: '11px',
                    borderColor: (bag.waterStone > 0) ? '#2196f3' : 'rgba(255,255,255,0.1)',
                    color: (bag.waterStone > 0) ? '#2196f3' : 'var(--text-muted)',
                    background: (bag.waterStone > 0) ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                    cursor: (bag.waterStone > 0) ? 'pointer' : 'not-allowed'
                  }}
                  disabled={!bag.waterStone || bag.waterStone <= 0}
                  onClick={() => {
                    updateBag('waterStone', -1);
                    onBranchEvolve(134);
                    onClose();
                  }}
                >
                  {bag.waterStone > 0 ? '💧 使用水之石進化' : '💧 缺水之石 (0)'}
                </button>
              </div>

              {/* 雷伊布 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 235, 59, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>⚡</span>
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ fontWeight: 800, color: '#ffeb3b' }}>雷伊布 (Jolteon)</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>電屬性 • 擅長極速打擊與高額爆發</div>
                  </div>
                </div>
                <button
                  className="neon-button"
                  style={{ 
                    padding: '4px 10px', 
                    fontSize: '11px',
                    borderColor: (bag.thunderStone > 0) ? '#ffeb3b' : 'rgba(255,255,255,0.1)',
                    color: (bag.thunderStone > 0) ? '#ffeb3b' : 'var(--text-muted)',
                    background: (bag.thunderStone > 0) ? 'rgba(255, 235, 59, 0.1)' : 'transparent',
                    cursor: (bag.thunderStone > 0) ? 'pointer' : 'not-allowed'
                  }}
                  disabled={!bag.thunderStone || bag.thunderStone <= 0}
                  onClick={() => {
                    updateBag('thunderStone', -1);
                    onBranchEvolve(135);
                    onClose();
                  }}
                >
                  {bag.thunderStone > 0 ? '⚡ 使用雷之石進化' : '⚡ 缺雷之石 (0)'}
                </button>
              </div>

              {/* 火伊布 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 152, 0, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🔥</span>
                  <div style={{ fontSize: '12px' }}>
                    <div style={{ fontWeight: 800, color: '#ff9800' }}>火伊布 (Flareon)</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>火屬性 • 擅長狂暴破壞與物理重擊</div>
                  </div>
                </div>
                <button
                  className="neon-button"
                  style={{ 
                    padding: '4px 10px', 
                    fontSize: '11px',
                    borderColor: (bag.fireStone > 0) ? '#ff9800' : 'rgba(255,255,255,0.1)',
                    color: (bag.fireStone > 0) ? '#ff9800' : 'var(--text-muted)',
                    background: (bag.fireStone > 0) ? 'rgba(255, 152, 0, 0.1)' : 'transparent',
                    cursor: (bag.fireStone > 0) ? 'pointer' : 'not-allowed'
                  }}
                  disabled={!bag.fireStone || bag.fireStone <= 0}
                  onClick={() => {
                    updateBag('fireStone', -1);
                    onBranchEvolve(136);
                    onClose();
                  }}
                >
                  {bag.fireStone > 0 ? '🔥 使用火之石進化' : '🔥 缺火之石 (0)'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 當前夥伴屬性展示 */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          fontSize: '12px',
          textAlign: 'left'
        }}>
          <div>夥伴名稱: <span style={{ color: 'var(--neon-blue)', fontWeight: 800 }}>{partner.name}</span></div>
          <div>目前等級: <span style={{ color: 'var(--neon-yellow)', fontWeight: 800 }}>Lv.{partner.level}</span></div>
          <div>最大 HP: <span style={{ color: 'var(--neon-green)', fontWeight: 800 }}>{partner.maxHp} 點</span></div>
          <div>當前攻擊力: <span style={{ color: 'var(--neon-orange)', fontWeight: 800 }}>{partner.atk} 點</span></div>
        </div>

        {/* 成功特訓訊息 */}
        {successMsg && (
          <div style={{ 
            background: 'rgba(57, 255, 20, 0.1)', 
            border: '1px solid var(--neon-green)',
            color: 'var(--neon-green)',
            borderRadius: '10px',
            padding: '8px',
            fontSize: '12px',
            marginBottom: '15px',
            animation: 'slide-up 0.3s ease'
          }}>
            {successMsg}
          </div>
        )}

        {/* 特訓選項 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'left' }}>付費基礎潛能特訓：</div>
          {trainingOptions.map((option) => {
            const canAfford = gold >= option.cost;
            return (
              <div key={option.key} className="shop-item-row" style={{ marginTop: '0px' }}>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#fff' }}>{option.name}</div>
                  <div className="shop-item-desc" style={{ marginTop: '2px' }}>{option.desc}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', marginLeft: '15px' }}>
                  <span className="shop-item-price">{option.cost} 金幣</span>
                  <button
                    className="neon-button"
                    style={{ padding: '4px 10px', fontSize: '11px', borderColor: 'var(--neon-purple)', color: 'var(--neon-purple)' }}
                    disabled={!canAfford}
                    onClick={() => handleTrain(option)}
                  >
                    特訓
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="neon-button"
          style={{ width: '100%', marginTop: '20px', borderColor: 'var(--text-muted)', color: 'var(--text-secondary)' }}
          onClick={onClose}
        >
          離開訓練場
        </button>
      </div>
    </div>
  );
};

export default TrainingGym;
