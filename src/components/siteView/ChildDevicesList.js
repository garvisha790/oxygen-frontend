import React from 'react';

const ChildDevicesList = () => {
  const devices = [
    { id: 1, name: 'Sensor 1', status: 'Active' },
    { id: 2, name: 'Sensor 2', status: 'Inactive' },
    { id: 3, name: 'Sensor 3', status: 'Warning' },
  ];

  return (
    <div className="card">
      <h3>Child Devices</h3>
      <ul>
        {devices.map((device) => (
          <li key={device.id}>
            {device.name} - <strong>{device.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChildDevicesList;
