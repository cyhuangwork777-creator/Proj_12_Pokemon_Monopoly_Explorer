import { MAP_LOCATIONS } from '../data/pokemonData';

// 取得在 Grid 中的對應行列座標
const getGridCoords = (id, currentChapter = 1) => {
  if (currentChapter === 1) {
    if (id >= 0 && id <= 4) {
      // 頂部 Row 1, Col 1~5
      return { gridColumn: id + 1, gridRow: 1 };
    } else if (id >= 5 && id <= 7) {
      // 右側 Col 5, Row 2~4
      return { gridColumn: 5, gridRow: id - 3 };
    } else if (id >= 8 && id <= 12) {
      // 底部 Row 5, Col 5~1 (8->5, 9->4, 10->3, 11->2, 12->1)
      return { gridColumn: 13 - id, gridRow: 5 };
    } else if (id >= 13 && id <= 15) {
      // 左側 Col 1, Row 4~2 (13->4, 14->3, 15->2)
      return { gridColumn: 1, gridRow: 17 - id };
    }
  } else {
    // 第二大陸 28 格 8x8 外環 Grid 排版
    if (id >= 0 && id <= 7) {
      // 頂部 Row 1, Col 1~8
      return { gridColumn: id + 1, gridRow: 1 };
    } else if (id >= 8 && id <= 13) {
      // 右側 Col 8, Row 2~7 (8->Row 2, 13->Row 7)
      return { gridColumn: 8, gridRow: id - 6 };
    } else if (id >= 14 && id <= 21) {
      // 底部 Row 8, Col 8~1 (14->8, 21->1)
      return { gridColumn: 22 - id, gridRow: 8 };
    } else if (id >= 22 && id <= 27) {
      // 左側 Col 1, Row 7~2 (22->7, 27->2)
      return { gridColumn: 1, gridRow: 29 - id };
    }
  }
  return { gridColumn: 1, gridRow: 1 };
};

// 取得柏油馬路道路類型，用以連貫車道黃虛線與轉彎斑馬線
const getRoadType = (id, currentChapter = 1) => {
  const corners = currentChapter === 1 ? [0, 4, 8, 12] : [0, 7, 14, 21];
  if (corners.includes(id)) return 'road-corner';
  
  if (currentChapter === 1) {
    if ((id >= 0 && id <= 4) || (id >= 8 && id <= 12)) return 'road-horizontal';
    return 'road-vertical';
  } else {
    if ((id >= 0 && id <= 7) || (id >= 14 && id <= 21)) return 'road-horizontal';
    return 'road-vertical';
  }
};

