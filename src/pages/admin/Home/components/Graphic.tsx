import { Col, Card, Skeleton } from 'antd';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardHomeResponse } from '../../../../services/homeService/types';

type GraphicProps = {
  data: DashboardHomeResponse | null;
  loading: boolean;
};

export function Graphic({ data, loading }: GraphicProps) {
  return (
    <Col xs={24} md={16}>
      <Card title='Faturamento - Últimos Meses' style={{ borderRadius: 12 }}>
        <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
          {data && (
            <ResponsiveContainer width='100%' height={280}>
              <LineChart data={data.revenueByMonth}>
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Line dataKey='value' stroke='#1677ff' strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Skeleton>
      </Card>
    </Col>
  );
}
