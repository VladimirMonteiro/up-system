import { useEffect, useState } from 'react';
import styles from './SingleRent.module.css';
import { useParams } from 'react-router-dom';
import api from '../../../utils/api';
import Loading from '../../../components/loading/Loading';
import Navbar from '../../../components/navbar/Navbar';
import UpdateRent from '../../../components/updateRent/UpdateRent';

const SingleRent = () => {
  const [rent, setRent] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const request = async () => {
      const response = await api.get(`/rent/${id}`);
      console.log(response.data);
      setRent(response.data);
      setLoading(false);
    };

    request();
  }, [id]);

  return (
    <div >
      {loading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <section>
            <h1 style={{textAlign: 'center'}}> Aluguel nº {id}</h1>
            <UpdateRent rent={rent} />
          </section>
        </>
      )}
    </div>
  );
};

export default SingleRent;
