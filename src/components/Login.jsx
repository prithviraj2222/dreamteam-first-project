import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [msg, setMsg] = useState("")
  const [validate, setValidate] = useState(false)

  const validateUser = () => {
    if(validate){
      navigate("/")
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={validateUser} className="bg-gray-100 text-center flex flex-col items-start p-2 rounded-2xl w-[25%]">
        <div className="flex w-full justify-center">
          <h1 className="font-extrabold text-3xl m-4">Login</h1>
        </div>
        <div className="p-4 w-full flex justify-between">
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
        <div className="p-4 w-full flex justify-between">
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
              setPass(e.target.value);
            }}
            required
          />
        </div>

        <div className="p-4 flex justify-center w-full">
          <button
            type="submit"
            className="bg-black text-white rounded-md px-4 py-2"
          >
            Login
          </button>
        </div>
        <div className="w-full flex justify-center mb-2">
          <p>
            Don't have an account?{" "}
            <span className="text-blue-600">
              <Link to="/">Sign Up</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
