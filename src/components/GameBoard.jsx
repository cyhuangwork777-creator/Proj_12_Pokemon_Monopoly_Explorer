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

// 大師級地圖格子內置動態插圖圖章 (內聯 SVG + 粒子效果)
const renderCellDecoration = (cell) => {
  const type = cell.type;

  switch (type) {
    case 'start':
      return (
        <div className="cell-decor cell-decor-start">
          <svg viewBox="0 0 24 24" className="decor-svg">
            <path fill="currentColor" d="M12 2L2 22h20L12 2zm0 3.99L19.53 19H4.47L12 5.99zM13 16h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
          </svg>
        </div>
      );
    case 'grass':
      return (
        <div className="cell-decor cell-decor-grass">
          <div className="particle-layer">
            <span className="decor-leaf leaf-p1">🍃</span>
            <span className="decor-leaf leaf-p2">🍃</span>
          </div>
          <svg viewBox="0 0 64 64" className="decor-svg">
            {/* 松樹插圖 */}
            <path fill="currentColor" d="M32 6L14 30h11v16h14V30h11L32 6z" opacity="0.85" />
            <path fill="currentColor" d="M25 46h14v12H25z" opacity="0.5" />
          </svg>
        </div>
      );
    case 'water':
      return (
        <div className="cell-decor cell-decor-water">
          <div className="particle-layer">
            <span className="decor-bubble bub-1"></span>
            <span className="decor-bubble bub-2"></span>
          </div>
          <svg viewBox="0 0 64 64" className="decor-svg">
            {/* 滾動波浪 */}
            <path fill="currentColor" d="M0 45c10 0 10-6 20-6s10 6 20 6 10-6 20-6v19H0V45z" opacity="0.6" />
            <path fill="currentColor" d="M0 50c10 0 10-4 20-4s10 4 20 4 10-4 20-4v14H0V50z" opacity="0.9" />
          </svg>
        </div>
      );
    case 'rock':
      return (
        <div className="cell-decor cell-decor-rock">
          <div className="particle-layer">
            <span className="decor-dust dust-1">✨</span>
          </div>
          <svg viewBox="0 0 64 64" className="decor-svg">
            {/* 高聳岩峰 */}
            <polygon points="32,10 10,54 54,54" fill="currentColor" opacity="0.8" />
            <polygon points="45,24 25,54 65,54" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
      );
    case 'cave':
      return (
        <div className="cell-decor cell-decor-cave">
          <div className="particle-layer">
            <span className="decor-spark spk-1"></span>
            <span className="decor-spark spk-2"></span>
          </div>
          <svg viewBox="0 0 64 64" className="decor-svg animate-pulse">
            {/* 旋轉符文或深淵水晶 */}
            <polygon points="32,6 58,24 48,54 16,54 6,24" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="32" cy="32" r="10" fill="currentColor" />
          </svg>
        </div>
      );
    case 'mart':
      return (
        <div className="cell-decor cell-decor-mart">
          <svg viewBox="0 0 64 64" className="decor-svg">
            {/* 商店建築物 */}
            <path fill="currentColor" d="M12 28v28h40V28L32 10 12 28zm20-10l12 12H20l12-12zm12 32H20v-8h24v8z" />
          </svg>
        </div>
      );
    case 'center':
      return (
        <div className="cell-decor cell-decor-center">
          <div className="particle-layer">
            <span className="decor-heart animate-ping">❤️</span>
          </div>
          <svg viewBox="0 0 64 64" className="decor-svg">
            {/* 寶可夢中心十字架 */}
            <rect x="26" y="10" width="12" height="44" fill="currentColor" rx="4" />
            <rect x="10" y="26" width="44" height="12" fill="currentColor" rx="4" />
          </svg>
        </div>
      );
    case 'dojo':
    case 'gym':
      return (
        <div className="cell-decor cell-decor-dojo">
          <svg viewBox="0 0 64 64" className="decor-svg">
            {/* 雙劍或競技場徽章 */}
            <path fill="currentColor" d="M32 2L10 12v18c0 13.5 9.4 26.1 22 29.5 12.6-3.4 22-16 22-29.5V12L32 2zm0 46.5c-7.5-3.3-12-11.8-12-21V19.7l12-5.5 12 5.5v8.3c0 9.2-4.5 17.7-12 21z" />
            <circle cx="32" cy="27" r="6" fill="currentColor" />
          </svg>
        </div>
      );
    case 'stoneMine':
      return (
        <div className="cell-decor cell-decor-mine">
          <div className="particle-layer">
            <span className="decor-crystal">💎</span>
          </div>
          <svg viewBox="0 0 64 64" className="decor-svg">
            {/* 水晶礦石 */}
            <polygon points="32,6 48,22 32,58 16,22" fill="currentColor" opacity="0.85" />
            <polygon points="32,6 38,22 32,58 26,22" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
      );
    case 'port':
      return (
        <div className="cell-decor cell-decor-port">
          <svg viewBox="0 0 64 64" className="decor-svg">
            {/* 金色錨點 */}
            <path fill="currentColor" d="M35 12h-6V6h6v6zm-3 8c-7.7 0-14 6.3-14 14h4c0-5.5 4.5-10 10-10s10 4.5 10 10h4c0-7.7-6.3-14-14-14zm-2 28v-12h4v12h10l-12 12-12-12h10z" />
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
        {mapLocations.map((cell) => {
          const coords = getGridCoords(cell.id, currentChapter);
          const isPlayerHere = playerPos === cell.id;

          return (
            <div
              key={cell.id}
              className={`board-cell glass-panel ${isPlayerHere ? 'player-here' : ''}`}
              style={coords}
              data-type={cell.type}
            >
              {/* 大師級地形插圖裝飾物 */}
              {renderCellDecoration(cell)}

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
                  {trainerAvatar ? (
                    <img 
                      src={trainerAvatar} 
                      alt="Player" 
                      className="player-token-avatar"
                    />
                  ) : (
                    <span className="player-token-inner">🎒</span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* 棋盤中間的區域，用來擺放狀態與地標，並增加 3D 擬真微縮沙盤 */}
        <div className="board-center glass-panel">
          {/* 3D 擬真微縮沙盤裝飾物層 */}
          <div className="sandtable-decorations">
            {currentChapter === 2 ? (
              // 🏔️ Chapter 2 神奧大陸：天冠雪山、蔚藍海溝、超古代神廟
              <>
                <div className="sandtable-sea">
                  <div className="sandtable-wave wave-back"></div>
                  <div className="sandtable-wave wave-front"></div>
                </div>
                <div className="sandtable-mountains">
                  <div className="sandtable-mountain mt-1"></div>
                  <div className="sandtable-mountain mt-2"></div>
                  <div className="sandtable-mountain mt-3"></div>
                </div>
                <div className="sandtable-temple-pillars">
                  <div className="temple-pillar pillar-left"></div>
                  <div className="temple-pillar pillar-right"></div>
                </div>
                <div className="sandtable-lake"></div>
              </>
            ) : (
              // 🌸 Chapter 1 關都地區：蔚藍海灣、小島燈塔、櫻花瓣飄落
              <>
                <div className="sandtable-sea kanto-sea">
                  <div className="sandtable-wave wave-kanto"></div>
                </div>
                <div className="sandtable-island"></div>
                <div className="sandtable-lighthouse">
                  <div className="lighthouse-light"></div>
                </div>
                <div className="sandtable-cherry-blossoms">
                  <span className="blossom-leaf leaf-c1">🌸</span>
                  <span className="blossom-leaf leaf-c2">🌸</span>
                </div>
              </>
            )}
          </div>

          {/* 徽章內容疊加層 */}
          <div className="sandtable-content-overlay">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
