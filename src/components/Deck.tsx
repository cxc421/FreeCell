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

function getDisplayCard(props: DeckProps): JSX.Element[] {
  const baseZindex = 10;

  if (props.type === CardType.OpenCell) {
    const { cards } = props;
    return [
      <Card key="open-0" type={CardType.OpenCell} />,
      <Card key="0" {...cards[0]} style={{ zIndex: baseZindex + 1 }} />
    ];
  }

  if (props.type === CardType.OpenFundation) {
    const { cards, suit } = props;
    return [
      <Card
        key="fundation-0"
        type={CardType.OpenFundation}
        suit={suit}
        style={{ zIndex: baseZindex }}
      />,
      ...cards.map((card, index) => (
        <Card
          key={index}
          {...card}
          style={{ zIndex: baseZindex + (index + 1) }}
        />
      ))
    ];
  }

  const { cards } = props;
  return [
    <Card key="open-0" type={CardType.OpenCell} />,
    ...cards.map((card, index) => (
      <Card
        key={index}
        {...card}
        style={{
          zIndex: baseZindex + (index + 1),
          transform: `translateY(${30 * index}px)`
        }}
      />
    ))
  ];
}

const Deck: React.FC<DeckProps> = props => {
  const displayCards = getDisplayCard(props);

  return <Container>{displayCards}</Container>;
};

export default Deck;
