import styles from '../styles/RentPdf.module.css';

const Clause = () => {
  return (
    <div className={styles.containerClausulas}>
      <h2>Cláusulas contratais</h2>
      <h3>
        CONTRATO DE LOCAÇÃO DE EQUIPAMENTO PARA CONSTRUÇÃO CIVIL CONTRATO PARA LOCAÇÃO DE PRAZO
        DETERMINADO.
      </h3>
      <p>
        As partes acima têm, entre si, justas e acertadas o presente contrato para locação de
        equipamentos para construção civil de prazo determinado, que se regerá pelas cláusulas
        seguintes e pelas condições descritas no presente.
      </p>
      <ul>
        <li>
          Cláusula 1ª: O presente contrato tem como objeto a locação de equipamento para construção
          civil, conforme descrito.
        </li>
        <li>
          Cláusula 2ª: O equipamento, objeto deste contrato, será utilizado exclusivamente pelo
          locatário, não sendo permitido o seu uso por terceiros sob pena de rescisão contratual.
        </li>{' '}
        <li>
          Cláusula 3ª: O Locatário pagará à locadora a quantia relacionada no documento em razão do
          aluguel do equipamento. Este pagamento será realizado no vencimento especificado.
        </li>{' '}
        <li>
          Cláusula 4ª: O locatário deverá devolver o equipamento à locadora nas mesmas condições em
          que estava quando recebeu, respondendo pelos danos ou prejuízos causados.
        </li>{' '}
        <li>
          Cláusula 5ª: A presente locação terá o lapso temporal de validade especificado neste
          documento e terminando na data especificada, data na qual o equipamento deverá ser
          devolvido.
        </li>
        <li>
          Clausula 6ª: O descumprimento de qualquer cláusula por partes dos contratantes enseja a
          rescisão deste instrumento e o devido pagamento pela parte.
        </li>
        <li>
          Clausula 7ª E por estarem de acordo com todas as cláusulas, firmam o presente instrumento,
          por si e eventuais sucessores, em duas (2) vias de igual teor, para um só efeito, com
          vigência a partir da data de sua assinatura.
        </li>
      </ul>
    </div>
  );
};

export default Clause;
