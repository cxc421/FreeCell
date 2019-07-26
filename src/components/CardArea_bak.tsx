import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import Card, { CardType, CardSuit } from './Card';
import {
  useCardState,
  CellsType,
  FoundationsType,
  DecksType
} from '../CardState';

const defaultCardAreaWidth = 1280;
const defaultCardWidth = 100;
const defaultCardHeight = 140;
const defaultHorizontalPadding = 30;
const defaultCardAreaHeight = 645;
const defaultCardAreaRatio = defaultCardAreaWidth / defaultCardAreaHeight;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  /* background: rgba(100, 0, 0, 0.1); */
`;

function computeCardSizeAndPos(cardAreaWidth: number, cardAreaHeight: number) {
  console.time('A');
  // console.time('A-1');
  const cardAreaRatio = cardAreaWidth / cardAreaHeight;
  const isScaledByWidth = cardAreaRatio < defaultCardAreaRatio;
  let scale = 0;
  let pagePadding = 0;
  if (isScaledByWidth) {
    scale = cardAreaWidth / defaultCardAreaWidth;
    pagePadding = 0;
  } else {
    scale = cardAreaHeight / defaultCardAreaHeight;
    pagePadding = (cardAreaWidth - scale * defaultCardAreaWidth) / 2;
  }
  // console.timeEnd('A-1');

  // console.time('A-2');
  const cardWidth = scale * defaultCardWidth;
  const cardHeight = scale * defaultCardHeight;
  const horiPadding = scale * defaultHorizontalPadding;
  const leftPadding = 2 * horiPadding;
  const centerDis = 6 * horiPadding;
  const k1 = cardWidth + horiPadding;
  const k2 = pagePadding + leftPadding;
  const k3 = k2 + centerDis + cardWidth;
  // console.timeEnd('A-2');

  // console.time('A-3');
  const cellPos = [];
  for (let i = 0; i < 4; i++) {
    cellPos[i] = {
      top: 0,
      left: k2 + k1 * i
    };
  }
  // console.timeEnd('A-3');

  // console.time('A-4');
  const foundationPos = [];
  for (let i = 0; i < 4; i++) {
    foundationPos[i] = {
      top: 0,
      left: k3 + k1 * (i + 3)
    };
  }
  // console.timeEnd('A-4');

  const deckTop = cardHeight + horiPadding;

  // console.time('A-5');
  const decksPos = [];
  for (let i = 0; i < 4; i++) {
    decksPos[i] = {
      left: cellPos[i].left,
      top: deckTop
    };
  }
  for (let i = 0; i < 4; i++) {
    decksPos[i + 4] = {
      left: foundationPos[i].left,
      top: deckTop
    };
  }
  // console.timeEnd('A-5');

  console.timeEnd('A');
  return {
    cellPos,
    foundationPos,
    decksPos,
    scale,
    vertShift: horiPadding
  };
}

function getCardsJSX(
  container: HTMLDivElement | null,
  cells: CellsType,
  foundations: FoundationsType,
  decks: DecksType,
  onCardMouseDown: (id: string) => void
): JSX.Element[] {
  const cardsJsx: JSX.Element[] = [];

  if (!container) {
    return cardsJsx;
  }
  const { clientWidth, clientHeight } = container;
  const {
    cellPos,
    foundationPos,
    decksPos,
    scale,
    vertShift
  } = computeCardSizeAndPos(clientWidth, clientHeight);
  cells.forEach((cell, cellIndex) => {
    const { top, left } = cellPos[cellIndex];

    const id = `cells-${cellIndex}`;
    cardsJsx.push(
      <Card
        id={id}
        key={id}
        type={CardType.OpenCell}
        style={{
          top,
          left,
          transform: `scale(${scale})`,
          zIndex: 0
        }}
      />
    );

    cell.forEach((card, index) => {
      const id = `card-${card.suit}-${card.number}`;
      cardsJsx.push(
        <Card
          id={id}
          key={id}
          type={CardType.Card}
          suit={card.suit}
          number={card.number}
          style={{
            top,
            left,
            transform: `scale${scale}`,
            zIndex: index + 1,
            cursor: 'grab'
          }}
          onMouseDown={() => onCardMouseDown(id)}
        />
      );
    });
  });

  const foundationSuits = [
    CardSuit.Spade,
    CardSuit.Heart,
    CardSuit.Club,
    CardSuit.Diamond
  ];

  for (let foundIndex = 0; foundIndex < foundations.length; foundIndex++) {
    const foundation = foundations[foundIndex];
    const { left, top } = foundationPos[foundIndex];

    const placementId = `found-${foundIndex}`;
    const suit = foundationSuits[foundIndex];
    cardsJsx.push(
      <Card
        id={placementId}
        key={placementId}
        type={CardType.OpenFundation}
        suit={suit}
        style={{
          top,
          left,
          transform: `scale(${scale})`,
          zIndex: 0
        }}
      />
    );

    for (let cardIndex = 0; cardIndex < foundation.length; cardIndex++) {
      const card = foundation[cardIndex];
      const id = `card-${card.suit}-${card.number}`;
      cardsJsx.push(
        <Card
          id={id}
          key={id}
          type={CardType.Card}
          suit={card.suit}
          number={card.number}
          style={{
            top,
            left,
            transform: `scale${scale}`,
            zIndex: cardIndex + 1
          }}
        />
      );
    }
  }

  decks.forEach((deck, deckIndex) => {
    const { top, left } = decksPos[deckIndex];

    const id = `deck-${deckIndex}`;
    cardsJsx.push(
      <Card
        id={id}
        key={id}
        type={CardType.OpenCell}
        style={{
          top,
          left,
          transform: `scale(${scale})`,
          zIndex: 0
        }}
      />
    );

    deck.forEach((card, cardIndex) => {
      const id = `card-${card.suit}-${card.number}`;
      cardsJsx.push(
        <Card
          id={id}
          key={id}
          type={CardType.Card}
          suit={card.suit}
          number={card.number}
          style={{
            top: top + vertShift * cardIndex,
            left,
            transform: `scale(${scale})`,
            zIndex: cardIndex + 1,
            cursor: cardIndex === deck.length - 1 ? 'grab' : 'default'
          }}
        />
      );
    });
  });
  return cardsJsx;
}

const CardArea: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { cells, foundations, decks } = useCardState();
  const [cardsJSX, setCardsJSX] = useState<JSX.Element[]>([]);

  function onCardMouseDown(id: string) {
    console.log(id);
  }

  useEffect(() => {
    function updateCardsJsx() {
      const newCardsJSX = getCardsJSX(
        containerRef.current,
        cells,
        foundations,
        decks,
        onCardMouseDown
      );
      setCardsJSX(newCardsJSX);
    }
    updateCardsJsx();
    window.addEventListener('resize', updateCardsJsx);
    return () => {
      window.removeEventListener('resize', updateCardsJsx);
    };
  }, [containerRef, cells, foundations, decks]);

  return <Container ref={containerRef}>{cardsJSX}</Container>;
};

export default CardArea;
