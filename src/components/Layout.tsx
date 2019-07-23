import React from 'react';
import styled, { css as _css } from 'styled-components';
import { ReactComponent as BgImg } from '../assets/bg-img.svg';

interface LayoutProps {
  highBg?: boolean;
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
`;

const Content = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
`;

const styledBgBaseCss = _css`
  position: absolute;
  width: 100%;

  left: 50%;
  top: calc(100% - 287px);
  transform: translateX(-50%);
  transition: transform 0.3s ease-out;
  min-width: 1280px;

  // bottom: 0;
  // left: 0;
`;

const StyledBgLeft = styled(BgImg)`
  ${styledBgBaseCss};
  path:first-child {
    display: none;
  }
  z-index: 1;

  &[data-highbg='true'] {
    z-index: 0;
    transform-origin: center bottom;
    transform: translateX(-20%) scale(2.05);
  }
`;

const StyledBgRight = styled(BgImg)`
  ${styledBgBaseCss};
  path:last-child {
    display: none;
  }
  z-index: 0;

  &[data-highbg='true'] {
    z-index: 1;
    transform-origin: center bottom;
    transform: translateX(-86%) scale(2.25);
  }
`;

const Layout: React.FC<LayoutProps> = ({ children, highBg = false }) => {
  return (
    <Container>
      <StyledBgLeft data-highbg={highBg} />
      <StyledBgRight data-highbg={highBg} />
      <Content>{children}</Content>
    </Container>
  );
};

export default Layout;
