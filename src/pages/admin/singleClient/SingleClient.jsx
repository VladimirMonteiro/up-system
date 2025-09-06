import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";
import Loading from "../../../components/loading/Loading";
import MyMenu from "../../../components/navbar/Navbar";
import RentsTable from "../../../components/rentsTable/RentsTable";
import styles from './single.module.css';

export default function SingleClient() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [clientRents, setClientRents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate()

  useEffect(() => {
    async function getClient() {
      try {
        setLoading(true);
        const [clientResponse, rentsResponse] = await Promise.all([
          api.get(`/clients/${id}`),
          api.get(`/rent/client/${id}`)
        ]);
        setClient(clientResponse.data || {});
        setClientRents(rentsResponse.data || []);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados do cliente.");
      } finally {
        setLoading(false);
      }
    }
    getClient();
  }, [id]);

  const updateRent = async(e, id) => {
    navigate(`/alugueis/${id}`)
  }
  return (
    <div className="mainContainerFlex">
      <MyMenu />
      {loading ? <Loading /> : (

        <section className={styles.containerSection}>
          <div className={styles.headerSection}>
            <h1>{client.name}</h1>
            <p className={styles.details}>
              Email: {client.email || "Não informado"} | Telefone: {client.phones[0] || "Não informado"}
            </p>
          </div>

          <div className={styles.infoCards}>
            <div className={styles.card}>
              <h3>Total de Locações</h3>
              <p>{clientRents.length}</p>
            </div>
            <div className={styles.card}>
              <h3>Locações Pendentes</h3>
              <p>{clientRents.filter(r => r.stateRent === "PENDENT").length}</p>
            </div>
            <div className={styles.card}>
              <h3>Total Pago pelo cliente</h3>
              <p style={{ color: "green" }}>
                R$ {clientRents.reduce((total, rent) => rent.stateRent === "PAID" ? total + (rent.price || 0) : total, 0).toFixed(2)}
              </p>
            </div>
            <div className={styles.card}>
              <h3>Saldo devedor</h3>
              <p style={{ color: "red" }}>
                R$ {clientRents
                  .reduce((total, rent) => rent.stateRent === "PENDENT" ? total + (rent.price || 0) : total, 0)
                  .toFixed(2)}

              </p>
            </div>
          </div>

          <div className={styles.tableSection}>
            <h2>Locações do Cliente</h2>
            <RentsTable rents={clientRents} singleClient={client} selected={updateRent}/>
          </div>
        </section>
      )}

    </div>
  );
}
