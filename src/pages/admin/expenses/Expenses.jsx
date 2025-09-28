import { useState, useEffect } from "react";
import CreateExpense from "../../../components/createExpense/CreateExpense";
import ExpenseTable from "../../../components/expenseTable/ExpenseTable";
import Modal from "../../../components/modal/Modal";
import Navbar from "../../../components/navbar/Navbar";
import UpdateExpense from "../../../components/updateExpense/UpdateExpense";
import styles from "./Expenses.module.css";
import api from "../../../utils/api";
import ComponentMessage from "../../../components/componentMessage/ComponentMessage";

const Expenses = () => {
    const [openModal, setOpenModal] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [errors, setErrors] = useState(null);
    const [errorsUpdate, setErrorsUpdate] = useState(null);
    const [success, setSuccess] = useState(null);

    // 🔹 Buscar lista inicial de gastos
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await api.get("/spent");
                setExpenses(response.data);
            } catch (error) {
                console.error("Erro ao carregar gastos:", error);
            }
        };
        fetchExpenses();
    }, []);

    const openModalUpdate = (e) => {
        e.preventDefault();
        setOpenModal(true);
    };

    // 🔹 Buscar gasto por ID
    const handleFindSpentById = async (e, id) => {
        openModalUpdate(e);
        try {
            const response = await api.get(`/spent/${id}`);
            setSelectedExpense(response.data);
        } catch (error) {
            console.error("Erro ao buscar gasto:", error);
        }
    };

    // 🔹 Atualizar gasto
    const handleUpdateSpent = async (id, updatedData) => {
        try {
            const response = await api.put(`/spent/update/${id}`, updatedData);
            const updatedExpense = response.data;


            setExpenses((prev) =>
                prev.map((expense) =>
                    expense.id === updatedExpense.id ? updatedExpense : expense
                )
            );


            setOpenModal(false);
            setSuccess("Gasto atualizado com sucesso!");
            setErrorsUpdate(null);
        } catch (error) {
            setErrorsUpdate(error.response?.data?.errors || ["Erro ao atualizar gasto."]);
        }
    };

    // 🔹 Criar gasto
    const handleCreateSpent = async (newSpent) => {
        try {
            const response = await api.post(`/spent/create`, newSpent);

            setExpenses((prev) => [...prev, response.data]);

            setErrors(null);
            setSuccess("Gasto criado com sucesso!");
        } catch (error) {
            setErrors(error.response?.data?.errors || ["Erro ao criar gasto."]);
            return "error";
        }
    };

    return (
        <div className="mainContainerFlex">
            <Navbar />

            {success && (
                <ComponentMessage
                    message={success}
                    type="success"
                    onClose={() => setSuccess(null)}
                />
            )}

            <section className={styles.containerSection}>
                <h1>Gastos</h1>
                <div className={styles.components}>
                    <CreateExpense handleCreateExpense={handleCreateSpent} errors={errors} />
                    <ExpenseTable selected={handleFindSpentById} expenses={expenses} />
                </div>

                <Modal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    width={"500px"}
                    height={"auto"}
                >
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
