import Landing_Page from "./components/Landing_Page";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UpdateDetails from "./components/UpdateDetails";
import UpdateCountry from "./components/updateCountry";
import Country from "./components/Country";
import AddCountry from "./components/AddCountry";
import Navbar from "./components/Navbar";
import States from "./components/States";
import AddState from "./components/AddState";
import UpdateState from "./components/UpdateState";
import Cities from "./components/Cities";
import AddCity from "./components/AddCity";
import UpdateCity from "./components/UpdateCity";
import Home from "./components/Home";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Profile from "./components/Profile";
import ChangePass from "./components/ChangePass";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPass from "./components/ForgotPass";
import AdminDashboard from "./components/AdminDashboard";
import FilteredUsers from "./components/FilteredUsers";
import Events from "./components/Events";
import AddEvent from "./components/AddEvent";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-pass" element={<ForgotPass />} />
          </Route>
          <Route element={<UserLayout />}>
            <Route
              path="/user_home/:id"
              element={
                <ProtectedRoute role="user">
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute role="user">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/pass/:id"
              element={
                <ProtectedRoute role="user">
                  <ChangePass />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route element={<AdminLayout />}>
            <Route
              path="/home"
              element={
                <ProtectedRoute role="admin">
                  <Landing_Page />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/filtered-users"
              element={
                <ProtectedRoute role="admin">
                  <FilteredUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute role="admin">
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-event"
              element={
                <ProtectedRoute role="admin">
                  <AddEvent />
                </ProtectedRoute>
              }
            />
            <Route path="/update/:id" element={<UpdateDetails />} />
            <Route path="/country" element={<Country />} />
            <Route path="/country/add" element={<AddCountry />} />
            <Route path="/country/:id" element={<UpdateCountry />} />
            <Route path="/states" element={<States />} />
            <Route path="/state/add" element={<AddState />} />
            <Route path="/state/:id" element={<UpdateState />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/city/add" element={<AddCity />} />
            <Route path="/city/:id" element={<UpdateCity />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
