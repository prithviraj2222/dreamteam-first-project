import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import api from "../api";

function AdminDashboard() {
  const [usersByCountry, setUsersByCountry] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsersByCountry = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users-by-country");
      setUsersByCountry(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users by country:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchUsersByCountry();
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 flex gap-4 min-h-screen">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Users by Country
        </h1>

        {usersByCountry.length === 0 ? (
          <p className="text-gray-600">No data available</p>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={usersByCountry}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="country" height={60} />
                <YAxis />
                {/* <Tooltip
                contentStyle={{ backgroundColor: '#f3f4f6', border: 'none' }}
              /> */}
                <Bar dataKey="userCount" fill="#3b82f6">
                  <LabelList dataKey="userCount" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Countries</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {usersByCountry.length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {usersByCountry.reduce(
                      (sum, country) => sum + country.userCount,
                      0,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Events</h1>
        {events.length === 0 ? (
          <p className="text-gray-600">No events available</p>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {event.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      event.is_holiday === "Y"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {event.is_holiday === "Y" ? "Holiday" : "Not Holiday"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Start:</strong>
                    {new Date(event.start_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End:</strong>
                    {new Date(event.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
