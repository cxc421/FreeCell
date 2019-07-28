import React, { PureComponent } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import Card, { CardType, CardSuit } from './Card';
import { CardState } from '../CardState';

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
  /* background: rgba(255, 50, 240, 0.2); */
  transform-origin: 0 0;
  position: relative;
  left: 50%;
  flex-shrink: 0;

  .can-grab {
    cursor: grab;
  }

  .grabbing {
    cursor: grabbing !important;
    transition: all 0ms ease-in-out !important;
    z-index: 10000 !important;
  }

  .dropping {
    cursor: grabbing !important;
    z-index: 10000 !important;
  }

  .overlap {
    background: skyblue !important;
  }
`;

class CardArea extends PureComponent<CardAreaProps> {
  cardAreaRef = React.createRef<HTMLDivElement>();
  $cardArea: JQuery<HTMLDivElement> = $('');
  resizeKey: number | undefined = undefined;
  $cardMap: CardJqueryMap = {};
  canGrabIds: CanGrabIds = {};
  $movingCard: JQuery<HTMLDivElement> | null = null;
  movingCardOriTop = 0;
  movingCardOriLeft = 0;
  mouseDownPageX = 0;
  mouseDownPageY = 0;
  scale = 1;
  canCardMouseDown = true;
  canCardMove = false;
  canMovingCardDropIDs: string[] = [];
  $preOverlapDom: JQuery<HTMLDivElement> = $('');

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

  computeCanDropDoms(suit: CardSuit, number: number) {
    const { decks, cells, foundations } = this.props;
    const result: string[] = [];

    cells.forEach((cell, cellIndex) => {
      if (cell.length === 0) {
        const id = '#cell-' + cellIndex;
        result.push(id);
      }
    });

    const foundSuitList = [
      CardSuit.Club,
      CardSuit.Diamond,
      CardSuit.Heart,
      CardSuit.Spade
    ];
    for (let founIndex = foundations.length - 1; founIndex >= 0; founIndex--) {
      const foundSuit = foundSuitList[founIndex];
      if (foundSuit !== suit) {
        continue;
      }
      const found = foundations[founIndex];
      if (found.length === 0) {
        if (number === 1) {
          const id = '#found-' + founIndex;
          result.push(id);
        }
        break;
      }

      const lastCard = found[found.length - 1];
      if (lastCard.number === number - 1) {
        const id = `#card-${lastCard.suit}-${lastCard.number}`;
        result.push(id);
        break;
      }
    }

    let validSuit: { [key: string]: boolean } = {};
    if (suit === CardSuit.Club || suit === CardSuit.Spade) {
      validSuit[CardSuit.Diamond] = true;
      validSuit[CardSuit.Heart] = true;
    } else {
      validSuit[CardSuit.Club] = true;
      validSuit[CardSuit.Spade] = true;
    }

    decks.forEach((deck, deckIndex) => {
      if (deck.length === 0) {
        const id = `#deck-${deckIndex}`;
        result.push(id);
      } else {
        const lastCard = deck[deck.length - 1];
        if (lastCard.number === number + 1 && validSuit[lastCard.suit]) {
          const id = `#card-${lastCard.suit}-${lastCard.number}`;
          result.push(id);
        }
      }
    });

    this.canMovingCardDropIDs = result;
    console.log(result);
  }

  onCardMouseDown = (e: React.MouseEvent, suit: CardSuit, number: number) => {
    const id = `#card-${suit}-${number}`;
    if (this.canGrabIds.hasOwnProperty(id) && this.canCardMouseDown) {
      this.$movingCard = this.getJqueryDom(id);
      this.$movingCard.addClass('grabbing');
      this.movingCardOriTop = parseInt(this.$movingCard.css('top'), 10);
      this.movingCardOriLeft = parseInt(this.$movingCard.css('left'), 10);
      this.mouseDownPageX = e.pageX;
      this.mouseDownPageY = e.pageY;
      this.canCardMouseDown = false;
      this.canCardMove = true;
      this.computeCanDropDoms(suit, number);
    }
  };

  onWindowMouseMove = (e: MouseEvent) => {
    if (!this.$movingCard || !this.canCardMove) return;

    const newTop =
      this.movingCardOriTop + (e.pageY - this.mouseDownPageY) / this.scale;
    const newLeft =
      this.movingCardOriLeft + (e.pageX - this.mouseDownPageX) / this.scale;

    this.$movingCard.css({
      top: newTop,
      left: newLeft
    });

    this.checkOverlap(newTop, newLeft);
  };

  checkOverlap(top: number, left: number) {
    let $closest: JQuery<HTMLDivElement> | null = null;
    let minDis = Number.MAX_SAFE_INTEGER;

    this.canMovingCardDropIDs.forEach(id => {
      const $dom = this.getJqueryDom(id);
      const yDiff = Math.abs(top - parseInt($dom.css('top')));
      const xDiff = Math.abs(left - parseInt($dom.css('left')));
      if (xDiff < 100 && yDiff < 140) {
        const dis = Math.pow(xDiff, 2) + Math.pow(yDiff, 2);
        if (dis < minDis) {
          minDis = dis;
          $closest = $dom;
        }
      }
    });

    this.$preOverlapDom.removeClass('overlap');
    if ($closest) {
      let $tmp = $closest as JQuery<HTMLDivElement>;
      $tmp.addClass('overlap');
      this.$preOverlapDom = $tmp;
    }
  }

  onWindowMouseUp = () => {
    const $movingCard = this.$movingCard;
    if ($movingCard && this.canCardMove) {
      $movingCard.removeClass('grabbing');
      $movingCard.addClass('dropping');
      $movingCard.css({
        top: this.movingCardOriTop,
        left: this.movingCardOriLeft
      });
      this.canCardMove = false;
      setTimeout(() => {
        this.canCardMouseDown = true;
        $movingCard.removeClass('dropping');
      }, 200);

      this.$preOverlapDom.removeClass('overlap');
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
    window.addEventListener('mousemove', this.onWindowMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeContainer);
    window.removeEventListener('mouseup', this.onWindowMouseUp);
    window.removeEventListener('mousemove', this.onWindowMouseMove);
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
    this.scale = scale;

    this.$cardArea.css({
      transform: `scale(${scale}) translate(-50%)`
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
            onMouseDown={e => this.onCardMouseDown(e, suit, number)}
          />
        );
      }
    }

    return (
      <>
        <Container ref={this.cardAreaRef}>
          {/* cell */}
          <Card type={CardType.OpenCell} id="cell-0" />
          <Card type={CardType.OpenCell} id="cell-1" />
          <Card type={CardType.OpenCell} id="cell-2" />
          <Card type={CardType.OpenCell} id="cell-3" />
          {/* found */}
          <Card
            type={CardType.OpenFundation}
            suit={CardSuit.Club}
            id="found-0"
          />
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
      </>
    );
  }
}

export default CardArea;
