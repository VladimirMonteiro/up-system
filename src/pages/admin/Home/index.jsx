import { Heading } from '../../../components/Heading';
import { Row } from 'antd';
import { useHomeDashboard } from '../../../modules/home/hooks/useHomeDashboard';
import { Kpis } from '../../../modules/home/components/Kpis';
import { Graphic } from '../../../modules/home/components/Graphic';
import { Actions } from '../../../modules/home/components/Actions';
import { RecentRents } from '../../../modules/home/components/RecentsRents';
import { MostCategories } from '../../../modules/home/components/MostCategories';

export function DashboardHome() {
  const { dashboardData, loading } = useHomeDashboard();

  return (
    <>
      <Heading title='Dashboard' description='Bem-vindo ao painel de controle da Up Locações' />

      <div style={{ padding: 24 }}>
        {/* KPIs */}
        <Kpis data={dashboardData} loading={loading} />

        {/* GRÁFICO + AÇÕES */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Graphic data={dashboardData} loading={loading} />
          <Actions loading={loading} />
        </Row>

        {/* LISTA + PIE */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <RecentRents data={dashboardData} loading={loading} />
          <MostCategories data={dashboardData} loading={loading} />
        </Row>
      </div>
    </>
  );
}
