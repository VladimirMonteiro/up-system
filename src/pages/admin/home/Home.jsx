
import styles from './Home.module.css'

import Navbar from '../../../components/navbar/Navbar'
import { useEffect, useState } from 'react'
import api from '../../../utils/api'
import Loading from '../../../components/loading/Loading'

const Home = () => {

    const [rents, setRents] = useState([])
    const [clients, setClients] = useState([])
    const [tools, setTools] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get("http://localhost:8080/clients");
                const response2 = await api.get("http://localhost:8080/tools");
                const response3 = await api.get("http://localhost:8080/rent");
                setClients(response.data);
                setTools(response2.data)
                setRents(response3.data)
                setLoading(false)
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
            }
        };

        fetchClients();
    }, []);
    return (
        loading ?
            <>
                <Navbar />
                <Loading />

            </> : (
                <>
                <Navbar />
                    <section className={styles.sectionContainer}>
                        <h1>Seja-bem vindo</h1>

                        <div className={styles.cardsContainer}>
                            <div className={styles.singleCard}>
                                <h2>Aluguéis ativos</h2>
                                <p>{rents && rents.filter(rent => rent.stateRent === 'PENDENT').length}</p>
                            </div>
                            <div className={styles.singleCard}>
                                <h2>Clientes</h2>
                                <p>{clients.length}</p>
                            </div>
                            <div className={styles.singleCard}>
                                <h2>Equipamentos</h2>
                                <p>{tools.length}</p>
                            </div>
                        </div>

                    </section>

                </>
            )
    )
}


export default Home