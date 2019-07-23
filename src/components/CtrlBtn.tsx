import React from 'react';
import styled from 'styled-components';

interface CtrlBtnProps {
  SvgIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  text: string;
}

const Container = styled.div`
  position: relative;
  width: 60px;
  height: 70px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f7f6f5;
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Text = styled.div`
  font-weight: 300;
  font-size: 15px;
  white-space: nowrap;
  color: #58554f;
  margin-top: 5px;
`;

const CtrlBtn: React.FC<CtrlBtnProps> = ({ SvgIcon, text }) => {
  return (
    <Container>
      <SvgIcon style={{ width: 25 }} />
      <Text>{text}</Text>
    </Container>
  );
};

export default CtrlBtn;
