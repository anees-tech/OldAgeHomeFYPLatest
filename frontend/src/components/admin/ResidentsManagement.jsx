import React, { useState } from 'react';

function ResidentsManagement() {
  const [residents] = useState([
    { id: 1, name: 'Mary Johnson', age: 78, room: 'A-101', status: 'Active', joinDate: '2023-05-15' },
    { id: 2, name: 'James Wilson', age: 82, room: 'B-203', status: 'Active', joinDate: '2023-03-22' },
    { id: 3, name: 'Dorothy Smith', age: 75, room: 'A-105', status: 'Medical Leave', joinDate: '2023-01-10' }
  ]);

  return (
    <div className="residents-management">
      <div className="management-header">
        <h2>Residents Management</h2>
        <button className="btn primary-btn">
          <i className="fas fa-user-plus"></i>
          Add New Resident
        </button>
      </div>
      
      <div className="residents-grid">
        {residents.map(resident => (
          <div key={resident.id} className="resident-card">
            <div className="resident-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="resident-info">
              <h3>{resident.name}</h3>
              <p>Age: {resident.age} | Room: {resident.room}</p>
              <span className={`status ${resident.status.toLowerCase().replace(' ', '-')}`}>
                {resident.status}
              </span>
            </div>
            <div className="resident-actions">
              <button className="btn-small primary">View</button>
              <button className="btn-small secondary">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResidentsManagement;