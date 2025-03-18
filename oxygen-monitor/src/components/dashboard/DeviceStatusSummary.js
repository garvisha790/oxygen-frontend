import React from 'react';

const DeviceStatusSummary = ({ status }) => {
  return (
    <div className="status-summary-container">
      <div className="status-box offline">
        <h3>Offline</h3>
        <p className="status-count">{status.offline}</p>
      </div>
      <div className="status-box error">
        <h3>Error</h3>
        <p className="status-count">{status.error}</p>
      </div>
      <div className="status-box warning">
        <h3>Warning</h3>
        <p className="status-count">{status.warning}</p>
      </div>
      <div className="status-box normal">
        <h3>Normal</h3>
        <p className="status-count">{status.normal}</p>
      </div>
      <div className="status-description">
        
      </div>
    </div>
  );
};

export default DeviceStatusSummary;
