import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function FilteredUsers() {
  const [details, setDetails] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedActive, setSelectActive] = useState("");

  const fetchData = async () => {
    let countriesData = await api.get("/country");
    setCountries(countriesData.data.filter((d) => d.removed === "N"));
  };

  const toggleActive = async (data) => {
    if (window.confirm("Are you sure you want to change user active status")) {
      const val = data.is_active === "N" ? "Y" : "N";
      setDetails((prev) =>
        prev.map((d) => (d.id === data.id ? { ...d, is_active: val } : d)),
      );
      if (data.id) {
        try {
          await api.put(`/users/${data.id}`, { val });
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
        const res = await api.delete(`/users/${id}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeSelectdUsers = async () => {
    if (window.confirm("Are you sure you want to delete this selected users")) {
      selectedUsers.map((data, i) => {
        setDetails((prev) => prev.filter((d) => d.id !== data));
      });

      try {
        await api.patch(`/users`, { selectedUsers });
        setSelectedUsers([]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchFilteredUsers = async () => {
    const params = {};

    if (selectedCountry) {
      params.countryId = selectedCountry;
    }

    if (selectedState) {
      params.stateId = selectedState;
    }

    if (selectedCity) {
      params.cityId = selectedCity;
    }

    if (selectedActive && selectedActive !== "both") {
      params.active = selectedActive;
    }

    try {
      const res = await api.get("/users", { params });
      setDetails(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const exportUser = async () => {
    const params = {};

    if (selectedCountry) {
      params.countryId = selectedCountry;
    }

    if (selectedState) {
      params.stateId = selectedState;
    }

    if (selectedCity) {
      params.cityId = selectedCity;
    }

    if (selectedActive && selectedActive !== "both") {
      params.active = selectedActive;
    }

    try {
      const res = await api.get("/users/export", {
        params,
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "filtered_users.xlsx";

      document.body.appendChild(a);

      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      api
        .get(`/states/by-country/${selectedCountry}`)
        .then((res) => setStates(res.data));
    } else {
      setStates([]);
      setCities([]);
    }

    fetchFilteredUsers();
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      api
        .get(`/cities/by-state/${selectedState}`)
        .then((res) => setCities(res.data));
    }

    fetchFilteredUsers();
  }, [selectedState]);

  useEffect(() => {
    fetchFilteredUsers();
  }, [selectedCity, selectedActive]);

  return (
    <div className="min-h-[91vh] bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] md:w-[90%] lg:w-[80%]">
        <div id="print" className="w-full flex">
          <div className="w-[57%] flex justify-end">
            {" "}
            <h1 className="text-3xl font-bold text-center">Users Data</h1>
          </div>
          <div className="w-[43%] flex justify-end">
            <p><b>Date:</b> {new Date().toISOString().split("T")[0]}</p>
          </div>
        </div>
        <div className="w-full flex justify-end gap-4 mb-4">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={exportUser}
          >
            Export
          </button>

          <button
            className="bg-red-600 text-white py-2 px-4 rounded-md"
            onClick={() => {
              window.print();
            }}
          >
            Print
          </button>
        </div>
        <div className="w-full flex justify-between items-center mb-1">
          <div className="w-full flex gap-2 mb-4">
            <select
              className="w-full border rounded-md py-2 px-3 bg-gray-100"
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedState("");
                setSelectedCity("");
              }}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            <select
              className="w-full border rounded-md py-2 px-3 bg-gray-100 disabled:opacity-60"
              value={selectedState}
              disabled={!states[0]}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("");
              }}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
            <select
              className="w-full border rounded-md py-2 px-3 bg-gray-100 disabled:opacity-60"
              value={selectedCity}
              disabled={!cities[0]}
              onChange={(e) => {
                setSelectedCity(e.target.value);
              }}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            <div className="flex flex-col items-center">
              <label>Select Active</label>
              <div className="flex items-center gap-2">
                <label className="mb-1" htmlFor="yes">
                  Yes
                </label>
                <input
                  type="radio"
                  name="active"
                  value="Y"
                  id="yes"
                  onChange={(e) => setSelectActive(e.target.value)}
                />
                <label className="mb-1" htmlFor="no">
                  No
                </label>
                <input
                  type="radio"
                  name="active"
                  value="N"
                  id="no"
                  onChange={(e) => setSelectActive(e.target.value)}
                />
                <label className="mb-1" htmlFor="both">
                  Both
                </label>
                <input
                  type="radio"
                  name="active"
                  value="both"
                  id="both"
                  onChange={(e) => setSelectActive(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={removeSelectdUsers}
              className="text-white p-1 mb-2"
            >
              <i className="fa-solid fa-xmark text-red-600 text-3xl"></i>
            </button>
            <Link to="/">
              <button className="text-white p-1 mb-2">
                <i className="fa-solid fa-plus text-green-600 text-3xl"></i>
              </button>
            </Link>
          </div>
        </div>
        {details[0] ? (
          <div id="print-section">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th className="no-print p-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length > 0 &&
                        details.every((user) => selectedUsers.includes(user.id))
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(details.map((user) => user.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-3">S.No.</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">State</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Active</th>
                  <th className="no-print p-3">Delete</th>
                  <th className="no-print p-3">Update</th>
                </tr>
              </thead>

              <tbody>
                {details.map((data, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100 transition">
                    <td className="no-print p-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(data.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers((prev) => [...prev, data.id]);
                          } else {
                            setSelectedUsers((prev) =>
                              prev.filter((id) => id !== data.id),
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="p-3">{i+1}</td>
                    <td className="p-3">{data.user_name}</td>
                    <td className="p-3">{data.mobile}</td>
                    <td className="p-3">{data.email}</td>
                    <td className="p-3">{data.country_name}</td>
                    <td className="p-3">{data.state_name}</td>
                    <td className="p-3">{data.city_name}</td>
                    <td
                      onClick={() => toggleActive(data)}
                      className="p-3 text-center hover:cursor-pointer"
                    >
                      {data.is_active === "Y" ? "Yes" : "No"}
                    </td>
                    <td
                      onClick={() => removeUser(data.id)}
                      className="no-print p-3"
                    >
                      <button className="bg-red-600 text-white p-2 rounded-md">
                        Delete
                      </button>
                    </td>
                    <td className="no-print p-3">
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
        ) : (
          <div>
            <p>User Not Avaialble</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilteredUsers;
