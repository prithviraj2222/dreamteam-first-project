import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

function UpdateCity() {
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState({});
  const [select, setSelect] = useState();
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  const [countryStates, setCountryStates] = useState([]);

  const [countryId, setCountryId] = useState(-1);

  const { id } = useParams();

  const navigate = useNavigate();

  const fetchData = async () => {
    let citiesData = await axios.get("https://dreamteam-first-project-backend.onrender.com/cities");
    setCities(citiesData.data);
    let data = await axios.get(`https://dreamteam-first-project-backend.onrender.com/city/${id}`);
    data = data.data[0];
    setCity(data);
    setSelect(data.state_id);
    let statesData = await axios.get("https://dreamteam-first-project-backend.onrender.com/states");
    setStates(statesData.data.filter((d) => d.removed === "N"));
    setCountryId(
      statesData.data.find((state) => state.id === data.state_id).country_id
    );
    let countriesData = await axios.get("https://dreamteam-first-project-backend.onrender.com/country");
    setCountry(countriesData.data);
    setCountryStates(
      statesData.data.filter(
        (state) =>
          state.country_id ==
          statesData.data.find((state) => state.id === data.state_id).country_id
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (window.confirm("Are you sure you want to upadate city name")) {
      if (select) {
        if (
          cities.some((c) => {
            if (c.name.toLowerCase() === city.name.trim().toLowerCase()) {
              return c.state_id == select;
            }
          })
        ) {
          alert("City Already Exitst !");
        } else {
          try {
            await axios.put(`https://dreamteam-first-project-backend.onrender.com/city/${id}`, {
              city,
              select,
            });
            navigate("/cities");
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        alert("Choose State");
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
          <h1 className="font-extrabold text-3xl m-4">Update City</h1>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold">Choose Country:</label>
          <select
            className="border w-[14rem] rounded-md p-1"
            value={countryId}
            onChange={(e) => {
              let val = e.target.value;
              setCountryId(val);
              setCountryStates(
                states.filter((state) => state.country_id == val)
              );
              setSelect("");
            }}
          >
            {country.map((c, i) => (
              <option key={i} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold">Change State:</label>
          {countryStates[0] ? (
            <select
              className="border w-[14rem] rounded-md p-1"
              onChange={(e) => setSelect(e.target.value)}
              value={select}
            >
              <option>Select</option>
              {countryStates.map((state, i) => (
                <option key={i} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          ) : (
            <select className="border w-[14rem] rounded-md p-1">
              <option value="">No State</option>
            </select>
          )}
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="name">
            Name:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="text"
            id="name"
            value={city.name}
            onChange={(e) => {
              setCity({ ...city, name: e.target.value });
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
            to="/cities"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default UpdateCity;
