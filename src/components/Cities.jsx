import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Cities() {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [searchVal, setSearchVal] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const itemsPerPage = 10;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const perPageCities = cities.slice(startIdx, endIdx);

  const totalPages = Math.ceil(cities.length / itemsPerPage);

  const fetchData = async () => {
    let citiesData = await axios.get("https://dreamteam-first-project-backend.onrender.com/cities"); // http://localhost:3000
    setCities(citiesData.data.filter((city) => city.removed === "N"));
    let statesData = await axios.get("https://dreamteam-first-project-backend.onrender.com/states");
    setStates(statesData.data);
    let countriesData = await axios.get("https://dreamteam-first-project-backend.onrender.com/country");
    setCountry(countriesData.data);
    let userData = await axios.get("https://dreamteam-first-project-backend.onrender.com/users");
    setUsers(userData.data.map((user) => user.city_master_id));
  };

  const removeCity = async (data) => {
    if (window.confirm("Are you sure you want to delete this city")) {
      setCities((prev) => prev.filter((d) => d.id !== data.id));

      try {
        await axios.patch(`https://dreamteam-first-project-backend.onrender.com/city/${data.id}`);
        setSearchVal("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeSelectdCities = async () => {
    if (
      window.confirm("Are you sure you want to delete this selected cities")
    ) {
      if (selectedCities[0]) {
        selectedCities.map((data, i) => {
          setCities((prev) => prev.filter((d) => d.id !== data));
        });

        try {
          await axios.patch(`https://dreamteam-first-project-backend.onrender.com/cities`, { selectedCities });
          setSelectedCities([]);
          setSearchVal("");
        } catch (error) {
          console.log(error);
        }
      }else{
        alert("Choose users")
      }
    }
  };

  const findState = (id) => {
    let state = states.find((state) => state.id === id);
    return state ? state.name : "";
  };

  const findCountry = (id) => {
    let state = states.find((state) => state.id === id);
    let result = country.find((c) => c.id === state.country_id);
    return result ? result.name : "";
  };

  const search = async () => {
    try {
      const result = await axios.get("https://dreamteam-first-project-backend.onrender.com/city/search", {
        params: {
          name: searchVal.trim(),
        },
      });

      setSearchResult(result.data ? result.data : null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchVal) {
      setSearchResult("");
      return;
    }

    const timer = setTimeout(() => {
      search();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchVal]);

  return (
    <div className="min-h-[91vh] bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-lg rounded-lg px-6 p-1.5 w-[90%] lg:w-[70%]">
        <h1 className="text-3xl mt-2 font-bold text-center">Cities</h1>
        <div className="w-full flex justify-between items-center mb-1">
          <div>
            <input
              type="text"
              value={searchVal}
              className="border w-100 mr-2 rounded-md py-1 px-2"
              placeholder="Search City"
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
          <div className="flex">
            <button
              onClick={removeSelectdCities}
              className="text-white p-1 mb-2"
            >
              <i className="fa-solid fa-xmark text-red-600 text-3xl"></i>
            </button>
            <Link to="/city/add">
              <button className="text-white p-1 mb-2">
                <i className="fa-solid fa-plus text-green-600 text-3xl"></i>
              </button>
            </Link>
          </div>
        </div>

        {!searchVal || searchResult === "" ? (
          <>
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th className="p-1.5">
                    <input
                      type="checkbox"
                      checked={
                        selectedCities.length > 0 &&
                        selectedCities.length ===
                          perPageCities.filter(
                            (city) => !users.includes(city.id)
                          ).length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const ids = perPageCities
                            .filter((city) => !users.includes(city.id))
                            .map((city) => city.id);
                          setSelectedCities(ids);
                        } else {
                          setSelectedCities([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-1.5">Name</th>
                  <th className="p-1.5">State</th>
                  <th className="p-1.5">Country</th>
                  <th className="p-1.5">Delete</th>
                  <th className="p-1.5">Update</th>
                </tr>
              </thead>

              <tbody>
                {perPageCities.map((city, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100 transition">
                    {users.includes(city.id) ? (
                      <td className="p-1.5 font-bold">--</td>
                    ) : (
                      <td className="p-1.5">
                        <input
                          type="checkbox"
                          checked={selectedCities.includes(city.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCities((prev) => [...prev, city.id]);
                            } else {
                              setSelectedCities((prev) =>
                                prev.filter((id) => id !== city.id)
                              );
                            }
                          }}
                        />
                      </td>
                    )}

                    <td className="p-1.5 w-[35%]">{city.name}</td>
                    <td className="p-1.5 w-[30%]">
                      {findState(city.state_id)}
                    </td>
                    <td className="p-1.5 w-[30%]">
                      {findCountry(city.state_id)}
                    </td>
                    {users.includes(city.id) ? (
                      <td className="p-1.5 w-full text-center font-bold">--</td>
                    ) : (
                      <td
                        onClick={() => removeCity(city)}
                        className="p-1.5 w-full"
                      >
                        <span className="w-full flex justify-center">
                          <i className="fa-solid fa-xmark text-red-600 text-xl"></i>
                        </span>
                      </td>
                    )}
                    <td className="p-1.5 w-full">
                      <Link
                        to={`/city/${city.id}`}
                        className="w-full flex justify-center"
                      >
                        <i className="fa-solid fa-pen-to-square text-xl"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-full flex justify-between items-center mt-4 mb-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                  setSelectedCities([]);
                }}
              >
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <span>
                {currentPage} of {totalPages}
              </span>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                  setSelectedCities([]);
                }}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </>
        ) : searchResult.length > 0 ? (
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-left">
                <th className="p-1.5">
                  <input
                    type="checkbox"
                    checked={
                      selectedCities.length > 0 &&
                      selectedCities.length ===
                        searchResult.filter((city) => !users.includes(city.id))
                          .length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const ids = searchResult
                          .filter((city) => !users.includes(city.id))
                          .map((city) => city.id);
                        setSelectedCities(ids);
                      } else {
                        setSelectedCities([]);
                      }
                    }}
                  />
                </th>
                <th className="p-1.5">Name</th>
                <th className="p-1.5">State</th>
                <th className="p-1.5">Country</th>
                <th className="p-1.5">Delete</th>
                <th className="p-1.5">Update</th>
              </tr>
            </thead>
            <tbody>
              {searchResult.map((city, i) => (
                <tr key={i}>
                  {users.includes(city.id) ? (
                    <td className="p-1.5 font-bold">--</td>
                  ) : (
                    <td className="p-1.5">
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(city.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCities((prev) => [...prev, city.id]);
                          } else {
                            setSelectedCities((prev) =>
                              prev.filter((id) => id !== city.id)
                            );
                          }
                        }}
                      />
                    </td>
                  )}
                  <td className="p-1.5 w-[54%]">{city.name}</td>
                  <td className="p-1.5 w-[30%]">{findState(city.state_id)}</td>
                  <td className="p-1.5 w-full pl-3">
                    {findCountry(city.state_id)}
                  </td>
                  {users.includes(city.id) ? (
                    <td className="p-1.5 w-full text-center font-bold">--</td>
                  ) : (
                    <td
                      onClick={() => removeCity(city)}
                      className="p-1.5 w-full"
                    >
                      <span className="w-full flex justify-center">
                        <i className="fa-solid fa-xmark text-red-600 text-xl"></i>
                      </span>
                    </td>
                  )}
                  <td className="p-1.5 w-full">
                    <Link
                      to={`/city/${city.id}`}
                      className="w-full flex justify-center"
                    >
                      <i className="fa-solid fa-pen-to-square text-xl"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            <p>Not Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cities;
