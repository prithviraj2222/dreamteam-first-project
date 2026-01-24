import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [change, setChange] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const fetchData = async () => {
    try {
      let res = await api.get(`/users/profile/${id}`);
      res = res.data[0];

      setUser(res);
      setSelectedCountry(res.country_id);
      setSelectedState(res.state_id);
      setSelectedCity(res.city_id);
      let countriesData = await api.get("/country");
      setCountries(countriesData.data.filter((d) => d.removed === "N"));
    } catch (error) {
      console.error(error);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      const base64 = await convertToBase64(file);

      setUser((prev) => ({
        ...prev,
        profile_image: base64,
      }));
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/user/${id}`, { user });
      alert("Details saved")
      navigate(`/user_home/${id}`);
    } catch (error) {
      alert("Update Failed");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      api
        .get(`/states/by-country/${selectedCountry}`)
        .then((res) => setStates(res.data));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      api
        .get(`/cities/by-state/${selectedState}`)
        .then((res) => setCities(res.data));
    }
  }, [selectedState]);

  if (!user) {
    return (
      <div className="min-h-[91vh] flex justify-center items-center">
        <p className="text-red-600 font-semibold">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[91vh] bg-gray-100 flex justify-center items-start p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-6 py-4 w-[90%] lg:w-[60%]"
      >
        <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

        <div className="flex flex-col items-center mb-6">
          <img
            src={user.profile_image || "/default-avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
          />

          <label className="mt-3 cursor-pointer text-blue-600 font-semibold">
            {uploading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {handlePhotoUpload(e.target.files[0]); setChange(true)}}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              value={user.name}
              className="w-full border rounded-md py-2 px-3 bg-gray-100"
              onChange={(e) => {
                setUser({ ...user, name: e.target.value });
                setChange(true)
              }}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Date of Birth</label>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={user.dob?.split("T")[0]}
              className="w-full border rounded-md py-2 px-3 bg-gray-100"
              onChange={(e) => {
                setUser({ ...user, dob: e.target.value });
                setChange(true)
              }}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              className="w-full border rounded-md py-2 px-3 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Mobile</label>
            <input
              type="text"
              maxLength={10}
              value={user.mobile}
              className="w-full border rounded-md py-2 px-3 bg-gray-100"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                setUser({ ...user, mobile: e.target.value });
                setChange(true)
              }}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Country</label>
            <select
              className="w-full border rounded-md py-2 px-3 bg-gray-100"
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedState("");
                setSelectedCity("");
                setChange(true)
              }}
            >
              <option value="">Select Country</option>
              {countries?.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">State</label>
            <select
              className="w-full border rounded-md py-2 px-3 bg-gray-100"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("");
                setChange(true)
              }}
            >
              <option value="">Select State</option>
              {states?.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">City</label>
            <select
              className="w-full border rounded-md py-2 px-3 bg-gray-100"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                console.log(e.target.value);
                setUser({...user, city_master_id: e.target.value});
                setChange(true)
              }}
            >
              <option value="">Select City</option>
              {cities?.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Address</label>
            <textarea
              value={user.address}
              rows={3}
              className="w-full border rounded-md py-2 px-3 bg-gray-100 resize-none"
              onChange={(e) => {
                setUser({ ...user, address: e.target.value });
                setChange(true)
              }}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button disabled={!change} className="bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
            Edit Profile
          </button>
          <Link
            className="bg-blue-600 text-white px-6 py-2 rounded-md cursor-pointer"
             to={`/user_home/${id}`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Profile;
