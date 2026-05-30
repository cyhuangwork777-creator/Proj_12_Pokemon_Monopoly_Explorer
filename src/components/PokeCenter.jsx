import { useState } from 'react';

const PokeCenter = ({ partner, fullyHealPartner, onClose }) => {
  const [treatmentState, setTreatmentState] = useState('welcome'); // welcome, healing, done

  const handleStartHeal = () => {
    setTreatmentState('healing');

    // 模擬嗶嗶嗶嗶治療時間 (1.8s)
    setTimeout(() => {
      fullyHealPartner();
      setTreatmentState('done');
    }, 1800);
  };

  return (
    <div className="overlay-screen">
      <div className="screen-card glass-panel" style={{ maxWidth: '450px', textAlign: 'center' }}>
        <div className="panel-header" style={{ justifyContent: 'center' }}>
          <span style={{ color: 'var(--neon-red)', fontSize: '18px' }}>🏥 寶可夢中心 (Pokémon Center)</span>
        </div>

        {treatmentState === 'welcome' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
            <span style={{ fontSize: '48px' }}>👩‍⚕️</span>
            <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
              「歡迎來到寶可夢中心！我是喬伊。<br />
              我們會幫你的夥伴寶可夢 <b>{partner.name}</b> 恢復到 100% 的活力，請把牠交給我吧！」
            </div>
            
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              當前 HP: <span style={{ color: 'var(--neon-red)' }}>{partner.hp}</span> / {partner.maxHp}
            </div>

            <button className="neon-button" style={{ width: '100%', borderColor: 'var(--neon-red)', color: 'var(--neon-red)' }} onClick={handleStartHeal}>
              🔌 請幫忙治療寶可夢
            </button>
            <button className="neon-button" style={{ width: '100%', borderColor: 'var(--text-muted)', color: 'var(--text-secondary)' }} onClick={onClose}>
              不用了，謝謝
            </button>
          </div>
        )}

        {treatmentState === 'healing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0', marginTop: '15px' }}>
            <span style={{ fontSize: '48px', animation: 'bounce 0.4s infinite alternate' }}>🔴🔴🔴🔴</span>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-green)', letterSpacing: '1px' }}>
              正在進行體力恢復中...
            </div>
            <div className="hp-bar-container" style={{ width: '80%', height: '6px' }}>
              <div 
                className="hp-bar-fill" 
                style={{ 
                  width: '100%', 
                  background: 'linear-gradient(90deg, var(--neon-red), var(--neon-green))',
                  animation: 'pulse-button 0.6s infinite alternate' 
                }} 
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>嗶—— 嗶—— 嗶—— 嗶—— ♪</div>
          </div>
        )}

        {treatmentState === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
            <span style={{ fontSize: '48px' }}>💖</span>
            <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--neon-green)', fontWeight: 800 }}>
              「謝謝您的耐心等待！<br />
              您的寶可夢已經恢復 100% 精神，神采飛揚了！」
            </div>
            
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              目前 HP: <span style={{ color: 'var(--neon-green)', fontWeight: 800 }}>{partner.maxHp}</span> / {partner.maxHp}
            </div>

            <button className="neon-button" style={{ width: '100%', borderColor: 'var(--neon-green)', color: 'var(--neon-green)' }} onClick={onClose}>
              太棒了！拿回精靈球
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PokeCenter;
