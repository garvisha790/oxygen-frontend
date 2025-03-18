import React from 'react';

const AlertsList = ({ alerts }) => {
  return (
    <div className="alerts-list">
      {alerts.length === 0 ? (
        <p>No alerts available</p>
      ) : (
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Site</th>
              <th>Device</th>
              <th>Alert Type</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index} className={`alert-row ${alert.severity.toLowerCase()}`}>
                <td>{alert.timestamp}</td>
                <td>{alert.site}</td>
                <td>{alert.device}</td>
                <td>{alert.type}</td>
                <td>{alert.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AlertsList;