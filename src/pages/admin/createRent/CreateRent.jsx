import { useEffect, useState } from 'react'
import Navbar from '../../../components/navbar/Navbar'
import styles from './CreateRent.module.css'

import Modal
 from '../../../components/modal/Modal'




const CreateRent = () => {

    const [client, setClient] = useState("")
    const [tool, setTool] = useState("")
    const [price, setPrice] = useState(0)
    const [listItems, setListItems] = useState([])


    const [isClientModalOpen, setClientModalOpen] = useState(false); // Estado para o modal de cliente
    const [isToolModalOpen, setToolModalOpen] = useState(false); // Estado para o modal de ferramenta


    useEffect(() => {
        console.log("A lista foi atualizada:", listItems);

    }, [listItems])



    const openClients = (e) => {
        e.preventDefault();
        setClientModalOpen(true); // Abre o modal de clientes
    };

    const openTools = (e) => {
        e.preventDefault();
        setToolModalOpen(true); // Abre o modal de ferramentas
    };

    const closeClientModal = () => {
        setClientModalOpen(false); // Fecha o modal de clientes
    };

    const closeToolModal = () => {
        setToolModalOpen(false); // Fecha o modal de ferramentas
    };


    const addItems = (e) => {
        e.preventDefault()

        const parsedPrice = parseFloat(price)

        const item = {
            tool,
            price: parsedPrice
        }

        setListItems([...listItems, item])
        console.log("adicionado")
        console.log(listItems)

    }





    return (

        <>
            <Navbar />

            <section className={styles.sectionContainer}>
                <h1>Alugar</h1>
                <div className={styles.center}>
                    <form className={styles.formContainer}>

                        <div className={styles.inputContainer}>
                            <label htmlFor="client">Selecione o cliente</label>
                            <input type="text" name="client" id="client" onChange={e => setClient(e.target.value)} value={client} />
                            <button onClick={openClients}>Selecionar</button>
                        </div>
                        <div className={styles.inputContainer}>
                            <label htmlFor="tool">Selecione a ferramenta</label>
                            <input type="text" name="tool" id="tool" onChange={e => setTool(e.target.value)} value={tool} />
                            <button onClick={openTools}>Selecionar</button>
                        </div>
                        <div className={styles.dateInputContainer}>
                            <label htmlFor="initialDate">Data inicial: </label>
                            <input type="date" name="initialDate" id="initialDate" />
                        </div>
                        <div className={styles.dateInputContainer}>
                            <label htmlFor="deliveryDate">Data Final: </label>
                            <input type="date" name="deliveryDate" id="deliveryDate" />
                        </div>
                        <div className={styles.inputContainer2}>
                            <label htmlFor="price">Valor da Locação</label>
                            <input type="number" name="price" id="price" onChange={e => setPrice(e.target.value)} value={price} />
                        </div>
                        <div className={styles.inputContainer2}>
                            <button onClick={addItems}>Adicionar</button>
                        </div>

                        <div className={styles.inputContainer2}>
                            <input type="submit" value="Alugar" />
                        </div>

                    </form>
                    <div className={styles.listContainer}>
                        <div className={styles.list}>
                            <h2>Items da locação</h2>
                            <ul>
                                {listItems.length > 0 && listItems.map((item, index) => (
                                    <li key={index}><div>{item.tool}</div> - <div>R${item.price}</div></li>
                                ))}
                            </ul>
                            <p className={styles.total}>
                            TOTAL: R${listItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal para Cliente */}
            <Modal isOpen={isClientModalOpen} onClose={closeClientModal}>
                <h2>Selecione um Cliente</h2>
                {/* Aqui você pode adicionar os componentes ou listagens para clientes */}
                <button onClick={closeClientModal}>Fechar</button>
            </Modal>

            {/* Modal para Ferramentas */}
            <Modal isOpen={isToolModalOpen} onClose={closeToolModal}>
                <h2>Selecione uma Ferramenta</h2>
                {/* Aqui você pode adicionar os componentes ou listagens para ferramentas */}
                <button onClick={closeToolModal}>Fechar</button>
            </Modal>

        </>

    )
}


export default CreateRent