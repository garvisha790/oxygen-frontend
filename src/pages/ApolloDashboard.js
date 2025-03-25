import React from 'react';
import DeviceDetails from '../components/siteView/DeviceDetails';
import ChildDevicesList from '../components/siteView/ChildDevicesList';
import SiteLogs from '../components/siteView/SiteLogs';
import SiteAlerts from '../components/siteView/SiteAlerts';


const ApolloDashboard = () => {
  return (
    <div className="site-dashboard">
      <h2>Oxygen Plant Monitor - Apollo Hospital</h2>
      <DeviceDetails />
      <ChildDevicesList />
      <SiteLogs />
      <SiteAlerts />
    </div>
  );
};

export default ApolloDashboard;
