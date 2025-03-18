// src/pages/SiteDashboard.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import SiteHeader from '../components/siteView/SiteHeader';
import DeviceDetails from '../components/siteView/DeviceDetails';
import ChildDevicesList from '../components/siteView/ChildDevicesList';
import SiteLogs from '../components/siteView/SiteLogs';
import SiteAlerts from '../components/siteView/SiteAlerts';
import DeviceStatusSummary from '../components/dashboard/DeviceStatusSummary';
import Loader from '../components/common/Loader';
import { fetchSiteData } from '../services/deviceService';

const SiteDashboard = () => {
  const { siteId } = useParams();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppContext);

  useEffect(() => {
    const loadSiteData = async () => {
      setLoading(true);
      try {
        // Pass both siteId and user token for authentication
        const data = await fetchSiteData(siteId, user.token);
        setSiteData(data);
      } catch (error) {
        console.error('Error loading site data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && siteId) {
      loadSiteData();
    }
  }, [siteId, user]);

  if (loading) return <Loader />;

  return (
    <div className="site-dashboard">
      <SiteHeader siteName={siteData.siteName} />
      
      <div className="site-content">
        <div className="site-left-panel">
          <DeviceDetails 
            deviceDetails={siteData.deviceDetails}
            lastKnownValues={siteData.lastKnownValues}
            lastConnectStatus={siteData.lastConnectStatus}
            childDevices={siteData.childDevices}
          />
          <SiteLogs logs={siteData.logs} siteId={siteId} token={user.token} />
        </div>
        
        <div className="site-right-panel">
          <ChildDevicesList 
            devices={siteData.childDevices} 
            siteId={siteId} 
          />
          <DeviceStatusSummary statuses={siteData.deviceStatuses} />
          <SiteAlerts alerts={siteData.alerts} />
        </div>
      </div>
    </div>
  );
};

export default SiteDashboard;