import { useState, useEffect } from 'react';
import axios from 'axios';
// import '../../styles/admin-management.css'; // Assuming this holds common styles
import '../../styles/donations-management.css'; // Create this file for specific styles

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
    setLoading(true); // Set loading true at the start of fetch
    try {
      const response = await axios.get('http://localhost:5000/api/donations/all');
      setDonations(response.data);
      setError(''); // Clear previous errors
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
      // Optionally set an error state for stats if needed
    }
  };

  const updateDonationStatus = async (id, status, adminNotes = '') => {
    try {
      const response = await axios.put(`http://localhost:5000/api/donations/${id}`, {
        status,
        adminNotes // Though not used in UI for input, backend might use it
      });
      
      setDonations(donations.map(donation => 
        donation._id === id ? response.data : donation
      ));
      
      fetchStats(); // Refresh stats after status update
      setError(''); // Clear previous errors
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
        fetchStats(); // Refresh stats after deletion
        setError(''); // Clear previous errors
      } catch (err) {
        setError('Failed to delete donation');
        console.error('Error deleting donation:', err);
      }
    }
  };

  const filteredDonations = donations.filter(donation => {
    const searchTermLower = searchTerm.toLowerCase();
    
    // Safely access nested properties
    const donorFirstName = donation.donorInfo?.firstName?.toLowerCase() || '';
    const donorLastName = donation.donorInfo?.lastName?.toLowerCase() || '';
    const donorEmail = donation.donorInfo?.email?.toLowerCase() || '';
    const isAnonymous = donation.donorInfo?.isAnonymous || false;

    let matchesSearch = false;
    if (isAnonymous && "anonymous".includes(searchTermLower)) {
        matchesSearch = true;
    } else if (!isAnonymous) {
        matchesSearch = 
            donorFirstName.includes(searchTermLower) ||
            donorLastName.includes(searchTermLower) ||
            donorEmail.includes(searchTermLower);
    }
    
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
      default: return 'status-default'; // Default class
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    if (typeof amount !== 'number') return 'N/A'; // Handle cases where amount might not be a number
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD' // Consider making currency dynamic if needed
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading donations...</div>;

  return (
    <div className="donations-management">
      <div className="management-header donations-header"> {/* Use common management-header */}
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
      <div className="filter-controls donations-filters"> {/* Use common filter-controls */}
        <div className="search-bar"> {/* Use common search-bar */}
          <input
            type="text"
            placeholder="Search by name, email, or 'anonymous'..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-select-group"> {/* Use common filter-select-group */}
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
        <div className="filter-select-group"> {/* Use common filter-select-group */}
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
            <option value="meals">Meals & Nutrition</option>
            <option value="transportation">Transportation</option>
            {/* Add other categories from your backend options if needed */}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Donations Table */}
      <div className="table-container donations-table-container"> {/* Use common table-container */}
        <table className="data-table donations-table"> {/* Use common data-table */}
          <thead>
            <tr>
              <th>Donor</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Type (Recurrence)</th>
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
                      <strong>
                        {donation.donorInfo?.isAnonymous 
                          ? 'Anonymous' 
                          : `${donation.donorInfo?.firstName || ''} ${donation.donorInfo?.lastName || ''}`.trim() || 'N/A'}
                      </strong>
                      {donation.donationType === 'monthly' && ( // donationType here is recurrence
                        <span className="recurring-badge">Monthly</span>
                      )}
                    </div>
                  </td>
                  <td>{donation.donorInfo?.isAnonymous ? 'Hidden' : donation.donorInfo?.email || 'N/A'}</td>
                  <td className="amount-cell">
                    <strong>{donation.type === 'monetary' ? formatAmount(donation.amount) : donation.type.toUpperCase()}</strong>
                  </td>
                  <td>
                    <span className="type-badge">
                      {donation.donationType ? donation.donationType.replace('-', ' ') : 'N/A'} {/* Recurrence */}
                    </span>
                  </td>
                  <td>
                    <span className="category-badge">
                      {donation.category ? donation.category : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(donation.status)}`}>
                      {donation.status ? donation.status : 'N/A'}
                    </span>
                  </td>
                  <td>{formatDate(donation.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <select
                        value={donation.status}
                        onChange={(e) => updateDonationStatus(donation._id, e.target.value)}
                        className="status-select" // From admin.css or specific
                        title="Update Status"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <button
                        className="btn delete-btn" // From admin.css
                        onClick={() => deleteDonation(donation._id)}
                        title="Delete Donation"
                      >
                        {/* Using React Icons would be <FaTrashAlt /> */}
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