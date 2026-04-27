import { Col, Card, Skeleton } from 'antd';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardHomeResponse } from '../../../../services/homeService/types';

const COLORS = ['#1677ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96'];

type MostCategoriesProps = {
  data: DashboardHomeResponse | null;
  loading: boolean;
};

export function MostCategories({ data, loading }: MostCategoriesProps) {
  return (
    <Col xs={24} md={10}>
      <Card title='Categorias Mais Alugadas' style={{ borderRadius: 12 }}>
        <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
          {data && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Gráfico */}
              <div style={{ height: 240 }}>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={data?.categories}
                      dataKey='quantity'
                      nameKey='category'
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                    >
                      {data?.categories?.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>

                    <Tooltip formatter={(value) => [`${value}`, 'Quantidade']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legenda */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data?.categories?.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: COLORS[index % COLORS.length],
                        borderRadius: '50%',
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ fontSize: 13 }}>
                      {item.name} — <strong>{item.quantity}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Skeleton>
      </Card>
    </Col>
  );
}
