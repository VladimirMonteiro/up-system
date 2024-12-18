import { useContext } from 'react'
import styles from './Navbar.module.css'
import { authContext } from '../../context/authProvider/AuthContext'
import { useNavigate, NavLink } from 'react-router-dom'

const Navbar = () => {


    const auth = useContext(authContext)
    const navigate = useNavigate()

    const handleLogout = () => {

        auth.logout()
        navigate("/")

    }

    return (
        <header className={styles.headerContainer}>
            <div className={styles.center}>

                <h1>Up Locações</h1>
                <p onClick={handleLogout}>Sair</p>

            </div>
            <nav className={styles.navContainer}>
                <ul>
                    <li><NavLink to="/inicial" className={({ isActive }) =>
                        isActive ? styles.active : ""
                    }>Inicial</NavLink></li>
                    <li><NavLink to="/alugar" className={({ isActive }) =>
                         isActive ? styles.active : ""
                    }>Alugar</NavLink></li>
                    <li><NavLink to="/ferramentas" className={({ isActive }) =>
                        isActive ? styles.active : ""
                    }>Ferramentas</NavLink></li>
                    <li><NavLink to="/clientes" className={({ isActive }) =>
                        isActive ? styles.active : ""
                    }>Clientes</NavLink></li>
                    <li><NavLink to="/alugueis" className={({ isActive }) =>
                        isActive ? styles.active : ""
                    }>Aluguéis</NavLink></li>
                    <li><NavLink to="/relatorios" className={({ isActive }) =>
                        isActive ? styles.active : ""
                    }>Relatórios</NavLink></li>
                </ul>
            </nav>
        </header>
    


    )
}

export default Navbar