import CryptoChart from './CryptoChart';
import styles from "./styles.module.css";

const Details = () => {

  return (

    <div className={styles.details_container}>
      <h2>Kształtowanie się wartości kryptowalut w czasie</h2>
      <CryptoChart/>
    </div>

  );
};

export default Details;
