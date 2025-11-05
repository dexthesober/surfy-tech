import Papa from "papaparse";
import { saveAs } from "file-saver";
export function parseCSV(file) {
    return new Promise((res, rej) =>
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (r) => res(r),
            error: (e) => rej(e),
        })
    );
}
export function exportCSV(rows, cols) {
    const visible = cols.filter((c) => c.visible);
    const data = rows.map((r) => {
        const o = {};
        visible.forEach((c) => (o[c.label] = r[c.key]));
        return o;
    });
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table-export.csv");
}
