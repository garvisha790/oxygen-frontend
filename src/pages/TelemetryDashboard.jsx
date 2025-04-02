import React, { useEffect, useState, useCallback } from "react";
import { getPlants } from "../services/plantService";
import { getDevices } from "../services/deviceService";
import { 
  getLatestTelemetryEntry, 
  getRealtimeTelemetryData, 
  getTelemetryData,
  clearDeviceCache 
} from "../services/telemetryService";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

import {
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Divider,
  TableContainer,
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import { useTheme } from '@mui/material/styles';

// Custom circular progress visualization component that matches the reference UI
const MetricCircle = ({ value, label, color, size = 100, thickness = 5 }) => {
  const theme = useTheme();
  const displayValue = value || 0;
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      m: 2
    }}>
      <Box sx={{ 
        position: 'relative', 
        display: 'inline-flex',
        mb: 1
      }}>
        <CircularProgress
          variant="determinate"
          value={75} // Fixed angle for the visual style
          size={size}
          thickness={thickness}
          sx={{ 
            color: color || theme.palette.primary.main,
            transform: 'rotate(135deg)',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" component="div" fontWeight="bold">
            {displayValue}
            {label === 'Temperature' ? '°C' : label === 'Humidity' || label === 'Oil Level' ? '%' : ''}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" component="div">
        {label}
      </Typography>
    </Box>
  );
};

