// src/services/deviceService.js
// import { api } from './api';

// src/services/deviceService.js
import api from "./api";

// Usage example
const sites = await api.fetchSites();
const deviceData = await api.fetchDeviceData("D001");


// Fetch data for the main dashboard
export const fetchDashboardData = async (token) => {
  try {
    const response = await api.get('/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch data for a specific site
export const fetchSiteData = async (siteId, token) => {
  try {
    const response = await api.get(`/sites/${siteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch data for a specific device
export const fetchDeviceData = async (siteId, deviceId, token) => {
  try {
    const response = await api.get(`/sites/${siteId}/devices/${deviceId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch logs for a site with pagination
export const fetchSiteLogs = async (siteId, page = 1, limit = 20, token) => {
  try {
    const response = await api.get(`/sites/${siteId}/logs`, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch alerts for a site with pagination
export const fetchSiteAlerts = async (siteId, page = 1, limit = 20, token) => {
  try {
    const response = await api.get(`/sites/${siteId}/alerts`, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};