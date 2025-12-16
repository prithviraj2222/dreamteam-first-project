import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from "axios";

function Country() {
   const [details, setDetails] = useState([]);
   const [country, setCountry] = useState("Choose Country");

  const fetchData = async () => {
    let data = await axios.get("http://localhost:3000/users");
    setDetails(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] md:w-[80%] lg:w-[75%]">
        <h1 className="text-3xl font-bold mb-6 text-center">Users Data</h1>

        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Address</th>
              <th className="p-3">Country</th>
            </tr>
          </thead>

          <tbody>
            {details.map((data, i) => (
              <tr key={i} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{data.id}</td>
                <td className="p-3">{data.name}</td>
                <td className="p-3">{data.email}</td>
                <td className="p-3">{data.address}</td>
                <td className="p-3">
                    <select value={country} onChange={(e) => setCountry(e.target.value)}>
                        <option value={country}>India</option>
                        <option value={country}>USA</option>
                    </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Country
