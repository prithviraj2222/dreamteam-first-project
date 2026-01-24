import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function States() {
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [searchVal, setSearchVal] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const itemsPerPage = 10;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const perPageStates = states.slice(startIdx, endIdx);

  const totalPages = Math.ceil(states.length / itemsPerPage);

  const fetchData = async () => {
    let statesData = await axios.get("http://localhost:3000/states");
    setStates(statesData.data.filter((d) => d.removed === "N"));
    let countriesData = await axios.get("http://localhost:3000/country");
    setCountry(countriesData.data.filter((d) => d.removed === "N"));
    let citiesData = await axios.get("http://localhost:3000/cities");
    setCities(citiesData.data.map((city) => city.state_id));
  };

  const removeState = async (data) => {
    if (window.confirm("Are you sure you want to delete this state")) {
      setStates((prev) => prev.filter((d) => d.id !== data.id));

      try {
        await axios.patch(`http://localhost:3000/state/${data.id}`);
        setSearchVal("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const findCountry = (id) => {
    let data = country.find((c) => c.id === id);
    return data ? data.name : "";
  };

  const removeSelectdStates = async () => {
    if (
      window.confirm("Are you sure you want to delete this selected states")
    ) {
      selectedStates.map((data, i) => {
        setStates((prev) => prev.filter((d) => d.id !== data));
      });

      try {
        await axios.patch(`http://localhost:3000/states`, { selectedStates });
        setSelectedStates([]);
        setSearchVal("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const search = async () => {
    try {
      const result = await axios.get("http://localhost:3000/state/search", {
        params: {
          name: searchVal,
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
        <h1 className="text-3xl mt-2 font-bold text-center">States</h1>
        <div className="w-full flex justify-between items-center mb-1">
          <div>
            <input
              type="text"
              value={searchVal}
              className="border w-100 mr-2 rounded-md py-1 px-2"
              placeholder="Search State"
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
          <div className="flex">
            <button
              onClick={removeSelectdStates}
              className="text-white p-1 mb-2"
            >
              <i className="fa-solid fa-xmark text-red-600 text-3xl"></i>
            </button>
            <Link to="/state/add">
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
                        selectedStates.length > 0 &&
                        selectedStates.length ===
                          perPageStates.filter(
                            (state) => !cities.includes(state.id)
                          ).length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const ids = perPageStates
                            .filter((state) => !cities.includes(state.id))
                            .map((state) => state.id);
                          setSelectedStates(ids);
                        } else {
                          setSelectedStates([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-1.5">Name</th>
                  <th className="p-1.5">Country</th>
                  <th className="p-1.5">Delete</th>
                  <th className="p-1.5">Update</th>
                </tr>
              </thead>

              <tbody>
                {perPageStates.map((state, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100 transition">
                    {cities.includes(state.id) ? (
                      <td className="p-1.5 font-bold">--</td>
                    ) : (
                      <td className="p-1.5">
                        <input
                          type="checkbox"
                          checked={selectedStates.includes(state.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStates((prev) => [...prev, state.id]);
                            } else {
                              setSelectedStates((prev) =>
                                prev.filter((id) => id !== state.id)
                              );
                            }
                          }}
                        />
                      </td>
                    )}
                    <td className="p-1.5 w-[54%]">{state.name}</td>
                    <td className="p-1.5 w-full pl-3">
                      {findCountry(state.country_id)}
                    </td>
                    {cities.includes(state.id) ? (
                      <td className="p-1.5 w-full text-center font-bold">--</td>
                    ) : (
                      <td
                        onClick={() => removeState(state)}
                        className="p-1.5 w-full"
                      >
                        <span className="w-full flex justify-center">
                          <i className="fa-solid fa-xmark text-red-600 text-xl"></i>
                        </span>
                      </td>
                    )}
                    <td className="p-1.5 w-full">
                      <Link
                        to={`/state/${state.id}`}
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
                  setSelectedStates([]);
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
                  setSelectedStates([]);
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
                      selectedStates.length > 0 &&
                      selectedStates.length ===
                        searchResult.filter(
                          (state) => !cities.includes(state.id)
                        ).length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                          const ids = searchResult
                            .filter((state) => !cities.includes(state.id))
                            .map((state) => state.id);
                          setSelectedStates(ids);
                      } else {
                        setSelectedStates([]);
                      }
                    }}
                  />
                </th>
                <th className="p-1.5">Name</th>
                <th className="p-1.5">Country</th>
                <th className="p-1.5">Delete</th>
                <th className="p-1.5">Update</th>
              </tr>
            </thead>
            <tbody>
              {searchResult.map((state) => (
                <tr>
                  {cities.includes(state.id) ? (
                    <td className="p-1.5 font-bold">--</td>
                  ) : (
                    <td className="p-1.5">
                      <input
                        type="checkbox"
                        checked={selectedStates.includes(state.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStates((prev) => [...prev, state.id]);
                          } else {
                            setSelectedStates((prev) =>
                              prev.filter((id) => id !== state.id)
                            );
                          }
                        }}
                      />
                    </td>
                  )}
                  <td className="p-1.5 w-[54%]">{state.name}</td>
                  <td className="p-1.5 w-full pl-3">
                    {findCountry(state.country_id)}
                  </td>
                  {cities.includes(state.id) ? (
                    <td className="p-1.5 w-full text-center font-bold">--</td>
                  ) : (
                    <td
                      onClick={() => removeState(state)}
                      className="p-1.5 w-full"
                    >
                      <span className="w-full flex justify-center">
                        <i className="fa-solid fa-xmark text-red-600 text-xl"></i>
                      </span>
                    </td>
                  )}
                  <td className="p-1.5 w-full">
                    <Link
                      to={`/state/${state.id}`}
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

export default States;
