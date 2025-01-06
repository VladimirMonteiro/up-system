import Navbar from "../../../components/navbar/Navbar";
import RentsTable from "../../../components/rentsTable/RentsTable";
import styles from "./Rents.module.css";

const Rents = () => {
  return (
    <>
      <Navbar />
      <section className={styles.containerSection}>
        <h1>Aluguéis</h1>
        <RentsTable/>
      </section>
    </>
  );
};

export default Rents;
