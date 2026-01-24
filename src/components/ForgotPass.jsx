import axios from "axios";
import React from "react";
import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

function ForgotPass() {
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [otpSend, setOtpSend] = useState(false);
  const [otpValidation, setOtpValidation] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) {
      setOtpMsg("Please enter email first");
      return;
    }

    try {
      setOtpLoading(true);
      setOtpMsg("Otp sending...");
      await axios.post("http://localhost:3000/send-otp", { email });
      setOtpSend(true);
      setOtpMsg("Otp Send check you email");
    } catch (error) {
      console.error("Send otp error : ", error);
      setOtpMsg("Failed to send otp, Try Again");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!email) {
      setOtpMsg("Please enter email first");
      return;
    }

    if (!otp) {
      setOtpMsg("Please enter Otp first");
      return;
    }

    try {
      setOtpMsg("Verifying OTP...");
      await axios.post("http://localhost:3000/verify-otp", { email, otp });
      setOtpValidation(true);
      setOtpMsg("OTP verified");
    } catch (error) {
      console.error("verifyOtp error:", error);
      setOtpValidation(false);
      setOtpMsg("Invalid or expired OTP");
    }
  };

  const handleSubmit = async (e) => {
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
      await api.put(`/user/forgot-pass`, { newPass, email });

      alert("Password updated successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Failed to update password");
    }
  };

  return (
    <div className="flex justify-center items-center mt-16">
      {otpValidation ? (
        <form
          onSubmit={handleSubmit}
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
              to={`/login`}
            >
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="bg-gray-100 text-center flex flex-col items-start p-2 rounded-2xl w-[25%]">
          <div className="flex w-full justify-center">
            <h1 className="font-extrabold text-3xl m-4">Forgot Password</h1>
          </div>
          <div className="p-4 w-full flex flex-col">
            <div className="w-full flex justify-between">
              <label className="mr-2 font-bold" htmlFor="email">
                Email:{" "}
              </label>
              <input
                className="border w-[14rem] rounded-md p-1"
                type="email"
                id="email"
                value={email}
                placeholder="Enter you Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>

            <div className="mt-2 flex flex-wrap justify-end gap-2">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-60"
                onClick={sendOtp}
                disabled={otpLoading}
              >
                {otpSend ? "Resend Otp" : "Send Otp"}
              </button>

              {otpSend && !otpValidation && (
                <div className="w-full flex flex-col justify-end">
                  <div className="w-full flex justify-between py-4">
                    <label className="mr-2 font-bold" htmlFor="otp">
                      Enter Otp:{" "}
                    </label>
                    <input
                      className="border w-[14rem] p-1 rounded"
                      type="text"
                      maxLength={6}
                      id="otp"
                      value={otp}
                      placeholder="Enter Otp"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        setOtp(e.target.value);
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={verifyOtp}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
              {otpValidation && (
                <span className="text-green-600 font-semibold">Verified ✓</span>
              )}
            </div>
            {otpMsg && <p className="text-sm text-gray-600 mt-2">{otpMsg}</p>}
          </div>
          <div className="w-full flex justify-center mb-2">
            <Link
              className="bg-gray-500 text-white px-6 py-2 rounded-md"
              to={`/login`}
            >
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPass;
