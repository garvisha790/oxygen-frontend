// src/components/deviceView/DeviceCharts.js
import React, { useState, useEffect, useRef } from 'react';
// You can use a charting library like Chart.js or Recharts
// Here's an example with Chart.js
import { Chart } from 'chart.js/auto';

const DeviceCharts = ({ temperatureData, otherMetrics }) => {
  const [selectedDevice, setSelectedDevice] = useState('all');
  const temperatureChartRef = useRef(null);
  const temperatureChart = useRef(null);
  
  useEffect(() => {
    // Cleanup previous chart instance
    if (temperatureChart.current) {
      temperatureChart.current.destroy();
    }
    
    if (temperatureChartRef.current && temperatureData && temperatureData.labels) {
      const ctx = temperatureChartRef.current.getContext('2d');
      
      temperatureChart.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: temperatureData.labels,
          datasets: [{
            label: 'Temperature',
            data: temperatureData.values,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Temperature (°C)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Time'
              }
            }
          }
        }
      });
    }
    
    return () => {
      if (temperatureChart.current) {
        temperatureChart.current.destroy();
      }
    };
  }, [temperatureData, selectedDevice]);

  return (
    <div className="device-charts-container">
      <div className="chart-controls">
        <label>
          Device:
          <select 
            value={selectedDevice} 
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            <option value="all">All</option>
            {otherMetrics && otherMetrics.devices && otherMetrics.devices.map(device => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h4>Temperature Vs Time</h4>
          <canvas ref={temperatureChartRef}></canvas>
        </div>
        
        {/* Add more charts as needed */}
      </div>
    </div>
  );
};

export default DeviceCharts;