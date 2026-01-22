import { Resolution, Margin } from 'react-to-pdf';

export const pdfOptions = {
  method: 'open',
  resolution: Resolution.HIGH,
  page: {
    margin: Margin.SMALL,
    format: 'A4',
    orientation: 'portrait',
  },
  canvas: {
    mimeType: 'image/jpeg',
    qualityRatio: 0.8,
  },
  overrides: {
    pdf: { compress: true },
    canvas: { useCORS: false },
  },
};
