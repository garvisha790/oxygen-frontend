import React from 'react';

const Dropdown = ({ 
  options, 
  selectedValue, 
  onChange, 
  label, 
  name, 
  placeholder = 'Select an option' 
}) => {
  return (
    <div className="dropdown-container">
      {label && <label htmlFor={name}>{label}</label>}
      <select 
        id={name}
        name={name}
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        className="dropdown-select"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;