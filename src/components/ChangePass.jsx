import api from "../api";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function ChangePass() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [validated, setValidated] = useState(false); 

  const verifyOldPass = async (e) => {
    e.preventDefault();

    if (!oldPass) {
      alert("Please enter old password");
      return;
    }

    try {
      await api.post(`/user/verify-pass/${id}`, { oldPass });

      alert("Old password verified");
      setValidated(true);
      setOldPass("");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid old password");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (!newPass || !confirmPass) {
      alert("Please fill all fields");
      return;
    }

    if (newPass !== confirmPass) {
      alert("New password and confirm password must match !");
      return;
    }

    try {
      await api.put(`/user/pass/${id}`, { newPass });

      alert("Password updated successfully");
      navigate(`/user_home/${id}`);
    } catch (error) {
      alert("Failed to update password");
    }
  };

  return (
    <div className="min-h-[91vh] bg-gray-100 flex justify-center items-start p-6">

      {!validated ? (
        <form
          onSubmit={verifyOldPass}
          className="bg-white shadow-lg rounded-lg px-6 py-4 w-[90%] lg:w-[60%]"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            Verify Old Password
          </h1>

          <div className="flex justify-center items-center gap-8">
            <label className="font-semibold">Enter Old Password:</label>
            <input
              type="password"
              value={oldPass}
              className="w-60 border rounded-sm px-2 py-1"
              onChange={(e) => setOldPass(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
              Verify
            </button>
            <Link
              className="bg-gray-500 text-white px-6 py-2 rounded-md"
              to={`/user_home/${id}`}
            >
              Cancel
            </Link>
          </div>
        </form>
      ) : (
        <form
          onSubmit={changePassword}
          className="bg-white shadow-lg rounded-lg px-6 py-4 w-[90%] lg:w-[60%]"
        >
          <h1 className="text-3xl font-bold text-center mb-6">
            Change Password
          </h1>

          <div className="flex flex-col items-center gap-4">
            <div className="flex w-[55%] justify-between items-center gap-8">
              <label className="font-semibold">New Password:</label>
              <input
                type="password"
                value={newPass}
                className="w-60 border rounded-sm px-2 py-1"
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>

            <div className="flex w-[55%] justify-between items-center gap-8">
              <label className="font-semibold">Confirm Password:</label>
              <input
                type="password"
                value={confirmPass}
                className="w-60 border rounded-sm px-2 py-1"
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
              Change
            </button>
            <Link
              className="bg-gray-500 text-white px-6 py-2 rounded-md"
              to={`/user_home/${id}`}
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default ChangePass;
