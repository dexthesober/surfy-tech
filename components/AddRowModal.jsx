import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRow } from '../store/tableSlice';
import './AddRowModal.css';

const AddRowModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const columns = useSelector(state => state.table.columns.filter(col => col.visible));
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addRow(formData));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Row</h2>
        <form onSubmit={handleSubmit}>
          {columns.map(col => (
            <div key={col.key} className="form-group">
              <label>{col.label}</label>
              <input
                type={col.key === 'age' ? 'number' : 'text'}
                onChange={e => setFormData({
                  ...formData,
                  [col.key]: e.target.value
                })}
              />
            </div>
          ))}
          <div className="modal-actions">
            <button type="submit">Add</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRowModal;
