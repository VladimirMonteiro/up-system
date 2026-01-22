import styles from './LocData.module.css';

const LocData = ({ title, client }) => {
  const address = client?.addresses?.[0];

  return (
    <div className={styles.dataContainer}>
      <p style={{ fontWeight: 'bold' }}>{title}</p>

      <div className={styles.locationInfo}>
        {/* Linha 1 */}
        <div className={styles.line1}>
          <div>
            <span>Nome:</span>
            <p>{client?.name || '-'}</p>
          </div>

          <div className={styles.line1CPF}>
            <span>CPF/CNPJ:</span>
            <p>{client?.document || '-'}</p>
          </div>
        </div>

        {/* Linha 2 */}
        <div className={styles.line2}>
          <span>Endereço:</span>
          <p>
            {address
              ? `${address.street}, Nº ${address.number}`
              : '-'}
          </p>

          {address?.complement && (
            <>
              <span>Complemento:</span>
              <p>{address.complement}</p>
            </>
          )}
        </div>

        {/* Linha 3 */}
        <div className={styles.line3}>
          <div>
            <span>Bairro:</span>
            <p>{address?.neighborhood || '-'}</p>
          </div>

          <div>
            <span>Cidade:</span>
            <p>{address?.city || '-'}</p>
          </div>

          <div>
            <span>UF:</span>
            <p>{address?.state || '-'}</p>
          </div>
        </div>

        {/* Linha 4 */}
        <div className={styles.line4}>
          <div>
            <span>Celular:</span>
            <p>{client?.phones?.[0] || '-'}</p>
          </div>

          <div>
            <span>Fone comercial:</span>
            <p>{client?.phones?.[0] || '-'}</p>
          </div>

          <div>
            <span>E-mail:</span>
            <p>{client?.email || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocData;
