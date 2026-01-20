function processFile() {
    const fileInput = document.getElementById("fileInput");
    const columnInput = document.getElementById("columnInput");
    const result = document.getElementById("result");

    const file = fileInput.files[0];
    const columnName = columnInput.value.trim();

    if (!file) {
        alert("Upload a CSV file");
        return;
    }

    if (!columnName) {
        alert("Enter column name");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const rows = e.target.result.trim().split(/\r?\n/);
        const headers = rows[0].split(",");
        const colIndex = headers.indexOf(columnName);

        if (colIndex === -1) {
            alert("Column not found");
            return;
        }

        const seen = new Set();
        const output = [rows[0]];

        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(",");
            const value = (cols[colIndex] || "").toLowerCase().trim();

            if (!seen.has(value)) {
                seen.add(value);
                output.push(rows[i]);
            }
        }

        downloadCSV(output.join("\n"));
        result.innerText = `✅ Duplicates removed: ${rows.length - output.length}`;
    };

    reader.readAsText(file);
}

function downloadCSV(data) {
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cleaned_data.csv";
    a.click();

    URL.revokeObjectURL(url);
}

document.getElementById("btn").addEventListener("click", processFile);

