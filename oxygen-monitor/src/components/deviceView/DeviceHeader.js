// src/components/deviceView/DeviceHeader.js
import React from 'react';
import { Link } from 'react-router-dom';

const DeviceHeader = ({ siteName, siteId, deviceName }) => {
  return (
    <div className="device-header">
      <h1>Oxygen Plan Monitor</h1>
      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link> &gt; 
        <Link to={`/site/${siteId}`}>{siteName}</Link> &gt; 
        <span>{deviceName}</span>
      </div>
    </div>
  );
};

export default DeviceHeader;