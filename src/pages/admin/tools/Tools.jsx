import { useState } from "react";

import TableTools from '../../../components/tableTools/TableTools'
import Navbar from "../../../components/navbar/Navbar";
import Modal from "../../../components/modal/Modal";

import styles from "./Tools.module.css";
import RegisterTool from "../../../components/registerTool/RegisterTool";
import api from "../../../utils/api";
import UpdateTool from "../../../components/updateTool/UpdateTool";

const Tools = () => {

  const [modalTool, setModalTool] = useState(false)
  const [modalToolUpdate, setModalToolUpdate] = useState(false)
  const [tool, setTool] = useState({})

  const openModalTool = (e) => {
    e.preventDefault()
    setModalTool(true)
  }

  const closeModalTool = () => {
    setModalTool(false)
  }

  const openModalToolUpdate = (e) => {
    e.preventDefault()
    setModalToolUpdate(true)
  }

  const closeModalToolUpdate = () => {
    setModalToolUpdate(false)
  }


  const handleUpdateTool = async (e, id) => {
    openModalToolUpdate(e)

    try {
      const response = await api.get(`http://localhost:8080/tools/${id}`)
      setTool(response.data)

    } catch (error) {
      console.log(error)

    }
  }


  return (
    <>
      <Navbar />
      <section className={styles.containerSection}>
        <h1>Ferramentas</h1>
        <TableTools selected={handleUpdateTool} />
        <div className={styles.containerBtn}>
          <button onClick={openModalTool} >Cadastrar Ferramenta</button>
        </div>
        <Modal isOpen={modalTool} onClose={closeModalTool}>
          <RegisterTool/>

        </Modal>
        <Modal isOpen={modalToolUpdate} onClose={closeModalToolUpdate}>
          <UpdateTool tool={tool}/>

        </Modal>

      </section>
    </>
  );
};

export default Tools;
