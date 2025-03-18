export const fetchSites = async () => {
    // Mock data
    return [
      { id: 1, name: 'Manipal Hospital', status: 'normal', lat: 12.9716, lng: 77.5946 },
      { id: 2, name: 'Biocon', status: 'warning', lat: 12.9716, lng: 77.6946 },
      { id: 3, name: 'Aster', status: 'normal', lat: 13.0716, lng: 77.5946 },
      { id: 4, name: 'Apollo', status: 'offline', lat: 13.0716, lng: 77.6946 }
    ];
  };
  
  export const fetchDeviceStatus = async () => {
    // Mock data
    return {
      offline: 2,
      error: 0,
      warning: 1,
      normal: 1
    };
  };
  
  export const fetchLogs = async () => {
    // Mock data
    return [
      { timestamp: '2023-05-15 10:30:25', site: 'Manipal Hospital', device: 'Device 1', event: 'Temperature High', status: 'Warning' },
      { timestamp: '2023-05-15 10:15:10', site: 'Biocon', device: 'Device 3', event: 'Connection Lost', status: 'Offline' },
      { timestamp: '2023-05-15 09:45:30', site: 'Aster', device: 'Device 2', event: 'Normal Operation', status: 'Normal' },
      { timestamp: '2023-05-15 09:30:15', site: 'Apollo', device: 'Device 4', event: 'Connection Lost', status: 'Offline' }
    ];
  };
  
  export const fetchAlerts = async () => {
    // Mock data
    return [
      { timestamp: '2023-05-15 10:30:25', site: 'Manipal Hospital', device: 'Device 1', type: 'Temperature Threshold', severity: 'Warning' },
      { timestamp: '2023-05-15 10:15:10', site: 'Biocon', device: 'Device 3', type: 'Connection Issue', severity: 'Critical' },
      { timestamp: '2023-05-15 09:30:15', site: 'Apollo', device: 'Device 4', type: 'Connection Issue', severity: 'Critical' }
    ];
  };
  
  export const fetchSiteDetails = async (siteId) => {
    // Mock data
    return {
      id: siteId,
      name: 'Site ' + siteId,
      lastValues: '23°C, 45% RH, 1013 hPa',
      lastConnectStatus: 'Connected',
      lastUpdated: '2023-05-15 10:35:00'
    };
  };
  
  export const fetchChildDevices = async (siteId) => {
    // Mock data
    return [
      { id: 'D001', type: 'Temperature Sensor', lastValue: '23°C', status: 'Normal', lastUpdated: '2023-05-15 10:35:00' },
      { id: 'D002', type: 'Humidity Sensor', lastValue: '45% RH', status: 'Normal', lastUpdated: '2023-05-15 10:34:00' },
      { id: 'D003', type: 'Pressure Sensor', lastValue: '1013 hPa', status: 'Warning', lastUpdated: '2023-05-15 10:33:00' },
      { id: 'D004', type: 'Oxygen Sensor', lastValue: '98%', status: 'Normal', lastUpdated: '2023-05-15 10:32:00' }
    ];
  };
  
  export const fetchSiteLogs = async (siteId) => {
    // Mock data
    return [
      { timestamp: '2023-05-15 10:30:25', device: 'Device 1', event: 'Temperature High', status: 'Warning' },
      { timestamp: '2023-05-15 10:15:10', device: 'Device 3', event: 'Connection Lost', status: 'Offline' },
      { timestamp: '2023-05-15 09:45:30', device: 'Device 2', event: 'Normal Operation', status: 'Normal' }
    ];
  };
  
  export const fetchSiteAlerts = async (siteId) => {
    // Mock data
    return [
      { timestamp: '2023-05-15 10:30:25', device: 'Device 1', type: 'Temperature Threshold', severity: 'Warning' },
      { timestamp: '2023-05-15 10:15:10', device: 'Device 3', type: 'Connection Issue', severity: 'Critical' }
    ];
  };
  
  export const fetchDeviceData = async (deviceId) => {
    // Mock data
    return {
      id: deviceId,
      temperature: [22, 23, 21, 24],
      humidity: [40, 45, 42, 47],
      pressure: [1010, 1013, 1012, 1015]
    };
  };
  const api = {
    fetchSites,
    fetchDeviceStatus,
    fetchLogs,
    fetchAlerts,
    fetchSiteDetails,
    fetchChildDevices,
    fetchSiteLogs,
    fetchSiteAlerts,
    fetchDeviceData,
  };
  
  export default api;
  