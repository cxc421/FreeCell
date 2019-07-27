import React, { PureComponent } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import Card, { CardType, CardSuit } from './Card';
import { CardState } from '../CardState';

// const defaultCardAreaWidth = 1280;
// const defaultCardWidth = 100;
// const defaultCardHeight = 140;
// const defaultHorizontalPadding = 30;
// const defaultCardAreaHeight = 645;
// const defaultCardAreaRatio = defaultCardAreaWidth / defaultCardAreaHeight;

interface CardAreaProps extends CardState {}

interface CardJqueryMap {
  [key: string]: JQuery<HTMLDivElement>;
}

interface CanGrabIds {
  [key: string]: string;
}

const Container = styled.div`
  width: 1280px;
  height: 645px;
  background: rgba(255, 50, 240, 0.2);
  transform-origin: center top;
  position: relative;
  flex-shrink: 0;

  .can-grab {
    cursor: grab;
  }

  .grabbing {
    cursor: grabbing !important;
  }
`;

class CardArea extends PureComponent<CardAreaProps> {
  cardAreaRef = React.createRef<HTMLDivElement>();
  $cardArea: JQuery<HTMLDivElement> = $('');
  resizeKey: number | undefined = undefined;
  $cardMap: CardJqueryMap = {};
  canGrabIds: CanGrabIds = {};
  $movingCard: JQuery<HTMLDivElement> | null = null;

  getJqueryDom(id: string) {
    if (this.$cardMap[id]) return this.$cardMap[id];
    return (this.$cardMap[id] = this.$cardArea.find(id));
  }

  computeCanGrabIds() {
    const { decks, cells } = this.props;
    const canGrabIds: CanGrabIds = {};

    const $prevCanGrabCards = this.$cardArea.find('.can-grab');
    $prevCanGrabCards.removeClass('can-grab');

    decks.forEach(deck => {
      const deckLen = deck.length;
      if (deckLen > 0) {
        const card = deck[deckLen - 1];
        const id = `#card-${card.suit}-${card.number}`;
        this.getJqueryDom(id).addClass('can-grab');
        canGrabIds[id] = id;
      }
    });
    cells.forEach(deck => {
      const deckLen = deck.length;
      if (deckLen > 0) {
        const card = deck[0];
        const id = `#card-${card.suit}-${card.number}`;
        this.getJqueryDom(id).addClass('can-grab');
        canGrabIds[id] = id;
      }
    });
    this.canGrabIds = canGrabIds;
  }

  onCardMouseDown = (suit: CardSuit, number: number) => {
    const id = `#card-${suit}-${number}`;
    if (this.canGrabIds.hasOwnProperty(id)) {
      this.$movingCard = this.getJqueryDom(id);
      this.$movingCard.addClass('grabbing');
    }
  };

  onWindowMouseUp = () => {
    if (this.$movingCard) {
      this.$movingCard.removeClass('grabbing');
      this.$movingCard = null;
    }
  };

  componentDidMount() {
    const cardAreaDom = this.cardAreaRef.current as HTMLDivElement;
    this.$cardArea = $(cardAreaDom);
    this.resizeContainer();
    this.initPlacementPos();
    this.updateCardPos();
    this.computeCanGrabIds();
    window.addEventListener('resize', this.resizeContainer);
    window.addEventListener('mouseup', this.onWindowMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeContainer);
    window.removeEventListener('mouseup', this.onWindowMouseUp);
    clearTimeout(this.resizeKey);
  }

  componentDidUpdate() {
    this.updateCardPos();
    this.computeCanGrabIds();
  }

  resizeContainer = () => {
    const viewHeight = document.documentElement.clientHeight - 155;
    const viewWidth = document.documentElement.clientWidth;
    const scale = Math.min(viewHeight / 645, viewWidth / 1280);

    this.$cardArea.css({
      transform: `scale(${scale})`
    });
  };

  onWindowResize = () => {
    clearTimeout(this.resizeKey);
    this.resizeKey = setTimeout(this.resizeContainer, 300);
  };

