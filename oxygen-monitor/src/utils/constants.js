export const STATUS_TYPES = {
    OFFLINE: 'offline',
    ERROR: 'error',
    WARNING: 'warning',
    NORMAL: 'normal'
  };
  
  export const REFRESH_INTERVALS = {
    LOGS: 30000,  // 30 seconds
    DEVICES: 60000 // 1 minute
  };
  
  export const CHART_COLORS = {
    TEMPERATURE: '#ff4081',
    HUMIDITY: '#2196f3',
    PRESSURE: '#4caf50',
    OXYGEN: '#9c27b0'
  };
  
  export const SENSOR_TYPES = [
    'Temperature',
    'Humidity',
    'Pressure',
    'Oxygen'
  ];
  
  export const ALERT_SEVERITY = {
    CRITICAL: 'Critical',
    WARNING: 'Warning',
    INFO: 'Info'
  };