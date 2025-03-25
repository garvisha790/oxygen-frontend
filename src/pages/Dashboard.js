// src/pages/Dashboard.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Dummy hospital data
const hospitals = [
  { name: "All", location: null },
  { name: "Manipal Hospital", location: [12.934533, 77.612278] },
  { name: "Biocon", location: [12.834174, 77.681009] },
  { name: "Aster", location: [12.9634, 77.5855] },
  { name: "Apollo", location: [13.0105, 77.5528] },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState("All");

  // Handle hospital selection
  const handleSiteChange = (event) => {
    setSelectedHospital(event.target.value);
    if (event.target.value !== "All") {
      navigate(`/site/${event.target.value}`);
    }
  };

  // Get selected location (default to Bangalore coordinates if "All")
  const getSelectedLocation = () => {
    const hospital = hospitals.find((h) => h.name === selectedHospital);
    return hospital && hospital.location ? hospital.location : [12.9716, 77.5946];
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        paddingBottom: "20px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#0d47a1",
          color: "white",
          padding: "20px 0",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4" align="center" fontWeight="bold">
          Oxygen Plant Monitor
        </Typography>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Dropdown for hospital selection */}
          <Grid item xs={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Select Hospital</InputLabel>
              <Select
                value={selectedHospital}
                onChange={handleSiteChange}
                label="Select Hospital"
                sx={{ backgroundColor: "#ffffff" }}
              >
                {hospitals.map((hospital, index) => (
                  <MenuItem key={index} value={hospital.name}>
                    {hospital.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Map Section */}
          <Grid item xs={9}>
            <Paper
              elevation={3}
              style={{
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "12px",
              }}
            >
              {/* Map Heading - Left Aligned with Black Font */}
              <Typography
                variant="h6"
                fontWeight="bold"
                align="left"
                sx={{ marginBottom: "10px", color: "#000" }}
              >
                Google Map with Site Level Status
              </Typography>

              {/* Map Container */}
              <div
                style={{
                  height: "200px",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <MapContainer
                  center={getSelectedLocation()}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {selectedHospital !== "All" &&
                    hospitals
                      .filter((h) => h.name === selectedHospital)
                      .map((hospital, index) => (
                        <Marker key={index} position={hospital.location}>
                          <Popup>{hospital.name}</Popup>
                        </Marker>
                      ))}
                </MapContainer>
              </div>
            </Paper>
          </Grid>

          {/* Device Status Summary */}
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center">
              {[
                { status: "Offline", color: "#ADD8E6" }, // Gray
                { status: "Error", color: "#f44336" }, // Red
                { status: "Warning", color: "#ff9800" }, // Orange
                { status: "Normal", color: "#4caf50" }, // Green
              ].map((item, index) => (
                <Grid item key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "15px",
                      textAlign: "center",
                      width: "120px",
                      backgroundColor: item.color,
                      color: "#000",
                      borderRadius: "12px",
                    }}
                  >
                    <Typography variant="h6">{item.status}</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {Math.floor(Math.random() * 5)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Logs and Alerts Section */}
          <Grid item xs={6}>
            <Paper
              elevation={3}
              style={{
                height: "200px",
                padding: "15px",
                backgroundColor: "#e3f2fd",
                borderRadius: "12px",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                List of Logs with Auto Refresh
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper
              elevation={3}
              style={{
                height: "200px",
                padding: "15px",
                backgroundColor: "#fce4ec",
                borderRadius: "12px",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                List of Alerts
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
