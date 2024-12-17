import axios from 'axios'
import styles from './Login.module.css'

import { useContext, useState } from 'react'
import { authContext } from '../../context/authProvider/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState([])

    const auth = useContext(authContext)
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = await auth.authenticate({ login, password })

        if (data.status == 403) {
            setErrors(["Usuário não encontrado."])
        } else if (data.response) {
            console.log(data.response.data.errors)
            console.log(data)
            setErrors(data.response.data.errors)

        }
        else {
            setLogin("")
            setPassword("")
            navigate("/inicial")

        }
    }


    return (
        <section className={styles.container}>

            <h1>Up Locações</h1>
            <div className={styles.containerForm}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="login">usename</label>
                        <input type="text" name="login" id="login" onChange={e => setLogin(e.target.value)} value={login} />
                        {errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("login"))}</p>
                        )}
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="password">password</label>
                        <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} value={password} />
                        {errors.length > 0 && (
                            <p style={{ color: "red" }}>{errors.filter(error => error.includes("senha"))}</p>
                        )}
                    </div>
                    {errors.length > 0 && (
                        <p style={{ color: "red" }}>{errors.filter(error => error.includes("Usuário"))}</p>
                    )}
                    <input type="submit" value="Entrar" />
                </form>
            </div>

        </section>
    )
}


export default Login