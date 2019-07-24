import React from 'react';
import styled, { css as _css } from 'styled-components';

type HoverType = 'background' | 'color';

type TextColor = {
  textColor?: string;
};

type IconColor = {
  iconColor?: string;
};

type HoverStyle = {
  hoverStyle?: HoverType;
};

interface CtrlBtnProps extends TextColor, IconColor, HoverStyle {
  SvgIcon: React.FC<React.SVGProps<SVGSVGElement>>;
  text: string;
}

const Container = styled.div<HoverStyle>`
  position: relative;
  width: 60px;
  height: 70px;
  cursor: pointer;
  transition: background 0.2s;

  ${props => {
    if (props.hoverStyle === 'background') {
      return _css`
        &:hover {
          background: #f7f6f5;
        }
      `;
    } else {
      return _css`
        &:hover {
          * {
            color: gray !important;
            fill: gray !important;
          }
        }
      `;
    }
  }};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Text = styled.div<TextColor>`
  font-weight: 300;
  font-size: 15px;
  white-space: nowrap;
  color: ${props => props.textColor || '#58554f'};
  margin-top: 5px;
`;

const CtrlBtn: React.FC<CtrlBtnProps> = ({
  SvgIcon,
  text,
  textColor,
  iconColor,
  hoverStyle = 'background'
}) => {
  const StyledSvgIcon = styled(SvgIcon)`
    path,
    rect {
      fill: ${iconColor};
    }
  `;

  return (
    <Container hoverStyle={hoverStyle}>
      <StyledSvgIcon style={{ width: 25 }} />
      <Text textColor={textColor}>{text}</Text>
    </Container>
  );
};

export default CtrlBtn;
