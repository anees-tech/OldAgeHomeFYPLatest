import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/user-dashboard.css';

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    totalContacts: 0,
    totalApplications: 0,
    totalDonations: 0
  });
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [user, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch user-specific data
      const activitiesResponse = await axios.get('http://localhost:5000/api/activities');
      setUserActivities(activitiesResponse.data.slice(0, 5)); // Get latest 5 activities
      
      // You can add more user-specific API calls here
      setUserStats({
        totalContacts: 0, // This would come from user-specific API
        totalApplications: 0,
        totalDonations: 0
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <div className="welcome-section">
              <h2>Welcome back, {user.firstName}!</h2>
              <p>Here's what's happening at Golden Years Home</p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon contact-icon"></div>
                <div className="stat-content">
                  <h3>My Contacts</h3>
                  <p className="stat-number">{userStats.totalContacts}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon application-icon"></div>
                <div className="stat-content">
                  <h3>Applications</h3>
                  <p className="stat-number">{userStats.totalApplications}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon donation-icon"></div>
                <div className="stat-content">
                  <h3>Donations</h3>
                  <p className="stat-number">{userStats.totalDonations}</p>
                </div>
              </div>
            </div>
            
            <div className="recent-activities">
              <h3>Recent Activities</h3>
              <div className="activities-list">
                {userActivities.map(activity => (
                  <div key={activity._id} className="activity-item">
                    <div className="activity-icon calendar-icon"></div>
                    <div className="activity-content">
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                      <p className="activity-date">
                        {new Date(activity.date).toLocaleDateString()} at {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'profile':
        return (
          <div className="profile-section">
            <h2>My Profile</h2>
            <div className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" value={user.firstName} readOnly />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" value={user.lastName} readOnly />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={user.email} readOnly />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" value={user.phone} readOnly />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" value={user.role} readOnly />
                </div>
                <div className="form-group">
                  <label>Member Since</label>
                  <input type="text" value={new Date(user.createdAt).toLocaleDateString()} readOnly />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'quick-actions':
        return (
          <div className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <div className="action-card" onClick={() => navigate('/contact')}>
                <div className="action-icon contact-icon"></div>
                <h3>Contact Us</h3>
                <p>Send a message or inquiry</p>
              </div>
              
              <div className="action-card" onClick={() => navigate('/admission')}>
                <div className="action-icon application-icon"></div>
                <h3>Apply for Admission</h3>
                <p>Submit an admission application</p>
              </div>
              
              <div className="action-card" onClick={() => navigate('/donation')}>
                <div className="action-icon donation-icon"></div>
                <h3>Make a Donation</h3>
                <p>Support our community</p>
              </div>
              
              <div className="action-card" onClick={() => navigate('/gallery')}>
                <div className="action-icon gallery-icon"></div>
                <h3>View Gallery</h3>
                <p>See our facilities and activities</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div className="user-info">
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.role}</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon overview-icon"></span>
            Overview
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="nav-icon profile-icon"></span>
            My Profile
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'quick-actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick-actions')}
          >
            <span className="nav-icon actions-icon"></span>
            Quick Actions
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon"></span>
            Logout
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="content-header">
          <h1>User Dashboard</h1>
          <div className="header-actions">
            <button className="btn secondary-btn" onClick={() => navigate('/')}>
              Back to Home
            </button>
            {user.isAdmin && (
              <button className="btn primary-btn" onClick={() => navigate('/admin')}>
                Admin Panel
              </button>
            )}
          </div>
        </div>
        
        <div className="content-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;