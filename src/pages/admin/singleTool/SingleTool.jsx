import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../utils/api";
import Loading from "../../../components/loading/Loading";
import MyMenu from "../../../components/navbar/Navbar";
import RentsTable from "../../../components/rentsTable/RentsTable";
import styles from './SingleTool.module.css';

const SingleTool = () => {
  const { id } = useParams();
  const [rents, setRents] = useState([]);
  const [tool, setTool] = useState(null); // melhor usar null inicialmente
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // para exibir erro

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rentsResponse, toolResponse] = await Promise.all([
          api.get(`rent/tool/${id}`),
          api.get(`tools/${id}`)
        ]);
        setRents(rentsResponse.data || []);
        setTool(toolResponse.data || {});
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!tool) return <div className={styles.error}>Ferramenta não encontrada.</div>;

  return (
    <div className="mainContainerFlex">
      <MyMenu />
      <section className={styles.containerSection}>
        <div className={styles.headerSection}>
          <h1>{tool.name}</h1>
          <p className={styles.category}>{tool.category || "Categoria não definida"}</p>
        </div>

        <div className={styles.infoCards}>
          <div className={styles.card}>
            <h3>Quantidade Disponível</h3>
            <p>{tool.quantity ?? 0}</p>
          </div>
          <div className={styles.card}>
            <h3>Preço Diário</h3>
            <p>R$ {tool.daily ?? "0,00"}</p>
          </div>
          <div className={styles.card}>
            <h3>Status</h3>
            <p>{tool.status || "Indefinido"}</p>
          </div>
          <div className={styles.card}>
            <h3>Total de Aluguéis</h3>
            <p>{rents.length}</p>
          </div>
        </div>

        <div className={styles.tableSection}>
          <h2>Locações que possuem este equipamento</h2>
          <RentsTable rents={rents} />
        </div>
      </section>
    </div>
  );
};

export default SingleTool;
