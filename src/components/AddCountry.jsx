import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddCountry() {
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);

  const fetchData = async () => {
    let data = await axios.get("http://localhost:3000/country");
    setCountries(data.data);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(countries.some((countryName) => countryName.name === country.trim()))) {
      try {
        await axios.post("http://localhost:3000/country", { country });
        navigate("/country");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Country Already Exitst !");
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
          <h1 className="font-extrabold text-3xl m-4">Add Country</h1>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="name">
            Enter Country:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="text"
            id="name"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
            }}
          />
        </div>
        <div className="p-4 flex justify-center gap-4 w-full">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md px-4 py-2"
          >
            Add
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

export default AddCountry;
