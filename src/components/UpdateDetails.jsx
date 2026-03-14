import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateDetails() {
  const [details, setDetails] = useState({});
  const [userCity, setUserCity] = useState({});
  const [countryId, setCountryId] = useState(-1);
  const [stateId, setStateId] = useState(-1);
  const [cities, setCities] = useState([]);
  const [select, setSelect] = useState(-1);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  const [countryStates, setCountryStates] = useState([]);
  const [stateCities, setStateCities] = useState([]);

  const { id } = useParams();

  const navigate = useNavigate();

  const fetchData = async () => {
    let data = await axios.get(`https://dreamteam-first-project-backend.onrender.com/users/${id}`);
    data = data.data[0];
    setDetails(data);
    let countriesData = await axios.get("https://dreamteam-first-project-backend.onrender.com/country");
    setCountry(countriesData.data.filter((d) => d.removed === "N"));
    let statesData = await axios.get("https://dreamteam-first-project-backend.onrender.com/states");
    setStates(statesData.data.filter((d) => d.removed === "N"));
    let citiesData = await axios.get("https://dreamteam-first-project-backend.onrender.com/cities");
    setCities(citiesData.data.filter((d) => d.removed === "N"));
    let cityData = await axios.get(
      `https://dreamteam-first-project-backend.onrender.com/city/${data.city_master_id}`
    );
    cityData = cityData.data[0];
    setUserCity(cityData);
    setCountryId(
      statesData.data.find((state) => state.id === cityData.state_id).country_id
    );
    setCountryStates(
      statesData.data.filter(
        (state) =>
          state.country_id ==
          statesData.data.find((state) => state.id === cityData.state_id)
            .country_id
      )
    );
    setStateId(cityData.state_id);

    setStateCities(
      citiesData.data.filter(
        (city) =>
          city.state_id ==
          citiesData.data.find((city) => city.id === data.city_master_id)
            .state_id
      )
    );

    setSelect(data.city_master_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to upadate user details")) {
      try {
        await axios.put(`https://dreamteam-first-project-backend.onrender.com/users/update/${id}`, details);
        navigate("/home");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center my-8">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 text-center flex flex-col items-start p-2 rounded-2xl w-[30%]"
      >
        <div className="flex w-full justify-center">
          <h1 className="font-extrabold text-3xl m-4">Update Details</h1>
        </div>
        <div className="p-[11px] w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="name">
            Name:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="text"
            id="name"
            value={details.name}
            placeholder="Enter your Name"
            onChange={(e) => {
              setDetails({ ...details, name: e.target.value });
            }}
          />
        </div>
        <div className="p-[11px] w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="dob">
            Date of Birth:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            max={new Date().toISOString().split("T")[0]}
            type="date"
            id="dob"
            value={details.dob ? details.dob.split("T")[0] : ""}
            onChange={(e) => {
              setDetails({ ...details, dob: e.target.value });
            }}
          />
        </div>
        <div className="p-[11px] w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="address">
            Address:{" "}
          </label>
          <textarea
            className="border w-[14rem] rounded-md p-1"
            name="address"
            id="address"
            value={details.address}
            placeholder="Enter your Address"
            onChange={(e) => {
              setDetails({ ...details, address: e.target.value });
            }}
          ></textarea>
        </div>
        <div className="p-[11px] w-full flex justify-between">
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
              setStateId(-1);
              setSelect(-1);
            }}
          >
            {country.map((c, i) => (
              <option key={i} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="p-[11px] w-full flex justify-between">
          <label className="mr-2 font-bold">Change State:</label>
          {stateId ? (
            <select
              className="border w-[14rem] rounded-md p-1"
              value={stateId}
              onChange={(e) => {
                let val = e.target.value;
                setStateId(val);
                setStateCities(cities.filter((city) => city.state_id == val));
                setSelect(-1);
              }}
            >
              <option>Select</option>
              {countryStates.map((state, i) => (
                <option key={i} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          ) : (
            <select className="border w-[14rem] rounded-md p-1" value={stateId}>
              <option value="">No State</option>
            </select>
          )}
        </div>
        <div className="p-[11px] w-full flex justify-between">
          <label className="mr-2 font-bold">Change City:</label>
          {stateCities[0] ? (
            <select
              className="border w-[14rem] rounded-md p-1"
              onChange={(e) => {
                let val = e.target.value;
                setSelect(val);
                setDetails({ ...details, city_master_id: val });
              }}
              value={select}
            >
              <option>Select</option>
              {stateCities.map((city, i) => (
                <option key={i} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          ) : (
            <select className="border w-[14rem] rounded-md p-1">
              <option value="">No City</option>
            </select>
          )}
        </div>
        <div className="p-[11px] w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="mobile">
            Mobile No.:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            maxLength={10}
            type="text"
            id="mobile"
            value={details.mobile}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              setDetails({ ...details, mobile: e.target.value });
            }}
            placeholder="Enter Mobile No."
          />
        </div>
        <div className="p-[11px] flex gap-8 justify-center w-full">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md px-4 py-2"
          >
            Update
          </button>
          <Link
            className="bg-blue-600 text-white rounded-md px-4 py-2"
            to="/home"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default UpdateDetails;
