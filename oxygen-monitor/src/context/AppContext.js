import React, { createContext, useState, useEffect } from 'react';
import { fetchSites, fetchDeviceStatus } from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState({
    offline: 0,
    error: 0,
    warning: 0,
    normal: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (user) {
        setLoading(true);
        try {
          const sitesData = await fetchSites();
          setSites(sitesData);
          
          const statusData = await fetchDeviceStatus();
          setDeviceStatus(statusData);
        } catch (error) {
          console.error("Failed to fetch initial data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInitialData();
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        sites,
        setSites,
        selectedSite,
        setSelectedSite,
        deviceStatus,
        setDeviceStatus,
        loading,
        setLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
