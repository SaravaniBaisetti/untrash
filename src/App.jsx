// App.jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import CafeRegistration from './pages/CafeRegistration'
import UserRegistration from './pages/UserRegistration'
import DashboardCafe from './pages/DashboardCafe'
import DashboardUser from './pages/DashboardUser'
import Navbar from './components/Navbar'
import About from './pages/About';
import Login from "./pages/login";
import NewDonation from './pages/NewDonation';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register-cafe" element={<CafeRegistration />} />
          <Route path="/register-user" element={<UserRegistration />} />
          <Route path="/dashboard-cafe" element={<DashboardCafe />} />
          <Route path="/dashboard-user" element={<DashboardUser />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donate" element={<NewDonation />} />
          <Route path="/dashboard-admin" element={<AdminDashboard />} />
          <Route path="*" element={<h1 className="text-center text-white mt-5">404 - Page Not Found</h1>} />

        </Routes>
      </div>
    </Router>
  )
}

export default App
