import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CardType, CardSuit } from './Card';
import Deck from './Deck';

const Container = styled.div`
  position: relative;
  width: 1280px;
  height: 645px;
  /* background: rgba(0, 0, 0, 0.1); */
  padding: 0 60px;
  transform-origin: center top;
  transform: scale(1);
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

const useScale = (): number => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function resize() {
      const width = 1280;
      const height = 645;
      let { clientWidth, clientHeight } = document.body;
      clientHeight -= 155;
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
  }, []);

  return scale;
};

const DeckArea = () => {
  const scale = useScale();
  const containerStyle = {
    transform: `scale(${scale})`
  };

  return (
    <Container style={containerStyle}>
      <Row>
        <LeftArea>
          <Deck
            type={CardType.OpenCell}
            cards={[
              {
                type: CardType.Card,
                suit: CardSuit.Club,
                number: 13
              }
            ]}
          />
          <Deck
            type={CardType.OpenCell}
            cards={[
              {
                type: CardType.Card,
                suit: CardSuit.Diamond,
                number: 12
              }
            ]}
          />
          <Deck
            type={CardType.OpenCell}
            cards={[
              {
                type: CardType.Card,
                suit: CardSuit.Spade,
                number: 11
              }
            ]}
          />
          <Deck
            type={CardType.OpenCell}
            cards={[
              {
                type: CardType.Card,
                suit: CardSuit.Heart,
                number: 10
              }
            ]}
          />
        </LeftArea>
        <RightArea>
          <Deck
            type={CardType.OpenFundation}
            suit={CardSuit.Spade}
            cards={[
              {
                type: CardType.Card,
                suit: CardSuit.Spade,
                number: 3
              }
            ]}
          />
          <Deck
            type={CardType.OpenFundation}
            suit={CardSuit.Heart}
            cards={[
              {
                type: CardType.Card,
                suit: CardSuit.Heart,
                number: 4
              }
            ]}
          />
          <Deck
            type={CardType.OpenFundation}
            suit={CardSuit.Club}
            cards={[
              {
                type: CardType.Card,
                suit: CardSuit.Club,
                number: 5
              }
            ]}
          />
          <Deck
            type={CardType.OpenFundation}
            suit={CardSuit.Diamond}
            cards={[
              {
                type: CardType.Card,
                suit: CardSuit.Diamond,
                number: 6
              }
            ]}
          />
        </RightArea>
      </Row>
      <Row style={{ marginTop: 30 }}>
        <LeftArea>
          <Deck
            type={CardType.Card}
            cards={[
              {
                type: CardType.Card,
                suit: CardSuit.Heart,
                number: 13
              },
              {
                type: CardType.Card,
                suit: CardSuit.Heart,
                number: 12
              },
              {
                type: CardType.Card,
                suit: CardSuit.Spade,
                number: 11
              },
              {
                type: CardType.Card,
                suit: CardSuit.Diamond,
                number: 10
              },
              {
                type: CardType.Card,
                suit: CardSuit.Diamond,
                number: 9
              },
              {
                type: CardType.Card,
                suit: CardSuit.Club,
                number: 8
              },
              {
                type: CardType.Card,
                suit: CardSuit.Spade,
                number: 7
              },
              {
                type: CardType.Card,
                suit: CardSuit.Spade,
                number: 6
              },
              {
                type: CardType.Card,
                suit: CardSuit.Spade,
                number: 5
              },
              {
                type: CardType.Card,
                suit: CardSuit.Spade,
                number: 4
              },
              {
                type: CardType.Card,
                suit: CardSuit.Spade,
                number: 3
              }
              // {
              //   type: CardType.Card,
              //   suit: CardSuit.Spade,
              //   number: 2
              // },
              // {
              //   type: CardType.Card,
              //   suit: CardSuit.Spade,
              //   number: 1
              // }
            ]}
          />
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
