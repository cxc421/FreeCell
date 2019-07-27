/**
 * Note: 當綁定事件的元素裡面有子元素的時候，鼠標經過綁定mouseover的當前元素以及它裡面的子元素的時候，都會觸發，而經過綁定mouseenter的元素時，只會在鼠標剛進入的時候觸發，當進入其子元素的時候，是不會再觸發的了。
 */
import React from 'react';
import styled, { css as _css } from 'styled-components';
import { ReactComponent as SpadeIcon } from '../assets/icon-spades.svg';
import { ReactComponent as ClubIcon } from '../assets/icon-club.svg';
import { ReactComponent as DiamondIcon } from '../assets/icon-diamond.svg';
import { ReactComponent as HeartIcon } from '../assets/icon-heart.svg';
import { ReactComponent as ElfIcon } from '../assets/pic-card-elf.svg';
import { ReactComponent as KnightIcon } from '../assets/pic-card-knight.svg';
import { ReactComponent as KingtIcon } from '../assets/pic-card-king.svg';

export const cardWidth = 100;
export const cardHeight = 140;

type OpenCellProps = {
  type: CardType.OpenCell;
  style?: React.CSSProperties;
  id?: string;
};
type OpenFundationProps = {
  type: CardType.OpenFundation;
  suit: CardSuit;
  style?: React.CSSProperties;
  id?: string;
};
export type NormalCardProps = {
  type: CardType.Card;
  suit: CardSuit;
  number: number;
  style?: React.CSSProperties;
  id?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
};
type CardProps = OpenCellProps | OpenFundationProps | NormalCardProps;

type ContainerProps = { type: CardType; suit?: CardSuit };
type CardCornerProps = { isRightBottom: boolean };

export enum CardType {
  Card,
  OpenCell,
  OpenFundation
}

export enum CardSuit {
  Spade, // 黑桃
  Heart, // 紅心
  Club, // 梅花
  Diamond // 方塊
}

const Container = styled.div<ContainerProps>`
  visibility: hidden;
  position: absolute;
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  border-radius: 5px;
  transform-origin: left top;
  transition: all 100ms ease-in-out;
  color: ${props =>
    props.suit === CardSuit.Heart || props.suit === CardSuit.Diamond
      ? '#F1697B'
      : '#565656'};

  ${props => {
    if (props.type === CardType.Card) {
      return _css`
        background: #F7F6F5;
        border: 1px solid #D9D9D9;
      `;
    }
    if (props.type === CardType.OpenCell) {
      return _css`
        background: #f7f6f5;
        border: 1px solid #afafaf;
      `;
    }
    if (props.type === CardType.OpenFundation) {
      return _css`
        background: #f7f6f5;
        box-shadow: 0px 3px 14px rgba(199, 199, 199, 1);

        display: flex;
        justify-content: center;
        align-items: center;
      `;
    }
  }};

  background: #f7f6f5;
  border: 1px solid #afafaf;
`;

function getIcon(suit: CardSuit) {
  switch (suit) {
    case CardSuit.Spade:
      return SpadeIcon;
    case CardSuit.Diamond:
      return DiamondIcon;
    case CardSuit.Heart:
      return HeartIcon;
    default:
      return ClubIcon;
  }
}

const CardCorner = styled.div<CardCornerProps>`
  position: absolute;
  font-weight: 900;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${props => {
    if (props.isRightBottom) {
      return _css`
        right: 7px;
        bottom: 0;
        transform-origin: center center;
        transform: rotate(180deg);
      `;
    } else {
      return _css`
        left: 7px;
        top: 0;
      `;
    }
  }};
`;

const CardCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function getCardContent({ suit, number }: NormalCardProps) {
  const Icon = getIcon(suit);
  let text = String(number);
  let textStyle: React.CSSProperties = {};
  if (number === 1) {
    text = 'A';
  } else if (number === 11) {
    text = 'J';
  } else if (number === 12) {
    text = 'Q';
    textStyle = { transform: 'translateY(-2px)' };
  } else if (number === 13) {
    text = 'K';
  }

  let centerContent;
  const baseIconStyle: React.CSSProperties = {
    width: 15,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };
  const getIconStyle = (style: React.CSSProperties = {}): React.CSSProperties =>
    Object.assign(style, baseIconStyle);

  switch (number) {
    case 1:
      centerContent = (
        <>
          <Icon style={baseIconStyle} />
        </>
      );
      break;
    case 2:
      centerContent = (
        <>
          <Icon style={Object.assign({ marginTop: -24 }, baseIconStyle)} />
          <Icon style={Object.assign({ marginTop: 24 }, baseIconStyle)} />
        </>
      );
      break;
    case 3:
      centerContent = (
        <>
          <Icon style={baseIconStyle} />
          <Icon style={Object.assign({ marginTop: -24 }, baseIconStyle)} />
          <Icon style={Object.assign({ marginTop: 24 }, baseIconStyle)} />
        </>
      );
      break;
    case 4:
      centerContent = (
        <>
          <Icon style={getIconStyle({ marginTop: -14, marginLeft: 17 })} />
          <Icon style={getIconStyle({ marginTop: 14, marginLeft: 17 })} />
          <Icon style={getIconStyle({ marginTop: -14, marginLeft: -17 })} />
          <Icon style={getIconStyle({ marginTop: 14, marginLeft: -17 })} />
        </>
      );
      break;
    case 5:
      centerContent = (
        <>
          <Icon style={getIconStyle()} />
          <Icon style={getIconStyle({ marginTop: -14, marginLeft: 17 })} />
          <Icon style={getIconStyle({ marginTop: 14, marginLeft: 17 })} />
          <Icon style={getIconStyle({ marginTop: -14, marginLeft: -17 })} />
          <Icon style={getIconStyle({ marginTop: 14, marginLeft: -17 })} />
        </>
      );
      break;
    case 6:
      centerContent = (
        <>
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: 24 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: -24 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: 0 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: 24 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: -24 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: 0 })} />
        </>
      );
      break;
    case 7:
      centerContent = (
        <>
          <Icon style={getIconStyle({ marginLeft: 0, marginTop: -12 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: 24 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: -24 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: 0 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: 24 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: -24 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: 0 })} />
        </>
      );
      break;
    case 8:
      centerContent = (
        <>
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: 36 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: 12 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: -12 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: -36 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: 36 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: 12 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: -12 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: -36 })} />
        </>
      );
      break;
    case 9:
      centerContent = (
        <>
          <Icon style={getIconStyle({ marginLeft: 0, marginTop: -24 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: 36 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: 12 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: -12 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: -36 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: 36 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: 12 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: -12 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: -36 })} />
        </>
      );
      break;
    case 10:
      centerContent = (
        <>
          <Icon style={getIconStyle({ marginLeft: 0, marginTop: 24 })} />
          <Icon style={getIconStyle({ marginLeft: 0, marginTop: -24 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: 36 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: 12 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: -12 })} />
          <Icon style={getIconStyle({ marginLeft: 17, marginTop: -36 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: 36 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: 12 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: -12 })} />
          <Icon style={getIconStyle({ marginLeft: -17, marginTop: -36 })} />
        </>
      );
      break;
    case 11:
      centerContent = (
        <>
          <ElfIcon style={{ height: 110 }} />
        </>
      );
      break;
    case 12:
      centerContent = (
        <>
          <KnightIcon style={{ height: 119 }} />
        </>
      );
      break;
    default:
      centerContent = (
        <>
          <KingtIcon style={{ height: 125 }} />
        </>
      );
  }

  return (
    <>
      <CardCorner isRightBottom={false}>
        <span style={textStyle}>{text}</span>
        <Icon style={{ width: 7 }} />
      </CardCorner>
      <CardCorner isRightBottom={true}>
        <span style={textStyle}>{text}</span>
        <Icon style={{ width: 7 }} />
      </CardCorner>
      <CardCenter>{centerContent}</CardCenter>
    </>
  );
}

function getFundationIcon(suit: CardSuit) {
  let Icon = getIcon(suit);

  const StyledIcon = styled(Icon)`
    width: 30px;
    path {
      fill: #eae6e4;
    }
  `;

  return <StyledIcon />;
}

const Card: React.FC<CardProps> = props => {
  if (props.type === CardType.Card) {
    const cardStyle = props.style ? { ...props.style } : {};

    return (
      <Container
        className="card"
        type={props.type}
        suit={props.suit}
        style={cardStyle}
        id={props.id}
        onMouseDown={props.onMouseDown}
      >
        {getCardContent(props)}
      </Container>
    );
  }

  if (props.type === CardType.OpenCell) {
    return <Container type={props.type} style={props.style} id={props.id} />;
  }

  if (props.type === CardType.OpenFundation) {
    return (
      <Container
        type={props.type}
        suit={props.suit}
        style={props.style}
        id={props.id}
      >
        {getFundationIcon(props.suit)}
      </Container>
    );
  }

  return null;
};

export default React.memo(Card);
