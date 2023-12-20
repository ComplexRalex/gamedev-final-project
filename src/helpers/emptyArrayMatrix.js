export const emptyArrayMatrix = (numRows = 2, numCols = 3) => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        const row = [];
        for (let j = 0; j < numCols; j++) {
            row.push([]);
        }
        rows.push(row);
    }
    return rows;
}