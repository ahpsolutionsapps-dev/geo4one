"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeReportRows = normalizeReportRows;
exports.generatePdfReportBuffer = generatePdfReportBuffer;
const pdfkit_1 = __importDefault(require("pdfkit"));
const MIN_ROW_HEIGHT = 20;
const CELL_PADDING = 8;
function formatCellValue(value) {
    if (value == null) {
        return '';
    }
    if (typeof value === 'boolean') {
        return value ? 'Si' : 'No';
    }
    return String(value);
}
function normalizeReportRows(rows) {
    return rows.map((row) => row.map((cell) => formatCellValue(cell)));
}
async function generatePdfReportBuffer(input) {
    const { title, headers, rows } = input;
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default({
            margin: 40,
            size: 'A4',
            layout: 'landscape',
        });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
        doc.fontSize(16).text(title, { align: 'left' });
        doc.moveDown(0.5);
        doc
            .fontSize(10)
            .fillColor('#4b5563')
            .text(`Generado: ${new Date().toLocaleString('es')}`, { align: 'left' });
        doc.text(`Registros: ${rows.length}`, { align: 'left' });
        doc.moveDown(1);
        doc.fillColor('#111827');
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const columnWidth = pageWidth / headers.length;
        const bottomLimit = () => doc.page.height - doc.page.margins.bottom;
        let y = doc.y;
        const measureRowHeight = (cells, fontSize) => {
            doc.fontSize(fontSize);
            let maxHeight = MIN_ROW_HEIGHT;
            cells.forEach((cell) => {
                const contentHeight = doc.heightOfString(cell, {
                    width: columnWidth - CELL_PADDING,
                });
                maxHeight = Math.max(maxHeight, contentHeight + CELL_PADDING);
            });
            return maxHeight;
        };
        const drawHeaderRow = () => {
            const rowHeight = measureRowHeight(headers, 9);
            if (y + rowHeight > bottomLimit()) {
                doc.addPage();
                y = doc.page.margins.top;
            }
            doc.rect(doc.page.margins.left, y, pageWidth, rowHeight).fill('#1e40af');
            doc.fillColor('#ffffff').fontSize(9);
            headers.forEach((cell, index) => {
                doc.text(cell, doc.page.margins.left + index * columnWidth + 4, y + 4, {
                    width: columnWidth - CELL_PADDING,
                });
            });
            y += rowHeight;
            doc.fillColor('#111827');
        };
        const ensureSpaceForDataRow = (rowHeight) => {
            if (y + rowHeight <= bottomLimit()) {
                return;
            }
            doc.addPage();
            y = doc.page.margins.top;
            drawHeaderRow();
        };
        const drawDataRow = (cells, striped) => {
            const rowHeight = measureRowHeight(cells, 8);
            ensureSpaceForDataRow(rowHeight);
            if (striped) {
                doc.rect(doc.page.margins.left, y, pageWidth, rowHeight).fill('#f5f7fa');
            }
            doc.fillColor('#111827').fontSize(8);
            cells.forEach((cell, index) => {
                doc.text(cell, doc.page.margins.left + index * columnWidth + 4, y + 4, {
                    width: columnWidth - CELL_PADDING,
                });
            });
            y += rowHeight;
        };
        drawHeaderRow();
        rows.forEach((row, index) => {
            drawDataRow(row, index % 2 === 1);
        });
        doc.end();
    });
}
//# sourceMappingURL=pdf-report.generator.js.map