import React, { Component, createRef } from 'react';
import styled from 'styled-components';
import Card, { CardType, CardSuit } from './Card';
import { CardState } from '../CardState';

interface CardAreaProps extends CardState {}

type Pos = {
  top: number;
  left: number;
};

interface CardStyle {
  cellPos: Pos[];
  foundationPos: Pos[];
  decksPos: Pos[];
  scale: number;
  vertShift: number;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const defaultCardAreaWidth = 1280;
const defaultCardWidth = 100;
const defaultCardHeight = 140;
const defaultHorizontalPadding = 30;
const defaultCardAreaHeight = 645;
const defaultCardAreaRatio = defaultCardAreaWidth / defaultCardAreaHeight;

class CardArea extends Component<CardAreaProps> {
  containerRef = createRef<HTMLDivElement>();
  resizeKey: undefined | number = undefined;
  movingDom: HTMLDivElement | null = null;
  grabbing = false;
  state = {
    viewWidth: 0,
    viewHeight: 0
  };

  onWindowResize = () => {
    const container = this.containerRef.current;
    if (!container) return;

    clearTimeout(this.resizeKey);
    this.resizeKey = setTimeout(() => {
      this.setState({
        viewWidth: container.clientWidth,
        viewHeight: container.clientHeight
      });
    }, 300);
  };

  computeCardStyleInfo = (() => {
    let cacheCardStyle: null | CardStyle = null;
    let preViewWidth = 0;
    let preViewHeight = 0;

    return (cardAreaWidth: number, cardAreaHeight: number) => {
      if (preViewWidth === cardAreaWidth && preViewHeight === cardAreaHeight) {
        return cacheCardStyle;
      } else {
        preViewWidth = cardAreaWidth;
        preViewHeight = cardAreaHeight;
      }

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

      const cardWidth = scale * defaultCardWidth;
      const cardHeight = scale * defaultCardHeight;
      const horiPadding = scale * defaultHorizontalPadding;
      const leftPadding = 2 * horiPadding;
      const centerDis = 6 * horiPadding;
      const k1 = cardWidth + horiPadding;
      const k2 = pagePadding + leftPadding;
      const k3 = k2 + centerDis + cardWidth;

      const cellPos = [];
      for (let i = 0; i < 4; i++) {
        cellPos[i] = {
          top: 0,
          left: k2 + k1 * i
        };
      }

      const foundationPos = [];
      for (let i = 0; i < 4; i++) {
        foundationPos[i] = {
          top: 0,
          left: k3 + k1 * (i + 3)
        };
      }

      const deckTop = cardHeight + horiPadding;
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

      return (cacheCardStyle = {
        cellPos,
        foundationPos,
        decksPos,
        scale,
        vertShift: horiPadding
      });
    };
  })();

  onCardMouseDown = (id: string) => {
    this.movingDom = document.getElementById(id) as HTMLDivElement;
  };

  onWindowMouseMove = () => {};

  onWindowMouseUp = () => {
    if (this.movingDom) {
      this.movingDom = null;
    }
  };

  getCardListJSX(): JSX.Element[] {
    const { viewWidth, viewHeight } = this.state;
    if (!viewWidth || !viewHeight) return [];
    const cardStyleInfo = this.computeCardStyleInfo(viewWidth, viewHeight);
    if (!cardStyleInfo) return [];
    const {
      cellPos,
      foundationPos,
      decksPos,
      scale,
      vertShift
    } = cardStyleInfo;
    const { cells, foundations, decks } = this.props;
    const cardListJSX: JSX.Element[] = [];

    cells.forEach((cell, cellIndex) => {
      const { top, left } = cellPos[cellIndex];

      const id = `cells-${cellIndex}`;
      cardListJSX.push(
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
        cardListJSX.push(
          <Card
            id={id}
            key={id}
            type={CardType.Card}
            suit={card.suit}
            number={card.number}
            style={{
              top,
              left,
              transform: `scale(${scale})`,
              zIndex: index + 1,
              cursor: 'grab'
            }}
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
      cardListJSX.push(
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
        cardListJSX.push(
          <Card
            id={id}
            key={id}
            type={CardType.Card}
            suit={card.suit}
            number={card.number}
            style={{
              top,
              left,
              transform: `scale(${scale})`,
              zIndex: cardIndex + 1
            }}
          />
        );
      }
    }

    decks.forEach((deck, deckIndex) => {
      const { top, left } = decksPos[deckIndex];

      const id = `deck-${deckIndex}`;
      cardListJSX.push(
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
        cardListJSX.push(
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
            onMouseDown={() => this.onCardMouseDown(id)}
          />
        );
      });
    });

    return cardListJSX;
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onWindowMouseMove);
    window.addEventListener('mouseup', this.onWindowMouseUp);
    this.onWindowResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onWindowMouseMove);
    window.removeEventListener('mouseup', this.onWindowMouseUp);
    clearTimeout(this.resizeKey);
  }

  render() {
    const cardListJSX = this.getCardListJSX();

    return <Container ref={this.containerRef}>{cardListJSX}</Container>;
  }
}

export default CardArea;
