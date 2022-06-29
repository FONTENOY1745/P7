import React, { createContext, useState, useEffect } from "react";
import Axios from "axios";

export const datacontext = createContext({});

export const DataProvider = ({ children }) => {
  const [dataUser, setDataUser] = useState([]);
  const LStoken = localStorage.getItem("token");
  const userId = localStorage.getItem("id");
  const [dataUserId, setDataUserId] = useState("");

  useEffect(() => {
    Axios.get(`http://localhost:3000/api/user/${userId}`).then((response) => {
      console.log(response.data);
      setDataUserId(response.data.id);
      setDataUser(response.data);
    });
  }, []);

  return (
    <datacontext.Provider
      value={{
        dataUser,
        LStoken,
        dataUserId,
      }}
    >
      {children}
    </datacontext.Provider>
  );
};

export default datacontext;
