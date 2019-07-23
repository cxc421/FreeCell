import React from 'react';
import styled from 'styled-components';
import Card, { CardType, CardSuit, NormalCardProps } from './Card';

type DeckProps =
  | { type: CardType.Card | CardType.OpenCell; cards: NormalCardProps[] }
  | { type: CardType.OpenFundation; suit: CardSuit; cards: NormalCardProps[] };

const Container = styled.div`
  position: relative;
  width: 100px;
  height: 140px;

  > * {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const Deck: React.FC<DeckProps> = props => {
  const baseZindex = 10;
  const CardPlacement =
    props.type === CardType.OpenFundation ? (
      <Card
        type={CardType.OpenFundation}
        suit={props.suit}
        style={{ zIndex: baseZindex }}
      />
    ) : (
      <Card type={CardType.OpenCell} />
    );
  const displayCards = [CardPlacement];

  return <Container>{displayCards}</Container>;
};

export default Deck;
