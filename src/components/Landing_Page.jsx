import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function Landing_Page() {
  const [details, setDetails] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [searchVal, setSearchVal] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const itemsPerPage = 10;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const perPageUsers = details.slice(startIdx, endIdx);

  const totalPages = Math.ceil(details.length / itemsPerPage);

  const fetchData = async () => {
    let data = await api.get("/users");
    setDetails(data.data);
  };

  const toggleActive = async (data) => {
    if (window.confirm("Are you sure you want to change user active status")) {
      const val = data.is_active === "N" ? "Y" : "N";
      setDetails((prev) =>
        prev.map((d) => (d.id === data.id ? { ...d, is_active: val } : d))
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
        setSearchVal("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const search = async () => {
    try {
      const result = await api.get("/user/search", {
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
      <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] md:w-[90%] lg:w-[75%]">
        <h1 className="text-3xl font-bold mb-6 text-center">Users Data</h1>
        <div className="w-full flex justify-between items-center mb-1">
          <div>
            <input
              type="text"
              value={searchVal}
              className="border w-100 mr-2 rounded-md py-1 px-2"
              placeholder="Search User"
              onChange={(e) => setSearchVal(e.target.value)}
            />
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
        {!searchVal || searchResult === "" ? (
          <>
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length > 0 &&
                        perPageUsers.every((user) =>
                          selectedUsers.includes(user.id)
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(perPageUsers.map((user) => user.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">State</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Delete</th>
                  <th className="p-3">Update</th>
                </tr>
              </thead>

              <tbody>
                {perPageUsers.map((data, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100 transition">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(data.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers((prev) => [...prev, data.id]);
                          } else {
                            setSelectedUsers((prev) =>
                              prev.filter((id) => id !== data.id)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="p-3">{data.id}</td>
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
                    <td onClick={() => removeUser(data.id)} className="p-3">
                      <button className="bg-red-600 text-white p-2 rounded-md">
                        Delete
                      </button>
                    </td>
                    <td className="p-3">
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
            <div className="w-full flex justify-between items-center mt-4 mb-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                  setSelectedUsers([]);
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
                  setSelectedUsers([]);
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
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length > 0 &&
                      searchResult.every((user) =>
                        selectedUsers.includes(user.id)
                      )
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(searchResult.map((user) => user.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Email</th>
                <th className="p-3">Country</th>
                <th className="p-3">State</th>
                <th className="p-3">City</th>
                <th className="p-3">Active</th>
                <th className="p-3">Delete</th>
                <th className="p-3">Update</th>
              </tr>
            </thead>

            <tbody>
              {searchResult.map((data, i) => (
                <tr key={i} className="border-b hover:bg-gray-100 transition">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(data.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers((prev) => [...prev, data.id]);
                        } else {
                          setSelectedUsers((prev) =>
                            prev.filter((id) => id !== data.id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="p-3">{data.id}</td>
                  <td className="p-3">{data.user_name}</td>
                  <td className="p-3">{data.mobile}</td>
                  <td className="p-3">{data.email}</td>
                  <td className="p-3">{data.country_name}</td>
                  <td className="p-3">{data.state_name}</td>
                  <td className="p-3">{data.city_name}</td>
                  <td
                    onClick={() => toggleActive(data)}
                    className="p-3 text-center"
                  >
                    {data.is_active}
                  </td>
                  <td onClick={() => removeUser(data.id)} className="p-3">
                    <button className="bg-red-600 text-white p-2 rounded-md">
                      Delete
                    </button>
                  </td>
                  <td className="p-3">
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
        ) : (
          <div>
            <p>Not Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Landing_Page;
