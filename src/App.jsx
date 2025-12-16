import Landing_Page from './components/Landing_Page'
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Login from './components/Login'
import Signup from './components/Signup'
import UpdateDetails from './components/UpdateDetails';
import Country from './components/Country';

function Navbar() {
  return (
    <nav className='bg-gray-800 flex gap-5 text-xl text-white p-4 z-100'>
      <Link to={"/home"}>Home</Link>
      <Link to={"/country"}>Country</Link>
    </nav>
  );
}

function App() {

  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Landing_Page />} />
        <Route path='/update/:id' element={<UpdateDetails />} />
        <Route path='/country' element={<Country />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
