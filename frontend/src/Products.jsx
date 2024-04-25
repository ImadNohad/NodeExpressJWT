// Dashboard.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const Products = ({ onLogout }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    setError("");
    const fetchData = async () => {
      try {
        const token = cookies.access_token;
        const response = await axios.get("http://127.0.0.1:82/products", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        setError(error.response.data);
        setData([]);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="container">
      <h2>Products Table</h2>
      <button className="btn btn-primary" onClick={handleLogout}>
        Logout
      </button>
      <br />
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.description}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
