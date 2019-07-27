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
  grabCardMdX = 0;
  grabCardMdY = 0;
  state = {
    viewWidth: 0,
    viewHeight: 0,
    grabbingCardId: '',
    grabbingTop: 0,
    grabbingLeft: 0
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
          top: 155,
          left: k2 + k1 * i
        };
      }

      const foundationPos = [];
      for (let i = 0; i < 4; i++) {
        foundationPos[i] = {
          top: 155,
          left: k3 + k1 * (i + 3)
        };
      }

      const deckTop = cardHeight + horiPadding + 155;
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

  onCardMouseDown = (e: React.MouseEvent, id: string) => {
    const dom = document.getElementById(id) as HTMLDivElement;
    const { top, left } = dom.getBoundingClientRect();

    console.log({ top, left });

    this.grabCardMdX = e.pageX;
    this.grabCardMdY = e.pageY;

    this.setState({
      grabbingCardId: id,
      grabbingTop: top,
      grabbingLeft: left
    });
  };

  onWindowMouseMove = (e: MouseEvent) => {
    const { grabbingCardId } = this.state;
    if (grabbingCardId === '') return;

    const newMdX = e.pageX;
    const newMdY = e.pageY;

    this.setState((state: { grabbingTop: number; grabbingLeft: number }) => {
      // grabbingTop: grabbingTop + (newMdY - this.grabCardMdY),
      // grabbingLeft: grabbingLeft + (newMdX - this.grabCardMdX)
      return {
        grabbingTop: state.grabbingTop + (newMdY - this.grabCardMdY),
        grabbingLeft: state.grabbingLeft + (newMdX - this.grabCardMdX)
      };
    });

    this.grabCardMdX = newMdX;
    this.grabCardMdY = newMdY;
  };

  onWindowMouseUp = () => {
    this.setState({ grabbingCardId: '' });
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
    const { grabbingCardId, grabbingTop, grabbingLeft } = this.state;
    const cardListJSX: JSX.Element[] = [];

    const renderCard = (
      card: { suit: CardSuit; number: number },
      index: number,
      left: number,
      top: number,
      verShiift: number = 0,
      canDrag: boolean = false
    ) => {
      const id = `card-${card.suit}-${card.number}`;
      const isGrabingCard = id === grabbingCardId;

      if (!isGrabingCard) {
        cardListJSX.push(
          <Card
            id={id}
            key={id}
            type={CardType.Card}
            suit={card.suit}
            number={card.number}
            style={{
              top: top + verShiift * index,
              left,
              transform: `scale(${scale})`,
              zIndex: index + 1,
              cursor: canDrag ? 'grab' : 'default'
            }}
            onMouseDown={(e: React.MouseEvent) =>
              this.onCardMouseDown(e, canDrag ? id : '')
            }
          />
        );
      } else {
        cardListJSX.push(
          <Card
            id={id}
            key={id}
            type={CardType.Card}
            suit={card.suit}
            number={card.number}
            style={{
              top: grabbingTop,
              left: grabbingLeft,
              transform: `scale(${scale})`,
              zIndex: 9999,
              cursor: 'grabbing',
              transition: 'all 0ms ease-in-out'
            }}
          />
        );
      }
    };

    function renderPlacement(
      type: CardType,
      top: number,
      left: number,
      index: number,
      suit: CardSuit = CardSuit.Club
    ) {
      if (type === CardType.OpenCell || type === CardType.Card) {
        const id =
          type === CardType.OpenCell ? `cell-${index}` : `deck-${index}`;
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
      }
      if (type === CardType.OpenFundation) {
        const id = `foundation-${index}`;
        cardListJSX.push(
          <Card
            id={id}
            key={id}
            type={type}
            suit={suit}
            style={{
              top,
              left,
              transform: `scale(${scale})`,
              zIndex: 0
            }}
          />
        );
      }
    }

    cells.forEach((cell, cellIndex) => {
      const { top, left } = cellPos[cellIndex];
      renderPlacement(CardType.OpenCell, top, left, cellIndex);
      cell.forEach((card, index) =>
        renderCard(card, index, left, top, 0, true)
      );
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
      const suit = foundationSuits[foundIndex];
      renderPlacement(CardType.OpenFundation, top, left, foundIndex, suit);

      for (let cardIndex = 0; cardIndex < foundation.length; cardIndex++) {
        const card = foundation[cardIndex];
        renderCard(card, cardIndex, left, top, 0, false);
      }
    }

    decks.forEach((deck, deckIndex) => {
      const { top, left } = decksPos[deckIndex];
      renderPlacement(CardType.Card, top, left, deckIndex);

      const lastDeckIndex = deck.length - 1;
      deck.forEach((card, cardIndex) =>
        renderCard(
          card,
          cardIndex,
          left,
          top,
          vertShift,
          cardIndex === lastDeckIndex
        )
      );
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
