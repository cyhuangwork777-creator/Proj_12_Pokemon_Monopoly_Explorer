import { useState } from 'react';

const TrainingGym = ({ gold, partner, updateGold, trainPartner, onClose }) => {
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
      <div className="screen-card glass-panel" style={{ maxWidth: '500px' }}>
        <div className="panel-header">
          <span style={{ color: 'var(--neon-purple)' }}>🏋️ 寶可夢訓練場 (Training Gym)</span>
          <span className="shop-item-price">💰 {gold} G</span>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          歡迎來到道館訓練場！在這裡你可以付費聘請專業教練，為你的夥伴 <b>{partner.name}</b> (Lv.{partner.level}) 進行特訓！
        </div>

        {/* 當前夥伴屬性展示 */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '15px',
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
          {trainingOptions.map((option) => {
            const canAfford = gold >= option.cost;
            return (
              <div key={option.key} className="shop-item-row">
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
          特訓結束
        </button>
      </div>
    </div>
  );
};

export default TrainingGym;