const TelemetryDashboard = () => {
  const theme = useTheme();
  const [plants, setPlants] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("esp32");
  const [telemetryData, setTelemetryData] = useState([]);
  const [latestEntry, setLatestEntry] = useState(null);
  const [realtimeData, setRealtimeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("status");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  // Fetch plants on component mount
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const plantData = await getPlants();
        if (plantData && plantData.length > 0) {
          setPlants(plantData);
          // Auto-select first plant if none selected
          if (!selectedPlant && plantData.length > 0) {
            setSelectedPlant(plantData[0]._id);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching plants:", error);
        setError("Failed to load plants. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, [selectedPlant]);

  // Fetch devices when plant selection changes
  useEffect(() => {
    const fetchDevices = async () => {
      if (!selectedPlant) {
        setDevices([]);
        setSelectedDevice("");
        return;
      }
      
      try {
        setLoading(true);
        const deviceData = await getDevices(selectedPlant);
        if (deviceData && deviceData.length > 0) {
          setDevices(deviceData);
          // Auto-select first device if none selected
          if (!selectedDevice && deviceData.length > 0) {
            setSelectedDevice(deviceData[0]._id);
          }
        } else {
          setDevices([]);
          setSelectedDevice("");
        }
      } catch (error) {
        console.error("❌ Error fetching devices:", error);
        setError("Failed to load devices. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, [selectedPlant]);

  // Fetch latest telemetry entry for dashboard metrics
  const fetchLatestEntry = useCallback(async () => {
    if (!selectedDevice) {
      setLatestEntry(null);
      setConnectionStatus("disconnected");
      return;
    }
    
    try {
      const data = await getLatestTelemetryEntry(selectedDevice);
      if (data) {
        setLatestEntry(data);
        setConnectionStatus("connected");
        setError(null);
      } else {
        setConnectionStatus("no data");
        setError("No telemetry data available for this device. Showing latest stored data if available.");
      }
    } catch (error) {
      console.error("❌ Error fetching latest telemetry:", error);
      setConnectionStatus("error");
      setError("Failed to fetch latest telemetry data. Showing latest stored data if available.");
    }
  }, [selectedDevice]);

  // Fetch realtime telemetry data for charts
  const fetchRealtimeData = useCallback(async () => {
    if (!selectedDevice) {
      setRealtimeData([]);
      return;
    }
    
    try {
      setLoading(true);
      const data = await getRealtimeTelemetryData(selectedDevice);
      setLoading(false);
      
      if (data && data.length > 0) {
        setRealtimeData(data);
        setError(null);
      } else {
        // If no realtime data, try to use historical data
        try {
          const historicalData = await getTelemetryData(selectedDevice);
          if (historicalData && historicalData.length > 0) {
            setRealtimeData(historicalData.slice(0, 20));
            setError("No real-time data available. Showing historical data instead.");
          } else {
            setError("No telemetry data available in CosmosDB for this device.");
          }
        } catch (innerError) {
          console.error("❌ Error fetching historical data as fallback:", innerError);
          setError("Failed to fetch any telemetry data from CosmosDB.");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ Error fetching realtime data:", error);
      setError("Failed to fetch real-time data from CosmosDB. Check connection settings.");
    }
  }, [selectedDevice]);

  // Fetch historical telemetry data for tables
  const fetchHistoricalData = useCallback(async () => {
    if (!selectedDevice) {
      setTelemetryData([]);
      return;
    }
    
    try {
      setLoading(true);
      const data = await getTelemetryData(selectedDevice);
      setLoading(false);
      
      if (data && data.length > 0) {
        setTelemetryData(data.slice(0, 20)); // Last 20 entries
        setError(null);
        
        // If we have historical data but no latest entry, use the most recent historical entry
        if (!latestEntry && data.length > 0) {
          // Sort by timestamp, newest first
          const sortedData = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setLatestEntry(sortedData[0]);
        }
      } else {
        setError("No historical telemetry data available in CosmosDB for this device.");
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ Error fetching historical data:", error);
      setError("Failed to fetch telemetry data from CosmosDB. Please check connection settings.");
    }
  }, [selectedDevice, latestEntry]);

  // Set up polling intervals when device changes
  useEffect(() => {
    if (!selectedDevice) return;
    
    // Clear cache when switching devices
    clearDeviceCache(selectedDevice);
    
    // Initial fetches
    fetchLatestEntry();
    fetchRealtimeData();
    fetchHistoricalData();
    
    // Set up polling intervals
    const latestInterval = setInterval(fetchLatestEntry, 2000);
    const realtimeInterval = setInterval(fetchRealtimeData, 3000);
    const historicalInterval = setInterval(fetchHistoricalData, 10000);
    
    // Cleanup intervals on unmount or device change
    return () => {
      clearInterval(latestInterval);
      clearInterval(realtimeInterval);
      clearInterval(historicalInterval);
    };
  }, [selectedDevice, fetchLatestEntry, fetchRealtimeData, fetchHistoricalData]);

  // Format data for temperature chart
  const temperatureChartData = {
    labels: realtimeData.map((data) => 
      new Date(data.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    ),
    datasets: [
      {
        label: "Temperature (°C)",
        data: realtimeData.map((data) => data.temperature),
        borderColor: "#ff6b8b",
        backgroundColor: "rgba(255, 107, 139, 0.1)",
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  // Format data for oil level chart
  const oilLevelChartData = {
    labels: realtimeData.map((data) => 
      new Date(data.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    ),
    datasets: [
      {
        label: "Oil Level (%)",
        data: realtimeData.map((data) => data.oilLevel),
        borderColor: "#4dabf5",
        backgroundColor: "rgba(77, 171, 245, 0.1)",
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  // Chart options for better appearance to match reference UI
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'rect'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10
          }
        }
      },
    },
    animation: {
      duration: 500,
    },
  };

  // Handlers for select changes
  const handlePlantChange = (e) => {
    const newPlantId = e.target.value;
    setSelectedPlant(newPlantId);
    setSelectedDevice("");
    clearDeviceCache(); // Clear all device cache when plant changes
  };

  const handleDeviceChange = (e) => {
    const newDeviceId = e.target.value;
    setSelectedDevice(newDeviceId);
    clearDeviceCache(newDeviceId); // Clear cache for this specific device
  };

  // Render connection status indicator
  const getConnectionStatus = () => {
    if (connectionStatus === "connected") {
      return "Connected";
    } else if (connectionStatus === "disconnected") {
      return "Disconnected";
    } else if (connectionStatus === "error") {
      return "Connection Error";
    } else if (connectionStatus === "no data") {
      return "No data available";
    }
    return "Unknown";
  };

  // Render the alarms tab content
  const renderAlarmsTab = () => {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        {latestEntry ? (
          <Typography variant="h6">
            {latestEntry.openAlerts || 0} Open Alerts
          </Typography>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No alerts data available
          </Typography>
        )}
      </Box>
    );
  };

  // Render the command center tab content
  const renderCommandCenterTab = () => {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Command Center functionality coming soon
        </Typography>
      </Box>
    );
  };

  // Render device metrics in the status tab
  const renderDeviceMetrics = () => {
    if (!latestEntry) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No telemetry data available for this device. Please check CosmosDB connection.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            If this is a real device and data exists in CosmosDB, check that device IDs match between the frontend and database.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Device Metrics
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          flexWrap: 'wrap',
          mb: 3 
        }}>
          <MetricCircle 
            value={latestEntry.openAlerts || 0} 
            label="Open Alerts" 
            color="#f44336" // red
          />
          <MetricCircle 
            value={latestEntry.temperature || 0} 
            label="Temperature" 
            color="#ff9800" // orange
          />
          <MetricCircle 
            value={latestEntry.humidity || 0} 
            label="Humidity" 
            color="#2196f3" // blue
          />
          <MetricCircle 
            value={latestEntry.oilLevel || 0} 
            label="Oil Level" 
            color="#4caf50" // green
          />
        </Box>
      </Box>
    );
  };

  // Render charts section
  const renderCharts = () => {
    if (realtimeData.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 3, mt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No telemetry data available in CosmosDB to display charts.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please ensure data is being properly stored in the CosmosDB container.
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={1}>Temperature Over Time</Typography>
            <Paper sx={{ p: 2, height: 250 }}>
              <Line data={temperatureChartData} options={chartOptions} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={1}>Oil Level Over Time</Typography>
            <Paper sx={{ p: 2, height: 250 }}>
              <Line data={oilLevelChartData} options={chartOptions} />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" mb={1}>Latest Readings</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Temperature (°C)</TableCell>
                  <TableCell>Oil Level (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {telemetryData.length > 0 ? (
                  telemetryData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(item.timestamp).toLocaleString([], {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>{item.temperature}</TableCell>
                      <TableCell>{item.oilLevel}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Telemetry Dashboard
        </Typography>
        
        {/* Plant and Device Selection */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="plant-select-label">Select Plant</InputLabel>
              <Select
                labelId="plant-select-label"
                value={selectedPlant}
                onChange={handlePlantChange}
                label="Select Plant"
                disabled={loading}
              >
                {plants.map((plant) => (
                  <MenuItem key={plant._id} value={plant._id}>
                    {plant.plantName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedPlant || loading}>
              <InputLabel id="device-select-label">Select Device</InputLabel>
              <Select
                labelId="device-select-label"
                value={selectedDevice}
                onChange={handleDeviceChange}
                label="Select Device"
              >
                {devices.map((device) => (
                  <MenuItem key={device._id} value={device._id}>
                    {device.deviceName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Tab navigation */}
        {selectedDevice && !loading && (
          <>
            <Box 
              sx={{ 
                display: 'flex',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Button 
                variant={activeTab === "status" ? "contained" : "text"}
                onClick={() => setActiveTab("status")}
                sx={{ 
                  flex: 1, 
                  py: 1.5,
                  borderRadius: 0,
                  color: activeTab === "status" ? "#fff" : "inherit",
                  backgroundColor: activeTab === "status" ? "#1976d2" : "transparent"
                }}
              >
                Status
                {activeTab === "status" && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {getConnectionStatus()}
                  </Typography>
                )}
              </Button>
              
              <Divider orientation="vertical" flexItem />
              
              <Button 
                variant={activeTab === "alarms" ? "contained" : "text"}
                onClick={() => setActiveTab("alarms")}
                sx={{ 
                  flex: 1, 
                  py: 1.5,
                  borderRadius: 0,
                  color: activeTab === "alarms" ? "#fff" : "inherit",
                  backgroundColor: activeTab === "alarms" ? "#1976d2" : "transparent"
                }}
              >
                Alarms
                {activeTab === "alarms" && latestEntry && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    {latestEntry.openAlerts || 0} Open Alerts
                  </Typography>
                )}
              </Button>
              
              <Divider orientation="vertical" flexItem />
              
              <Button 
                variant={activeTab === "cmd" ? "contained" : "text"}
                onClick={() => setActiveTab("cmd")}
                sx={{ 
                  flex: 1, 
                  py: 1.5,
                  borderRadius: 0,
                  color: activeTab === "cmd" ? "#fff" : "inherit",
                  backgroundColor: activeTab === "cmd" ? "#1976d2" : "transparent"
                }}
              >
                Command Center
              </Button>
            </Box>

            {/* Error message */}
            {error && (
              <Paper 
                sx={{ 
                  p: 2, 
                  mt: 2, 
                  bgcolor: 'error.light', 
                  color: 'error.main',
                  borderRadius: 1
                }}
              >
                <Typography>{error}</Typography>
              </Paper>
            )}
            
            {/* Tab content */}
            <Box sx={{ mt: 3 }}>
              {activeTab === "status" && (
                <>
                  {renderDeviceMetrics()}
                  {renderCharts()}
                </>
              )}
              
              {activeTab === "alarms" && renderAlarmsTab()}
              
              {activeTab === "cmd" && renderCommandCenterTab()}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default TelemetryDashboard;