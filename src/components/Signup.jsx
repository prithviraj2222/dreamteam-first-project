import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [pass, setPass] = useState("");
  const [check, setCheck] = useState("");

  const [otp, setOtp] = useState("");
  const [otpMsg, setOtpMsg] = useState("");
  const [otpSend, setOtpSend] = useState(false);
  const [otpValidation, setOtpValidation] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const navigate = useNavigate();

  const checkPass = (x) => {
    if (x.length < 8) return "Weak";

    const hasLetters = /[A-Za-z]/.test(x);
    const hasNumbers = /[0-9]/.test(x);
    const hasSpecial = /[^A-Za-z0-9]/.test(x);

    if (hasLetters && hasNumbers && hasSpecial) return "Strong";
    else if (hasLetters && hasNumbers) return "Medium";
    else return "Weak";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpValidation) {
      setOtpMsg("Please verify your email with OTP before signing up.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/user", {
        name,
        dob,
        address,
        mobile,
        email,
        pass,
      });

      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

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

  const verifyOtp = async (e) => {
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

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 text-center flex flex-col items-start p-2 rounded-2xl w-[30%]"
      >
        <div className="flex w-full justify-center">
          <h1 className="font-extrabold text-3xl m-4">Register</h1>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="name">
            Name:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="text"
            id="name"
            value={name}
            placeholder="Enter your Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="dob">
            Date of Birth:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            max={new Date().toISOString().split("T")[0]}
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
            }}
          />
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="address">
            Address:{" "}
          </label>
          <textarea
            className="border w-[14rem] rounded-md p-1"
            name="address"
            id="address"
            value={address}
            placeholder="Enter your Address"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="mobile">
            Mobile No.:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            maxLength={10}
            type="text"
            id="mobile"
            value={mobile}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              setMobile(e.target.value);
            }}
            placeholder="Enter Mobile No."
          />
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
                      setOtp(e.target.value)
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
        <div className="px-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="pass">
            Password:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="password"
            id="pass"
            value={pass}
            placeholder="Enter your Password"
            onChange={(e) => {
              const val = e.target.value;
              setPass(val);
              setCheck(checkPass(val));
            }}
            required
          />
        </div>
        <div className="w-full flex justify-end">
          {pass !== "" && (
            <p className="mt-2 font-semibold mr-4">
              <span
                className={
                  check === "Strong"
                    ? "text-green-600"
                    : check === "Medium"
                    ? "text-yellow-500"
                    : "text-red-600"
                }
              >
                {check}
              </span>
            </p>
          )}
        </div>
        <div className="p-4 flex justify-center w-full">
          <button
            type="submit"
            className="bg-black text-white rounded-md px-4 py-2"
          >
            Sign Up
          </button>
        </div>

        <div className="w-full flex justify-center mb-2">
          <p>Already have an account? <span className="text-blue-600"><Link to="/login">Login</Link></span></p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
