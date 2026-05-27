export function downloadCsv(filename: string, rows: string[][]) {
  const escape = (value: string) => {
    const normalized = value.replace(/"/g, '""');
    return `"${normalized}"`;
  };

  const content = rows.map((row) => row.map((cell) => escape(String(cell ?? ""))).join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
