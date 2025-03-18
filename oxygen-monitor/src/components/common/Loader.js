import React from 'react';

const Loader = ({ size = 'medium', message = 'Loading...' }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return '30px';
      case 'large':
        return '60px';
      case 'medium':
      default:
        return '40px';
    }
  };

  return (
    <div className="loader-container">
      <div 
        className="loader-spinner" 
        style={{ width: getSize(), height: getSize() }}
      ></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;