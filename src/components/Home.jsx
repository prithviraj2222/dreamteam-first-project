import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function Home() {
  const [events, setEvents] = useState([]);

  const fetchdata = async () => {
    const res = await api.get("/events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchdata();
  }, []);
  
  return (
    <div className="min-h-[91vh] bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] md:w-[90%] lg:w-[75%]">
        <h1 className="text-3xl font-bold mb-6 text-center">Events</h1>
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-left">
              <th className="p-3 text-center">S.No.</th>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">From</th>
              <th className="p-3 text-center">To</th>
              <th className="p-3 text-center">Holiday</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event, i) => (
              <tr key={i} className="border-b hover:bg-gray-100 transition">
                <td className="p-3 text-center">{i + 1}</td>
                <td className="p-3 text-center">{event.name}</td>
                <td className="p-3 text-center">{event.start_date.split("T")[0]}</td>
                <td className="p-3 text-center">{event.end_date.split("T")[0]}</td>
                <td className="p-3 text-center">                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      event.is_holiday === "Y"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {event.is_holiday === "Y" ? "Holiday" : "Not Holiday"}
                  </span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
