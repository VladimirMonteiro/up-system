import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authProvider/AuthContext';

// Pages
import { Login } from './pages/Login';
import { DashboardHome } from './pages/admin/Home/index.jsx';
import CreateRent from './modules/rents/pages/CreateRent';
import Clients from './pages/admin/clients/Clients';
import { ToolsManager } from './pages/admin/ToolsManager';
import { RentsManager } from './pages/admin/RentsManager';
import Earnings from './pages/admin/earnings/Earninigs';
import Expenses from './pages/admin/expenses/Expenses';
import SingleRent from './pages/admin/singleRent/SingleRent.jsx';
import SingleClient from './pages/admin/singleClient/SingleClient';
import { ToolDetails } from './pages/admin/ToolDetails';
import Budgets from './pages/admin/budgets/Budgets';
import CreateBudget from './pages/admin/createBudget/CreateBudget';

// Layouts
import Protected from './components/Protected';
import AdminLayout from './components/layout/AdminLayout.jsx';

function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Login (SEM header) */}
            <Route path='/' element={<Login />} />

            {/* Rotas protegidas */}
            <Route element={<Protected />}>
              <Route element={<AdminLayout />}>
                <Route path='/inicial' element={<DashboardHome />} />
                <Route path='/alugar' element={<CreateRent />} />
                <Route path='/clientes' element={<Clients />} />
                <Route path='/clientes/:id' element={<SingleClient />} />
                <Route path='/ferramentas' element={<ToolsManager />} />
                <Route path='/ferramentas/:id' element={<ToolDetails />} />
                <Route path='/alugueis' element={<RentsManager />} />
                <Route path='/alugueis/:id' element={<SingleRent />} />
                <Route path='/faturamentos' element={<Earnings />} />
                <Route path='/gastos' element={<Expenses />} />
                <Route path='/orcamentos' element={<Budgets />} />
                <Route path='/criar-orcamento' element={<CreateBudget />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
