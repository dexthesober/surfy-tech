import { createSlice } from '@reduxjs/toolkit'
const defaultColumns = [
  { key: 'name', label: 'Name', visible: true },
  { key: 'email', label: 'Email', visible: true },
  { key: 'age', label: 'Age', visible: true },
  { key: 'role', label: 'Role', visible: true }
]
const initialState = {
  rows: [
    { id: 1, name: 'madhav', email: 'Madhav@example.com', age: 28, role: 'Engineer' },
    { id: 2, name: 'sakshi', email: 'sakshi@example.com', age: 34, role: 'Designer' },
    { id: 3, name: 'madhav', email: 'Madhav@example.com', age: 28, role: 'Engineer' },
    { id: 4, name: 'sakshi', email: 'sakshi@example.com', age: 34, role: 'Designer' },
    { id: 5, name: 'madhav', email: 'Madhav@example.com', age: 28, role: 'Engineer' },
    { id: 6, name: 'sakshi', email: 'sakshi@example.com', age: 34, role: 'Designer' },
    
  ],
  columns: defaultColumns,
  sort: { key: null, dir: 'asc' },
  search: '',
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0
  }
}
const slice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    addRow: (state, action) => {
      const nextId = Math.max(0, ...state.rows.map(r => r.id)) + 1;
      state.rows.push({ id: nextId, ...action.payload });
    },
    setRows: (s,a)=>{s.rows=a.payload},
    updateRow: (s,a)=>{const {id,changes}=a.payload;const i=s.rows.findIndex(r=>r.id===id);if(i>=0)s.rows[i]={...s.rows[i],...changes}},
    deleteRow:(s,a)=>{s.rows=s.rows.filter(r=>r.id!==a.payload)},
    setColumns:(s,a)=>{s.columns=a.payload},
    toggleColumnVisibility:(s,a)=>{const c=s.columns.find(x=>x.key===a.payload);if(c)c.visible=!c.visible},
    addColumn:(s,a)=>{s.columns.push(a.payload)},
    setSort:(s,a)=>{s.sort=a.payload},
    setSearch:(s,a)=>{s.search=a.payload},
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when changing page size
    },
    setTotal: (state, action) => {
      state.pagination.total = action.payload;
    }
  }
})

export const { addRow, setRows, updateRow, deleteRow, setColumns, toggleColumnVisibility, addColumn, setSort, setSearch, setCurrentPage, setPageSize, setTotal } = slice.actions
export default slice.reducer