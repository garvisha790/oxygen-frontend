// src/components/siteView/SiteHeader.js
import React from 'react';
import { Link } from 'react-router-dom';

const SiteHeader = ({ siteName }) => {
  return (
    <div className="site-header">
      <h1>Oxygen Plan Monitor</h1>
      <div className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link> &gt; {siteName}
      </div>
    </div>
  );
};

export default SiteHeader;