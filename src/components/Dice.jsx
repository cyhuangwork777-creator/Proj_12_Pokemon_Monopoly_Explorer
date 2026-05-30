const Dice = ({ rollValue, isRolling, onRoll }) => {
  return (
    <div className="dice-container" onClick={!isRolling ? onRoll : null}>
      <div className={`cube ${isRolling ? 'is-rolling' : `roll-${rollValue}`}`}>
        <div className="cube-face face-1">1</div>
        <div className="cube-face face-2">2</div>
        <div className="cube-face face-3">3</div>
        <div className="cube-face face-4">4</div>
        <div className="cube-face face-5">5</div>
        <div className="cube-face face-6">6</div>
      </div>
    </div>
  );
};

export default Dice;
