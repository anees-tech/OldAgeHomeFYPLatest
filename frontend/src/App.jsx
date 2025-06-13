"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import ServicesPage from "./pages/ServicesPage"; // Add this
import GalleryPage from "./pages/GalleryPage"; // Add this
import AdmissionPage from "./pages/AdmissionPage"; // Add this
import DonationPage from "./pages/DonationPage"; // Add this
import ContactPage from './pages/ContactPage';
import "./styles/global.css"
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext"

function App() {
  const { user } = useAuth()

  // Check if user is admin
  if (user && user.isAdmin) {
    return (
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/services" element={<ServicesPage />} /> {/* Add this */}
              <Route path="/gallery" element={<GalleryPage />} /> {/* Add this */}
              <Route path="/admission" element={<AdmissionPage />} /> {/* Add this */}
              <Route path="/donation" element={<DonationPage />} /> {/* Add this */}
              <Route path="/contact" element={<ContactPage />} /> {/* Add this */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    )
  }

  return (
    <Router>
      <div className="app">
        {!user?.isAdmin && <Header />}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Navigate to="/login" />} />
            <Route path="/services" element={<ServicesPage />} /> {/* Add this */}
            <Route path="/gallery" element={<GalleryPage />} /> {/* Add this */}
            <Route path="/admission" element={<AdmissionPage />} /> {/* Add this */}
            <Route path="/donation" element={<DonationPage />} /> {/* Add this */}
            <Route path="/contact" element={<ContactPage />} /> {/* Add this */}
          </Routes>
        </main>
        {!user?.isAdmin && <Footer />}
      </div>
    </Router>
  )
}

export default App

// Update any navigation links from "/#" to "/contact"
// <Link to="/contact" className="btn secondary-btn">
//   Contact Us
// </Link>
