import fs from 'fs';

const inputFile = './idb_mathangduocdat.sql';
const outputFile = './idb_mathangduocdat.csv';

const sql = fs.readFileSync(inputFile, 'utf8');

const insertRegex = /INSERT\s+INTO\s+\w+\s*\(([^)]+)\)\s*VALUES\s*(.+);/is;
const match = sql.match(insertRegex);
if (!match) {
    console.error('Không tìm thấy cú pháp INSERT hợp lệ!');
    process.exit(1);
}

const columns = match[1].split(',').map(c => c.trim());
const valuesBlock = match[2].trim();

const rows = [];
let parenLevel = 0;
let current = '';
for (let i = 0; i < valuesBlock.length; i++) {
    const char = valuesBlock[i];
    if (char === '(') {
        if (parenLevel === 0) current = '';
        parenLevel++;
    }
    if (parenLevel > 0) current += char;
    if (char === ')') {
        parenLevel--;
        if (parenLevel === 0) {
            rows.push(current.slice(1, -1)); 
            current = '';
        }
    }
}

function splitRow(row) {
    const result = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if ((char === "'" || char === '"') && !inQuote) {
            inQuote = true;
            quoteChar = char;
            current += char;
        } else if (char === quoteChar && inQuote) {
            inQuote = false;
            current += char;
        } else if (char === ',' && !inQuote) {
            result.push(current.trim().replace(/^['"]|['"]$/g, ''));
            current = '';
        } else {
            current += char;
        }
    }
    if (current.length > 0)
        result.push(current.trim().replace(/^['"]|['"]$/g, ''));
    return result;
}

const output = [];
output.push(columns.join(','));

rows.forEach(row => {
    const fields = splitRow(row);
    const csvFields = fields.map(f =>
        /[",\n]/.test(f)
            ? `"${f.replace(/"/g, '""')}"`
            : f
    );
    output.push(csvFields.join(','));
});

fs.writeFileSync(outputFile, output.join('\n'), 'utf8');
console.log('Đã chuyển thành công sang file CSV:', outputFile);