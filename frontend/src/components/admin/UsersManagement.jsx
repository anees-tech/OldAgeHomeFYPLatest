"use client"

import { useState, useEffect } from "react"
import axios from "axios" // Import axios
import "../../styles/users-management.css"
import "../../styles/admin.css" // Import admin styles for modal

function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false) // State for edit modal
  const [editingUser, setEditingUser] = useState(null) // State for user being edited
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "family",
    isAdmin: false,
  })

  // --- API Base URL ---
  const API_URL = "http://localhost:5000/api/auth"

  useEffect(() => {
    fetchUsers()
  }, [])

  // --- Fetch Users ---
  const fetchUsers = async () => {
    setLoading(true)
    setError("") // Clear previous errors
    try {
      // Fetch users from the correct backend endpoint
      const response = await axios.get(`${API_URL}/users`) // Use the new GET /users route
      setUsers(response.data)
    } catch (err) {
      console.error("Fetch Users Error:", err)
      setError(err.response?.data?.message || "Failed to fetch users. Ensure the backend is running and you have admin rights.")
    } finally {
      setLoading(false)
    }
  }

  // --- Add User ---
  const handleAddUser = async (e) => {
    e.preventDefault()
    setError("")

    if (newUser.password !== newUser.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!newUser.password) {
      setError("Password is required")
      return
    }

    try {
      // Use the POST /register route to add a new user
      const response = await axios.post(`${API_URL}/register`, newUser)

      setUsers([response.data.user, ...users]) // Add new user to the beginning of the list
      setShowAddModal(false)
      setNewUser({ // Reset form
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "family",
        isAdmin: false,
      })
    } catch (err) {
      console.error("Add User Error:", err)
      setError(err.response?.data?.message || "Failed to add user.")
    }
  }

  // --- Delete User ---
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setError("")
      try {
        // Use the DELETE /users/:id route
        await axios.delete(`${API_URL}/users/${userId}`)
        setUsers(users.filter((user) => user._id !== userId)) // Remove user from state
      } catch (err) {
        console.error("Delete User Error:", err)
        setError(err.response?.data?.message || "Failed to delete user.")
      }
    }
  }

  // --- Edit User ---
  const handleEditClick = (user) => {
    setEditingUser({ ...user }) // Set the user to be edited (create a copy)
    setShowEditModal(true) // Show the edit modal
    setError("")
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    setError("")
    if (!editingUser || !editingUser._id) return

    try {
      // Use the PUT /users/:id route
      const response = await axios.put(`${API_URL}/users/${editingUser._id}`, {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        isAdmin: editingUser.isAdmin,
      })

      // Update the user in the state
      setUsers(users.map((user) => (user._id === editingUser._id ? response.data.user : user)))
      setShowEditModal(false)
      setEditingUser(null)
    } catch (err) {
      console.error("Update User Error:", err)
      setError(err.response?.data?.message || "Failed to update user.")
    }
  }

  // --- Input Handlers ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewUser({
      ...newUser,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditingUser({
      ...editingUser,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // --- Filtering and Formatting ---
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      (user.firstName?.toLowerCase() || "").includes(searchLower) ||
      (user.lastName?.toLowerCase() || "").includes(searchLower) ||
      (user.email?.toLowerCase() || "").includes(searchLower) ||
      (user.phone?.toLowerCase() || "").includes(searchLower)

    const matchesRole = filterRole === "all" || user.role === filterRole

    return matchesSearch && matchesRole
  })

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return "Invalid Date"
    }
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "family": return "badge-blue"
      case "resident": return "badge-green"
      case "caregiver": return "badge-purple"
      case "healthcare": return "badge-orange"
      case "admin": return "badge-red" // Add admin badge style if needed
      default: return "badge-gray"
    }
  }

  // --- Render ---
  return (
    <div className="users-management">
      {/* Header */}
      <div className="users-header">
        <h2>Users Management</h2>
        <button className="btn primary-btn" onClick={() => { setShowAddModal(true); setError("") }}>
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="users-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users (name, email, phone)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="filter-select">
            <option value="all">All Roles</option>
            <option value="family">Family</option>
            <option value="resident">Resident</option>
            <option value="caregiver">Caregiver</option>
            <option value="healthcare">Healthcare</option>
            <option value="other">Other</option>
            {/* Add admin filter if needed */}
            {/* <option value="admin">Admin</option> */}
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && <div className="error-message">{error}</div>}

      {/* User Table */}
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-results">
                    No users found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          title="Edit User"
                          onClick={() => handleEditClick(user)}
                        >
                          <span className="action-icon edit-icon"></span>
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Delete User"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <span className="action-icon delete-icon"></span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-grid">
                {/* Input fields (similar structure as before) */}
                <div className="form-group">
                  <label htmlFor="add-firstName">First Name</label>
                  <input type="text" id="add-firstName" name="firstName" value={newUser.firstName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="add-lastName">Last Name</label>
                  <input type="text" id="add-lastName" name="lastName" value={newUser.lastName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="add-email">Email</label>
                  <input type="email" id="add-email" name="email" value={newUser.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="add-phone">Phone</label>
                  <input type="tel" id="add-phone" name="phone" value={newUser.phone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="add-password">Password</label>
                  <input type="password" id="add-password" name="password" value={newUser.password} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="add-confirmPassword">Confirm Password</label>
                  <input type="password" id="add-confirmPassword" name="confirmPassword" value={newUser.confirmPassword} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="add-role">Role</label>
                  <select id="add-role" name="role" value={newUser.role} onChange={handleInputChange} required>
                    <option value="family">Family Member</option>
                    <option value="resident">Resident</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="healthcare">Healthcare Professional</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group checkbox-group full-width">
                  <label htmlFor="add-isAdmin" className="checkbox-label">
                    <input
                      type="checkbox"
                      id="add-isAdmin"
                      name="isAdmin"
                      checked={newUser.isAdmin}
                      onChange={handleInputChange}
                      disabled={newUser.role !== "caregiver"} // Disable if role is not Caregiver
                    />
                    <span>Grant Admin Privileges</span>
                  </label>
                </div>
              </div>
              {/* Display error inside modal if needed */}
              {error && <p className="error-message" style={{ marginTop: '1rem' }}>{error}</p>}
              <div className="modal-footer">
                <button type="button" className="btn secondary-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn primary-btn">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit User: {editingUser.firstName} {editingUser.lastName}</h3>
              <button className="close-btn" onClick={() => { setShowEditModal(false); setEditingUser(null); }}>×</button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="form-grid">
                {/* Input fields pre-filled with editingUser data */}
                <div className="form-group">
                  <label htmlFor="edit-firstName">First Name</label>
                  <input type="text" id="edit-firstName" name="firstName" value={editingUser.firstName} onChange={handleEditInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-lastName">Last Name</label>
                  <input type="text" id="edit-lastName" name="lastName" value={editingUser.lastName} onChange={handleEditInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-email">Email</label>
                  <input type="email" id="edit-email" name="email" value={editingUser.email} onChange={handleEditInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-phone">Phone</label>
                  <input type="tel" id="edit-phone" name="phone" value={editingUser.phone} onChange={handleEditInputChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-role">Role</label>
                  <select id="edit-role" name="role" value={editingUser.role} onChange={handleEditInputChange} required>
                    <option value="family">Family Member</option>
                    <option value="resident">Resident</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="healthcare">Healthcare Professional</option>
                    <option value="other">Other</option>
                 </select>
                </div>
                <div className="form-group checkbox-group full-width">
                  <label htmlFor="edit-isAdmin" className="checkbox-label">
                    <input
                      type="checkbox"
                      id="edit-isAdmin"
                      name="isAdmin"
                      checked={editingUser.isAdmin}
                      onChange={handleEditInputChange}
                      disabled={editingUser.role !== "caregiver"} // Disable if role is not Caregiver
                    />
                    <span>Grant Admin Privileges</span>
                  </label>
                </div>
                {/* Note: Password update is often handled separately for security */}
                <p style={{ gridColumn: '1 / -1', fontSize: '0.8rem', color: '#6b7280' }}>Password cannot be changed here.</p>
              </div>
              {/* Display error inside modal if needed */}
              {error && <p className="error-message" style={{ marginTop: '1rem' }}>{error}</p>}
              <div className="modal-footer">
                <button type="button" className="btn secondary-btn" onClick={() => { setShowEditModal(false); setEditingUser(null); }}>Cancel</button>
                <button type="submit" className="btn primary-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersManagement
