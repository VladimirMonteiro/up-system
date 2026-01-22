import RentsActions from '../RentsActions';
import {
  PAYMENT_LABEL,
  RENT_STATE_LABEL,
  paymentClass,
  rentStateClass,
} from '../../../utils/rentStatus';

const RentsTableRow = ({ rent, styles, onDelete, onComplete, onPdf, onEdit }) => {
  return (
    <tr>
      <td>{rent.id}</td>
      <td>{rent.client?.name}</td>
      <td>{rent.initialDate}</td>
      <td>{rent.deliveryDate}</td>
      <td>{rent.price}</td>

      <td>
        <span
          className={`${styles.tableRow} ${paymentClass(
            rent.paymentStatus,
            styles
          )}`}
        >
          {PAYMENT_LABEL[rent.paymentStatus]}
        </span>
      </td>

      <td>
        <span
          className={`${styles.tableRow} ${rentStateClass(
            rent.stateRent,
            styles
          )}`}
        >
          {RENT_STATE_LABEL[rent.stateRent]}
        </span>
      </td>

      <td className={styles.actions}>
        <RentsActions
          rent={rent}
          onDelete={onDelete}
          onComplete={onComplete}
          onPdf={onPdf}
          onEdit={onEdit}
        />
      </td>
    </tr>
  );
};

export default RentsTableRow;
