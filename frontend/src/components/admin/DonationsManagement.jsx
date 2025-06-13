import { useState, useEffect } from 'react';
import axios from 'axios';
// import '../../styles/admin-management.css';

function DonationsManagement() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    monthlyAmount: 0
  });

  useEffect(() => {
    fetchDonations();
    fetchStats();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/donations/all');
      setDonations(response.data);
    } catch (err) {
      setError('Failed to fetch donations');
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/donations/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching donation stats:', err);
    }
  };

  const updateDonationStatus = async (id, status, adminNotes = '') => {
    try {
      const response = await axios.put(`http://localhost:5000/api/donations/${id}`, {
        status,
        adminNotes
      });
      
      setDonations(donations.map(donation => 
        donation._id === id ? response.data : donation
      ));
      
      // Refresh stats
      fetchStats();
    } catch (err) {
      setError('Failed to update donation status');
      console.error('Error updating donation:', err);
    }
  };

  const deleteDonation = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/donations/${id}`);
        setDonations(donations.filter(donation => donation._id !== id));
        fetchStats();
      } catch (err) {
        setError('Failed to delete donation');
        console.error('Error deleting donation:', err);
      }
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = 
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || donation.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || donation.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      case 'refunded': return 'status-refunded';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading donations...</div>;

  return (
    <div className="donations-management">
      <div className="donations-header">
        <h2>Donations Management</h2>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-label">Total Donations</span>
            <span className="stat-value">{stats.totalDonations}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Amount</span>
            <span className="stat-value">{formatAmount(stats.totalAmount)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">This Month</span>
            <span className="stat-value">{formatAmount(stats.monthlyAmount)}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="donations-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search donations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div className="filter-box">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="medical">Medical</option>
            <option value="activities">Activities</option>
            <option value="facilities">Facilities</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Donations Table */}
      <div className="donations-table-container">
        <table className="donations-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results">
                  No donations found matching criteria.
                </td>
              </tr>
            ) : (
              filteredDonations.map(donation => (
                <tr key={donation._id}>
                  <td>
                    <div className="donor-info">
                      <strong>{donation.isAnonymous ? 'Anonymous' : donation.donorName}</strong>
                      {donation.donationType === 'monthly' && (
                        <span className="recurring-badge">Monthly</span>
                      )}
                    </div>
                  </td>
                  <td>{donation.isAnonymous ? 'Hidden' : donation.email}</td>
                  <td className="amount-cell">
                    <strong>{formatAmount(donation.amount)}</strong>
                  </td>
                  <td>
                    <span className="type-badge">
                      {donation.donationType.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="category-badge">
                      {donation.category.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(donation.status)}`}>
                      {donation.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{formatDate(donation.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <select
                        value={donation.status}
                        onChange={(e) => updateDonationStatus(donation._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteDonation(donation._id)}
                        title="Delete Donation"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DonationsManagement;