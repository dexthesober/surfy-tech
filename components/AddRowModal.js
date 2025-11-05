import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRow } from '../store/tableSlice';

export const AddRowModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const columns = useSelector(state => state.table.columns.filter(col => col.visible));
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (!value) return 'Required';
    switch (name) {
      case 'age':
        return isNaN(value) ? 'Must be a number' : '';
      case 'email':
        return !value.includes('@') ? 'Invalid email' : '';
      default:
        return '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    columns.forEach(col => {
      const error = validateField(col.key, formData[col.key]);
      if (error) newErrors[col.key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      dispatch(addRow(formData));
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Row</h2>
        <form onSubmit={handleSubmit}>
          {columns.map(col => (
            <div key={col.key}>
              <label>{col.label}</label>
              <input
                type={col.key === 'age' ? 'number' : 'text'}
                value={formData[col.key] || ''}
                onChange={e => {
                  setFormData({...formData, [col.key]: e.target.value});
                  const error = validateField(col.key, e.target.value);
                  setErrors({...errors, [col.key]: error});
                }}
              />
              {errors[col.key] && <span className="error">{errors[col.key]}</span>}
            </div>
          ))}
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};
