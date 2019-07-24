import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as BgMain } from '../assets/bg-img-main.svg';
import { ReactComponent as BgWellcome } from '../assets/bg-img-wellcome.svg';

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
`;

const Content = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
`;

const BgWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const useOverScale = (
  w: number,
  h: number,
  offset: number,
  offsetType: 'top' | 'bottom'
): number => {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    function resize() {
      const { clientWidth, clientHeight } = document.body;
      const vH = offsetType === 'bottom' ? offset : clientHeight - offset;
      const vW = clientWidth;
      let newScale = vW / w;
      if (newScale * h < vH) {
        newScale = vH / h;
      }
      setScale(newScale);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('load', resize);

    return () => {
      console.log('clear');
      window.removeEventListener('resize', resize);
      window.removeEventListener('load', resize);
    };
  }, [w, h, offset, offsetType]);

  return scale;
};

function useBgImg(highBg: boolean) {
  const BgImg = highBg ? BgMain : BgWellcome;
  const bgWidth = 1280;
  const bgHeight = highBg ? 617 : 288;
  const offset = highBg ? 183 : 271;
  const offsetType = highBg ? 'top' : 'bottom';
  const scale = useOverScale(bgWidth, bgHeight, offset, offsetType);

  return (
    <BgImg
      style={{
        position: 'absolute',
        top: offsetType === 'top' ? offset : `calc(100% - ${offset}px)`,
        transformOrigin: 'center top',
        left: '50%',
        transform: `translateX(-50%) scale(${scale})`,
        width: bgWidth
      }}
    />
  );
}

const Layout: React.FC<LayoutProps> = ({ children, highBg = false }) => {
  // const BgImg = BgMain;
  // const scale = useOverScaleTopOffset(1280, 617, 183);
  // const bgStyle: React.CSSProperties = {
  //   position: 'absolute',
  //   top: 183,
  //   transformOrigin: 'center top',
  //   left: '50%',
  //   transform: `translateX(-50%) scale(${scale})`,
  //   width: 1280
  // };

  // const BgImg = BgWellcome;
  // const scale = useOverScaleBottomOffset(1280, 288, 271);
  // const bgStyle: React.CSSProperties = {
  //   position: 'absolute',
  //   top: `calc(100% - ${271}px)`,
  //   transformOrigin: 'center top',
  //   left: '50%',
  //   transform: `translateX(-50%) scale(${scale})`,
  //   width: 1280
  // };
  const bgImg = useBgImg(highBg);

  return (
    <Container>
      <BgWrapper>{bgImg}</BgWrapper>
      <Content>{children}</Content>
    </Container>
  );
};

export default Layout;
