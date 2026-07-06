import { useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import { ToolDetailsHeader } from './components/ToolDetailsHeader';
import { KpiCards } from './components/KpiCards';
import { ToolInformations } from './components/ToolInformations';
import { RentHistoric } from './components/RentHistoric';
import { useToolDetails } from '../../../hooks/useToolsDetails';

export function ToolDetails() {
  const { id: number } = useParams();

  const { tool, loading, error } = useToolDetails();

  if (loading)
    return (
      <div style={{ padding: '24px' }}>
        <Skeleton active />
      </div>
    );
  if (error || !tool) return <div style={{ padding: '24px' }}>Erro ao carregar ferramenta.</div>;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* --- HEADER --- */}
      <ToolDetailsHeader tool={tool} />

      {/* --- KPI CARDS --- */}
      <KpiCards tool={tool} />

      {/* --- INFORMAÇÕES DA FERRAMENTA --- */}
      <ToolInformations tool={tool} />

      {/* --- HISTÓRICO DE LOCAÇÕES --- */}
      <RentHistoric tool={tool} />
    </div>
  );
}

export default ToolDetails;
