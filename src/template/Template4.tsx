import React from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import kingImgSrc from '../assets/pic-king.png';
import { ReactComponent as Logo } from '../assets/logo.svg';

const CenterBlock = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledLogo = styled(Logo)`
  margin-top: 20px;
  width: 245px;
`;

const StartBtn = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 27px;
  margin-top: 45px;
  width: 185px;
  height: 55px;
  border: solid 3px #82d5e8;
  color: #82d5e8;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
  > span {
    margin-top: -3px;
  }
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #82d5e8;
    color: white;
  }
`;

const Template4 = () => {
  return (
    <Layout highBg={false}>
      <CenterBlock>
        <img src={kingImgSrc} alt="king icon" />
        <StyledLogo />
        <StartBtn>
          <span>開始遊戲</span>
        </StartBtn>
      </CenterBlock>
    </Layout>
  );
};

export default Template4;
