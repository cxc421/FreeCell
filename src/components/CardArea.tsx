import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 1280px;
  height: 645px;
  background: rgba(0, 0, 0, 0.1);
  transform-origin: center top;
`;

function useScale(containerRef: React.RefObject<HTMLDivElement>) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function resize() {
      const container = containerRef.current;
      if (!container) return;

      const width = 1280;
      const height = 645;
      const parent = container.parentNode as HTMLDivElement;
      let { clientWidth, clientHeight } = parent;
      let newScale = clientWidth / width;
      if (height * newScale > clientHeight) {
        newScale = clientHeight / height;
      }
      setScale(newScale);
    }

    window.addEventListener('resize', resize);
    resize();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [containerRef]);

  return scale;
}

const CardArea = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useScale(containerRef);

  return (
    <Container
      ref={containerRef}
      style={{
        transform: `scale(${scale})`
      }}
    >
      123
    </Container>
  );
};

export default CardArea;
