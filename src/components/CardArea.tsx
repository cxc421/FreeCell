import React from 'react';
import styled from 'styled-components';
import Card, { CardType, CardSuit } from './Card';

const Container = styled.div`
  position: relative;
  width: 1280px;
  height: 645px;
  /* background: rgba(0, 0, 0, 0.1); */
  padding: 0 60px;
`;

const TopArea = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TempArea = styled.div`
  display: flex;
  > * {
    margin-right: 30px;
  }
`;

const ResultArea = styled.div`
  display: flex;
  justify-content: flex-end;
  > * {
    margin-left: 30px;
  }
`;

const BottomArea = styled.div`
  /* margin-top: 30px; */
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

const CardArea = () => {
  return (
    <Container>
      <TopArea>
        <TempArea>
          <Card type={CardType.OpenCell} />
          <Card type={CardType.OpenCell} />
          <Card type={CardType.OpenCell} />
          <Card type={CardType.OpenCell} />
        </TempArea>
        <ResultArea>
          <Card type={CardType.OpenFundation} suit={CardSuit.Spade} />
          <Card type={CardType.OpenFundation} suit={CardSuit.Heart} />
          <Card type={CardType.OpenFundation} suit={CardSuit.Club} />
          <Card type={CardType.OpenFundation} suit={CardSuit.Diamond} />
        </ResultArea>
      </TopArea>
      <BottomArea>{testAllCards()}</BottomArea>
    </Container>
  );
};

export default CardArea;
