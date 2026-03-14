import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Events() {
  const [events, setEvents] = useState([]);

  const [selectedEvents, setSelectedEvents] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [searchVal, setSearchVal] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const itemsPerPage = 10;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const perPageEvents = events.slice(startIdx, endIdx);

  const totalPages = Math.ceil(events.length / itemsPerPage);

  const fetchdata = async () => {
    const res = await api.get("/events");
    setEvents(res.data);
  };

    const toggleHoliday = async (data) => {
    if (window.confirm("Are you sure you want to change event holiday status")) {
      const val = data.is_holiday === "N" ? "Y" : "N";
      setEvents((prev) =>
        prev.map((d) => (d.id === data.id ? { ...d, is_holiday: val } : d))
      );
      if (data.id) {
        try {
          await api.put(`/event/${data.id}`, { val });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const removeEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event")) {
      setEvents((prev) => prev.filter((d) => d.id !== id));

      try {
        const res = await api.delete(`/event/${id}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const removeSelectdEvents = async () => {
    if (
      window.confirm("Are you sure you want to delete this selected events")
    ) {
      console.log(selectedEvents);
      selectedEvents.map((data, i) => {
        setEvents((prev) => prev.filter((d) => d.id !== data));
      });

      try {
        await api.patch(`/events`, { selectedEvents });
        setSelectedEvents([]);
        setSearchVal("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const search = async () => {
    try {
      const result = await api.get("/event/search", {
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
    fetchdata();
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
        <h1 className="text-3xl font-bold mb-6 text-center">Events</h1>
        <div className="w-full flex justify-between items-center mb-1">
          <div>
            <input
              type="text"
              value={searchVal}
              className="border w-100 mr-2 rounded-md py-1 px-2"
              placeholder="Search event"
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={removeSelectdEvents}
              className="text-white p-1 mb-2"
            >
              <i className="fa-solid fa-xmark text-red-600 text-3xl"></i>
            </button>
            <Link to="/add-event">
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
                  <th className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedEvents.length > 0 &&
                        perPageEvents.every((event) =>
                          selectedEvents.includes(event.id),
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEvents(
                            perPageEvents.map((event) => event.id),
                          );
                        } else {
                          setSelectedEvents([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-3 text-center">S.No.</th>
                  <th className="p-3 text-center">Name</th>
                  <th className="p-3 text-center">From</th>
                  <th className="p-3 text-center">To</th>
                  <th className="p-3 text-center">Holiday</th>
                  <th className="p-3 text-center">Delete</th>
                  <th className="p-3 text-center">Update</th>
                </tr>
              </thead>

              <tbody>
                {perPageEvents.map((event, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100 transition">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents((prev) => [...prev, event.id]);
                          } else {
                            setSelectedEvents((prev) =>
                              prev.filter((id) => id !== event.id),
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="p-3 text-center">{i + 1}</td>
                    <td className="p-3 text-center">{event.name}</td>
                    <td className="p-3 text-center">
                      {new Date(event.start_date).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center">
                      {new Date(event.end_date).toLocaleDateString()}
                    </td>
                    <td
                      onClick={() => toggleHoliday(event)}
                      className="p-3 text-center text-center hover:cursor-pointer"
                    >
                      {event.is_holiday === "Y" ? "Yes" : "No"}
                    </td>
                    <td onClick={() => removeEvent(event.id)} className="p-3 text-center">
                      <button className="bg-red-600 text-white p-2 rounded-md">
                        Delete
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <Link to={`/update/${event.id}`}>
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
                  setSelectedEvents([]);
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
                  setSelectedEvents([]);
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
                <th className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedEvents.length > 0 &&
                      searchResult.every((event) =>
                        selectedEvents.includes(event.id),
                      )
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEvents(
                          searchResult.map((event) => event.id),
                        );
                      } else {
                        setSelectedEvents([]);
                      }
                    }}
                  />
                </th>
                <th className="p-3 text-center">S.No.</th>
                <th className="p-3 text-center">Name</th>
                <th className="p-3 text-center">From</th>
                <th className="p-3 text-center">To</th>
                <th className="p-3 text-center">Holiday</th>
                <th className="p-3 text-center">Delete</th>
                <th className="p-3 text-center">Update</th>
              </tr>
            </thead>

            <tbody>
              {searchResult.map((data, i) => (
                <tr key={i} className="border-b hover:bg-gray-100 transition">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(data.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEvents((prev) => [...prev, data.id]);
                        } else {
                          setSelectedEvents((prev) =>
                            prev.filter((id) => id !== data.id),
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="p-3 text-center">{i + 1}</td>
                  <td className="p-3 text-center">{data.event_name}</td>
                  <td className="p-3 text-center">
                    {new Date(data.start_date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
                    {new Date(data.end_date).toLocaleDateString()}
                  </td>
                  <td
                    onClick={() => toggleHoliday(data)}
                    className="p-3 text-center"
                  >
                    {data.is_holiday === "Y" ? "Yes" : "No"}
                  </td>
                  <td onClick={() => removeEvent(data.id)} className="p-3 text-center">
                    <button className="bg-red-600 text-white p-2 rounded-md">
                      Delete
                    </button>
                  </td>
                  <td className="p-3 text-center">
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

export default Events;
