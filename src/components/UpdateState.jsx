import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function UpdateState() {
  const [state, setState] = useState({});
  const [countries, setCountries] = useState([]);
  const [select, setSelect] = useState();
  const [states, setStates] = useState({});

  const { id } = useParams();

  const navigate = useNavigate();

  const fetchData = async () => {
    let countriesData = await axios.get("http://localhost:3000/country");
    setCountries(countriesData.data.filter((d) => d.removed === "N"));
    let data = await axios.get(`http://localhost:3000/state/${id}`);
    data = data.data[0];
    setState(data);
    setSelect(data.country_id);
    let statesData = await axios.get("http://localhost:3000/states");
    setStates(statesData.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (window.confirm("Are you sure you want to upadate state name")) {
      if (
        states.some((s) => {
          if (s.name === state.name.trim()) {
            return s.country_id == select;
          }
        })
      ) {
        alert("State Already Exitst !");
      } else {
        try {
          await axios.put(`http://localhost:3000/state/${id}`, {
            state,
            select,
          });
          navigate("/states");
        } catch (error) {
          console.log(error);
        }
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
          <h1 className="font-extrabold text-3xl m-4">Update State</h1>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold">Change Country:</label>
          <select
            className="border w-[14rem] rounded-md p-1"
            onChange={(e) => setSelect(e.target.value)}
            value={select}
          >
            {countries.map((country, i) => (
              <option key={i} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="name">
            Name:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="text"
            id="name"
            value={state.name}
            onChange={(e) => {
              setState({ ...state, name: e.target.value });
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
            to="/states"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default UpdateState;
