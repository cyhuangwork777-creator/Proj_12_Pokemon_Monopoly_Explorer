import { MAP_LOCATIONS } from '../data/pokemonData';

// 取得 16 格在 5x5 Grid 中的對應行列座標
const getGridCoords = (id) => {
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
  return { gridColumn: 1, gridRow: 1 };
};

const GameBoard = ({ playerPos, isMoving, trainerAvatar, children }) => {
  return (
    <div className="board-wrapper">
      {MAP_LOCATIONS.map((cell) => {
        const coords = getGridCoords(cell.id);
        const isPlayerHere = playerPos === cell.id;

        return (
          <div
            key={cell.id}
            className={`board-cell glass-panel ${isPlayerHere ? 'player-here' : ''}`}
            style={coords}
            data-type={cell.type}
          >
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

      {/* 棋盤中間的 3x3 區域，用來擺放骰子與狀態控制項 */}
      <div className="board-center glass-panel">
        {children}
      </div>
    </div>
  );
};

export default GameBoard;