// 大富翁4經典美學：為格子繪製高出格子邊界、具備立體 Z 軸遮擋的 3D 彈出式像素建築物/山林
const renderCell3DBuilding = (cell) => {
  const type = cell.type;

  switch (type) {
    case 'start':
      return (
        <div className="cell-building-sprite building-start">
          <svg viewBox="0 0 64 64" className="building-svg">
            {/* GO! 發光彩虹拱門路標 */}
            <path fill="#ff1744" d="M10 56V26c0-10 8-18 18-18s18 8 18 18v30h-8V26c0-5.5-4.5-10-10-10s-10 4.5-10 10v30H10z" />
            <path fill="#ffd700" d="M14 56V26c0-7.7 6.3-14 14-14s14 6.3 14 14v30h-4V26c0-5.5-4.5-10-10-10s-10 4.5-10 10v30h-4z" opacity="0.8" />
            <circle cx="32" cy="12" r="6" fill="#ffd700" className="animate-pulse" />
            <rect x="24" y="20" width="16" height="12" fill="#00e5ff" rx="2" />
            <text x="32" y="29" fill="#fff" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="monospace">GO</text>
          </svg>
        </div>
      );
    case 'grass':
      return (
        <div className="cell-building-sprite building-grass">
          {/* 草原動態微風綠葉 */}
          <div className="particle-layer">
            <span className="decor-leaf leaf-p1">🍃</span>
            <span className="decor-leaf leaf-p2">🍃</span>
          </div>
          <svg viewBox="0 0 64 80" className="building-svg building-bounce">
            {/* 3D 像素松樹林 (高矮重疊，高出格子邊界) */}
            {/* 後左側矮松樹 */}
            <polygon points="20,15 5,45 15,45 10,65 30,65 25,45 35,45" fill="#00796b" opacity="0.8" />
            <rect x="18" y="65" width="4" height="10" fill="#5d4037" />
            {/* 後右側矮松樹 */}
            <polygon points="44,20 32,48 40,48 35,68 53,68 48,48 56,48" fill="#00796b" opacity="0.8" />
            <rect x="42" y="68" width="4" height="8" fill="#5d4037" />
            {/* 前中央高松樹 */}
            <polygon points="32,2 12,38 24,38 16,60 48,60 40,38 52,38" fill="#00e676" />
            <rect x="29" y="60" width="6" height="15" fill="#795548" />
          </svg>
        </div>
      );
    case 'water':
      return (
        <div className="cell-building-sprite building-water">
          {/* 海洋微縮氣泡粒子 */}
          <div className="particle-layer">
            <span className="decor-bubble bub-1"></span>
            <span className="decor-bubble bub-2"></span>
          </div>
          <svg viewBox="0 0 64 64" className="building-svg building-float">
            {/* 像素海浪上的立體木製小漁船 */}
            <path fill="#0288d1" d="M0 48c10 0 10-4 20-4s10 4 20 4 10-4 20-4v16H0V48z" opacity="0.4" />
            <path fill="#00b0ff" d="M0 53c10 0 10-3 20-3s10 3 20 3 10-3 20-3v11H0V53z" opacity="0.7" />
            {/* 像素褐色帆船 */}
            <path fill="#8d6e63" d="M14 42l4 8h28l4-8H14z" />
            <rect x="30" y="20" width="3" height="22" fill="#d7ccc8" />
            <polygon points="33,22 48,32 33,38" fill="#fff" />
          </svg>
        </div>
      );
    case 'rock':
      return (
        <div className="cell-building-sprite building-rock">
          {/* 巨岩發光星塵 */}
          <div className="particle-layer">
            <span className="decor-dust dust-1">✨</span>
          </div>
          <svg viewBox="0 0 64 80" className="building-svg">
            {/* 巍峨的立體雙峰高山，被皑皑白雪覆蓋 */}
            {/* 右側矮峰 */}
            <polygon points="45,28 25,70 65,70" fill="#78909c" />
            <polygon points="45,28 39,40 51,40" fill="#fff" opacity="0.9" />
            {/* 左側高峰 (跨越格子邊界) */}
            <polygon points="28,4 4,70 52,70" fill="#455a64" />
            <polygon points="28,4 20,22 36,22" fill="#ffffff" />
            <polygon points="28,4 25,12 31,12" fill="#e0f7fa" />
          </svg>
        </div>
      );
    case 'cave':
      return (
        <div className="cell-building-sprite building-cave">
          {/* 火山冒熔岩火花粒子 */}
          <div className="particle-layer">
            <span className="decor-spark spk-1"></span>
            <span className="decor-spark spk-2"></span>
          </div>
          <svg viewBox="0 0 64 80" className="building-svg">
            {/* 立體噴發像素火山 (冒出紅色熔岩) */}
            <polygon points="32,22 10,70 54,70" fill="#3e2723" />
            {/* 火山噴發口熔岩 */}
            <ellipse cx="32" cy="24" rx="10" ry="4" fill="#ff3d00" />
            <path fill="#ff9100" d="M28 24l2-8 2 12 2-10 2 6" stroke="#ff3d00" strokeWidth="2" fill="none" />
            {/* 山坡熔岩流動 */}
            <polygon points="30,24 26,45 34,45" fill="#ff3d00" opacity="0.85" />
            <polygon points="34,24 38,50 32,50" fill="#ff3d00" opacity="0.85" />
          </svg>
        </div>
      );
    case 'mart':
      return (
        <div className="cell-building-sprite building-mart">
          <svg viewBox="0 0 64 70" className="building-svg building-bounce">
            {/* 大富翁4經典像素紅頂便利商店小屋 */}
            {/* 地基陰影 */}
            <rect x="6" y="58" width="52" height="6" fill="rgba(0,0,0,0.3)" rx="3" />
            {/* 屋身 */}
            <rect x="10" y="24" width="44" height="34" fill="#eeeeee" stroke="#374151" strokeWidth="2" />
            {/* 紅瓦屋頂 (立體三角形) */}
            <polygon points="32,4 6,24 58,24" fill="#ff1744" stroke="#374151" strokeWidth="2" />
            {/* 商店招牌 */}
            <rect x="18" y="28" width="28" height="8" fill="#ffd700" rx="1" stroke="#374151" strokeWidth="1.5" />
            <text x="32" y="34" fill="#000" fontSize="5" fontWeight="900" textAnchor="middle" fontFamily="monospace">MART</text>
            {/* 商店玻璃大門與櫥窗 */}
            <rect x="26" y="40" width="12" height="18" fill="#e0f7fa" stroke="#374151" strokeWidth="1.5" />
            <rect x="14" y="40" width="8" height="12" fill="#00e5ff" opacity="0.7" />
            <rect x="42" y="40" width="8" height="12" fill="#00e5ff" opacity="0.7" />
          </svg>
        </div>
      );
    case 'center':
      return (
        <div className="cell-building-sprite building-center">
          <div className="particle-layer">
            <span className="decor-heart animate-ping">❤️</span>
          </div>
          <svg viewBox="0 0 64 75" className="building-svg building-bounce">
            {/* 高聳的像素寶可夢中心大樓 (紅瓦圓頂、發光綠十字) */}
            {/* 地基陰影 */}
            <rect x="4" y="64" width="56" height="8" fill="rgba(0,0,0,0.35)" rx="4" />
            {/* 醫院主體 */}
            <rect x="10" y="20" width="44" height="44" fill="#ffffff" stroke="#374151" strokeWidth="2.5" />
            {/* 經典紅色半圓瓦屋頂 (跨越格子邊界) */}
            <path d="M10 20c0-10 10-16 22-16s22 6 22 16H10z" fill="#ff1744" stroke="#374151" strokeWidth="2.5" />
            {/* 寶可夢大門與康復綠十字 */}
            <rect x="25" y="44" width="14" height="20" fill="#e8f5e9" stroke="#374151" strokeWidth="2" />
            <rect x="22" y="26" width="20" height="12" fill="#a5d6a7" rx="2" stroke="#374151" strokeWidth="1.5" />
            {/* 發光綠十字 */}
            <path d="M32 29v6M29 32h6" stroke="#4caf50" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'dojo':
    case 'gym':
      return (
        <div className="cell-building-sprite building-dojo">
          <svg viewBox="0 0 64 80" className="building-svg">
            {/* 雄偉的大富翁4風格像素城堡道館 (雙層青瓦屋頂、石壁與金字徽章) */}
            {/* 地基陰影 */}
            <rect x="2" y="68" width="60" height="8" fill="rgba(0,0,0,0.4)" rx="4" />
            {/* 底層石壁 */}
            <rect x="8" y="42" width="48" height="26" fill="#cfd8dc" stroke="#374151" strokeWidth="2.5" />
            {/* 中層青瓦屋頂 */}
            <polygon points="32,28 4,42 60,42" fill="#0d47a1" stroke="#374151" strokeWidth="2.5" />
            {/* 二層主體 */}
            <rect x="16" y="20" width="32" height="18" fill="#ffffff" stroke="#374151" strokeWidth="2" />
            {/* 頂層青瓦屋頂 (雙重簷) */}
            <polygon points="32,6 12,20 52,20" fill="#0d47a1" stroke="#374151" strokeWidth="2" />
            {/* 黃金道館標誌 */}
            <circle cx="32" cy="29" r="4" fill="#ffd700" stroke="#374151" strokeWidth="1.5" />
            {/* 大門 */}
            <rect x="26" y="52" width="12" height="16" fill="#5d4037" stroke="#374151" strokeWidth="2" />
          </svg>
        </div>
      );
    case 'stoneMine':
      return (
        <div className="cell-building-sprite building-mine">
          <div className="particle-layer">
            <span className="decor-crystal">💎</span>
          </div>
          <svg viewBox="0 0 64 70" className="building-svg">
            {/* 像素礦井基地：起重木架與採礦礦石車軌 */}
            <rect x="8" y="40" width="48" height="24" fill="#9e9e9e" stroke="#374151" strokeWidth="2" />
            {/* 起重木架 (A字架) */}
            <line x1="20" y1="40" x2="32" y2="10" stroke="#795548" strokeWidth="3" />
            <line x1="44" y1="40" x2="32" y2="10" stroke="#795548" strokeWidth="3" />
            <line x1="20" y1="40" x2="44" y2="40" stroke="#795548" strokeWidth="2" />
            {/* 發光水晶礦石 */}
            <polygon points="32,8 37,20 32,32 27,20" fill="#d500f9" opacity="0.9" />
            {/* 軌道與小推車 */}
            <rect x="18" y="50" width="28" height="4" fill="#374151" />
            <rect x="26" y="44" width="12" height="8" fill="#ffd700" rx="1" />
          </svg>
        </div>
      );
    case 'port':
      return (
        <div className="cell-building-sprite building-port">
          <svg viewBox="0 0 64 64" className="building-svg building-float">
            {/* 帶有金色栓柱與木棧板的像素港口 */}
            <path fill="#5d4037" d="M6 44h52v8H6z" stroke="#374151" strokeWidth="2" />
            <rect x="10" y="44" width="6" height="16" fill="#3e2723" />
            <rect x="48" y="44" width="6" height="16" fill="#3e2723" />
            {/* 金色錨栓柱 */}
            <rect x="28" y="34" width="8" height="10" fill="#ffd700" rx="1" stroke="#374151" strokeWidth="1.5" />
            {/* 蔚藍海面 */}
            <path fill="#00e5ff" d="M0 50c10 0 10-3 20-3s10 3 20 3 10-3 20-3v14H0V50z" opacity="0.7" />
          </svg>
        </div>
      );
    case 'daycare':
      return (
        <div className="cell-building-sprite building-daycare">
          <div className="particle-layer">
            <span className="decor-heart animate-ping">❤️</span>
          </div>
          <svg viewBox="0 0 64 75" className="building-svg building-bounce">
            {/* 溫馨像素風培育小木屋 */}
            {/* 地基陰影 */}
            <rect x="6" y="60" width="52" height="6" fill="rgba(0,0,0,0.3)" rx="3" />
            {/* 小木屋身 */}
            <rect x="12" y="26" width="40" height="34" fill="#a1887f" stroke="#374151" strokeWidth="2" />
            {/* 溫馨橙黃色瓦屋頂 */}
            <polygon points="32,6 6,26 58,26" fill="#ffb74d" stroke="#374151" strokeWidth="2" />
            {/* 屋頂裝飾小愛心 */}
            <path d="M32 18c-1.5-2-4-1.5-5 .5-.8-2-3.3-2.5-5-.5-1.2 1.5 0 4 5 7 5-3 6.2-5.5 5-7z" fill="#ff4081" stroke="#374151" strokeWidth="1" />
            {/* 深木色大門與發光小窗 */}
            <rect x="26" y="42" width="12" height="18" fill="#5d4037" stroke="#374151" strokeWidth="1.5" />
            <rect x="16" y="34" width="8" height="8" fill="#fff8e1" stroke="#374151" strokeWidth="1" />
            <rect x="40" y="34" width="8" height="8" fill="#fff8e1" stroke="#374151" strokeWidth="1" />
          </svg>
        </div>
      );
    case 'event':
      return (
        <div className="cell-building-sprite building-event">
          <div className="particle-layer">
            <span className="decor-dust dust-1">✨</span>
          </div>
          <svg viewBox="0 0 64 75" className="building-svg building-float">
            {/* 經典像素風冒險命運問號寶箱 */}
            {/* 地基陰影 */}
            <rect x="8" y="58" width="48" height="6" fill="rgba(0,0,0,0.3)" rx="3" />
            {/* 寶箱主體 */}
            <rect x="12" y="24" width="40" height="34" fill="#9c27b0" stroke="#374151" strokeWidth="2.5" rx="3" />
            {/* 金色邊框與鎖扣 */}
            <rect x="12" y="24" width="40" height="6" fill="#ffd700" stroke="#374151" strokeWidth="1.5" />
            <rect x="28" y="36" width="8" height="10" fill="#ffd700" stroke="#374151" strokeWidth="1.5" />
            <circle cx="32" cy="41" r="2" fill="#ff1744" />
            {/* 箱頂懸浮亮黃色問號 */}
            <text x="32" y="16" fill="#ffd700" fontSize="20" fontWeight="900" textAnchor="middle" fontFamily="monospace" stroke="#374151" strokeWidth="1">?</text>
          </svg>
        </div>
      );
    default:
      return null;
  }
};

const GameBoard = ({ playerPos, isMoving, trainerAvatar, mapLocations = MAP_LOCATIONS, currentChapter = 1, children }) => {
  let transformStyle = {};
  
  if (currentChapter === 2) {
    const playerCoords = getGridCoords(playerPos, currentChapter);
    const col = playerCoords.gridColumn;
    const row = playerCoords.gridRow;
    
    // 🌈 遊戲設計大師鏡頭動態跟隨演算法 (置中跟隨鏡頭，平移限制在 [0%, -60%] 絕不露底)
    const offsetX = -((col - 1) / 7) * 60;
    const offsetY = -((row - 1) / 7) * 60;
    
    transformStyle = {
      transform: `translate(${offsetX}%, ${offsetY}%)`,
      width: '160%',
      height: '160%',
      aspectRatio: '1 / 1'
    };
  }

  return (
    <div className="board-viewport">
      {/* ☁️ 天空漂浮雲朵層，產生超凡的立體視差 (Parallax Cloud Layer) */}
      <div className="floating-clouds-layer">
        <div className="floating-cloud cloud-1"></div>
        <div className="floating-cloud cloud-2"></div>
        <div className="floating-cloud cloud-3"></div>
      </div>

      <div 
        className={`board-wrapper ${currentChapter === 2 ? 'chapter-2' : ''}`}
        style={transformStyle}
      >
        {/* 🗺️ 大作級雙背景底圖 Cross-dissolve 平移轉場層 */}
        <div className="board-background-images">
          <div 
            className="board-bg-img kanto-bg" 
            style={{ opacity: currentChapter === 1 ? 1 : 0 }}
          ></div>
          <div 
            className="board-bg-img sinnoh-bg" 
            style={{ opacity: currentChapter === 2 ? 1 : 0 }}
          ></div>
        </div>

        {mapLocations.map((cell) => {
          const coords = getGridCoords(cell.id, currentChapter);
          const isPlayerHere = playerPos === cell.id;
          const roadType = getRoadType(cell.id, currentChapter);

          return (
            <div
              key={cell.id}
              className={`board-cell glass-panel ${roadType} ${isPlayerHere ? 'player-here' : ''}`}
              style={coords}
              data-type={cell.type}
            >
              {/* 大富翁4經典 3D 立體彈出像素建築物與自然裝飾圖章 */}
              {renderCell3DBuilding(cell)}

              <div className="cell-info">
                <span 
                  className="cell-type-tag"
                  style={{ backgroundColor: cell.color + '40', color: cell.color }}
                >
                  {cell.terrain || cell.type}
                </span>
                <span className="cell-name">{cell.name}</span>
              </div>
              
              <span className="cell-desc">{cell.desc}</span>

              {isPlayerHere && (
                <div className={`player-token ${isMoving ? 'jumping' : ''}`}>
                  {/* 大富翁4復古 Q 版敞篷卡丁小車車身結構 */}
                  <div className="kart-body">
                    <div className="kart-wheel wheel-front"></div>
                    <div className="kart-wheel wheel-back"></div>
                    <div className="kart-exhaust">
                      <span className="gas-puff puff-1"></span>
                      <span className="gas-puff puff-2"></span>
                    </div>
                    {trainerAvatar ? (
                      <img 
                        src={trainerAvatar} 
                        alt="Player" 
                        className="player-token-avatar kart-driver"
                      />
                    ) : (
                      <span className="player-token-inner kart-driver">🎒</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* 棋盤正中央磨砂展示面板 */}
        <div className="board-center glass-panel">
          {/* 只保留徽章內容疊加層，底層像素雪山與海灣底圖完美透出 */}
          <div className="sandtable-content-overlay">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
