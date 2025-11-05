import React from "react";
import DataTable from "../components/DataTable";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { green } from "@mui/material/colors";
export default function Home({ themeMode, setThemeMode }) {
    return (
        <Container sx={{ mt: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <button
                    style={{
                        borderRadius: "4px",
                        padding: "6px 12px",
                        background: themeMode === "light" ? "#000000ff" : "",
                        color: themeMode === "light" ? "#ffffff" : "",
                    }}
                    onClick={() =>
                        setThemeMode(themeMode === "light" ? "dark" : "light")
                    }
                >
                    {" "}
                    {themeMode === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"}
                </button>
            </Box>
            <DataTable />
        </Container>
    );
}
