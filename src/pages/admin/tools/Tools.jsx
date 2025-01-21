import { useState } from "react";

import TableTools from '../../../components/tableTools/TableTools'
import Navbar from "../../../components/navbar/Navbar";
import Modal from "../../../components/modal/Modal";

import styles from "./Tools.module.css";
import RegisterTool from "../../../components/registerTool/RegisterTool";
import api from "../../../utils/api";
import UpdateTool from "../../../components/updateTool/UpdateTool";
import ComponentMessage from "../../../components/componentMessage/ComponentMessage";


const Tools = () => {

  const [modalTool, setModalTool] = useState(false)
  const [modalToolUpdate, setModalToolUpdate] = useState(false)
  const [tool, setTool] = useState({})
  const [tools, setTools] = useState([])
  const [errors, setErrors] = useState(null)
  const [errorsUpdate, setErrorsUpdate] = useState(null)
  const [success, setSuccess] = useState(null)

  const openModalTool = (e) => {
    e.preventDefault()
    setModalTool(true)
  }

  const openModalToolUpdate = (e) => {
    e.preventDefault()
    setModalToolUpdate(true)
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

  const registerTool = async (newTool) => {

    try {

      const response = await api.post(`tools/create`, newTool)

      // Adiciona o novo gasto à lista de despesas
      setTools((prevTools) => [
        ...prevTools,       // Mantém todos os gastos antigos
        newTool         // Adiciona o novo gasto
      ]);
      setErrors(null); // Limpa os erros
      setModalTool(false)
      setSuccess(response.data.message)
    } catch (error) {
      setErrors(error.response.data.errors)
      console.log(error)
      return error;

    }
  }


  const updateTool = async (id, toolToUpdate) => {
    try {

      const response = await api.put(`tools/update/${id}`, toolToUpdate)
      const updatedTool = response.data;

      // Atualiza a lista de despesas no estado
      setTools((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === updatedTool.id ? updatedTool : expense
        )
      );

      setModalTool(false);
      setSuccess(response.data.message);  // Define a mensagem de sucesso
      setErrorsUpdate(null);  // Limpa os erros


    } catch (error) {
      setErrorsUpdate(error.response.data.errors);

    }
  }

  return (
    <>

      <Navbar />
      {success && <ComponentMessage message={success} type="success" onClose={() => setSuccess(null)} />}
      <section className={styles.containerSection}>
        <h1>Ferramentas</h1>
        <TableTools selected={handleUpdateTool} tools={tools} />
        <div className={styles.containerBtn}>
          <button onClick={openModalTool} >Cadastrar Ferramenta</button>
        </div>
        <Modal isOpen={modalTool} onClose={() => setModalTool(false)}>
          <RegisterTool handleRegisterTool={registerTool} errors={errors} />

        </Modal>
        <Modal isOpen={modalToolUpdate} onClose={() => setModalToolUpdate(false)}>
          <UpdateTool tool={tool} handleUpdate={updateTool} errors={errorsUpdate}/>

        </Modal>

      </section>
    </>
  );
};

export default Tools;
