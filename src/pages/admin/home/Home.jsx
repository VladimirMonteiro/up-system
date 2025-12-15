import styles from "./Home.module.css";

import Navbar from "../../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import Loading from "../../../components/loading/Loading";
import RentsTable from "../../../components/rentsTable/RentsTable";


const Home = () => {
  const [quantities, setQuantities] = useState({});
  const [rentsExpiring, setRentsExpiring] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("rent/quantities");
        const responseRents = await api.get("rent/expire");
        setRentsExpiring(responseRents.data);
        setQuantities(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClients();
  }, []);
  const updateRent = async(e, id) => {
    navigate(`/alugueis/${id}`)
  }
  return (
    <div className="mainContainerFlex">
      <Navbar />
      {loading ? <Loading /> : (<section className={styles.sectionContainer}>
        <div className="content">
          <h1 className={styles.welcomeTitle}>Seja bem-vindo 👋</h1>
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
          <h2 className={styles.sub}>📅 Locações prestes a expirar</h2>
          <div style={{width: "100%"}}>
            <RentsTable rents={rentsExpiring} selected={updateRent}/>
          </div>
        </div>
      </section>)}


    </div>
  )
};

export default Home;
