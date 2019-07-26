import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Card, { CardType, CardSuit, cardWidth } from './Card';

const Container = styled.div`
  position: relative;
  width: 1280px;
  height: 645px;
  background: rgba(0, 0, 0, 0.1);
  transform-origin: center top;
`;

function useScale(containerRef: React.RefObject<HTMLDivElement>) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function resize() {
      const container = containerRef.current;
      if (!container) return;

      const width = 1280;
      const height = 645;
      const parent = container.parentNode as HTMLDivElement;
      let { clientWidth, clientHeight } = parent;
      let newScale = clientWidth / width;
      if (height * newScale > clientHeight) {
        newScale = clientHeight / height;
      }
      setScale(newScale);
    }

    window.addEventListener('resize', resize);
    resize();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [containerRef]);

  return scale;
}

const CardArea = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useScale(containerRef);
  const containerStyle: React.CSSProperties = { transform: `scale(${scale})` };
  const openDeckList = [
    [{ suit: CardSuit.Heart, number: 1 }],
    [{ suit: CardSuit.Heart, number: 2 }],
    [],
    [{ suit: CardSuit.Heart, number: 4 }]
  ];
  const cardJSX = [];
  for (let i = 0; i < openDeckList.length; i++) {
    cardJSX.push(
      <Card
        key={`open-${i}`}
        type={CardType.OpenCell}
        style={{
          position: 'absolute',
          top: 0,
          left: 60 + (cardWidth + 30) * i,
          zIndex: 0
        }}
      />
    );
    for (let j = 0; j < openDeckList[i].length; j++) {
      cardJSX.push(
        <Card
          key={`open-${i}-${j}`}
          type={CardType.Card}
          suit={openDeckList[i][j].suit}
          number={openDeckList[i][j].number}
          style={{
            position: 'absolute',
            top: 0,
            left: 60 + (cardWidth + 30) * i,
            zIndex: j + 1
          }}
        />
      );
    }
  }

  return (
    <Container ref={containerRef} style={containerStyle}>
      {cardJSX}
    </Container>
  );
};

export default CardArea;
