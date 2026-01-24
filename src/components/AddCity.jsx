import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function AddCity() {
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState("");
  const [stateId, setStateId] = useState(-1);
  const [countryId, setCountryId] = useState(-1);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  const [countryStates, setCountryStates] = useState([]);

  const navigate = useNavigate();

  const fetchData = async () => {
    let citiesData = await axios.get("http://localhost:3000/cities");
    setCities(citiesData.data);
    let statesData = await axios.get("http://localhost:3000/states");
    setStates(statesData.data.filter((d) => d.removed === "N"));
    let data = await axios.get("http://localhost:3000/country");
    setCountry(data.data.filter((d) => d.removed === "N"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cityName && stateId !== -1) {
      if (
        cities.some((city) => {
          if (city.name.toLowerCase() === cityName.trim().toLowerCase()) {
            console.log(city.state_id, stateId);
            return city.state_id == stateId;
          }
        })
      ) {
        alert("City Already Exitst !");
      } else {
        try {
          await axios.post("http://localhost:3000/city", { stateId, cityName });
          navigate("/cities");
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      if (!cityName && stateId === -1) alert("Enter city and choose state");
      else if (!cityName) alert("Enter city");
      else alert("Choose state");
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
          <h1 className="font-extrabold text-3xl m-4">Add City</h1>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold">Choose Country:</label>
          <select
            className="border w-[14rem] rounded-md p-1"
            value={countryId}
            onChange={(e) => {
              let val = e.target.value;
              setCountryId(val);
              setCountryStates(states.filter(state => state.country_id == val));
            }}
          >
            <option disabled={countryId !== -1}>Select</option>
            {country.map((c, i) => (
              <option key={i} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div
          className={`p-4 w-full flex justify-between ${
            countryId === -1 ? "opacity-60" : ""
          }`}
        >
          <label className="mr-2 font-bold">Choose State:</label>
          <select
            className="border w-[14rem] rounded-md p-1"
            onChange={(e) => setStateId(e.target.value)}
            required
            disabled={countryId === -1}
          >
            <option disabled={stateId !== -1}>Select</option>
            {countryStates.map((state, i) => (
              <option key={i} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="name">
            Enter City:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="text"
            id="name"
            value={cityName}
            onChange={(e) => {
              setCityName(e.target.value);
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
            to="/cities"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddCity;
