import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Background from './components/Background';
import IntroBlock from './components/IntroBlock';
import CtrlBtn from './components/CtrlBtn';
import CardArea from './components/CardArea';
import { ReactComponent as Logo } from './assets/logo.svg';
import { ReactComponent as PauseIcon } from './assets/icon-pause.svg';
import { ReactComponent as ReplayIcon } from './assets/icon-replay.svg';
import { ReactComponent as PrevStepIcon } from './assets/icon-prev-step.svg';
import { ReactComponent as QuestionIcon } from './assets/icon-question.svg';
import { secToTimeText, strPad2 } from './helper/time';
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

enum GameStatus {
  PLAY,
  PAUSE,
  WAIT
}

function useTime(gameStatus: GameStatus) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let key: undefined | number = undefined;
    if (gameStatus === GameStatus.PLAY) {
      key = setTimeout(() => {
        setTime(time + 1);
      }, 1000);
    } else if (gameStatus === GameStatus.WAIT) {
      setTime(0);
    }
    return () => {
      clearTimeout(key);
    };
  }, [gameStatus, time]);

  return time;
}

const App: React.FC = () => {
  const [page, setPage] = useState(Page.Intro);
  const [gameStatus, setGameStatus] = useState(GameStatus.WAIT);
  const time = useTime(gameStatus);
  const { score = 0 } = useCardState();
  // const allFoundationFill = !!!foundations.find(found => found.length !== 13);
  // console.log(allFoundationFill);

  const introWrapperStyle: React.CSSProperties = {
    opacity: page === Page.Intro ? 1 : 0,
    visibility: page === Page.Intro ? 'visible' : 'hidden'
  };
  const gameWrapperStyle: React.CSSProperties = {
    opacity: page === Page.Game ? 1 : 0,
    visibility: page === Page.Game ? 'visible' : 'hidden'
  };

  function onClickStartBtn() {
    setPage(Page.Game);
    setGameStatus(GameStatus.PLAY);
  }

  function showNotCompleteMsg() {
    alert('此功能未完成... _(:3 」∠ )_');
  }

  return (
    <>
      <Background highBg={page === Page.Game} />
      <Content>
        <div style={introWrapperStyle}>
          <IntroBlock onClickStartBtn={onClickStartBtn} />
        </div>
        <div style={gameWrapperStyle}>
          <TopRow>
            <StyledLogo />
            <BtnArea>
              <CtrlBtn
                SvgIcon={ReplayIcon}
                text="重玩"
                onClick={showNotCompleteMsg}
              />
              <CtrlBtn
                SvgIcon={PrevStepIcon}
                text="上一步"
                onClick={showNotCompleteMsg}
              />
              <CtrlBtn
                SvgIcon={PauseIcon}
                text="暫停"
                onClick={showNotCompleteMsg}
              />
            </BtnArea>
          </TopRow>
          <TimeScoreArea>
            <CtrlBtn
              SvgIcon={QuestionIcon}
              text="提示"
              textColor="white"
              iconColor="white"
              hoverStyle="color"
              onClick={showNotCompleteMsg}
            />
            <Time>Time: {secToTimeText(time)}</Time>
            <Score>Score: {strPad2(score)}</Score>
          </TimeScoreArea>
          <CardAreaWrapper>
            <CardArea />
          </CardAreaWrapper>
        </div>
      </Content>
    </>
  );
};

export default App;
