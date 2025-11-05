import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage, setPageSize, addRow } from '../store/tableSlice';
import './Table.css';

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

const Table = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const rows = useSelector(state => state.table.rows);
  const columns = useSelector(state => state.table.columns.filter(col => col.visible));
  const { currentPage, pageSize } = useSelector(state => state.table.pagination);

  // Calculate pagination values
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = rows.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    dispatch(setPageSize(newPageSize));
  };

  return (
    <div className="table-container">
      <div className="table-toolbar">
        <button 
          className="add-button"
          onClick={() => setIsModalOpen(true)}
        >
          + Add New Row
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <div className="page-size">
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
        
        <div className="page-controls">
          <button 
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AddRowModal 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Table;