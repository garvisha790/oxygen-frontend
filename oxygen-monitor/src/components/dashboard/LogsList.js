import React from 'react';

const LogsList = ({ logs }) => {
  return (
    <div className="logs-list">
      {logs.length === 0 ? (
        <p>No logs available</p>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Site</th>
              <th>Device</th>
              <th>Event</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className={`log-row ${log.status.toLowerCase()}`}>
                <td>{log.timestamp}</td>
                <td>{log.site}</td>
                <td>{log.device}</td>
                <td>{log.event}</td>
                <td>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LogsList;