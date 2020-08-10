import React, { useRef, useState, useLayoutEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from '@emotion/styled';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import ContentLoader from 'react-content-loader';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// https://github.com/wojtekmaj/react-pdf/issues/332#issuecomment-458121654
function removeTextLayerOffset() {
  const textLayers = document.querySelectorAll('.react-pdf__Page__textContent');
  textLayers.forEach((layer) => {
    if (layer instanceof HTMLElement) {
      const { style } = layer;
      style.top = '0';
      style.left = '0';
      style.transform = '';
    }
  });
}

const ResumeContainer = styled.div`
  max-width: 100%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;

const StyledLoader = styled(ContentLoader)`
  padding: 1rem;
`;

interface ResumeProps {
  path: string;
}

const Resume: React.FC<ResumeProps> = ({ path }) => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetDimensions = () => {
    setWidth(containerRef.current?.clientWidth ?? 0);
  };

  useLayoutEffect(() => {
    resetDimensions();
    window.addEventListener('resize', resetDimensions);
    return () => {
      window.removeEventListener('resize', resetDimensions);
    };
  }, []);

  return (
    <ResumeContainer ref={containerRef}>
      <Document
        file={path}
        renderMode="canvas"
        loading={<StyledLoader />}
        error={<div style={{ padding: '1em', textAlign: 'center' }}>Failed to load PDF file.</div>}
      >
        <Page pageNumber={1} width={width} renderMode="canvas" loading={<StyledLoader />} onLoadSuccess={removeTextLayerOffset} />
      </Document>
    </ResumeContainer>
  );
};

export default Resume;
