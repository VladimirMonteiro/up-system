import { useState } from "react";
import { handlePriceChange } from "../../../utils/handlePriceChange";
import { formateNumber } from "../../../utils/formatNumber";

export const useCreateRent = () => {
  const [client, setClient] = useState({});
  const [tool, setTool] = useState({});
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [meters, setMeters] = useState("");
  const [listItems, setListItems] = useState([]);

  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isToolModalOpen, setToolModalOpen] = useState(false);
  const [isFinishRentOpen, setFinishRentOpen] = useState(false);

  const addItem = () => {
    if (!tool?.id || !price || !quantity) {
      alert("Preencha todos os campos");
      return;
    }

    const parsedPrice = parseFloat(
      price.replace("R$", "").replace(/\./g, "").replace(",", ".")
    );

    const item = {
      toolId: tool.id,
      tool: tool.name,
      quantity: Number(quantity),
      price: parsedPrice,
    };

    setListItems(prev => [...prev, item]);
    setTool({});
    setPrice("");
    setQuantity("");
    setMeters("");
  };

  const removeItem = (index) => {
    setListItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    setListItems(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const total = listItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    client,
    setClient,
    tool,
    setTool,
    price,
    setPrice,
    quantity,
    setQuantity,
    meters,
    setMeters,
    listItems,
    total,
    addItem,
    removeItem,
    updateItem,
    isClientModalOpen,
    setClientModalOpen,
    isToolModalOpen,
    setToolModalOpen,
    isFinishRentOpen,
    setFinishRentOpen,
    handlePriceChange,
    formateNumber
  };
};
