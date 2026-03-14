import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function AddEvent() {
  const [event, setEvent] = useState({
    name: null,
    startDate: null,
    endDate: null,
    isHoliday: null,
  });

  const navigate = useNavigate();

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (event.name && event.startDate && event.endDate && event.isHoliday) {
      try {
        const res = await api.post("/add-event", event);
        alert(res.data.message);
        navigate("/events");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="flex justify-center items-center my-16">
      <form
        onSubmit={handleAddEvent}
        className="bg-gray-100 text-center flex flex-col items-start p-2 rounded-2xl w-[30%]"
      >
        <div className="flex w-full justify-center">
          <h1 className="font-extrabold text-3xl m-4">Add Event</h1>
        </div>

        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold">Event Name:</label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="text"
            value={event.name}
            placeholder="Enter Event Name"
            required
            onChange={(e) => setEvent({ ...event, name: e.target.value })}
          />
        </div>

        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold">From:</label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="date"
            value={event.startDate}
            required
            onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
          />
        </div>

        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold">To:</label>
          <input
            className="border w-[14rem] rounded-md p-1"
            type="date"
            value={event.endDate}
            required
            onChange={(e) => setEvent({ ...event, endDate: e.target.value })}
          />
        </div>

        <div className="p-4 w-full flex justify-between">
          <label className="mr-2 font-bold">Is Holiday:</label>
          <div className="flex gap-4">
            <span className="flex gap-2">
              <label htmlFor="yes">Yes</label>
              <input
                type="radio"
                id="yes"
                value="Y"
                checked={event.isHoliday === "Y"}
                name="holiday"
                required
                onChange={(e) =>
                  setEvent({ ...event, isHoliday: e.target.value })
                }
              />
            </span>
            <span className="flex gap-2">
              <label htmlFor="no">No</label>
              <input
                type="radio"
                value="N"
                id="no"
                checked={event.isHoliday === "N"}
                name="holiday"
                required
                onChange={(e) =>
                  setEvent({ ...event, isHoliday: e.target.value })
                }
              />
            </span>
          </div>
        </div>

        <div className="p-4 flex justify-center gap-4 w-full">
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md px-4 py-2"
          >
            Add
          </button>
          <Link
            className="bg-blue-600 text-white rounded-md px-4 py-2"
            to="/events"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AddEvent;