  initPlacementPos = () => {
    const xPos = [60, 190, 320, 450, 730, 860, 990, 1120];

    for (let i = 0; i < 4; i++) {
      const $cell = this.getJqueryDom(`#cell-${i}`);
      $cell.css({
        visibility: 'visible',
        left: xPos[i],
        top: 0
      });
      const $found = this.getJqueryDom(`#found-${i}`);
      $found.css({
        visibility: 'visible',
        left: xPos[i + 4],
        top: 0
      });
    }

    for (let i = 0; i < 8; i++) {
      const $deck = this.getJqueryDom(`#deck-${i}`);
      $deck.css({
        visibility: 'visible',
        left: xPos[i],
        top: 170
      });
    }
  };

  updateCardPos = () => {
    const { decks, cells, foundations } = this.props;
    const xPos = [60, 190, 320, 450, 730, 860, 990, 1120];
    const yPos = 170;

    decks.forEach((deck, deckIndex) => {
      const leftPos = xPos[deckIndex];
      deck.forEach((card, cardIndex) => {
        const $card = this.getJqueryDom(`#card-${card.suit}-${card.number}`);
        $card.css({
          visibility: 'visible',
          left: leftPos,
          top: yPos + 30 * cardIndex,
          zIndex: cardIndex + 1
        });
      });
    });

    cells.forEach((cell, cellIndex) => {
      const leftPos = xPos[cellIndex];
      cell.forEach((card, cardIndex) => {
        const $card = this.getJqueryDom(`#card-${card.suit}-${card.number}`);
        $card.css({
          visibility: 'visible',
          left: leftPos,
          top: 0,
          zIndex: cardIndex + 1
        });
      });
    });

    for (let foundIndex = 0; foundIndex < foundations.length; foundIndex++) {
      const found = foundations[foundIndex];
      const leftPos = xPos[foundIndex + 4];
      for (let cardIndex = 0; cardIndex < found.length; cardIndex++) {
        const card = found[cardIndex];
        const $card = this.getJqueryDom(`#card-${card.suit}-${card.number}`);
        $card.css({
          visibility: 'visible',
          left: leftPos,
          top: 0,
          zIndex: cardIndex + 1
        });
      }
    }
  };

  render() {
    const cardList: JSX.Element[] = [];
    const suitList = [
      CardSuit.Club,
      CardSuit.Diamond,
      CardSuit.Heart,
      CardSuit.Spade
    ];
    for (let i = suitList.length - 1; i >= 0; i--) {
      const suit = suitList[i];
      for (let number = 1; number <= 13; number++) {
        cardList.push(
          <Card
            type={CardType.Card}
            key={`card-${suit}-${number}`}
            id={`card-${suit}-${number}`}
            suit={suit}
            number={number}
            onMouseDown={() => this.onCardMouseDown(suit, number)}
          />
        );
      }
    }

    return (
      <Container ref={this.cardAreaRef}>
        {/* cell */}
        <Card type={CardType.OpenCell} id="cell-0" />
        <Card type={CardType.OpenCell} id="cell-1" />
        <Card type={CardType.OpenCell} id="cell-2" />
        <Card type={CardType.OpenCell} id="cell-3" />
        {/* found */}
        <Card type={CardType.OpenFundation} suit={CardSuit.Club} id="found-0" />
        <Card
          type={CardType.OpenFundation}
          suit={CardSuit.Diamond}
          id="found-1"
        />
        <Card
          type={CardType.OpenFundation}
          suit={CardSuit.Heart}
          id="found-2"
        />
        <Card
          type={CardType.OpenFundation}
          suit={CardSuit.Spade}
          id="found-3"
        />
        {/* deck  */}
        <Card type={CardType.OpenCell} id="deck-0" />
        <Card type={CardType.OpenCell} id="deck-1" />
        <Card type={CardType.OpenCell} id="deck-2" />
        <Card type={CardType.OpenCell} id="deck-3" />
        <Card type={CardType.OpenCell} id="deck-4" />
        <Card type={CardType.OpenCell} id="deck-5" />
        <Card type={CardType.OpenCell} id="deck-6" />
        <Card type={CardType.OpenCell} id="deck-7" />
        {/* card */}
        {cardList}
      </Container>
    );
  }
}

export default CardArea;
