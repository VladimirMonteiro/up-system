import styles from '../TableTools/TableTools.module.css';

const ToolsSearch = ({ value, onChange, onSubmit }) => {
  return (
    <form
      className={styles.inputGroup}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        type='text'
        placeholder='Buscar ferramenta...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
      <button className={styles.button}>Pesquisar</button>
    </form>
  );
};

export default ToolsSearch;
