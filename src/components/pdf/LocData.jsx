import styles from "./LocData.module.css";

const LocData = ({title, name, cpfOrCnpj, address, neighborhood, city, state, phone, servicePhone, email}) => {
  return (
    <div className={styles.dataContainer}>
      <p style={{fontWeight: 'bold'}}>{title}</p>
      <div className={styles.locationInfo}>
        <div className={styles.line1}>
          <div>
            <span>Name:</span>
            <p>{name}</p>
          </div>
          <div className={styles.line1CPF}>
            <span>CPF/CNPJ:</span>
            <p>{cpfOrCnpj}</p>
          </div>
        </div>
        <div className={styles.line2}>
          <span>Endereço:</span>
          <p>{address}</p>
        </div>
        <div className={styles.line3}>
          <div>
            <span>Bairro:</span>
            <p>{neighborhood}</p>
          </div>
          <div>
            <span>Cidade: </span>
            <p>{city}</p>
          </div>
          <div>
            <span>UF: </span>
            <p>{state}</p>
          </div>
        </div>
        <div className={styles.line4}>
            <div>
                <span>Celular: </span>
                <p>{phone}</p>
            </div>
            <div>
                <span>Fone comercial:</span>
                <p>{servicePhone}</p>
            </div>
            <div>
                <span>E-mail:</span>
                <p>{email}</p>
            </div>
        </div>
      </div>
     
      </div>
  );
};

export default LocData;
