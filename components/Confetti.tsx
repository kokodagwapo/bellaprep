import React from 'react';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  return <div className="confetti-piece" style={style}></div>;
};

const Confetti: React.FC = () => {
  const confettiCount = 100;
  const pieces = Array.from({ length: confettiCount }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      '--bg-color': `hsl(${Math.random() * 360}, 70%, 60%)`
    } as React.CSSProperties;
    return <ConfettiPiece key={i} style={style} />;
  });

  return <div className="confetti-container">{pieces}</div>;
};

export default Confetti;