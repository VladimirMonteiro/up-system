import { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';


const ClientInput = () => (

    const[clients, setClients] = useState([]);

  <AutoComplete
    style={{ width: 200 }}
    options={options}
    placeholder="try to type `b`"
    showSearch={{
      filterOption: (inputValue, option) =>
        option.value.toUpperCase().includes(inputValue.toUpperCase()),
    }}
  />
);
export default ClientInput;