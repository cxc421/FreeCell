import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as BgMain } from '../assets/bg-img-main.svg';
import { ReactComponent as BgWellcome } from '../assets/bg-img-wellcome.svg';

interface Props {
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
      const vH = offsetType === 'bottom' ? offset : clientHeight - offset + 30;
      const vW = clientWidth;
      let newScale = vW / w;
      if (newScale * h < vH) {
        newScale = vH / h;
      }
      setScale(newScale);
    }

    window.addEventListener('resize', resize);
    window.dispatchEvent(new Event('resize'));

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [w, h, offset, offsetType]);

  return scale;
};

function useBgImg(highBg: boolean, style?: React.CSSProperties) {
  const BgImg = highBg ? BgMain : BgWellcome;
  const bgWidth = 1280;
  const bgHeight = highBg ? 617 : 288;
  const offset = highBg ? 193 : 271;
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
        transition: 'opacity 300ms',
        width: bgWidth,
        ...style
      }}
    />
  );
}

const Background: React.FC<Props> = ({ highBg = false }) => {
  const bgImgLow = useBgImg(false, {
    opacity: 1
  });
  const bgImgHigh = useBgImg(true, {
    opacity: highBg ? 1 : 0
  });

  return (
    <Container>
      <BgWrapper>
        {bgImgLow}
        {bgImgHigh}
      </BgWrapper>
    </Container>
  );
};

export default Background;
