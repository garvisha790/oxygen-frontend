// src/components/siteView/SiteLogs.js
import React, { useState, useEffect } from 'react';
import { fetchSiteLogs } from '../../services/deviceService';

const SiteLogs = ({ siteId, token, initialLogs = [] }) => {
  const [logs, setLogs] = useState(initialLogs);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const loadLogs = async () => {
    setLoading(true);
    try {
      const logsData = await fetchSiteLogs(siteId, 1, 50, token);
      setLogs(logsData.logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    let intervalId;
    
    // Initial load
    loadLogs();
    
    if (autoRefresh) {
      intervalId = setInterval(loadLogs, 30000); // refresh every 30 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [siteId, token, autoRefresh]);

  return (
    <div className="site-logs-container">
      <div className="logs-header">
        <h3>List of Logs</h3>
        <div className="logs-controls">
          <label className="auto-refresh-toggle">
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={() => setAutoRefresh(!autoRefresh)} 
            />
            Auto Refresh
          </label>
          <button 
            className="refresh-button" 
            onClick={loadLogs} 
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Now'}
          </button>
        </div>
      </div>
      
      <div className="logs-content">
        {logs.length === 0 ? (
          <p className="no-data-message">No logs found</p>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Device</th>
                <th>Message</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className={`log-level-${log.level?.toLowerCase()}`}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.deviceId}</td>
                  <td>{log.message}</td>
                  <td>{log.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SiteLogs;