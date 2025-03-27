import React, { useEffect, useState } from "react";
import { getPlants } from "../services/plantService";
import { getDevices } from "../services/deviceService";
import { getTelemetryByDevice } from "../services/telemetryService";
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
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
} from "@mui/material";

import Sidebar from "../components/Sidebar";

const TelemetryDashboard = () => {
  const [plants, setPlants] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [telemetryData, setTelemetryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch plants when component mounts
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const plantData = await getPlants();
        setPlants(plantData);
      } catch (error) {
        console.error("❌ Error fetching plants:", error);
      }
    };
    fetchPlants();
  }, []);

  // Fetch devices when plant is selected
  useEffect(() => {
    const fetchDevices = async () => {
      if (!selectedPlant) {
        setDevices([]);
        setSelectedDevice("");
        return;
      }
      try {
        const deviceData = await getDevices(selectedPlant);
        setDevices(deviceData);
      } catch (error) {
        console.error("❌ Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, [selectedPlant]);

  // Fetch telemetry data when device is selected
  useEffect(() => {
    let interval;
   
    const fetchTelemetry = async () => {
      if (!selectedDevice) {
        setTelemetryData([]);
        return;
      }
      setLoading(true);
      setError(null);
     
      try {
        const telemetry = await getTelemetryByDevice(selectedDevice);
        setTelemetryData(telemetry);
      } catch (error) {
        console.error("❌ Error fetching telemetry data:", error);
        setError("Failed to fetch telemetry data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTelemetry();
    interval = setInterval(fetchTelemetry, 10000); // Fetch every 10 seconds
   
    return () => clearInterval(interval); // Cleanup on unmount
  }, [selectedDevice]);

  const chartData = {
    labels: telemetryData.map((data) => new Date(data.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature (°C)",
        data: telemetryData.map((data) => data.temperature),
        borderColor: "red",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Oil Level (%)",
        data: telemetryData.map((data) => data.oilLevel),
        borderColor: "blue",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, ml: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Telemetry Dashboard
        </Typography>

        {/* Plant Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Plant</InputLabel>
          <Select value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)}>
            <MenuItem value="">Select Plant</MenuItem>
            {plants.map((plant) => (
              <MenuItem key={plant._id} value={plant._id}>
                {plant.plantName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Device Selection */}
        <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedPlant}>
          <InputLabel>Select Device</InputLabel>
          <Select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
            <MenuItem value="">Select Device</MenuItem>
            {devices.map((device) => (
              <MenuItem key={device._id} value={device._id}>
                {device.deviceName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Loading Indicator */}
        {loading && <CircularProgress sx={{ display: "block", margin: "auto", my: 2 }} />}

        {/* Error Message */}
        {error && <Typography color="error">{error}</Typography>}

        {/* Line Chart */}
        {telemetryData.length > 0 && !loading && (
          <Paper sx={{ padding: "16px", marginBottom: "20px" }}>
            <Typography variant="h6" mb={2}>
              Temperature & Oil Level Over Time
            </Typography>
            <Line data={chartData} />
          </Paper>
        )}

        {/* Telemetry Data Table */}
        {telemetryData.length > 0 && !loading && (
          <Paper sx={{ padding: "16px", marginTop: "20px" }}>
            <Typography variant="h6">Telemetry Data</Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#0d47a1" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Timestamp</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Temperature (°C)</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Oil Level (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {telemetryData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(data.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{data.temperature}</TableCell>
                    <TableCell>{data.oilLevel}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {telemetryData.length === 0 && selectedDevice && !loading && !error && (
          <Typography variant="body1" mt={2}>
            No telemetry data available for this device.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default TelemetryDashboard;