import PdfHeader from '../components/PdfHeader';
import PdfItemsTable from '../components/PdfItemsTable';
import PdfSummary from '../components/PdfSummary';
import PdfSignatures from '../components/PdfSignatures';
import LocData from '../components/LocData';

import styles from '../styles/RentPdf.module.css';
import PdfLayout from '../layouts/PdfLayout';
import PdfPeriod from '../components/PdfPeriod';
import Clause from '../components/Clause';

const RentPdf = ({ data }) => {
  const up = {
    name: 'Up Locações de equipamentos LTDA',
    document: '40.094.239/0001-92',
    addresses: [
      {
        street: 'Avenida Presidente Vargas',
        number: '3630',
        neighborhood: 'Centro',
        city: 'Esteio',
        state: 'RS',
      },
    ],
    phones: ['(51) 99913-4363'],
    email: 'uplocacoes.rs@gmail.com',
  };
  return (
    <PdfLayout>
      <PdfHeader rent={data} />
      <LocData title='Contrato de Locação DADOS DO LOCADOR' client={up} />
      <LocData title='Dados do Locatário' client={data.client} />
      <PdfPeriod initialDate={data.initialDate} deliveryDate={data.deliveryDate} />
      <PdfItemsTable items={data.items} freight={data.freight} />
      <PdfSummary obs={data.obs} total={data.price} />
      <Clause />
      <PdfSignatures />
    </PdfLayout>
  );
};

export default RentPdf;
