import { useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import { useToolDetails } from '../../../modules/tools/hooks/useToolDetails';
import { ToolDetailsHeader } from '../../../modules/tools/components/ToolDetailsHeader';
import { KpiCards } from '../../../modules/tools/components/KpiCards';
import { ToolInformations } from '../../../modules/tools/components/ToolInformations';
import { RentHistoric } from '../../../modules/tools/components/RentHistoric';

export function ToolDetails() {
  const { id } = useParams();

  const { tool, loading, error } = useToolDetails(id);

  if (loading)
    return (
      <div style={{ padding: '24px' }}>
        <Skeleton active />
      </div>
    );
  if (error || !tool) return <div style={{ padding: '24px' }}>Erro ao carregar ferramenta.</div>;

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: '24px' }}>
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
