"use client"

// Importing necessary hooks and components
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import AdminSidebar from "../components/AdminSidebar"
import UsersManagement from "../components/admin/UsersManagement"
import ActivitiesTracker from "../components/admin/ActivitiesTracker"
import ContactsManagement from "../components/admin/ContactsManagement"
import AdmissionsManagement from "../components/admin/AdmissionsManagement"
import DonationsManagement from "../components/admin/DonationsManagement"
import GalleryManagement from "../components/admin/GalleryManagement"
import ResidentsManagement from "../components/admin/ResidentsManagement"
import SettingsPanel from "../components/admin/SettingsPanel"
import "../styles/admin.css"
import axios from "axios"

function AdminDashboard() {
  // Accessing the authenticated user from the AuthContext
  const { user } = useAuth()

  // Hook to navigate between routes
  const navigate = useNavigate()

  // State to manage the currently active tab (e.g., dashboard, users, activities)
  const [activeTab, setActiveTab] = useState("dashboard")

  // State to store statistics for the dashboard
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResidents: 0,
    totalCaregivers: 0,
    totalActivities: 0,
    totalContacts: 0,
    totalAdmissions: 0,
    totalDonations: 0,
    upcomingActivities: [],
  })

  // State to manage loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // useEffect runs when the component mounts or when `user` or `navigate` changes
  useEffect(() => {
    // Redirect to home if the user is not an admin
    if (!user || !user.isAdmin) {
      navigate("/")
    } else {
      // Fetch the dashboard statistics
      fetchDashboardStats()
    }
  }, [user, navigate])

  // Function to fetch dashboard statistics from the API
  const fetchDashboardStats = async () => {
    setLoading(true)
    setError("")
    
    try {
      // Use Promise.allSettled to handle individual failures gracefully
      const [
        activitiesRes,
        contactsRes,
        admissionsRes,
        donationsRes
      ] = await Promise.allSettled([
        axios.get("http://localhost:5000/api/activities/stats/overview"),
        axios.get("http://localhost:5000/api/contact/all"),
        axios.get("http://localhost:5000/api/admissions/all"),
        axios.get("http://localhost:5000/api/donations/all")
      ])

      // Extract data from successful requests, use defaults for failed ones
      const activitiesData = activitiesRes.status === 'fulfilled' ? activitiesRes.value.data : {
        totalUsers: 0,
        totalResidents: 0,
        totalCaregivers: 0,
        totalActivities: 0,
        upcomingActivities: []
      };

      const contactsData = contactsRes.status === 'fulfilled' ? contactsRes.value.data : [];
      const admissionsData = admissionsRes.status === 'fulfilled' ? admissionsRes.value.data : [];
      const donationsData = donationsRes.status === 'fulfilled' ? donationsRes.value.data : [];

      setStats({
        ...activitiesData,
        totalContacts: Array.isArray(contactsData) ? contactsData.length : 0,
        totalAdmissions: Array.isArray(admissionsData) ? admissionsData.length : 0,
        totalDonations: Array.isArray(donationsData) ? donationsData.length : 0,
      })

      // Log any failed requests for debugging
      if (activitiesRes.status === 'rejected') {
        console.warn("Failed to fetch activities stats:", activitiesRes.reason);
      }
      if (contactsRes.status === 'rejected') {
        console.warn("Failed to fetch contacts:", contactsRes.reason);
      }
      if (admissionsRes.status === 'rejected') {
        console.warn("Failed to fetch admissions:", admissionsRes.reason);
      }
      if (donationsRes.status === 'rejected') {
        console.warn("Failed to fetch donations:", donationsRes.reason);
      }

    } catch (err) {
      console.error("Error fetching dashboard stats:", err)
      setError("Failed to fetch some dashboard statistics. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  // Function to render content based on the active tab
  
  const renderContent = () => {
    switch (activeTab) {
      case "users":
        // Render the Users Management component
        return <UsersManagement />
      case "residents":
        return <ResidentsManagement />
      case "activities":
        // Render the Activities Tracker component
        return <ActivitiesTracker />
      case "contacts":
        return <ContactsManagement />
      case "admissions":
        return <AdmissionsManagement />
      case "donations":
        return <DonationsManagement />
      case "gallery":
        return <GalleryManagement />
      case "settings":
        return <SettingsPanel />
      default:
        // Render the dashboard overview with statistics and recent activities
        return (
          <div className="dashboard-overview">
            <h2>Dashboard Overview</h2>
            {loading ? (
              <div className="loading">Loading dashboard statistics...</div>
            ) : error ? (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
                <button 
                  className="btn primary-btn" 
                  onClick={fetchDashboardStats}
                  style={{ marginLeft: '1rem' }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div>
                <div className="stats-grid">
                  {/* Displaying statistics in cards */}
                  <div className="stat-card">
                    <div className="stat-icon users-icon"></div>
                    <div className="stat-content">
                      <h3>Total Users</h3>
                      <p className="stat-number">{stats.totalUsers}</p>
                    </div>
                    <div className="stat-trend">
                      <i className="fas fa-arrow-up"></i>
                      <span>+12%</span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon heart-icon"></div>
                    <div className="stat-content">
                      <h3>Residents</h3>
                      <p className="stat-number">{stats.totalResidents}</p>
                    </div>
                    <div className="stat-trend">
                      <i className="fas fa-arrow-up"></i>
                      <span>+5%</span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon shield-icon"></div>
                    <div className="stat-content">
                      <h3>Caregivers</h3>
                      <p className="stat-number">{stats.totalCaregivers}</p>
                    </div>
                    <div className="stat-trend">
                      <i className="fas fa-arrow-down"></i>
                      <span>-2%</span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon calendar-icon"></div>
                    <div className="stat-content">
                      <h3>Activities</h3>
                      <p className="stat-number">{stats.totalActivities}</p>
                    </div>
                    <div className="stat-trend">
                      <i className="fas fa-arrow-up"></i>
                      <span>+25%</span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon contact-icon"></div>
                    <div className="stat-content">
                      <h3>Contacts</h3>
                      <p className="stat-number">{stats.totalContacts}</p>
                    </div>
                    <div className="stat-trend urgent">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Urgent</span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon application-icon"></div>
                    <div className="stat-content">
                      <h3>Admissions</h3>
                      <p className="stat-number">{stats.totalAdmissions}</p>
                    </div>
                    <div className="stat-trend">
                      <i className="fas fa-arrow-up"></i>
                      <span>+8%</span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon donation-icon"></div>
                    <div className="stat-content">
                      <h3>Donations</h3>
                      <p className="stat-number">{stats.totalDonations}</p>
                    </div>
                    <div className="stat-trend">
                      <i className="fas fa-arrow-up"></i>
                      <span>+15%</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced upcoming activities section */}
                {stats.upcomingActivities && stats.upcomingActivities.length > 0 ? (
                  <div className="recent-section">
                    <h3>Upcoming Activities</h3>
                    <div className="recent-list">
                      {stats.upcomingActivities.map((activity) => (
                        <div key={activity._id} className="recent-item">
                          <div className="recent-icon">
                            <i className="fas fa-calendar-check"></i>
                          </div>
                          <div className="recent-content">
                            <h4>{activity.title}</h4>
                            <p>{activity.description}</p>
                            <div className="activity-meta">
                              <span className="activity-date">
                                <i className="fas fa-clock"></i>
                                {activity.date} at {activity.time}
                              </span>
                              <span className="activity-location">
                                <i className="fas fa-map-marker-alt"></i>
                                {activity.location}
                              </span>
                            </div>
                          </div>
                          <div className="activity-actions">
                            <button 
                              className="btn-small primary"
                              onClick={() => setActiveTab('activities')}
                            >
                              Edit
                            </button>
                            <button className="btn-small secondary">View</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="recent-section">
                    <h3>Upcoming Activities</h3>
                    <div className="empty-state">
                      <div className="empty-icon">
                        <i className="fas fa-calendar-plus"></i>
                      </div>
                      <h4>No Upcoming Activities</h4>
                      <p>Schedule some activities to keep residents engaged and happy.</p>
                      <button 
                        className="btn primary-btn"
                        onClick={() => setActiveTab('activities')}
                      >
                        <i className="fas fa-plus"></i>
                        Add New Activity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar for navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-content">
        {/* Header section */}
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-user">
            <span>Welcome, {user?.firstName}</span>
            <div className="admin-avatar">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
          </div>
        </div>
        {/* Main content area */}
        <div className="admin-main">{renderContent()}</div>
      </div>
    </div>
  )
}

export default AdminDashboard
