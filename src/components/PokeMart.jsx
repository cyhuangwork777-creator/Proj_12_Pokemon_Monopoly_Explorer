const PokeMart = ({ gold, bag, updateBag, updateGold, onClose }) => {
  const shopItems = [
    {
      key: 'potion',
      name: '回復傷藥',
      desc: '在對戰中能為出戰夥伴回復 60 點體力值。',
      price: 80,
      icon: '🧪'
    }
  ];

  const handleBuy = (item) => {
    if (gold < item.price) return;
    updateGold(-item.price);
    updateBag(item.key, 1);
  };

  return (
    <div className="overlay-screen">
      <div className="screen-card glass-panel" style={{ maxWidth: '500px' }}>
        <div className="panel-header">
          <span style={{ color: 'var(--neon-blue)' }}>🛒 友好商店 (Poké Mart)</span>
          <span className="shop-item-price">💰 {gold} G</span>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
          歡迎光臨！想為接下來的冒險準備些什麼物資呢？
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {shopItems.map((item) => {
            const canAfford = gold >= item.price;
            return (
              <div key={item.key} className="shop-item-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '13px' }}>{item.name}</div>
                    <div className="shop-item-desc">{item.desc}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      目前擁有: {bag[item.key] || 0}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span className="shop-item-price">{item.price} 金幣</span>
                  <button
                    className="neon-button"
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                    disabled={!canAfford}
                    onClick={() => handleBuy(item)}
                  >
                    購買
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
          離開商店
        </button>
      </div>
    </div>
  );
};

export default PokeMart;
