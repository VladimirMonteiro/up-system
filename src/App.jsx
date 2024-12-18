
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
import Protected from "./components/Protected"


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
            <Route path="/relatorios" element={ <Protected><Statistics /></Protected> } />
          </Routes>
        </Router>
      </AuthProvider>


    </div>

  )
}

export default App
