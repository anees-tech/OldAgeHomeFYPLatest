"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../styles/activities-tracker.css"

function ActivitiesTracker() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [newActivity, setNewActivity] = useState({
    title: "",
    description: "",
    type: "social",
    date: "",
    time: "",
    duration: 60,
    capacity: 15,
    location: "Main Hall",
    day: "",
  })
  const [currentActivityId, setCurrentActivityId] = useState(null)

  // Fetch activities from the backend
  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:5000/api/activities")
      setActivities(res.data)
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch activities")
      setLoading(false)
    }
  }

  const handleAddActivity = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/activities", newActivity)
      setActivities([...activities, res.data]) // Add the new activity to the list
      setShowAddModal(false)
      resetActivityForm()
    } catch (err) {
      setError("Failed to add activity")
    }
  }

  const handleUpdateActivity = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`http://localhost:5000/api/activities/${currentActivityId}`, newActivity)
      setActivities(
        activities.map((activity) =>
          activity._id === currentActivityId ? res.data : activity
        )
      ) // Update the activity in the list
      setShowUpdateModal(false)
      resetActivityForm()
    } catch (err) {
      setError("Failed to update activity")
    }
  }

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await axios.delete(`http://localhost:5000/api/activities/${activityId}`)
        setActivities(activities.filter((activity) => activity._id !== activityId)) // Remove the deleted activity
      } catch (err) {
        setError("Failed to delete activity")
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setNewActivity({
      ...newActivity,
      [name]: type === "number" ? Number.parseInt(value) : value,
    })
  }

  const handleEditClick = (activity) => {
    setCurrentActivityId(activity._id)
    setNewActivity(activity)
    setShowUpdateModal(true)
  }

  const resetActivityForm = () => {
    setNewActivity({
      title: "",
      description: "",
      type: "social",
      date: "",
      time: "",
      duration: 60,
      capacity: 15,
      location: "Main Hall",
      day: "",
    })
    setCurrentActivityId(null)
  }

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || activity.type === filterType

    return matchesSearch && matchesType
  })

  return (
    <div className="activities-tracker">
      <div className="activities-header">
        <h2>Activities Tracker</h2>
        <button className="btn primary-btn" onClick={() => setShowAddModal(true)}>
          Add New Activity
        </button>
      </div>

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

      {loading ? (
        <div className="loading">Loading activities...</div>
      ) : (
        <div className="activities-grid">
          {filteredActivities.length === 0 ? (
            <div className="no-results">No activities found</div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity._id} className="activity-card">
                <div className="activity-header">
                  <h3 className="activity-title">{activity.title}</h3>
                  <span className={`activity-type badge-${activity.type}`}>
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </span>
                </div>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-details">
                  <div className="activity-detail">
                    <span className="detail-label">When:</span>
                    <span className="detail-value">{activity.date} at {activity.time}</span>
                  </div>
                  <div className="activity-detail">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{activity.duration} minutes</span>
                  </div>
                  <div className="activity-detail">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{activity.location}</span>
                  </div>
                  <div className="activity-detail">
                    <span className="detail-label">Day:</span>
                    <span className="detail-value">{activity.day}</span>
                  </div>
                  <div className="activity-detail">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">
                      {activity.participants}/{activity.capacity}
                    </span>
                  </div>
                </div>
                <div className="activity-actions">
                  {/* <button
                    className="action-btn edit-btn"
                    title="Edit Activity"
                    onClick={() => handleEditClick(activity)}
                  >
                    Edit
                  </button> */}
                  <button
                    className="action-btn delete-btn"
                    title="Delete Activity"
                    onClick={() => handleDeleteActivity(activity._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Activity</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddActivity}>
              <ActivityForm newActivity={newActivity} handleInputChange={handleInputChange} />
              <div className="modal-footer">
                <button type="button" className="btn secondary-btn" onClick={() => setShowAddModal(false)}>
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
              <button className="close-btn" onClick={() => setShowUpdateModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateActivity}>
              <ActivityForm newActivity={newActivity} handleInputChange={handleInputChange} />
              <div className="modal-footer">
                <button type="button" className="btn secondary-btn" onClick={() => setShowUpdateModal(false)}>
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
  return (
    <div className="form-grid">
      <div className="form-group full-width">
        <label htmlFor="title">Activity Title</label>
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
          required
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="type">Activity Type</label>
        <select id="type" name="type" value={newActivity.type} onChange={handleInputChange} required>
          <option value="fitness">Fitness</option>
          <option value="creative">Creative</option>
          <option value="therapy">Therapy</option>
          <option value="social">Social</option>
          <option value="health">Health</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="location">Location</label>
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
        <label htmlFor="date">Date</label>
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
        <label htmlFor="time">Time</label>
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
        <label htmlFor="duration">Duration (minutes)</label>
        <input
          type="number"
          id="duration"
          name="duration"
          min="15"
          max="240"
          value={newActivity.duration}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="capacity">Capacity</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          min="1"
          max="100"
          value={newActivity.capacity}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="day">Day</label>
        <input
          type="text"
          id="day"
          name="day"
          value={newActivity.day}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>
  )
}

export default ActivitiesTracker
