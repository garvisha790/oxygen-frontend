import React from 'react';

const DashboardHeader = ({ title }) => {
  return (
    <header className="dashboard-header">
      <h1>{title}</h1>
    </header>
  );
};

export default DashboardHeader;