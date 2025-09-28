import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// Gera cores dinâmicas (evita repetição)
const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 137.508) % 360; // Distribui as cores
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
};

// Formata valores para R$
const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const EarningChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Agrupar faturamento por mês e por cliente
  const monthlyTotals = {};
  const clientTotals = {};

  data.forEach((earning) => {
    const [day, month, year] = earning.dateOfEarn.split('/');
    const monthKey = `${month}/${year}`;

    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + earning.price;

    const clientName = earning.rent.client.name;
    clientTotals[clientName] = (clientTotals[clientName] || 0) + earning.price;
  });

  // Dados para o gráfico de barras (por mês)
  const barChartData = Object.keys(monthlyTotals).map((monthYear) => ({
    name: monthYear,
    faturamento: monthlyTotals[monthYear],
  }));

  // Organiza os clientes por faturamento
  const sortedClients = Object.entries(clientTotals)
    .sort(([, a], [, b]) => b - a);

  const topClients = sortedClients.slice(0, 6);
  const otherClients = sortedClients.slice(6);

  const otherTotal = otherClients.reduce((sum, [, value]) => sum + value, 0);

  // Dados para o gráfico de pizza (top 6 + "Outros")
  const pieChartData = [
    ...topClients.map(([name, value]) => ({ name, value })),
    ...(otherTotal > 0 ? [{ name: "Outros", value: otherTotal }] : [])
  ];

  const pieColors = generateColors(pieChartData.length);

  return (
    <div style={{ width: "100%", marginTop: "40px" }}>
      {/* GRÁFICO DE BARRAS - Faturamento por mês */}
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Faturamento por Mês</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barChartData} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="faturamento" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>

      {/* GRÁFICO DE PIZZA ou BARRA - Faturamento por cliente */}
      <h3 style={{ textAlign: "center", margin: "50px 0 20px" }}>Faturamento por Cliente</h3>
      <ResponsiveContainer width="100%" height={350}>
        {pieChartData.length <= 10 ? (
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        ) : (
          <BarChart data={pieChartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default EarningChart;
