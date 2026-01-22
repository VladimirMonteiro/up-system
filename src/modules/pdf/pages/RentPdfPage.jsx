import { useLocation } from 'react-router-dom';
import RentPdf from '../templates/RentPdf';

const RentPdfPage = () => {
  const { state } = useLocation();

  if (!state) return null;

  return <RentPdf data={state} />;
};

export default RentPdfPage;
