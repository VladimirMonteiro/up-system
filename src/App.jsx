import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authProvider/AuthContext';

// Pages
import Login from './pages/login/Login';
import { DashboardHome } from './pages/admin/Home/index.jsx';
import CreateRent from './modules/rents/pages/CreateRent';
import Clients from './pages/admin/clients/Clients';
import Tools from './modules/tools/pages/Tools/';
import Rents from './modules/rents/pages/Rents';
import PdfPage from './modules/pdf/pages/RentPdfPage';
import Earnings from './pages/admin/earnings/Earninigs';
import Expenses from './pages/admin/expenses/Expenses';
import SingleRent from './pages/singleRent/SingleRent';
import SingleClient from './pages/admin/singleClient/SingleClient';
import SingleTool from './modules/tools/pages/SingleTool';
import Budgets from './pages/admin/budgets/Budgets';
import CreateBudget from './pages/admin/createBudget/CreateBudget';
import BudgetPdf from './components/pdf/BudgetPdf';
import ReportPDF from './components/pdf/ReportPDF';

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
                <Route path='/ferramentas' element={<Tools />} />
                <Route path='/ferramentas/:id' element={<SingleTool />} />
                <Route path='/alugueis' element={<Rents />} />
                <Route path='/alugueis/:id' element={<SingleRent />} />
                <Route path='/faturamentos' element={<Earnings />} />
                <Route path='/gastos' element={<Expenses />} />
                <Route path='/orcamentos' element={<Budgets />} />
                <Route path='/criar-orcamento' element={<CreateBudget />} />
                <Route path='/pdf' element={<PdfPage />} />
                <Route path='/orcamento-pdf' element={<BudgetPdf />} />
                <Route path='/emitir-relatorio' element={<ReportPDF />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
