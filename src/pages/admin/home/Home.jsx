import styles from "./Home.module.css";

import Navbar from "../../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Loading from "../../../components/loading/Loading";

const Home = () => {
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("rent/quantities");
        console.log(response.data);
        setQuantities(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClients();
  }, []);
  return loading ? (
    <>
      <Navbar />
      <Loading />
    </>
  ) : (
    <div className="mainContainerFlex">
        <Navbar />
        <section className={styles.sectionContainer}>
          <h1>Seja-bem vindo</h1>
          <div className={styles.cardsContainer}>
            <div className={styles.singleCard}>
              <h2>Aluguéis ativos</h2>
              <p>{quantities.rent}</p>
            </div>
            <div className={styles.singleCard}>
              <h2>Clientes</h2>
              <p>{quantities.client}</p>
            </div>
            <div className={styles.singleCard}>
              <h2>Equipamentos</h2>
              <p>{quantities.tool}</p>
            </div>
          </div>
        </section>
    
    </div>
  );
};

export default Home;
