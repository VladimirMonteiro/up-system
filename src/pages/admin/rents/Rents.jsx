import { useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import RentsTable from "../../../components/rentsTable/RentsTable";
import styles from "./Rents.module.css";
import Modal from "../../../components/modal/Modal";
import UpdateRent from "../../../components/updateRent/UpdateRent";
import api from "../../../utils/api";

const Rents = () => {

  const [rent, setRent] = useState({})
  const [rentModal, setRentModal] = useState(false)


  const openRentModal = (e) => {
    e.preventDefault()
    setRentModal(true)
  }

  const closeRentModal = (e) => {
    setRentModal(false)
  }

  const updateRent = async(e, id) => {
    openRentModal(e)
    console.log(id)
    try {
      const response = await api.get(`/rent/${id}`)
      setRent(response.data)
      console.log(response.data)
      
    } catch (error) {
      console.log(error)
      
    }

   

  }

  
  return (
    <>
      <Navbar />
      <section className={styles.containerSection}>
        <h1>Aluguéis</h1>
        <RentsTable selected={updateRent}/>
      <Modal isOpen={rentModal} onClose={closeRentModal} height={"auto"}>
        <UpdateRent rent={rent}/>
      </Modal>
      </section>
    </>
  );
};

export default Rents;
