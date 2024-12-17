
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/authProvider/AuthContext"


// Pages
import Login from "./pages/login/Login"
import Home from "./pages/admin/home/Home"
import CreateRent from "./pages/admin/createRent/CreateRent"
import Clients from "./pages/admin/clients/Clients"
import Tools from "./pages/admin/tools/Tools"
import Rents from "./pages/admin/rents/Rents"
import Statistics from "./pages/admin/statistics/Statistics"


function App() {


  return (
    <div className="App">

      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inicial" element={<Home />} />
            <Route path="/alugar" element={<CreateRent />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/ferramentas" element={<Tools />} />
            <Route path="/alugueis" element={<Rents />} />
            <Route path="/relatorios" element={<Statistics />} />
          </Routes>
        </Router>
      </AuthProvider>


    </div>

  )
}

export default App
