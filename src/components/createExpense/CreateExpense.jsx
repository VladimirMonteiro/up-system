import { useState } from "react";
import styles from "./CreateExpense.module.css";
import { handlePriceChange } from "../../utils/handlePriceChange";

const CreateExpense = ({ handleCreateExpense, errors }) => {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [fixed, setFixed] = useState("");
  const [dateOfSpent, setDateOfSpent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [year, month, day] = dateOfSpent ? dateOfSpent.split("-") : [];
    const formattedDate = dateOfSpent
      ? `${day}/${month}/${year}`
      : "";

    const newSpent = {
      description,
      value: value ? parseFloat(value.replace(/\./g, "").replace(",", ".")) : null, // garante número
      fixed, // converte para boolean
      dateOfSpent: formattedDate,
    };

    try {
      const response = await handleCreateExpense(newSpent);
      if (!response) {
        // limpa os campos
        setDescription("");
        setFixed("");
        setValue("");
        setDateOfSpent("");
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <div className={styles.card}>
      <h2>Adicionar Gasto</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="description">Descrição</label>
          <input
            type="text"
            id="description"
            placeholder="Ex: Energia elétrica"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors?.some((err) => err.includes("descrição")) && (
            <p className={styles.error}>
              {errors.filter((err) => err.includes("descrição"))}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="value">Valor</label>
          <input
            type="text"
            id="value"
            placeholder="R$ 0,00"
            value={value}
            onChange={(e) => handlePriceChange(e, setValue)}
          />
          {errors?.some((err) => err.includes("O valor")) && (
            <p className={styles.error}>
              {errors.filter((err) => err.includes("O valor"))}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="fixed">Tipo de gasto</label>
          <select
            id="fixed"
            value={fixed}
            onChange={(e) => setFixed(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="true">Fixo</option>
            <option value="false">Não fixo</option>
          </select>
          {errors?.some((err) => err.includes("tipo")) && (
            <p className={styles.error}>
              {errors.filter((err) => err.includes("tipo"))}
            </p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dateOfSpent">Data de pagamento</label>
          <input
            type="date"
            id="dateOfSpent"
            value={dateOfSpent}
            onChange={(e) => setDateOfSpent(e.target.value)}
          />
          {errors?.some((err) => err.includes("data")) && (
            <p className={styles.error}>
              {errors.filter((err) => err.includes("data"))}
            </p>
          )}
        </div>

        <button type="submit" className={styles.submitBtn}>
          Adicionar
        </button>
      </form>
    </div>
  );
};

export default CreateExpense;
