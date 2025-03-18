import React from 'react';
import { getStatusColor } from '../../utils/helpers';

const DeviceStatus = ({ status, showLabel = true }) => {
  const normalizedStatus = status.toLowerCase();
  
  return (
    <div className="device-status">
      <span 
        className="status-indicator" 
        style={{ backgroundColor: getStatusColor(normalizedStatus) }}
      ></span>
      {showLabel && <span className="status-label">{status}</span>}
    </div>
  );
};

export default DeviceStatus;