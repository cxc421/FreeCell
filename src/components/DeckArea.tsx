import React from 'react';
import styled from 'styled-components';
import { CardType, CardSuit } from './Card';
import Deck from './Deck';

const Container = styled.div`
  position: relative;
  width: 1280px;
  height: 645px;
  background: rgba(0, 0, 0, 0.1);
  padding: 0 60px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftArea = styled.div`
  display: flex;
  > * {
    margin-right: 30px;
  }
`;

const RightArea = styled.div`
  display: flex;
  justify-content: flex-end;
  > * {
    margin-left: 30px;
  }
`;

/*
const TestBottomArea = styled.div`
  position: absolute;
  top: 170px;
  display: inline-flex;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100px * 13);
  flex-wrap: wrap;
`;

function testAllCards() {
  const suitList = [
    CardSuit.Heart,
    CardSuit.Diamond,
    CardSuit.Spade,
    CardSuit.Club
  ];
  const cardList = [];

  for (let i = 0; i < suitList.length; i++) {
    for (let j = 1; j <= 13; j++) {
      cardList.push(
        <Card
          key={`${i}-${j}`}
          type={CardType.Card}
          suit={suitList[i]}
          number={j}
        />
      );
    }
  }

  return cardList;
}
*/

const DeckArea = () => {
  return (
    <Container>
      <Row>
        <LeftArea>
          <Deck type={CardType.OpenCell} cards={[]} />
          <Deck type={CardType.OpenCell} cards={[]} />
          <Deck type={CardType.OpenCell} cards={[]} />
          <Deck type={CardType.OpenCell} cards={[]} />
        </LeftArea>
        <RightArea>
          <Deck
            type={CardType.OpenFundation}
            suit={CardSuit.Spade}
            cards={[]}
          />
          <Deck
            type={CardType.OpenFundation}
            suit={CardSuit.Heart}
            cards={[]}
          />
          <Deck type={CardType.OpenFundation} suit={CardSuit.Club} cards={[]} />
          <Deck
            type={CardType.OpenFundation}
            suit={CardSuit.Diamond}
            cards={[]}
          />
        </RightArea>
      </Row>
      <Row style={{ marginTop: 30 }}>
        <LeftArea>
          <Deck type={CardType.Card} cards={[]} />
          <Deck type={CardType.Card} cards={[]} />
          <Deck type={CardType.Card} cards={[]} />
          <Deck type={CardType.Card} cards={[]} />
        </LeftArea>
        <RightArea>
          <Deck type={CardType.Card} cards={[]} />
          <Deck type={CardType.Card} cards={[]} />
          <Deck type={CardType.Card} cards={[]} />
          <Deck type={CardType.Card} cards={[]} />
        </RightArea>
      </Row>
    </Container>
  );
};

export default DeckArea;
