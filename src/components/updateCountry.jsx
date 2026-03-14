import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function updateCountry() {
  const [country, setCountry] = useState({});
  const { id } = useParams();

  const navigate = useNavigate();

  const fetchData = async () => {
    let data = await axios.get(`https://dreamteam-first-project-backend.onrender.com/country/${id}`);
    setCountry(data.data[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to upadate country name")) {
      try {
        await axios.put(`https://dreamteam-first-project-backend.onrender.com/country/${id}`, country);
        navigate("/country");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center my-16">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 text-center flex flex-col items-start p-2 rounded-2xl w-[30%]"
      >
        <div className="flex w-full justify-center">
          <h1 className="font-extrabold text-3xl m-4">Update Country</h1>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="name">
            Name:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="text"
            id="name"
            value={country.name}
            placeholder="Enter Country Name"
            onChange={(e) => {
              setCountry({ ...country, name: e.target.value });
            }}
          />
        </div>
        <div className="p-4 flex justify-center gap-4 w-full">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md px-4 py-2"
          >
            Update
          </button>

          <Link
            type="submit"
            className="bg-blue-600 text-white rounded-md px-4 py-2"
            to="/country"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default updateCountry;
