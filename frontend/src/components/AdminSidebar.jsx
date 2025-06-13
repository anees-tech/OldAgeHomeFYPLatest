"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../styles/admin-sidebar.css"

function AdminSidebar({ activeTab, setActiveTab }) {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard-icon" },
    { id: "users", label: "Users", icon: "users-icon" },
    { id: "activities", label: "Activities", icon: "calendar-icon" },
    { id: "contacts", label: "Contacts", icon: "contact-icon" },
    { id: "admissions", label: "Admissions", icon: "application-icon" },
    { id: "donations", label: "Donations", icon: "donation-icon" },
    { id: "gallery", label: "Gallery", icon: "gallery-icon" },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <span className="logo-primary">Golden Years</span>
          <span className="logo-secondary">Admin</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              activeTab === item.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className={`nav-icon ${item.icon}`}></span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-sidebar-btn" onClick={handleLogout}>
          <div className="sidebar-icon logout-icon"></div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
