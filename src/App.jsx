
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/authProvider/AuthContext"


// Pages
import Login from "./pages/login/Login"
import Home from "./pages/admin/home/Home"
import CreateRent from "./pages/admin/createRent/CreateRent"
import Clients from "./pages/admin/clients/Clients"
import Tools from "./pages/admin/tools/Tools"
import Rents from "./pages/admin/rents/Rents"
import Protected from "./components/Protected"
import PdfPage from "./components/pdf/Pdf"
import Earnings from "./pages/admin/earnings/Earninigs"
import Expenses from "./pages/admin/expenses/Expenses"
import ReportPDF from "./components/pdf/ReportPDF"



function App() {


  return (
    <div className="App">

      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicial" element={ <Protected> <Home/> </Protected> } />
            <Route path="/alugar" element={ <Protected> <CreateRent/> </Protected> } />
            <Route path="/clientes" element={ <Protected> <Clients/> </Protected> } />
            <Route path="/ferramentas" element={ <Protected> <Tools/> </Protected> } />
            <Route path="/alugueis" element={ <Protected> <Rents/> </Protected> } />
            <Route path="/faturamentos" element={ <Protected> <Earnings /> </Protected> } />
            <Route path="/gastos" element={ <Protected> <Expenses /> </Protected> } />
            <Route path="/pdf" element={ <Protected> <PdfPage/> </Protected> } />
            <Route path="/emitir-relatorio" element={ <Protected> <ReportPDF/> </Protected> } />
          
          </Routes>
        </Router>
      </AuthProvider>


    </div>

  )
}

export default App
