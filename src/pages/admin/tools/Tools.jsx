import Navbar from "../../../components/navbar/Navbar";
import styles from "./Tools.module.css";

import TableTools from '../../../components/tableTools/TableTools'
import { useState } from "react";
import Modal from "../../../components/modal/Modal";


const Tools = () => {

    const [modalTool, setModalTool] = useState(false)

    const openModalTool = (e) => {
        e.preventDefault()
        setModalTool(true)
    }

    const closeModalTool = () => {
    setModalTool(false)
    }


  return (
    <>
      <Navbar />
      <section className={styles.containerSection}>
        <h1>Ferramentas</h1>
        <TableTools/>
        <div className={styles.containerBtn}>
        <button onClick={openModalTool} >Cadastrar Ferramenta</button>
        </div>
       <Modal isOpen={modalTool} onClose={closeModalTool}>

       </Modal>
      
      </section>
    </>
  );
};

export default Tools;
