"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FaUserPlus, FaEdit, FaTrashAlt } from "react-icons/fa"; // Import React Icons
import "../../styles/users-management.css"
// import "../../styles/admin.css" // Import admin styles for modal

function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
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

  // Updated API Base URL
  const API_URL = "http://localhost:5000/api/auth"

  useEffect(() => {
    fetchUsers()
  }, [])

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await axios.get(`${API_URL}/users`)
      setUsers(response.data)
    } catch (err) {
      console.error("Fetch Users Error:", err)
      setError(err.response?.data?.message || "Failed to fetch users. Please ensure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  // Add User
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
      const response = await axios.post(`${API_URL}/register`, newUser)
      await fetchUsers() // Refresh the users list
      setShowAddModal(false)
      resetNewUserForm()
      alert("User added successfully!")
    } catch (err) {
      console.error("Add User Error:", err)
      setError(err.response?.data?.message || "Failed to add user")
    }
  }

  // Edit User
  const handleEditUser = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const updateData = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        isAdmin: editingUser.isAdmin,
      }

      await axios.put(`${API_URL}/users/${editingUser._id}`, updateData)
      await fetchUsers() // Refresh the users list
      setShowEditModal(false)
      setEditingUser(null)
      alert("User updated successfully!")
    } catch (err) {
      console.error("Edit User Error:", err)
      setError(err.response?.data?.message || "Failed to update user")
    }
  }

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`)
        await fetchUsers() // Refresh the users list
        alert("User deleted successfully!")
      } catch (err) {
        console.error("Delete User Error:", err)
        setError(err.response?.data?.message || "Failed to delete user")
      }
    }
  }

  // Helper Functions
  const resetNewUserForm = () => {
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "family",
      isAdmin: false,
    })
  }

  const openEditModal = (user) => {
    setEditingUser({ ...user })
    setShowEditModal(true)
  }

  // Filter Users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === "all" || user.role === filterRole
    
    return matchesSearch && matchesRole
  })

  if (loading) {
    return <div className="loading">Loading users...</div>
  }

  return (
    <div className="users-management">
      <div className="management-header">
        <h2>Users Management</h2>
        <button 
          className="btn primary-btn" 
          onClick={() => setShowAddModal(true)}
        >
          <FaUserPlus style={{ marginRight: '0.5rem' }} /> {/* React Icon for Add User */}
          Add New User
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="search-filter-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="family">Family</option>
            <option value="resident">Resident</option>
            <option value="caregiver">Caregiver</option>
            <option value="healthcare">Healthcare</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && <div className="error-message">{error}</div>}

      {/* Users Stats */}
      <div className="users-stats">
        <div className="stat-card">
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter(u => u.role === 'resident').length}</h3>
          <p>Residents</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter(u => u.role === 'caregiver').length}</h3>
          <p>Caregivers</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter(u => u.isAdmin).length}</h3>
          <p>Admins</p>
        </div>
      </div>

      {/* User Table */}
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
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>
                  <strong>{user.firstName} {user.lastName}</strong>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`admin-badge ${user.isAdmin ? 'yes' : 'no'}`}>
                    {user.isAdmin ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn edit-btn"
                      onClick={() => openEditModal(user)}
                      title="Edit User"
                    >
                      <FaEdit /> {/* React Icon for Edit */}
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete User"
                    >
                      <FaTrashAlt /> {/* React Icon for Delete */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="no-results">
            No users found matching your criteria.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New User</h3>
              <button 
                className="close-btn" 
                onClick={() => {
                  setShowAddModal(false)
                  resetNewUserForm()
                  setError("")
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    required
                  >
                    <option value="family">Family</option>
                    <option value="resident">Resident</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newUser.isAdmin}
                      onChange={(e) => setNewUser({...newUser, isAdmin: e.target.checked})}
                      disabled={newUser.role !== 'caregiver'}
                    />
                    Admin Privileges {newUser.role !== 'caregiver' && '(Only for Caregivers)'}
                  </label>
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn secondary-btn"
                  onClick={() => {
                    setShowAddModal(false)
                    resetNewUserForm()
                    setError("")
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary-btn">
                  Add User
                </button>
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
              <h3>Edit User</h3>
              <button 
                className="close-btn" 
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                  setError("")
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditUser}>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={editingUser.firstName}
                    onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={editingUser.lastName}
                    onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    required
                  >
                    <option value="family">Family</option>
                    <option value="resident">Resident</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={editingUser.isAdmin}
                      onChange={(e) => setEditingUser({...editingUser, isAdmin: e.target.checked})}
                      disabled={editingUser.role !== 'caregiver'}
                    />
                    Admin Privileges {editingUser.role !== 'caregiver' && '(Only for Caregivers)'}
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn secondary-btn"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                    setError("")
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary-btn">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersManagement
