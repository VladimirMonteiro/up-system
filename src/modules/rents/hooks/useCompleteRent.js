import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

export const useCompleteRent = ({ client = {}, listItems = [] }) => {
  const [initialDate, setInitialDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [freight, setFreight] = useState("");
  const [obs, setObs] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const totalItems = Array.isArray(listItems)
    ? listItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    : 0;

  const finishRent = async () => {
    if (!initialDate || !deliveryDate) {
      alert("Informe as datas da locação");
      return;
    }

    setLoading(true);

    const items = listItems.map(({ tool, ...rest }) => rest);

    const payload = {
      client: {
        id: client.id,
        type: client.cnpj ? "clientPJ" : "clientFS",
      },
      items,
      price: totalItems + (freight ? Number(freight) : 0),
      initialDate,
      deliveryDate,
      obs,
      freight: freight ? Number(freight) : 0,
    };

    try {
      const response = await api.post("/rent/create", payload);

      navigate("/pdf", {
        state: {
          client,
          rentId: response.data.id,
          items: listItems,
          price: payload.price,
          initialDate,
          deliveryDate,
          obs,
          freight: payload.freight,
        },
      });
    } catch (err) {
      alert("Erro ao finalizar locação");
    } finally {
      setLoading(false);
    }
  };

  return {
    initialDate,
    deliveryDate,
    freight,
    obs,
    loading,
    setInitialDate,
    setDeliveryDate,
    setFreight,
    setObs,
    finishRent,
    totalItems,
  };
};
