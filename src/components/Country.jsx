import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Country() {
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const [searchVal, setSearchVal] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const itemsPerPage = 10;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const countries = country.slice(startIdx, endIdx);

  const totalPages = Math.ceil(country.length / itemsPerPage);

  const fetchData = async () => {
    let data = await axios.get("https://dreamteam-first-project-backend.onrender.com/country");
    setCountry(data.data.filter((d) => d.removed === "N"));

    let statesData = await axios.get("https://dreamteam-first-project-backend.onrender.com/states");
    // setStates(statesData.data.filter((d) => d.removed === "N"));
    setStates(statesData.data.map((state) => state.country_id));
  };

  const removeCountry = async (data) => {
    if (window.confirm("Are you sure you want to delete this country")) {
      setCountry((prev) => prev.filter((d) => d.id !== data.id));

      try {
        await axios.patch(`https://dreamteam-first-project-backend.onrender.com/country/${data.id}`);
        setSearchVal("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeSelectdCountries = async () => {
    if (
      window.confirm("Are you sure you want to delete this selected countries")
    ) {
      selectedCountries.map((data) => {
        setCountry((prev) => prev.filter((d) => d.id !== data));
      });

      try {
        await axios.patch(`https://dreamteam-first-project-backend.onrender.com/countries`, {
          selectedCountries,
        });

        setSelectedCountries([]);
        setSearchVal("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const search = async () => {
    try {
      const result = await axios.get("https://dreamteam-first-project-backend.onrender.com/country/search", {
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
        <h1 className="text-3xl mt-2 font-bold text-center">Country</h1>
        <div className="w-full flex justify-between items-center mb-1">
          <div>
            <input
              type="text"
              value={searchVal}
              className="border w-100 mr-2 rounded-md py-1 px-2"
              placeholder="Search Country"
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
          <div className="flex">
            <button
              onClick={removeSelectdCountries}
              className="text-white p-1 mb-2"
            >
              <i className="fa-solid fa-xmark text-red-600 text-3xl"></i>
            </button>
            <Link to="/country/add">
              <button className="text-white p-1 mb-2 border border-3 border-green-600 rounded-3xl">
                <i className="fa-solid fa-plus text-green-600 text-xl"></i>
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
                        selectedCountries.length > 0 &&
                        selectedCountries.length ===
                          countries.filter((c) => !states.includes(c.id)).length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const ids = countries
                            .filter((c) => !states.includes(c.id))
                            .map((c) => c.id);
                          setSelectedCountries(ids);
                        } else {
                          setSelectedCountries([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-1.5">Name</th>
                  <th className="p-1.5">Delete</th>
                  <th className="p-1.5">Update</th>
                </tr>
              </thead>

              <tbody>
                {countries.map((data, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100 transition">
                    {states.includes(data.id) ? (
                      <td className="p-1.5 font-bold">--</td>
                    ) : (
                      <td className="p-1.5">
                        <input
                          type="checkbox"
                          checked={selectedCountries.includes(data.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCountries((prev) => [
                                ...prev,
                                data.id,
                              ]);
                            } else {
                              setSelectedCountries((prev) =>
                                prev.filter((id) => id !== data.id)
                              );
                            }
                          }}
                        />
                      </td>
                    )}
                    <td className="p-1.5 w-full">{data.name}</td>
                    {states.includes(data.id) ? (
                      <td className="p-1.5 w-full text-center font-bold">--</td>
                    ) : (
                      <td
                        onClick={() => removeCountry(data)}
                        className="p-1.5 w-full"
                      >
                        <span className="w-full flex justify-center">
                          <i className="fa-solid fa-xmark text-red-600 text-xl"></i>
                        </span>
                      </td>
                    )}
                    <td className="p-1.5 w-full">
                      <Link
                        to={`/country/${data.id}`}
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
                  setSelectedCountries([]);
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
                  setSelectedCountries([]);
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
                      selectedCountries.length > 0 &&
                      selectedCountries.length ===
                        searchResult.filter((c) => !states.includes(c.id))
                          .length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const ids = searchResult
                          .filter((c) => !states.includes(c.id))
                          .map((c) => c.id);
                        setSelectedCountries(ids);
                      } else {
                        setSelectedCountries([]);
                      }
                    }}
                  />
                </th>
                <th className="p-1.5">Name</th>
                <th className="p-1.5">Delete</th>
                <th className="p-1.5">Update</th>
              </tr>
            </thead>
            <tbody>
              {searchResult.map((c) => (
                <tr>
                  {states.includes(c.id) ? (
                    <td className="p-1.5 font-bold">--</td>
                  ) : (
                    <td className="p-1.5">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(c.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCountries((prev) => [...prev, c.id]);
                          } else {
                            setSelectedCountries((prev) =>
                              prev.filter((id) => id !== c.id)
                            );
                          }
                        }}
                      />
                    </td>
                  )}
                  <td className="p-1.5 w-full">{c.name}</td>
                  {states.includes(c.id) ? (
                    <td className="p-1.5 w-full text-center font-bold">--</td>
                  ) : (
                    <td
                      onClick={() => removeCountry(c)}
                      className="p-1.5 w-full"
                    >
                      <span className="w-full flex justify-center">
                        <i className="fa-solid fa-xmark text-red-600 text-xl"></i>
                      </span>
                    </td>
                  )}
                  <td className="p-1.5 w-full">
                    <Link
                      to={`/country/${c.id}`}
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

export default Country;
