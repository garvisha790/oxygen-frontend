// src/pages/DeviceDetails.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import DeviceHeader from '../components/deviceView/DeviceHeader';
import DeviceCharts from '../components/deviceView/DeviceCharts';
import Loader from '../components/common/Loader';
import { fetchDeviceData } from '../services/deviceService';

const DeviceDetails = () => {
  const { siteId, deviceId } = useParams();
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AppContext);

  useEffect(() => {
    const loadDeviceData = async () => {
      setLoading(true);
      try {
        const data = await fetchDeviceData(siteId, deviceId, user.token);
        setDeviceData(data);
      } catch (error) {
        console.error('Error loading device data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && siteId && deviceId) {
      loadDeviceData();
    }
  }, [siteId, deviceId, user]);

  if (loading) return <Loader />;

  return (
    <div className="device-dashboard">
      <DeviceHeader 
        siteName={deviceData.siteName}
        siteId={siteId}
        deviceName={deviceData.deviceName} 
      />
      
      <div className="device-content">
        <DeviceCharts 
          temperatureData={deviceData.temperatureData}
          otherMetrics={deviceData.otherMetrics}
        />
      </div>
    </div>
  );
};

export default DeviceDetails;