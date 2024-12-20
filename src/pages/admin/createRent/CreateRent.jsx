import { useEffect, useState } from 'react'
import Navbar from '../../../components/navbar/Navbar'
import styles from './CreateRent.module.css'

import Modal
 from '../../../components/modal/Modal'
import Table from '../../../components/tableClients/Table'
import TableTools from '../../../components/tableTools/TableTools'




const CreateRent = () => {

    const [client, setClient] = useState("")
    const [tool, setTool] = useState({})
    const [initialDate, setInitalDate] = useState("")
    const [deliveryDate, setDeliveryDate] = useState("")
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState("")
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

        if(!tool) {
            alert("Selecione um equipamento para a locação!")
            return
        }

        const parsedPrice = parseFloat(price)

        const item = {
            tool: tool.name,
            quantity,
            price: parsedPrice

        }

        setListItems([...listItems, item])
        setTool("")
        setPrice("")

    }

    const handleSelectClient = (client) => {
        setClient(client.name)
        console.log(client)
        closeClientModal()
        return client
      }

      const handleSelectTool = (tool) => {
        setTool(tool)
        console.log(tool)
        closeToolModal()
        return tool
      }


      const finishRent = (e) => {
        e.preventDefault()

        const newRent = {
            client,
            listItems,
            price: listItems.reduce((total, item) => total + item.price, 0).toFixed(2),
            initialDate,
            deliveryDate
            
        }

        console.log(newRent)
      }

    return (

        <>
            <Navbar />

            <section className={styles.sectionContainer}>
                <h1>Alugar</h1>
                <div className={styles.center}>
                    <form className={styles.formContainer} onSubmit={finishRent}>

                        <div className={styles.inputContainer}>
                            <label htmlFor="client">Selecione o cliente</label>
                            <input type="text" name="client" id="client" onChange={e => setClient(e.target.value)} value={client} />
                            <button onClick={openClients}>Selecionar</button>
                        </div>

                        <div className={styles.inputContainer}>
                            <label htmlFor="tool">Selecione a ferramenta</label>
                            <input type="text" name="tool" id="tool" onChange={e => setTool(e.target.value)} value={tool.name || ""} />
                            <button onClick={openTools}>Selecionar</button>
                        </div>
                        <div className={styles.inputContainer2}>
                            <label htmlFor="price">Valor da Locação</label>
                            <input type="text" name="price" id="price" onChange={e => setPrice(e.target.value)} value={price} />
                        </div>
                        <div className={styles.inputContainer2}>
                            <label htmlFor="quantity">Quantidade</label>
                            <input type="text" name="quantity" id="quantity" onChange={e => setQuantity(e.target.value)} value={quantity} />
                        </div>
                        <div className={styles.dateInputContainer}>
                            <label htmlFor="initialDate">Data inicial: </label>
                            <input type="date" name="initialDate" id="initialDate" onChange={e => setInitalDate(e.target.value)} value={initialDate} />
                        </div>
                        <div className={styles.dateInputContainer}>
                            <label htmlFor="deliveryDate">Data Final: </label>
                            <input type="date" name="deliveryDate" id="deliveryDate" onChange={e => setDeliveryDate(e.target.value)} value={deliveryDate}/>
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
                <Table selected={handleSelectClient}/>
                <button onClick={closeClientModal}>Fechar</button>
            </Modal>

            {/* Modal para Ferramentas */}
            <Modal isOpen={isToolModalOpen} onClose={closeToolModal}>
                <h2>Selecione uma Ferramenta</h2>
                {/* Aqui você pode adicionar os componentes ou listagens para ferramentas */}
                <TableTools selected={handleSelectTool}/>
                <button onClick={closeToolModal}>Fechar</button>
            </Modal>

        </>

    )
}


export default CreateRent