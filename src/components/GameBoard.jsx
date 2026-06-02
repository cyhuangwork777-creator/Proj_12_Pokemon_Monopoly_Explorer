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

// 格子地形環境粒子與輕量輔助插圖，與大作底圖完美融合
const renderCellDecoration = (cell) => {
  const type = cell.type;

  switch (type) {
    case 'grass':
      return (
        <div className="cell-decor">
          <div className="particle-layer">
            <span className="decor-leaf leaf-p1">🍃</span>
            <span className="decor-leaf leaf-p2">🍃</span>
          </div>
        </div>
      );
    case 'water':
      return (
        <div className="cell-decor">
          <div className="particle-layer">
            <span className="decor-bubble bub-1"></span>
            <span className="decor-bubble bub-2"></span>
          </div>
        </div>
      );
    case 'rock':
      return (
        <div className="cell-decor">
          <div className="particle-layer">
            <span className="decor-dust dust-1">✨</span>
          </div>
        </div>
      );
    case 'cave':
      return (
        <div className="cell-decor">
          <div className="particle-layer">
            <span className="decor-spark spk-1"></span>
            <span className="decor-spark spk-2"></span>
          </div>
        </div>
      );
    case 'center':
      return (
        <div className="cell-decor">
          <div className="particle-layer">
            <span className="decor-heart animate-ping">❤️</span>
          </div>
        </div>
      );
    case 'stoneMine':
      return (
        <div className="cell-decor">
          <div className="particle-layer">
            <span className="decor-crystal">💎</span>
          </div>
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

          return (
            <div
              key={cell.id}
              className={`board-cell glass-panel ${isPlayerHere ? 'player-here' : ''}`}
              style={coords}
              data-type={cell.type}
            >
              {/* 地形微縮環境動態粒子 */}
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

        {/* 棋盤正中央磨砂展示面板 */}
        <div className="board-center glass-panel">
          {/* 只保留徽章內容疊加層，底層天冠雪山/枯葉燈塔底圖完美透出 */}
          <div className="sandtable-content-overlay">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
