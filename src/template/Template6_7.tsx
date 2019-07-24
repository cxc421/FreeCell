import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as PauseIcon } from '../assets/icon-pause.svg';
import { ReactComponent as ReplayIcon } from '../assets/icon-replay.svg';
import { ReactComponent as PrevStepIcon } from '../assets/icon-prev-step.svg';
import { ReactComponent as QuestionIcon } from '../assets/icon-question.svg';
import CtrlBtn from '../components/CtrlBtn';
import DeckArea from '../components/DeckArea';

const StyledLogo = styled(Logo)`
  position: absolute;
  top: 30px;
  left: 50px;
  width: 220px;
`;

const BtnArea = styled.div`
  position: absolute;
  right: 50px;
  top: 30px;
  /* background: pink; */
  display: flex;

  > * {
    margin-left: 6px;
  }
`;

const DeckAreaWrapper = styled.div`
  position: absolute;
  height: calc(100% - 155px);
  width: 100%;
  top: 155px;
  /* background: rgba(250, 250, 250, 0.7); */

  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const BottomWrapper = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 26px;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: white;
  /* background: pink; */
`;

const Score = styled.div`
  font-weight: bold;
  font-size: 26px;
`;

const Time = styled.div`
  font-size: 42px;
  font-weight: 300;
`;

const Template6 = () => {
  return (
    <Layout highBg={true}>
      <StyledLogo />
      <BtnArea>
        <CtrlBtn SvgIcon={ReplayIcon} text="重玩" />
        <CtrlBtn SvgIcon={PrevStepIcon} text="上一步" />
        <CtrlBtn SvgIcon={PauseIcon} text="暫停" />
      </BtnArea>
      <DeckAreaWrapper>
        <DeckArea />
      </DeckAreaWrapper>
      <BottomWrapper>
        <CtrlBtn
          SvgIcon={QuestionIcon}
          text="提示"
          textColor="white"
          iconColor="white"
          hoverStyle="color"
        />
        <Time>Time: 2:19</Time>
        <Score>Score: 02</Score>
      </BottomWrapper>
    </Layout>
  );
};

export default Template6;
