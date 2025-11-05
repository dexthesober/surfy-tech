import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleColumnVisibility, addColumn } from "../store/tableSlice";
import {
    Box,
    Modal,
    Typography,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
export default function ManageColumnsModal({ open, onClose }) {
    const dispatch = useDispatch();
    const columns = useSelector((s) => s.table.columns);
    const [newField, setNewField] = React.useState("");
    const addNew = () => {
        const key = newField.trim().toLowerCase().replace(/\s+/g, "_");
        if (!key) return;
        dispatch(addColumn({ key, label: newField.trim(), visible: true }));
        setNewField("");
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 400,
                    bgcolor: "background.paper",
                    p: 3,
                    m: "10vh auto",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6">Manage Columns</Typography>
                {columns.map((c) => (
                    <FormControlLabel
                        key={c.key}
                        control={
                            <Checkbox
                                checked={c.visible}
                                onChange={() =>
                                    dispatch(toggleColumnVisibility(c.key))
                                }
                            />
                        }
                        label={c.label}
                    />
                ))}
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <TextField
                        fullWidth
                        value={newField}
                        onChange={(e) => setNewField(e.target.value)}
                        placeholder="Department"
                    />
                    <Button variant="contained" onClick={addNew}>
                        Add
                    </Button>
                </Box>
                <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                    <Button onClick={onClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
}
