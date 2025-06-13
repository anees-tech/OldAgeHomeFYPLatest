import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdmissionsManagement.css';

function AdmissionsManagement() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admissions');
      setAdmissions(response.data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admissions/${id}/status`, {
        status: newStatus
      });
      fetchAdmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admission?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admissions/${id}`);
        fetchAdmissions();
      } catch (error) {
        console.error('Error deleting admission:', error);
        alert('Error deleting admission. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'under_review': return '#3498db';
      case 'approved': return '#27ae60';
      case 'rejected': return '#e74c3c';
      case 'waitlisted': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'immediate': return '#e74c3c';
      case 'within_month': return '#f39c12';
      case 'within_3_months': return '#3498db';
      case 'flexible': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const filteredAdmissions = admissions.filter(admission => {
    if (filter === 'all') return true;
    return admission.status === filter;
  });

  const getStats = () => {
    const total = admissions.length;
    const pending = admissions.filter(a => a.status === 'pending').length;
    const approved = admissions.filter(a => a.status === 'approved').length;
    const rejected = admissions.filter(a => a.status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  if (loading) {
    return <div className="loading">Loading admissions...</div>;
  }

  return (
    <div className="admissions-management">
      <div className="management-header">
        <h2>Admissions Management</h2>
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="waitlisted">Waitlisted</option>
          </select>
        </div>
      </div>

      <div className="admissions-stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Applications</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pending Review</p>
        </div>
        <div className="stat-card">
          <h3>{stats.approved}</h3>
          <p>Approved</p>
        </div>
        <div className="stat-card">
          <h3>{stats.rejected}</h3>
          <p>Rejected</p>
        </div>
      </div>

      <div className="admissions-table">
        <table>
          <thead>
            <tr>
              <th>Application Date</th>
              <th>Resident Name</th>
              <th>Contact Person</th>
              <th>Phone</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmissions.map(admission => (
              <tr key={admission._id}>
                <td>{new Date(admission.createdAt).toLocaleDateString()}</td>
                <td>
                  <strong>{admission.residentInfo.firstName} {admission.residentInfo.lastName}</strong>
                  <br />
                  <small>Age: {admission.residentInfo.age}</small>
                </td>
                <td>
                  {admission.contactInfo.contactName}
                  <br />
                  <small>{admission.contactInfo.relationship}</small>
                </td>
                <td>{admission.contactInfo.phone}</td>
                <td>
                  <span 
                    className="urgency-badge"
                    style={{ backgroundColor: getUrgencyColor(admission.urgency) }}
                  >
                    {admission.urgency.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <select
                    value={admission.status}
                    onChange={(e) => handleStatusUpdate(admission._id, e.target.value)}
                    className="status-select"
                    style={{ color: getStatusColor(admission.status) }}
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="waitlisted">Waitlisted</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn view-btn"
                      onClick={() => {
                        setSelectedAdmission(admission);
                        setShowDetailsModal(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(admission._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAdmission && (
        <div className="modal-overlay">
          <div className="modal admission-modal">
            <div className="modal-header">
              <h3>Admission Application Details</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="details-grid">
                <div className="detail-section">
                  <h4>Resident Information</h4>
                  <div className="detail-row">
                    <label>Name:</label>
                    <span>{selectedAdmission.residentInfo.firstName} {selectedAdmission.residentInfo.lastName}</span>
                  </div>
                  <div className="detail-row">
                    <label>Age:</label>
                    <span>{selectedAdmission.residentInfo.age}</span>
                  </div>
                  <div className="detail-row">
                    <label>Gender:</label>
                    <span>{selectedAdmission.residentInfo.gender}</span>
                  </div>
                  <div className="detail-row">
                    <label>Date of Birth:</label>
                    <span>{new Date(selectedAdmission.residentInfo.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Contact Information</h4>
                  <div className="detail-row">
                    <label>Contact Person:</label>
                    <span>{selectedAdmission.contactInfo.contactName}</span>
                  </div>
                  <div className="detail-row">
                    <label>Relationship:</label>
                    <span>{selectedAdmission.contactInfo.relationship}</span>
                  </div>
                  <div className="detail-row">
                    <label>Phone:</label>
                    <span>{selectedAdmission.contactInfo.phone}</span>
                  </div>
                  <div className="detail-row">
                    <label>Email:</label>
                    <span>{selectedAdmission.contactInfo.email}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Medical Information</h4>
                  <div className="detail-row">
                    <label>Medical Conditions:</label>
                    <span>{selectedAdmission.medicalInfo.conditions || 'None specified'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Medications:</label>
                    <span>{selectedAdmission.medicalInfo.medications || 'None specified'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Care Level:</label>
                    <span>{selectedAdmission.medicalInfo.careLevel}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Application Details</h4>
                  <div className="detail-row">
                    <label>Urgency:</label>
                    <span className="urgency-badge" style={{ backgroundColor: getUrgencyColor(selectedAdmission.urgency) }}>
                      {selectedAdmission.urgency.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="detail-row">
                    <label>Status:</label>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(selectedAdmission.status) }}>
                      {selectedAdmission.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="detail-row">
                    <label>Application Date:</label>
                    <span>{new Date(selectedAdmission.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedAdmission.additionalInfo && (
                  <div className="detail-section full-width">
                    <h4>Additional Information</h4>
                    <p>{selectedAdmission.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdmissionsManagement;