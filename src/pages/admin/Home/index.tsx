import { Heading } from '../../../components/Heading';
import { Row, Spin } from 'antd';
import { Kpis } from './components/Kpis';
import { Graphic } from './components/Graphic';
import { Actions } from './components/Actions';
import { RecentRents } from './components/RecentsRents';
import { MostCategories } from './components/MostCategories';
import { useHomeDashboard } from '../../../hooks/useHomeDashboard';

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
