import axios from 'axios';

const API_URL = 'http://localhost:5000/api/telemetry';

export const getTelemetryByDevice = async (deviceId) => {
  const response = await axios.get(`${API_URL}/${deviceId}`);
  return response.data;
};