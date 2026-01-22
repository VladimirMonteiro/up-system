import styles from './createRent.module.css';

const RentItemsList = ({ items, updateItem, removeItem, total }) => {
  return (
    <div className={styles.list}>
      <h2>Itens da Locação</h2>

      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <span>{item.tool}</span>

            <input
              type='number'
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
            />

            <input
              type='number'
              value={item.price}
              onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
            />

            <strong>Total: R$ {(item.price * item.quantity).toFixed(2)}</strong>

            <button onClick={() => removeItem(index)}>Remover</button>
          </li>
        ))}
      </ul>

      <h3>TOTAL: R$ {total.toFixed(2)}</h3>
    </div>
  );
};

export default RentItemsList;
