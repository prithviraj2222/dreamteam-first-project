import React from "react";

function Events() {
  return (
    <div className="min-h-[91vh] bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] md:w-[90%] lg:w-[75%]">
        <h1 className="text-3xl font-bold mb-6 text-center">Events</h1>
        <div className="w-full flex justify-end mb-1">
          <div>
            <label>From: </label>
            <input
              type="Date"
              className="border w-50 mr-2 rounded-md py-1 px-2"
            />
            <label>To: </label>
            <input
              type="Date"
              className="border w-50 mr-2 rounded-md py-1 px-2"
            />
          </div>
        </div>
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead></thead>

          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}

export default Events;
