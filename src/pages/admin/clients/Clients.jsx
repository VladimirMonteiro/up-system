
import { useState } from 'react'
import Navbar from '../../../components/navbar/Navbar'
import Table from '../../../components/tableClients/Table'
import styles from './Clients.module.css'
import Modal from '../../../components/modal/Modal'
import RegisterClient from '../../../components/RegisterClient/RegisterClient'
import api from '../../../utils/api'
import UpdateClientFs from '../../../components/updateClientFs/UpdateClientFs'
import UpdateClientPj from '../../../components/updateClientsPj/UpdateClientPj'





const Clients = () => {

    const [modalClients, setModalClients] = useState(false)
    const [client, setClient] = useState({})
    const [modalUpdateClients, setModalUpdateClients] = useState(false)
    const [modalUpdateClientsPj, setModalUpdateClientsPj] = useState(false)


    
  const openModalClient = (e) => {
    e.preventDefault()
    setModalClients(true)
  }

  const closeModalClient = () => {
    setModalClients(false)
  }

  const openModalUpdateClientFs = (e) => {
    e.preventDefault()
    setModalUpdateClients(true)

  }

  const closeModalUpdateClientFs = () => {
    setModalUpdateClients(false)
  }

  const openModalUpdateClientPj = (e) => {
    e.preventDefault()
    setModalUpdateClientsPj(true)

  }

  const closeModalUpdateClientPj = () => {
    setModalUpdateClientsPj(false)
  }

  const handleUpdateClient = async (e, id) => {
    

    try {
      const response = await api.get(`http://localhost:8080/clients/${id}`)
      setClient(response.data)
      if (response.data.cnpj) {
        setModalUpdateClientsPj(true)
      } else {
        openModalUpdateClientFs(e)
      }

    } catch (error) {
      console.log(error)

    }
  }
    return (
        <>
            <Navbar />

            <section className={styles.containerSection}>
                <h1>Clientes</h1>
                <Table  selected={handleUpdateClient}/>
                <div className={styles.containerBtn}>
                    <button onClick={openModalClient}>Cadastrar Cliente</button>
                </div>
                <Modal isOpen={modalClients} onClose={closeModalClient} width="1400px" height="650px">
                    <RegisterClient/>
                </Modal>
                <Modal isOpen={modalUpdateClients} onClose={closeModalUpdateClientFs}>
                  <UpdateClientFs clientId={client.id}/>
                 
                </Modal>
                <Modal isOpen={modalUpdateClientsPj} onClose={closeModalUpdateClientPj}>
                  <UpdateClientPj clientId={client.id}/>
                </Modal>

            </section>


        </>

    )
}


export default Clients