import Navbar from "../../../components/navbar/Navbar"
import styles from './Earning.module.css'


import EarningTable from "../../../components/earningTable/EarningTable"
import { useState, useEffect } from "react"
import api from "../../../utils/api"
import ComponentMessage from "../../../components/componentMessage/ComponentMessage"
import Modal from "../../../components/modal/Modal"
import UpdateEarning from "../../../components/updatedEarning/UpdateErning"

const Earnings = () => {

    const [earnings, setEarnings] = useState([])
    const [earnSelected, setEarnSelected] = useState({})

    const [modal, setModal] = useState(false)
    const [rents, setRents] = useState([])

    const [success, setSuccess] = useState(null)
    const [errors, setErrors] = useState(null)
    const [updateErrors, setUpdateErrors] = useState(null)


    useEffect(() => {
        const request = async () => {
            try {
                const response = await api.get(`/rent`)
                console.log(response.data)
                setRents(response.data.filter(rent => rent.stateRent === 'PENDENT'))
            } catch (error) {
                console.log(error)
            }
        }
        request()
    }, [])


    const openModal = (e) => {
        e.preventDefault()
        setModal(true)
    }

    const findById = async (e, id) => {
        openModal(e)
        try {
            const response = await api.get(`/earning/${id}`)
            setEarnSelected(response.data)

        } catch (error) {
            console.log(error)
        }
    }

    const updateEarn = async (id, updatedEarning) => {
        try {
            const response = await api.put(`/earning/update/${id}`, updatedEarning)
            const updatedEarn = response.data;

            // Atualiza a lista de despesas no estado
            setEarnings((prevExpenses) =>
                prevExpenses.map((earn) =>
                    earn.id === updatedEarn.id ? updatedEarn : earn
                )
            );

            setSuccess(response.data.message)
            setUpdateErrors(null)
            setModal(false)
        } catch (error) {
            setUpdateErrors(error.response.data.errors)

        }
    }

    return (
        <div className="mainContainerFlex">

            <Navbar />
            {success && <ComponentMessage message={success} type="success" onClose={() => setSuccess(null)} />}
            <section className={styles.containerSection}>
                <h1>Faturamentos</h1>
                <div className={styles.components}>
                    <EarningTable earnings={earnings} selected={findById} />
                    <Modal isOpen={modal} onClose={() => setModal(false)} width={'500px'} height={'auto'}>
                        <UpdateEarning rents={rents} errors={updateErrors} earn={earnSelected} handleUpdatedEarn={updateEarn} />
                    </Modal>
                </div>
            </section>

        </div>
    )
}

export default Earnings