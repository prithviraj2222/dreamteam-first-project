import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddState() {
  const [stateName, setStateName] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState(-1);
  const [states, setStates] = useState([]);

  const fetchData = async () => {
    let countriesData = await axios.get("http://localhost:3000/country");
    setCountries(countriesData.data.filter((d) => d.removed === "N"));
    let statesData = await axios.get("http://localhost:3000/states");
    setStates(statesData.data);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!states.some((state) => state.name === stateName.trim())) {
      try {
        await axios.post("http://localhost:3000/state", { countryId, stateName });
        navigate("/states");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("State Already Exitst !");
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
          <h1 className="font-extrabold text-3xl m-4">Add State</h1>
        </div>
        <div className="p-4 w-full flex justify-between">
            <label className="mr-2 font-bold">
                Choose Country:
            </label>
            <select className="border w-[14rem] rounded-md p-1" onChange={(e) => setCountryId(e.target.value)}>
                <option>Select</option>
                {
                    countries.map((country, i) => (
                        <option key={i} value={country.id}>
                            {country.name}
                        </option>
                    ))
                }
            </select>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="name">
            Enter State:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="text"
            id="name"
            value={stateName}
            onChange={(e) => {
              setStateName(e.target.value);
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
            to="/states"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddState;
