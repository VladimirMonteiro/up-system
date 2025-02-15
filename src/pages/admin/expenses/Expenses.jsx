import { useState, useEffect } from "react";
import CreateExpense from "../../../components/createExpense/CreateExpense";
import ExpenseTable from "../../../components/expenseTable/ExpenseTable";
import Modal from "../../../components/modal/Modal";
import Navbar from "../../../components/navbar/Navbar";
import UpdateExpense from "../../../components/updateExpense/UpdateExpense";
import styles from './Expenses.module.css';
import api from "../../../utils/api";
import ComponentMessage from "../../../components/componentMessage/ComponentMessage";

const Expenses = () => {
    const [openModal, setOpenModal] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [errors, setErrors] = useState(null)
    const [errorsUpdate, setErrorsUpdate] = useState(null)
    const [success, setSuccess] = useState(null);  // Estado para a mensagem de sucesso

    const openModalUpdate = (e) => {
        e.preventDefault();
        setOpenModal(true);
    };

    const handleFindSpentById = async (e, id) => {
        openModalUpdate(e);

        try {
            const response = await api.get(`spent/${id}`);
            setSelectedExpense(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Atualizar gasto
    const handleUpdateSpent = async (id, updatedData) => {
        try {
            const response = await api.put(`/spent/update/${id}`, updatedData);
            const updatedExpense = response.data;

            // Atualiza a lista de despesas no estado
            setExpenses((prevExpenses) =>
                prevExpenses.map((expense) =>
                    expense.id === updatedExpense.id ? updatedExpense : expense
                )
            );

            setOpenModal(false);
            setSuccess(response.data.message);  // Define a mensagem de sucesso
            setErrorsUpdate(null);  // Limpa os erros
        } catch (error) {
            setErrorsUpdate(error.response.data.errors);
        }
    };

    const handleCreateSpent = async (newSpent) => {
        try {
            const response = await api.post(`spent/create`, newSpent);

            // Adiciona o novo gasto à lista de despesas
            setExpenses((prevExpenses) => [
                ...prevExpenses,       // Mantém todos os gastos antigos
                newSpent         // Adiciona o novo gasto
            ]);
            setErrors(null); // Limpa os erros
            setSuccess("Gasto criado com sucesso!");  // Define a mensagem de sucesso

        } catch (error) {
            setErrors(error.response.data.errors);
            return error;
        }
    };

    return (
        
            <div className="mainContainerFlex">
                <Navbar />
                {/* Exibe a mensagem de sucesso */}
                {success && <ComponentMessage message={success} type="success" onClose={() => setSuccess(null)} />}
                
                <section className={styles.containerSection}>
                    <h1>Gastos</h1>
                    <div className={styles.components}>
                        <CreateExpense handleCreateExpense={handleCreateSpent} errors={errors} />
                        <ExpenseTable selected={handleFindSpentById} expenses={expenses} />
                    </div>
                    <Modal isOpen={openModal} onClose={() => setOpenModal(false)} width={'500px'} height={'auto'}>
                        <UpdateExpense
                            expense={selectedExpense}
                            handleUpdateSpent={handleUpdateSpent}
                            errors={errorsUpdate}
                        />
                    </Modal>
                </section>
            </div>
    );
};

export default Expenses;
