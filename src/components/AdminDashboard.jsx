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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsersByCountry = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users-by-country");
      setUsersByCountry(response.data);
      console.log(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users by country:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersByCountry();
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
    <div className="p-8 bg-gray-50 min-h-screen">
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
  );
}

export default AdminDashboard;
