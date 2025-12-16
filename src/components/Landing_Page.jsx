import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Landing_Page() {
  const [details, setDetails] = useState([]);

  const fetchData = async () => {
    let data = await axios.get("http://localhost:3000/users");
    setDetails(data.data);
  };

  const toggleActive = async (data) => {
    if (window.confirm("Are you sure you want to change user active status")) {
      const val = (data.is_active = data.is_active === "N" ? "Y" : "N");
      setDetails((prev) =>
        prev.map((d) => (d.id === data.id ? { ...d, is_active: val } : d))
      );
      if (data.id) {
        try {
          await axios.put(`http://localhost:3000/users/${data.id}`, { val });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const removeUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user")) {
      setDetails((prev) => prev.filter((d) => d.id !== id));

      try {
        const res = await axios.delete(`http://localhost:3000/users/${id}`);
      } catch (error) {
        console.log(error);
      }
    }
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
              <th className="p-3">DOB</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Email</th>
              <th className="p-3">Address</th>
              <th className="p-3">Password</th>
              <th className="p-3">Active</th>
              <th className="p-3">Delete</th>
              <th className="p-3">Update</th>
            </tr>
          </thead>

          <tbody>
            {details.map((data, i) => (
              <tr key={i} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{data.id}</td>
                <td className="p-3">{data.name}</td>
                <td className="p-3">{data.dob.split("T")[0]}</td>
                <td className="p-3">{data.mobile}</td>
                <td className="p-3">{data.email}</td>
                <td className="p-3">{data.address}</td>
                <td className="p-3">{data.password}</td>
                <td onClick={() => toggleActive(data)} className="p-3">
                  {data.is_active}
                </td>
                <td onClick={() => removeUser(data.id)} className="p-3">
                  <button className="bg-red-600 text-white p-2 rounded-md">
                    Delete
                  </button>
                </td>
                <td className="p-3">
                  <Link to={`/update/${data.id}`}>
                    <button className="bg-blue-600 text-white p-2 rounded-md">
                      Update
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Landing_Page;
