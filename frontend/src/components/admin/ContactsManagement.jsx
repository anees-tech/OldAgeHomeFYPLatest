import { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactsManagement.css';

function ContactsManagement() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      // Change from /api/contacts to /api/contact (matching your backend route)
      const response = await axios.get('http://localhost:5000/api/contact');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Change from /api/contacts to /api/contact
      await axios.put(`http://localhost:5000/api/contact/${id}/status`, {
        status: newStatus
      });
      fetchContacts();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        // Change from /api/contacts to /api/contact
        await axios.delete(`http://localhost:5000/api/contact/${id}`);
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#3498db';
      case 'in_progress': return '#f39c12';
      case 'resolved': return '#27ae60';
      case 'closed': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return '#e74c3c';
      case 'high': return '#f39c12';
      case 'normal': return '#3498db';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  const getStats = () => {
    const total = contacts.length;
    const newContacts = contacts.filter(c => c.status === 'new').length;
    const inProgress = contacts.filter(c => c.status === 'in_progress').length;
    const resolved = contacts.filter(c => c.status === 'resolved').length;
    
    return { total, newContacts, inProgress, resolved };
  };

  const stats = getStats();

  if (loading) {
    return <div className="loading">Loading contacts...</div>;
  }

  return (
    <div className="contacts-management">
      <div className="management-header">
        <h2>Contacts Management</h2>
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Contacts</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="contacts-stats">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Contacts</p>
        </div>
        <div className="stat-card">
          <h3>{stats.newContacts}</h3>
          <p>New Messages</p>
        </div>
        <div className="stat-card">
          <h3>{stats.inProgress}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <h3>{stats.resolved}</h3>
          <p>Resolved</p>
        </div>
      </div>

      <div className="contacts-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(contact => (
              <tr key={contact._id}>
                <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                <td>
                  <strong>{contact.name}</strong>
                  <br />
                  <small>{contact.phone}</small>
                </td>
                <td>{contact.email}</td>
                <td>{contact.subject || 'General Inquiry'}</td>
                <td>
                  <span 
                    className="urgency-badge"
                    style={{ backgroundColor: getUrgencyColor(contact.urgency) }}
                  >
                    {contact.urgency}
                  </span>
                </td>
                <td>
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                    className="status-select"
                    style={{ color: getStatusColor(contact.status) }}
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn view-btn"
                      onClick={() => {
                        setSelectedContact(contact);
                        setShowDetailsModal(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => handleDelete(contact._id)}
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
      {showDetailsModal && selectedContact && (
        <div className="modal-overlay">
          <div className="modal contact-modal">
            <div className="modal-header">
              <h3>Contact Details</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="contact-details">
                <div className="detail-section">
                  <h4>Contact Information</h4>
                  <div className="detail-row">
                    <label>Name:</label>
                    <span>{selectedContact.name}</span>
                  </div>
                  <div className="detail-row">
                    <label>Email:</label>
                    <span>{selectedContact.email}</span>
                  </div>
                  <div className="detail-row">
                    <label>Phone:</label>
                    <span>{selectedContact.phone || 'Not provided'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Subject:</label>
                    <span>{selectedContact.subject || 'General Inquiry'}</span>
                  </div>
                  <div className="detail-row">
                    <label>Preferred Contact:</label>
                    <span>{selectedContact.preferredContact}</span>
                  </div>
                  <div className="detail-row">
                    <label>Urgency:</label>
                    <span 
                      className="urgency-badge"
                      style={{ backgroundColor: getUrgencyColor(selectedContact.urgency) }}
                    >
                      {selectedContact.urgency}
                    </span>
                  </div>
                  <div className="detail-row">
                    <label>Status:</label>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(selectedContact.status) }}
                    >
                      {selectedContact.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="detail-row">
                    <label>Date:</label>
                    <span>{new Date(selectedContact.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="detail-section full-width">
                  <h4>Message</h4>
                  <div className="message-content">
                    {selectedContact.message}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactsManagement;