"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./ActivitiesTracker.css" // Assuming your CSS is correctly linked

function ActivitiesTracker() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all") // Keep as filterType for UI, map to 'type' for backend
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  
  const initialActivityState = {
    title: "",
    description: "",
    type: "social", // Changed from 'category' to 'type'
    date: "",
    time: "",
    duration: 60, // Added duration, default to 60 minutes
    capacity: 15, // Changed from 'maxParticipants' to 'capacity'
    location: "Main Hall",
    day: "", // Added day
    isActive: true
  };
  const [newActivity, setNewActivity] = useState(initialActivityState)
  const [currentActivityId, setCurrentActivityId] = useState(null)

  // Fetch activities from the backend
  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    setLoading(true)
    setError("")
    try {
      // Ensure this endpoint matches your backend route that uses the Mongoose model
      const res = await axios.get("http://localhost:5000/api/activities") 
      setActivities(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error("Error fetching activities:", err)
      setError("Failed to fetch activities")
      setActivities([]) 
    } finally {
      setLoading(false)
    }
  }

  const handleAddActivity = async (e) => {
    e.preventDefault()
    setError("")
    
    try {
      // Ensure data sent matches backend model
      const activityDataToSend = {
        ...newActivity,
        capacity: parseInt(newActivity.capacity) || 0,
        duration: parseInt(newActivity.duration) || 0,
      };
      const res = await axios.post("http://localhost:5000/api/activities", activityDataToSend)
      
      // The backend for POST /api/activities (Mongoose one) returns the saved activity directly
      setActivities([...activities, res.data])
      
      setShowAddModal(false)
      resetActivityForm()
    } catch (err) {
      console.error("Error adding activity:", err)
      setError(err.response?.data?.message || "Failed to add activity")
    }
  }

  const handleUpdateActivity = async (e) => {
    e.preventDefault()
    setError("")
    
    try {
      const activityDataToUpdate = {
        ...newActivity,
        capacity: parseInt(newActivity.capacity) || 0,
        duration: parseInt(newActivity.duration) || 0,
      };
      const res = await axios.put(`http://localhost:5000/api/activities/${currentActivityId}`, activityDataToUpdate)
      
      // The backend for PUT /api/activities/:id (Mongoose one) returns the updated activity
      setActivities(
        activities.map((activity) =>
          activity._id === currentActivityId ? res.data : activity
        )
      )
      
      setShowUpdateModal(false)
      resetActivityForm()
    } catch (err) {
      console.error("Error updating activity:", err)
      setError(err.response?.data?.message || "Failed to update activity")
    }
  }

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await axios.delete(`http://localhost:5000/api/activities/${activityId}`)
        setActivities(activities.filter((activity) => activity._id !== activityId))
      } catch (err) {
        console.error("Error deleting activity:", err)
        setError(err.response?.data?.message || "Failed to delete activity")
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewActivity({
      ...newActivity,
      [name]: type === "checkbox" ? checked : (name === "capacity" || name === "duration" ? parseInt(value) || 0 : value),
    })
  }

  const handleEditClick = (activity) => {
    setCurrentActivityId(activity._id)
    setNewActivity({
      title: activity.title || "",
      description: activity.description || "",
      type: activity.type || "social", // Use 'type'
      date: activity.date ? new Date(activity.date).toISOString().split('T')[0] : "",
      time: activity.time || "",
      duration: activity.duration || 60, // Add duration
      capacity: activity.capacity || 15, // Use 'capacity'
      location: activity.location || "",
      day: activity.day || "", // Add day
      isActive: activity.isActive !== undefined ? activity.isActive : true
    })
    setShowUpdateModal(true)
  }

  const resetActivityForm = () => {
    setNewActivity(initialActivityState)
    setCurrentActivityId(null)
  }

  const filteredActivities = activities.filter((activity) => {
    if (!activity) return false 
    
    const matchesSearch =
      (activity.title && activity.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (activity.location && activity.location.toLowerCase().includes(searchTerm.toLowerCase()))

    const activityTypeToFilter = activity.type || "" // Use 'type'
    const matchesType = filterType === "all" || activityTypeToFilter === filterType

    return matchesSearch && matchesType
  })

  if (loading) {
    return <div className="loading">Loading activities...</div>
  }

  return (
    <div className="activities-tracker">
      <div className="management-header">
        <h2>Activities Management</h2>
        <button className="btn primary-btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i>
          Add New Activity
        </button>
      </div>

      {/* Stats Cards */}
      <div className="activities-stats">
        <div className="stat-card">
          <h3>{activities.length}</h3>
          <p>Total Activities</p>
        </div>
        <div className="stat-card">
          <h3>{activities.filter(a => a.isActive).length}</h3>
          <p>Active Activities</p>
        </div>
        <div className="stat-card">
          {/* Ensure date comparison is robust if dates are strings */}
          <h3>{activities.filter(a => new Date(a.date) >= new Date(new Date().toDateString())).length}</h3>
          <p>Upcoming</p>
        </div>
        <div className="stat-card">
          <h3>{new Set(activities.map(a => a.type)).size}</h3> {/* Use 'type' */}
          <p>Categories</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="activities-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
            <option value="all">All Types</option>
            <option value="fitness">Fitness</option>
            <option value="creative">Creative</option>
            <option value="therapy">Therapy</option>
            <option value="social">Social</option>
            <option value="health">Health</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Activities Grid */}
      <div className="activities-grid">
        {filteredActivities.length === 0 ? (
          <div className="no-results">
            <div className="empty-state">
              <i className="fas fa-calendar-plus"></i>
              <h3>No Activities Found</h3>
              <p>Start by adding your first activity.</p>
              <button className="btn primary-btn" onClick={() => setShowAddModal(true)}>
                Add Activity
              </button>
            </div>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity._id} className="activity-card">
              <div className="activity-header">
                <h3 className="activity-title">{activity.title}</h3>
                <span className={`activity-type badge-${activity.type}`}> {/* Use 'type' */}
                  {(activity.type || "").charAt(0).toUpperCase() + (activity.type || "").slice(1)}
                </span>
              </div>
              <p className="activity-description">{activity.description}</p>
              <div className="activity-details">
                <div className="activity-detail">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {activity.date ? new Date(activity.date).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
                <div className="activity-detail">
                  <span className="detail-label">Day:</span>
                  <span className="detail-value">{activity.day || 'Not set'}</span>
                </div>
                <div className="activity-detail">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">{activity.time || 'Not set'}</span>
                </div>
                <div className="activity-detail">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{activity.duration ? `${activity.duration} mins` : 'N/A'}</span>
                </div>
                <div className="activity-detail">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{activity.location || 'Not set'}</span>
                </div>
                <div className="activity-detail">
                  <span className="detail-label">Capacity:</span>
                  <span className="detail-value">
                    {activity.participants || 0}/{activity.capacity || 0} {/* Use 'capacity' */}
                  </span>
                </div>
              </div>
              <div className="activity-actions">
                <button
                  className="btn edit-btn"
                  onClick={() => handleEditClick(activity)}
                  title="Edit Activity"
                >
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
                <button
                  className="btn delete-btn"
                  onClick={() => handleDeleteActivity(activity._id)}
                  title="Delete Activity"
                >
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              </div>
              <div className={`activity-status ${activity.isActive ? 'active' : 'inactive'}`}>
                {activity.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Activity</h3>
              <button className="close-btn" onClick={() => {
                setShowAddModal(false)
                resetActivityForm()
                setError("")
              }}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddActivity}>
              <ActivityForm newActivity={newActivity} handleInputChange={handleInputChange} />
              <div className="modal-footer">
                <button type="button" className="btn secondary-btn" onClick={() => {
                  setShowAddModal(false)
                  resetActivityForm()
                  setError("")
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn primary-btn">
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Activity Modal */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Activity</h3>
              <button className="close-btn" onClick={() => {
                setShowUpdateModal(false)
                resetActivityForm()
                setError("")
              }}>
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateActivity}>
              <ActivityForm newActivity={newActivity} handleInputChange={handleInputChange} />
              <div className="modal-footer">
                <button type="button" className="btn secondary-btn" onClick={() => {
                  setShowUpdateModal(false)
                  resetActivityForm()
                  setError("")
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn primary-btn">
                  Update Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ActivityForm({ newActivity, handleInputChange }) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return (
    <div className="form-grid">
      <div className="form-group full-width">
        <label htmlFor="title">Activity Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newActivity.title}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group full-width">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={newActivity.description}
          onChange={handleInputChange}
          rows="3"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="type">Type *</label> {/* Changed from category to type */}
        <select 
          id="type" 
          name="type" 
          value={newActivity.type} 
          onChange={handleInputChange} 
          required
        >
          <option value="fitness">Fitness</option>
          <option value="creative">Creative</option>
          <option value="therapy">Therapy</option>
          <option value="social">Social</option>
          <option value="health">Health</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={newActivity.location}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="date">Date *</label>
        <input
          type="date"
          id="date"
          name="date"
          value={newActivity.date}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="day">Day of Week *</label>
        <select
          id="day"
          name="day"
          value={newActivity.day}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Day</option>
          {daysOfWeek.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="time">Time *</label>
        <input
          type="time"
          id="time"
          name="time"
          value={newActivity.time}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="duration">Duration (minutes) *</label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={newActivity.duration}
          onChange={handleInputChange}
          min="1"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="capacity">Capacity</label> {/* Changed from maxParticipants to capacity */}
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={newActivity.capacity}
          onChange={handleInputChange}
          min="1"
          max="100"
        />
      </div>
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={newActivity.isActive}
            onChange={handleInputChange}
          />
          Active
        </label>
      </div>
    </div>
  )
}

export default ActivitiesTracker
