import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSort, setSearch, updateRow, deleteRow } from "../store/tableSlice";
import { exportCSV, parseCSV } from "../utils/csv";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    TablePagination,
    TextField,
    IconButton,
    Button,
    Toolbar,
    Typography,
    Box,
} from "@mui/material";
import ManageColumnsModal from "./ManageColumnsModal";
import {
    Edit,
    Delete,
    FileUpload,
    Download,
    Save,
    Cancel,
} from "@mui/icons-material";

export default function DataTable() {
    const dispatch = useDispatch();
    const { rows, columns, sort, search } = useSelector((s) => s.table);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(10);
    const [colModalOpen, setColModalOpen] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [editData, setEditData] = React.useState({});
    const[rawModalOpen, setRawModalOpen]=React.useState(false)

    const visibleCols = columns.filter((c) => c.visible);

    const filtered = React.useMemo(() => {
        const q = (search || "").toLowerCase();
        let list = rows.filter(
            (r) =>
                !q ||
                Object.keys(r).some((k) =>
                    String(r[k] ?? "")
                        .toLowerCase()
                        .includes(q)
                )
        );
        if (sort.key) {
            list = list.slice().sort((a, b) => {
                const av = a[sort.key] ?? "";
                const bv = b[sort.key] ?? "";
                if (av < bv) return sort.dir === "asc" ? -1 : 1;
                if (av > bv) return sort.dir === "asc" ? 1 : -1;
                return 0;
            });
        }
        return list;
    }, [rows, search, sort]);

    const handleSort = (key) => {
        if (sort.key === key)
            dispatch(
                setSort({ key, dir: sort.dir === "asc" ? "desc" : "asc" })
            );
        else dispatch(setSort({ key, dir: "asc" }));
    };

    const handleFile = async (e) => {
        const f = e.target.files[0];
        if (!f) return;
        try {
            const res = await parseCSV(f);
            if (!res || !res.data) return alert("Invalid CSV");
            const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
            const parsed = res.data.map((r, i) => ({ id: nextId + i, ...r }));
            dispatch({ type: "table/setRows", payload: parsed });
        } catch {
            alert("CSV parse error");
        }
    };

    const handleExport = () =>
        exportCSV(
            filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
            columns
        );
    const handleChangePage = (e, newPage) => setPage(newPage);

    const startEditing = () => {
        setEditMode(true);
        const buffer = {};
        rows.forEach((r) => (buffer[r.id] = { ...r }));
        setEditData(buffer);
    };
    const cancelEditing = () => {
        setEditMode(false);
        setEditData({});
    };
    const saveAll = () => {
        Object.entries(editData).forEach(([id, data]) => {
            dispatch(updateRow({ id: Number(id), changes: data }));
        });
        setEditMode(false);
        setEditData({});
    };
    const handleEditChange = (id, key, val) => {
        setEditData((prev) => ({ ...prev, [id]: { ...prev[id], [key]: val } }));
    };

    const validate = (key, val) => {
        if (key === "age") return /^\d+$/.test(val);
        if (key === "email") return val.includes("@");
        return true;
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Toolbar
                sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "space-between"
                    ,
                
                }}
            >
                <Typography variant="h6">Users</Typography>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", padding:"5px", borderRadius:"5px" }}>
                    {editMode ? (
                        <>
                            <Button
                                color="success"
                                startIcon={<Save />}
                                onClick={saveAll}
                            >
                                Save All
                            </Button>
                          
                            <Button
                                color="error"
                                startIcon={<Cancel />}
                                onClick={cancelEditing} >
                                Cancel All </Button>
                        </>
                    ) : (
                        <Button startIcon={<Edit />} onClick={startEditing}>
                            Edit
                        </Button>
                    )}
                    <TextField
                        size="small"
                        placeholder="Global search"
                        value={search}
                        onChange={(e) => dispatch(setSearch(e.target.value))}
                    />
                    
                    <Button
                        startIcon={<Download />}
                        variant="outlined"
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                    <label>
                        <input
                            type="file"
                            accept=".csv"
                            style={{ display: "none" }}
                            onChange={handleFile}
                        />
                        <Button startIcon={<FileUpload />} variant="contained">
                            Import
                        </Button>
                    </label>
                    <Button
                        variant="outlined"
                        onClick={() => setColModalOpen(true)}
                    >
                        Manage Columns
                    </Button>
                    <Button
                        startIcon={<Download />}
                        variant="outlined"
                        onClick={() => setRawModalOpen(true)}
                    >
                        fillData
                    </Button>
                </Box>
            </Toolbar>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {visibleCols.map((c) => (
                                <TableCell
                                    key={c.key}
                                    onClick={() => handleSort(c.key)}
                                    sx={{ cursor: "pointer" }}
                                >
                                    {c.label}
                                </TableCell>
                            ))}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered
                            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                            .map((row) => (
                                <TableRow key={row.id}>
                                    {visibleCols.map((c) => (
                                        <TableCell key={c.key}>
                                            {editMode ? (
                                                <input
                                                    style={{
                                                        width: "100%",
                                                        border: "none",
                                                        outline: "none",
                                                        background:
                                                            "transparent",
                                                    }}
                                                    value={
                                                        editData[row.id]?.[
                                                            c.key
                                                        ] ?? ""
                                                    }
                                                    onChange={(e) => {
                                                        const v =
                                                            e.target.value;
                                                        if (validate(c.key, v))
                                                            handleEditChange(
                                                                row.id,
                                                                c.key,
                                                                v
                                                            );
                                                    }}
                                                />
                                            ) : (
                                                row[c.key]
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <IconButton
                                            onClick={() =>
                                                dispatch(deleteRow(row.id))
                                            }
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
            />
            <ManageColumnsModal
                open={colModalOpen}
                onClose={() => setColModalOpen(false)}
            />
        </Paper>
    );
}
