import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DeviceStatusSummary from '../components/dashboard/DeviceStatusSummary';
import GoogleMap from '../components/dashboard/GoogleMap';
import LogsList from '../components/dashboard/LogsList';
import AlertsList from '../components/dashboard/AlertsList';
import { fetchLogs, fetchAlerts } from '../services/api';

const Dashboard = () => {
  const { sites, deviceStatus, setSelectedSite } = useContext(AppContext);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const logsData = await fetchLogs();
        setLogs(logsData);
        
        const alertsData = await fetchAlerts();
        setAlerts(alertsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
    
    // Set up auto-refresh for logs
    const interval = setInterval(fetchData, 30000); // refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleSiteClick = (site) => {
    setSelectedSite(site);
    navigate(`/site/${site.id}`);
  };

  const filteredSites = selectedFilter === 'All' 
    ? sites 
    : sites.filter(site => site.name === selectedFilter);

  return (
    <div className="dashboard-container">
      <DashboardHeader title="Oxygen Plant Monitor" />
      
      <div className="dashboard-content">
      <div className="flex justify-between items-center mb-4">
  <select
    value={selectedFilter}
    onChange={(e) => setSelectedFilter(e.target.value)}
    className="dropdown"
  >
    
    <option value="All">All</option>
    {sites.map(site => (
      <option key={site.id} value={site.name}>
        {site.name}
      </option>
    ))}
  </select>
</div>
        
        <div className="main-content">
          <div className="map-container">
          <GoogleMap sites={filteredSites} onSiteClick={handleSiteClick} />

          </div>
          
          <div className="status-summary">
            <DeviceStatusSummary status={deviceStatus} />
          </div>
          
          <div className="dashboard-bottom">
            <div className="logs-container">
              <h3>List of Logs with auto refresh</h3>
              <LogsList logs={logs} />
            </div>
            
            <div className="alerts-container">
              <h3>List of Alerts</h3>
              <AlertsList alerts={alerts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;