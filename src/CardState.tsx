import React from 'react';
import { CardSuit } from './components/Card';
import { getRandomIntInclusive } from './helper/number';

type SpadeCard = { suit: CardSuit.Spade; number: number };
type HeartCard = { suit: CardSuit.Heart; number: number };
type ClubCard = { suit: CardSuit.Club; number: number };
type DiamondCard = { suit: CardSuit.Diamond; number: number };
type Card = SpadeCard | HeartCard | ClubCard | DiamondCard;
export type DecksType = [
  Card[],
  Card[],
  Card[],
  Card[],
  Card[],
  Card[],
  Card[],
  Card[]
];
export type CellsType = [Card[], Card[], Card[], Card[]];
export type FoundationsType = [
  SpadeCard[],
  HeartCard[],
  ClubCard[],
  DiamondCard[]
];

export interface CardState {
  cells: CellsType; // Need to check length 1
  foundations: FoundationsType; // Need to check order
  decks: DecksType;
}

export const defaultCardState: CardState = {
  cells: [[], [], [], []],
  foundations: [[], [], [], []],
  decks: getRandomDecks() as DecksType
};

type ContextType = [CardState, React.Dispatch<Action>] | null;
const Context = React.createContext<ContextType>(null);

export function CardStateProvider(props: object): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, defaultCardState);
  const value = React.useMemo(() => [state, dispatch], [state]) as ContextType;
  return <Context.Provider value={value} {...props} />;
}

function getRandomDecks() {
  // initial
  const cardNum = 52;
  const deckNum = 8;
  const possibleCardsNumInDeck = [7, 7, 7, 7, 6, 6, 6, 6];
  const possibleCardValues = [];
  for (let i = 0; i < cardNum; i++) {
    possibleCardValues[i] = i;
  }
  const decks = [];

  // start random
  for (let deckIndex = 0; deckIndex < deckNum; deckIndex++) {
    const cardNumIndex = getRandomIntInclusive(
      0,
      possibleCardsNumInDeck.length - 1
    );
    const cardNum = possibleCardsNumInDeck[cardNumIndex];
    possibleCardsNumInDeck.splice(cardNumIndex, 1);

    const newDeck = [];
    for (let cardIndex = 0; cardIndex < cardNum; cardIndex++) {
      const cardValueIndex = getRandomIntInclusive(
        0,
        possibleCardValues.length - 1
      );
      const cardValue = possibleCardValues[cardValueIndex];
      possibleCardValues.splice(cardValueIndex, 1);

      const tmpNum = cardValue % 13;
      const suitValue = (cardValue - tmpNum) / 13;
      const number = tmpNum + 1;

      let suit;
      switch (suitValue) {
        case 0:
          suit = CardSuit.Club;
          break;
        case 1:
          suit = CardSuit.Spade;
          break;
        case 2:
          suit = CardSuit.Diamond;
          break;
        default:
          suit = CardSuit.Heart;
          break;
      }

      if (isNaN(number)) {
        console.error({
          cardValue,
          suitValue,
          number
        });
      }

      newDeck.push({
        suit,
        number
      });
    }

    decks.push(newDeck);
  }

  return decks;
}

enum ActionType {
  MoveCardFromDeckToCell
}

type MovaCardFromDeckToCellAction = {
  type: ActionType.MoveCardFromDeckToCell;
  deckIndex: number;
  cellIndex: number;
};

type Action = MovaCardFromDeckToCellAction;

function reducer(state: CardState, action: Action): CardState {
  switch (action.type) {
    case ActionType.MoveCardFromDeckToCell: {
      const newDecks = Array.from(state.decks) as DecksType;
      const movedCard = newDecks[action.deckIndex].pop();
      const newCells = Array.from(state.cells) as CellsType;
      if (!movedCard || newCells[action.cellIndex].length > 0) {
        return state;
      }
      newCells[action.cellIndex].push(movedCard);

      return {
        ...state,
        decks: newDecks,
        cells: newCells
      };
    }
    default:
      return state;
  }
}

export function useCardState() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useCardState must be used within a GlobalStateProvider`);
  }
  const [state, dispatch] = context;

  function moveDeckCardToCell(deckIndex: number, cellIndex: number) {
    dispatch({
      type: ActionType.MoveCardFromDeckToCell,
      deckIndex,
      cellIndex
    });
  }

  return {
    ...state,
    moveDeckCardToCell
  };
}
