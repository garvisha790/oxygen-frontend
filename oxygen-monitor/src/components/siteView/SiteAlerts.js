// src/components/siteView/SiteAlerts.js
import React, { useState, useEffect } from 'react';
import { fetchSiteAlerts } from '../../services/deviceService';

const SiteAlerts = ({ siteId, token, initialAlerts = [] }) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const alertsData = await fetchSiteAlerts(siteId, 1, 20, token);
        setAlerts(alertsData.alerts);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };
    
    if (siteId && token) {
      loadAlerts();
    }
  }, [siteId, token]);

  return (
    <div className="site-alerts-container">
      <h3>List of Alerts</h3>
      
      <div className="alerts-content">
        {alerts.length === 0 ? (
          <p className="no-data-message">No alerts found</p>
        ) : (
          <table className="alerts-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Device</th>
                <th>Alert</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => (
                <tr key={alert.id} className={`alert-${alert.severity?.toLowerCase()}`}>
                  <td>{new Date(alert.timestamp).toLocaleString()}</td>
                  <td>{alert.deviceId}</td>
                  <td>{alert.message}</td>
                  <td>{alert.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SiteAlerts;