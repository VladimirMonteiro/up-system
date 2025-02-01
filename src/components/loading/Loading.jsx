import React from 'react';
import styles from './Loading.module.css';

const Loading = ({table, width}) => {
  return (
    <div style={{width: width}} className={table ? styles.loadingTable : styles.loadingContainer}>
      <div className={styles.loader}></div>
      <p className={styles.desc}>Carregando...</p>
    </div>
  );
};

export default Loading;
