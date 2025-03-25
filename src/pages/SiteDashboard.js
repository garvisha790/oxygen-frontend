import React from 'react';
import DeviceDetails from '../components/siteView/DeviceDetails';
import SiteLogs from '../components/siteView/SiteLogs';
import SiteAlerts from '../components/siteView/SiteAlerts';

const SiteDashboard = ({ siteName }) => {
  return (
    <div>
      <h2>Dashboard for {siteName}</h2>
      <DeviceDetails siteName={siteName} />
      <SiteLogs siteName={siteName} />
      <SiteAlerts siteName={siteName} />
    </div>
  );
};

export default SiteDashboard;
