import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [masterOpen, setMasterOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 flex justify-between text-xl text-white p-4 z-100">
      <div className="flex gap-5">
        <button
          onClick={() => {
            navigate("/admin-dashboard");
          }}
          value="/admin-dashboard"
        >
          Home
        </button>
        <button
          onClick={() => {
            setMasterOpen(!masterOpen);
            setReportsOpen(false);
          }}
        >
          Master
        </button>
        {masterOpen && (
          <div className="absolute w-35 flex flex-col p-2 left-20 top-15 rounded-md mt-2 bg-white text-black shadow-lg text-lg">
            <Link
              className="p-2 ml-2"
              onClick={() => setMasterOpen(false)}
              to="/country"
            >
              Country
            </Link>
            <Link
              className="p-2 ml-2"
              onClick={() => setMasterOpen(false)}
              to="/states"
            >
              State
            </Link>
            <Link
              className="p-2 ml-2"
              onClick={() => setMasterOpen(false)}
              to="/cities"
            >
              City
            </Link>
            <Link
              className="p-2 ml-2"
              onClick={() => setMasterOpen(false)}
              to="/home"
            >
              Users
            </Link>
          </div>
        )}
        <button
          onClick={() => {
            setReportsOpen(!reportsOpen);
            setMasterOpen(false);
          }}
        >
          Reports
        </button>
        {reportsOpen && (
          <div className="absolute w-35 flex flex-col p-2 left-40 top-15 rounded-md mt-2 bg-white text-black shadow-lg text-lg">
            <Link
              className="p-2 ml-2"
              onClick={() => setReportsOpen(false)}
              to="/filtered-users"
            >
              Users
            </Link>
          </div>
        )}
      </div>
      <button
        className="p-2"
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    </nav>
  );
}

export default Navbar;
