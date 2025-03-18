// src/components/siteView/DeviceDetails.js
import React from 'react';

const DeviceDetails = ({ deviceDetails, lastKnownValues, lastConnectStatus }) => {
  return (
    <div className="device-details-container">
      <h3>Device Details</h3>
      <div className="device-info">
        {deviceDetails && (
          <>
            <div className="detail-row">
              <span className="detail-label">Last Known Values:</span>
              <span className="detail-value">{lastKnownValues}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Last Connect Status:</span>
              <span className={`detail-value status-${lastConnectStatus?.toLowerCase()}`}>
                {lastConnectStatus || 'Unknown'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">List of Child Devices:</span>
              <span className="detail-value">{deviceDetails.childDevicesCount || 0}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeviceDetails;