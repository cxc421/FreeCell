import React, { useState } from 'react';
import styled from 'styled-components';
import Background from './components/Background';
import IntroBlock from './components/IntroBlock';
import CtrlBtn from './components/CtrlBtn';
import CardArea from './components/CardArea';
import { CardType } from './components/Card';
import { ReactComponent as Logo } from './assets/logo.svg';
import { ReactComponent as PauseIcon } from './assets/icon-pause.svg';
import { ReactComponent as ReplayIcon } from './assets/icon-replay.svg';
import { ReactComponent as PrevStepIcon } from './assets/icon-prev-step.svg';
import { ReactComponent as QuestionIcon } from './assets/icon-question.svg';
import { useCardState } from './CardState';

enum Page {
  Intro,
  Game
}

const topRowHeight = 155;

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  /* bottom: 0;
  right: 0; */
  height: 100%;
  width: 100%;
  min-height: 100%;
  user-select: none;
`;

const TopRow = styled.div`
  position: relative;
  height: ${topRowHeight}px;
`;

const CardAreaWrapper = styled.div`
  /* background: rgba(255, 0, 0, 0.2); */
  width: 100%;
  /* display: flex;
  align-items: flex-start;
  justify-content: center; */
  position: absolute;
`;

const StyledLogo = styled(Logo)`
  position: absolute;
  top: 30px;
  left: 42px;
  width: 181px;
`;

const BtnArea = styled.div`
  position: absolute;
  right: 42px;
  top: 33px;
  /* background: pink; */
  display: flex;

  > * {
    margin-left: 6px;
  }
`;

const TimeScoreArea = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 26px;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: white;
`;

const Score = styled.div`
  font-weight: bold;
  font-size: 26px;
`;

const Time = styled.div`
  font-size: 42px;
  font-weight: 300;
`;

const App: React.FC = () => {
  const [page, setPage] = useState(Page.Game);
  const {
    decks,
    foundations,
    cells,
    moveCardFromDeckToCell,
    moveCardFromCellToDeck,
    moveCardFromCellToCell,
    moveCardFromDeckToDeck,
    moveCardFromCellToFound,
    moveCardFromDeckToFound
  } = useCardState();

  function moveCard(
    fromType: CardType,
    fromIndex: number,
    toType: CardType,
    toIndex: number
  ) {
    if (fromType === CardType.Card) {
      if (toType === CardType.OpenCell) {
        moveCardFromDeckToCell(fromIndex, toIndex);
      } else if (toType === CardType.Card) {
        moveCardFromDeckToDeck(fromIndex, toIndex);
      } else {
        moveCardFromDeckToFound(fromIndex, toIndex);
      }
    } else {
      if (toType === CardType.Card) {
        moveCardFromCellToDeck(fromIndex, toIndex);
      } else if (toType === CardType.OpenCell) {
        moveCardFromCellToCell(fromIndex, toIndex);
      } else {
        moveCardFromCellToFound(fromIndex, toIndex);
      }
    }
  }

  if (page === Page.Game) {
    return (
      <>
        <Background highBg={true} />
        <Content>
          <TopRow>
            <StyledLogo />
            <BtnArea>
              <CtrlBtn SvgIcon={ReplayIcon} text="重玩" />
              <CtrlBtn SvgIcon={PrevStepIcon} text="上一步" />
              <CtrlBtn SvgIcon={PauseIcon} text="暫停" />
            </BtnArea>
          </TopRow>
          <TimeScoreArea>
            <CtrlBtn
              SvgIcon={QuestionIcon}
              text="提示"
              textColor="white"
              iconColor="white"
              hoverStyle="color"
            />
            <Time>Time: 2:19</Time>
            <Score>Score: 02</Score>
          </TimeScoreArea>
          <CardAreaWrapper>
            <CardArea
              cells={cells}
              decks={decks}
              foundations={foundations}
              moveCard={moveCard}
            />
          </CardAreaWrapper>
        </Content>
      </>
    );
  }

  return (
    <>
      <Background highBg={false} />
      <Content>
        <IntroBlock onClickStartBtn={() => setPage(Page.Game)} />
      </Content>
    </>
  );
};

export default App;
