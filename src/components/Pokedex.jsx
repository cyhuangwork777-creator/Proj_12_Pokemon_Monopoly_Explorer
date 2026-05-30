import { POKEMON_DATABASE } from '../data/pokemonData';

const Pokedex = ({ caughtIds }) => {
  return (
    <div className="pokedex-panel glass-panel">
      <div className="panel-header">
        <span>📖 寶可夢圖鑑</span>
        <span style={{ fontSize: '12px', color: 'var(--neon-green)' }}>
          {caughtIds.length} / {POKEMON_DATABASE.length}
        </span>
      </div>
      
      <div className="pokedex-grid">
        {POKEMON_DATABASE.map((poke) => {
          const isCaught = caughtIds.includes(poke.id);
          
          return (
            <div 
              key={poke.id} 
              className={`pokedex-slot ${isCaught ? 'caught' : ''}`}
              title={isCaught ? `${poke.name} (${poke.type}屬性)` : '未捕獲'}
            >
              <img 
                src={poke.sprite} 
                alt={poke.name}
                style={isCaught ? {} : { filter: 'brightness(0) opacity(0.25)' }}
              />
              <span className="pokedex-slot-tooltip">
                {isCaught ? poke.name : `No.${poke.id}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pokedex;
