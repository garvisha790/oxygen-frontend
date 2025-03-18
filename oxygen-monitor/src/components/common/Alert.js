import React, { useState, useEffect } from 'react';

const Alert = ({ type = 'info', message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'warning':
        return 'alert-warning';
      case 'error':
        return 'alert-error';
      case 'info':
      default:
        return 'alert-info';
    }
  };

  if (!visible) return null;

  return (
    <div className={`alert ${getAlertClass()}`}>
      <div className="alert-content">{message}</div>
      <button className="alert-close" onClick={() => {
        setVisible(false);
        if (onClose) onClose();
      }}>
        &times;
      </button>
    </div>
  );
};

export default Alert;