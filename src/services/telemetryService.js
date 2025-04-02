import axios from 'axios';

// Use the correct base URL without the "telemetry" path
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Configure axios defaults for better error handling
axios.defaults.timeout = 10000; // 10 second timeout
axios.defaults.retry = 2;
axios.defaults.retryDelay = 1000;

// Create axios instance with retry logic
const axiosInstance = axios.create();
axiosInstance.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || !config.retry) {
    return Promise.reject(error);
  }
  
  config.retryCount = config.retryCount || 0;
  if (config.retryCount >= config.retry) {
    return Promise.reject(error);
  }
  
  config.retryCount += 1;
  const delay = config.retryDelay || 1000;
  console.log(`Retrying request (${config.retryCount}/${config.retry})...`);
  
  return new Promise(resolve => setTimeout(() => resolve(axiosInstance(config)), delay));
});

// Cache management for historical telemetry data
let historicalCache = {};
let lastHistoricalFetch = {};

/**
 * Fetch historical telemetry data (last 20 entries) for a given deviceId
 * @param {string} deviceId - The ID of the device to fetch data for
 * @returns {Promise<Array>} - Array of telemetry data points
 */
export const getTelemetryData = async (deviceId) => {
  try {
    // Implement cache control to prevent excessive API calls
    const now = Date.now();
    const cacheTime = 10000; // 10 seconds cache for historical data
    
    if (!historicalCache[deviceId] || !lastHistoricalFetch[deviceId] || 
        (now - lastHistoricalFetch[deviceId] > cacheTime)) {
      console.log('📊 Fetching fresh historical telemetry data...');
      const response = await axiosInstance.get(`${BASE_URL}/telemetry/${deviceId}`);
      historicalCache[deviceId] = response.data || [];
      lastHistoricalFetch[deviceId] = now;
    } else {
      console.log('📊 Using cached historical telemetry data...');
    }
    
    return historicalCache[deviceId];
  } catch (error) {
    console.error("❌ Error fetching historical telemetry data:", error);
    return [];
  }
};

// Cache management for real-time telemetry data
let realtimeCache = {};
let lastRealtimeFetch = {};

/**
 * Fetch real-time telemetry data (last 10 minutes) for a given deviceId
 * @param {string} deviceId - The ID of the device to fetch data for
 * @returns {Promise<Array>} - Array of telemetry data points
 */
export const getRealtimeTelemetryData = async (deviceId) => {
  try {
    // Implement cache control with shorter lifetime for real-time data
    const now = Date.now();
    const cacheTime = 3000; // 3 seconds cache
    
    if (!realtimeCache[deviceId] || !lastRealtimeFetch[deviceId] || 
        (now - lastRealtimeFetch[deviceId] > cacheTime)) {
      console.log('⚡ Fetching fresh real-time telemetry data...');
      const response = await axiosInstance.get(`${BASE_URL}/telemetry/realtime/${deviceId}`);
      realtimeCache[deviceId] = response.data || [];
      lastRealtimeFetch[deviceId] = now;
    } else {
      console.log('⚡ Using cached real-time telemetry data...');
    }
    
    return realtimeCache[deviceId];
  } catch (error) {
    console.error("❌ Error fetching real-time telemetry data:", error);
    return [];
  }
};

// Cache management for latest telemetry entry
let latestEntryCache = {};
let lastLatestFetch = {};

/**
 * Fetch the latest telemetry entry for a given deviceId (for dashboard indicators)
 * @param {string} deviceId - The ID of the device to fetch data for
 * @returns {Promise<Object>} - Latest telemetry entry
 */
export const getLatestTelemetryEntry = async (deviceId) => {
  try {
    // Implement cache control with very short lifetime for latest data
    const now = Date.now();
    const cacheTime = 2000; // 2 seconds cache
    
    if (!latestEntryCache[deviceId] || !lastLatestFetch[deviceId] || 
        (now - lastLatestFetch[deviceId] > cacheTime)) {
      console.log('🔄 Fetching fresh latest telemetry entry...');
      const response = await axiosInstance.get(`${BASE_URL}/telemetry/latest/${deviceId}`);
      latestEntryCache[deviceId] = response.data || null;
      lastLatestFetch[deviceId] = now;
    } else {
      console.log('🔄 Using cached latest telemetry entry...');
    }
    
    return latestEntryCache[deviceId];
  } catch (error) {
    console.error("❌ Error fetching latest telemetry entry:", error);
    return null;
  }
};

/**
 * Clear all cache for a specific deviceId when switching devices
 * @param {string} deviceId - The ID of the device to clear cache for
 */
export const clearDeviceCache = (deviceId) => {
  if (deviceId) {
    // Clear specific device cache
    delete historicalCache[deviceId];
    delete lastHistoricalFetch[deviceId];
    delete realtimeCache[deviceId];
    delete lastRealtimeFetch[deviceId];
    delete latestEntryCache[deviceId];
    delete lastLatestFetch[deviceId];
    console.log(`🧹 Cleared cache for device ${deviceId}`);
  } else {
    // Clear all cache
    historicalCache = {};
    lastHistoricalFetch = {};
    realtimeCache = {};
    lastRealtimeFetch = {};
    latestEntryCache = {};
    lastLatestFetch = {};
    console.log('🧹 Cleared all device cache');
  }
};