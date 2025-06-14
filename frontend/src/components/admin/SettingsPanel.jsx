import React from 'react';

function SettingsPanel() {
  return (
    <div className="settings-panel">
      <h2>System Settings</h2>
      <div className="settings-sections">
        <div className="settings-card">
          <h3>General Settings</h3>
          <p>Configure basic system preferences and defaults.</p>
          <button className="btn primary-btn">Configure</button>
        </div>
        
        <div className="settings-card">
          <h3>User Management</h3>
          <p>Manage user roles, permissions, and access controls.</p>
          <button className="btn primary-btn">Manage</button>
        </div>
        
        <div className="settings-card">
          <h3>System Backup</h3>
          <p>Configure automatic backups and data recovery options.</p>
          <button className="btn primary-btn">Setup</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;