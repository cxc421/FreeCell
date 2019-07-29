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
// export type FoundationsType = [
//   SpadeCard[],
//   HeartCard[],
//   ClubCard[],
//   DiamondCard[]
// ];
export type FoundationsType = CellsType;

export interface PureCardState {
  cells: CellsType; // Need to check length 1
  foundations: FoundationsType; // Need to check order
  decks: DecksType;
}

export interface CardState extends PureCardState {
  score: number;
  prevScore: number;
}

export const defaultCardState: CardState = {
  cells: [[], [], [], []],
  foundations: [[], [], [], []],
  decks: getRandomDecks() as DecksType,
  score: 0,
  prevScore: 0
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
  MoveCardFromDeckToCell,
  MoveCardFromCellToDeck,
  MoveCardFromDeckToDeck,
  MoveCardFromCellToCell,
  MoveCardFromDeckToFound,
  MoveCardFromCellToFound
}

type Action = {
  type: ActionType;
  fromIndex: number;
  toIndex: number;
};

function reducer(state: CardState, action: Action): CardState {
  switch (action.type) {
    case ActionType.MoveCardFromDeckToCell: {
      const newDecks = Array.from(state.decks) as DecksType;
      const movedCard = newDecks[action.fromIndex].pop();
      const newCells = Array.from(state.cells) as CellsType;
      if (!movedCard) {
        return state;
      }
      newCells[action.toIndex].push(movedCard);

      return {
        ...state,
        decks: newDecks,
        cells: newCells,
        score: state.score > 0 ? state.score - 1 : 0,
        prevScore: state.score
      };
    }
    case ActionType.MoveCardFromCellToDeck: {
      const newDecks = Array.from(state.decks) as DecksType;
      const newCells = Array.from(state.cells) as CellsType;
      console.log({ fromIndex: action.fromIndex });
      const movedCard = newCells[action.fromIndex].pop();
      if (!movedCard) return state;
      newDecks[action.toIndex].push(movedCard);
      return {
        ...state,
        decks: newDecks,
        cells: newCells,
        score: state.score > 0 ? state.score - 1 : 0,
        prevScore: state.score
      };
    }
    case ActionType.MoveCardFromCellToCell: {
      const newCells = Array.from(state.cells) as CellsType;
      const movedCard = newCells[action.fromIndex].pop();
      if (!movedCard) return state;
      newCells[action.toIndex].push(movedCard);
      return {
        ...state,
        cells: newCells,
        score: state.score > 0 ? state.score - 1 : 0,
        prevScore: state.score
      };
    }
    case ActionType.MoveCardFromDeckToDeck: {
      const newDeck = Array.from(state.decks) as DecksType;
      const movedCard = newDeck[action.fromIndex].pop();
      if (!movedCard) return state;
      newDeck[action.toIndex].push(movedCard);
      return {
        ...state,
        decks: newDeck,
        score: state.score > 0 ? state.score - 1 : 0,
        prevScore: state.score
      };
    }
    case ActionType.MoveCardFromCellToFound: {
      const newCells = Array.from(state.cells) as CellsType;
      const newFound = Array.from(state.foundations) as FoundationsType;
      const movedCard = newCells[action.fromIndex].pop();
      if (!movedCard) return state;
      newFound[action.toIndex].push(movedCard);

      const diff = state.score - state.prevScore;
      const score = state.score + (diff > 0 ? diff * 2 : 10);

      return {
        ...state,
        cells: newCells,
        foundations: newFound,
        score,
        prevScore: state.score
      };
    }
    case ActionType.MoveCardFromDeckToFound: {
      const newDecks = Array.from(state.decks) as DecksType;
      const newFound = Array.from(state.foundations) as FoundationsType;
      const movedCard = newDecks[action.fromIndex].pop();
      if (!movedCard) return state;
      newFound[action.toIndex].push(movedCard);

      const diff = state.score - state.prevScore;
      const score = state.score + (diff > 0 ? diff * 2 : 10);

      return {
        ...state,
        decks: newDecks,
        foundations: newFound,
        score,
        prevScore: state.score
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

  function moveCardFromDeckToCell(fromIndex: number, toIndex: number) {
    // console.log(fromIndex, toIndex);

    dispatch({
      type: ActionType.MoveCardFromDeckToCell,
      fromIndex,
      toIndex
    });
    // decreaseScore();
  }

  function moveCardFromCellToDeck(fromIndex: number, toIndex: number) {
    dispatch({
      type: ActionType.MoveCardFromCellToDeck,
      fromIndex,
      toIndex
    });
  }

  function moveCardFromCellToCell(fromIndex: number, toIndex: number) {
    dispatch({
      type: ActionType.MoveCardFromCellToCell,
      fromIndex,
      toIndex
    });
  }

  function moveCardFromDeckToDeck(fromIndex: number, toIndex: number) {
    dispatch({
      type: ActionType.MoveCardFromDeckToDeck,
      fromIndex,
      toIndex
    });
  }

  function moveCardFromCellToFound(fromIndex: number, toIndex: number) {
    dispatch({
      type: ActionType.MoveCardFromCellToFound,
      fromIndex,
      toIndex
    });
  }

  function moveCardFromDeckToFound(fromIndex: number, toIndex: number) {
    dispatch({
      type: ActionType.MoveCardFromDeckToFound,
      fromIndex,
      toIndex
    });
  }

  return {
    ...state,
    moveCardFromDeckToCell,
    moveCardFromCellToDeck,
    moveCardFromCellToCell,
    moveCardFromDeckToDeck,
    moveCardFromCellToFound,
    moveCardFromDeckToFound
  };
}
