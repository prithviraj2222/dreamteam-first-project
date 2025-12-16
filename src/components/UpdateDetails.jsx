import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UpdateDetails() {
  const [details, setDetails] = useState({});
  const { id } = useParams();

  const navigate = useNavigate();

  const fetchData = async () => {
    let data = await axios.get(`http://localhost:3000/users/${id}`);
    setDetails(data.data[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to upadate user details")) {
      try {
        await axios.put(`http://localhost:3000/users/update/${id}`, details);
        navigate("/home");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen my-16">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 text-center flex flex-col items-start p-2 rounded-2xl w-[30%]"
      >
        <div className="flex w-full justify-center">
          <h1 className="font-extrabold text-3xl m-4">Update Details</h1>
        </div>
        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold" htmlFor="name">
            Name:{" "}
          </label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="text"
            id="name"
            value={details.name}
            placeholder="Enter your Name"
            onChange={(e) => {
              setDetails({ ...details, name: e.target.value });
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
            value={details.dob ? details.dob.split("T")[0] : ""}
            onChange={(e) => {
              setDetails({ ...details, dob: e.target.value });
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
            value={details.address}
            placeholder="Enter your Address"
            onChange={(e) => {
              setDetails({ ...details, address: e.target.value });
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
            value={details.mobile}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
              setDetails({ ...details, mobile: e.target.value });
            }}
            placeholder="Enter Mobile No."
          />
        </div>
        <div className="p-4 flex justify-center w-full">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md px-4 py-2"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateDetails;
