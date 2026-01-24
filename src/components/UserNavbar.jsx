import React from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function UserNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <nav className="bg-gray-800 flex justify-end gap-5 text-xl text-white p-4 z-100">
      <div className="relative">
        <button
          className="mr-4"
          onClick={() => {
            setOpen(!open);
          }}
          value="/profile"
        >
          <i className="fa-solid fa-user"></i>
        </button>
        {open && (
          <div className="absolute w-50 p-2 right-0 rounded-md mt-2 bg-white text-black shadow-lg text-lg">
            <button
              className="p-2"
              onClick={() => {
                navigate(`/profile/${id}`);
                setOpen(false);
              }}
            >
              Update Profile
            </button>

            <button
              className="p-2"
              onClick={() => {
                navigate(`/user/pass/${id}`);
                setOpen(false);
              }}
            >
              Reset Password
            </button>

            <button
              className="p-2"
              onClick={() => {
                setOpen(false);
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default UserNavbar;
