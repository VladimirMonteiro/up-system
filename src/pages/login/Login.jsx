import styles from './Login.module.css';
import { useContext, useState } from 'react';
import { authContext } from '../../context/authProvider/AuthContext';
import { useNavigate } from 'react-router-dom';

import { FaUser, FaLock } from 'react-icons/fa';
import logo from '../../assets/logo_up.png';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const auth = useContext(authContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = await auth.authenticate({ login, password });

        if (data.status === 403) {
            setErrors(['Usuário não encontrado.']);
            setLoading(false);
        } else if (data.response) {
            setErrors(data.response.data.errors);
            setLoading(false);
        } else {
            setLogin('');
            setPassword('');
            setLoading(false);
            navigate('/inicial');
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.leftPanel}>
                <img src={logo} alt="Up Locações" className={styles.logo} />
                <h1>Bem-vindo à Up Locações</h1>
                <p>Aluguel de equipamentos com praticidade e confiança.</p>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formWrapper}>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="login">Usuário</label>
                            <div className={styles.inputWithIcon}>
                                <FaUser className={styles.icon} />
                                <input
                                    type="text"
                                    id="login"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    autoComplete="off"
                                    placeholder="Digite seu usuário"
                                />
                            </div>
                            {errors.some((err) => err.toLowerCase().includes('login')) && (
                                <p className={styles.error}>Usuário inválido</p>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Senha</label>
                            <div className={styles.inputWithIcon}>
                                <FaLock className={styles.icon} />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua senha"
                                />
                            </div>
                            {errors.some((err) => err.toLowerCase().includes('senha')) && (
                                <p className={styles.error}>Senha incorreta</p>
                            )}
                        </div>

                        {errors.some((err) => err.toLowerCase().includes('usuário')) && (
                            <p className={styles.error}>Usuário não encontrado</p>
                        )}

                        <button type="submit" className={styles.submitBtn}>
                            {loading ? 'Acessando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
