// src/components/siteView/ChildDevicesList.js
import React from 'react';
import { Link } from 'react-router-dom';

const ChildDevicesList = ({ devices, siteId }) => {
  return (
    <div className="child-devices-container">
      <h3>Child Devices List</h3>
      <div className="devices-list">
        {!devices || devices.length === 0 ? (
          <p className="no-data-message">No child devices found</p>
        ) : (
          <table className="devices-table">
            <thead>
              <tr>
                <th>Device Name</th>
                <th>Last Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(device => (
                <tr key={device.id}>
                  <td>
                    <Link to={`/site/${siteId}/device/${device.id}`}>
                      {device.name}
                    </Link>
                  </td>
                  <td>{device.lastValue}</td>
                  <td className={`status-${device.status?.toLowerCase()}`}>
                    {device.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ChildDevicesList;