import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/authProvider/AuthContext";

// Pages
import Login from "./pages/login/Login";
import Home from "./pages/admin/home/Home";
import CreateRent from "./pages/admin/createRent/CreateRent";
import Clients from "./pages/admin/clients/Clients";
import Tools from "./pages/admin/tools/Tools";
import Rents from "./pages/admin/rents/Rents";
import Protected from "./components/Protected";
import PdfPage from "./components/pdf/Pdf";
import Earnings from "./pages/admin/earnings/Earninigs";
import Expenses from "./pages/admin/expenses/Expenses";
import ReportPDF from "./components/pdf/ReportPDF";
import HeaderDefault from "./components/header/Header";
import SingleRent from "./pages/singleRent/SingleRent";
import SingleClient from "./pages/admin/singleClient/SingleClient";
import SingleTool from "./pages/admin/singleTool/SingleTool";
import Budgets from "./pages/admin/budgets/Budgets";
import CreateBudget from "./pages/admin/createBudget/CreateBudget";
import BudgetPdf from "./components/pdf/BudgetPdf";

// Componente HeaderControl (que usa useLocation para renderizar o HeaderDefault)
const HeaderControl = () => {
  const location = useLocation(); // Aqui usamos useLocation para pegar a URL atual

  // Condição para verificar se não estamos na página de login
  if (location.pathname !== "/") {
    return <HeaderDefault />;
  }
  return null; // Não renderiza nada caso seja a página de login
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          {/* O HeaderControl vai controlar a renderização do HeaderDefault */}
          <HeaderControl />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicial" element={<Protected><Home /></Protected>} />
            <Route path="/alugar" element={<Protected><CreateRent /></Protected>} />
            <Route path="/clientes" element={<Protected><Clients /></Protected>} />
            <Route path="/clientes/:id" element={<Protected><SingleClient /></Protected>} />
            <Route path="/ferramentas" element={<Protected><Tools /></Protected>} />
            <Route path="/ferramentas/:id" element={<Protected><SingleTool /></Protected>} />
            <Route path="/alugueis" element={<Protected><Rents /></Protected>} />
            <Route path="/alugueis/:id" element={<Protected><SingleRent /></Protected>} />
            <Route path="/faturamentos" element={<Protected><Earnings /></Protected>} />
            <Route path="/gastos" element={<Protected><Expenses /></Protected>} />
            <Route path="/pdf" element={<Protected><PdfPage /></Protected>} />
             <Route path="/orcamento-pdf" element={<Protected><BudgetPdf /></Protected>} />
            <Route path="/emitir-relatorio" element={<Protected><ReportPDF /></Protected>} />
            <Route path="/orçamentos" element={<Protected><Budgets/> </Protected>} />
            <Route path="/criar-orcamento" element={<Protected><CreateBudget /></Protected>} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
