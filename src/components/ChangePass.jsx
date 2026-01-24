// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";

// function ChangePass() {
//   const [user, setUser] = useState(null);
//   const [validate, setValidate] = useState(false);
//   const [pass, setPass] = useState("");
//   const [confirmPass, setConfirmPass] = useState("");
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const fetchData = async () => {
//     try {
//       let res = await axios.get(`http://localhost:3000/users/${id}`);
//       res = res.data[0];
//       setUser(res);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const verifyPass = (e) => {
//     e.preventDefault();

//     if (pass.trim() === user.password) {
//       setValidate(true);
//       setPass("");
//       alert("Password Matched !");
//     } else {
//       alert("Password Not Match, Try Again !");
//     }
//   };

//   const changePass = async (e) => {
//     e.preventDefault();

//     if (pass.trim() === confirmPass.trim()) {
//       try {
//         await axios.put(`http://localhost:3000/user/pass/${id}`, { pass });
//         alert("password change successfully");
//         navigate(`/user_home/${id}`);
//       } catch (error) {
//         console.log(error);
//         alert("Failed to change password");
//       }
//     } else {
//       alert("Password Not Match, Try Again !");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (!user) {
//     return (
//       <div className="min-h-[91vh] flex justify-center items-center">
//         <p className="text-red-600 font-semibold">User not found</p>
//       </div>
//     );
//   }
//   return (
//     <div className="min-h-[91vh] bg-gray-100 flex justify-center items-start p-6">
//       {validate ? (
//         <form
//           onSubmit={changePass}
//           className="bg-white shadow-lg rounded-lg px-6 py-4 w-[90%] lg:w-[60%]"
//         >
//           <h1 className="text-3xl font-bold text-center mb-6">
//             Change Password
//           </h1>{" "}
//           <div className="flex flex-col items-center gap-4">
//             <div className="flex w-[55%] justify-between items-center gap-8">
//               <label className="font-semibold">Enter New Password: </label>
//               <input
//                 type="password"
//                 value={pass}
//                 className="w-60 border rounded-sm px-2 py-1"
//                 onChange={(e) => setPass(e.target.value)}
//               />
//             </div>
//             <div className="flex w-[55%] justify-between items-center gap-8">
//               <label className="font-semibold">Confirm Password: </label>
//               <input
//                 type="password"
//                 value={confirmPass}
//                 className="w-60 border rounded-sm px-2 py-1"
//                 onChange={(e) => setConfirmPass(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="flex justify-center mt-8">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer"
//             >
//               Change
//             </button>
//           </div>
//         </form>
//       ) : (
//         <form
//           onSubmit={verifyPass}
//           className="bg-white shadow-lg rounded-lg px-6 py-4 w-[90%] lg:w-[60%]"
//         >
//           <h1 className="text-3xl font-bold text-center mb-6">
//             Verify Password
//           </h1>

//           <div className="flex justify-center items-center gap-8">
//             <label className="font-semibold">Enter Old Password: </label>
//             <input
//               type="password"
//               value={pass}
//               className="w-60 border rounded-sm px-2 py-1"
//               onChange={(e) => setPass(e.target.value)}
//             />
//           </div>
//           <div className="flex justify-center gap-4 mt-8">
//             <button className="bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer">
//               Check
//             </button>
//             <Link
//               className="bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer"
//               to={`/user_home/${id}`}
//             >
//               Cancel
//             </Link>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }

// export default ChangePass;


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
