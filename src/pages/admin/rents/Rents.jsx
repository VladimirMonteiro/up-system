import { useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import RentsTable from "../../../components/rentsTable/RentsTable";
import styles from "./Rents.module.css";
import Modal from "../../../components/modal/Modal";
import UpdateRent from "../../../components/updateRent/UpdateRent";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const Rents = () => {

  const [rent, setRent] = useState({})
  const [rentModal, setRentModal] = useState(false)
  const navigate = useNavigate()


  const openRentModal = (e) => {
    e.preventDefault()
    setRentModal(true)
  }

  const closeRentModal = (e) => {
    setRentModal(false)
  }

  const updateRent = async(e, id) => {
    navigate(`/alugueis/${id}`)
  }
  return (
    
      <div className="mainContainerFlex">
        <Navbar />
        <section className={styles.containerSection}>
          <h1>Aluguéis</h1>
          <RentsTable selected={updateRent}/>
        <Modal isOpen={rentModal} onClose={closeRentModal} height={"auto"}>
          <UpdateRent rent={rent}/>
        </Modal>
        </section>
      </div>
  );
};

export default Rents;
