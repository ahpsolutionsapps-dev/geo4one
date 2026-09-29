import PDFDocument from 'pdfkit';

export interface PdfReportInput {
  title: string;
  headers: string[];
  rows: string[][];
}

const MIN_ROW_HEIGHT = 20;
const CELL_PADDING = 8;

function formatCellValue(value: unknown): string {
  if (value == null) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? 'Si' : 'No';
  }

  return String(value);
}

export function normalizeReportRows(
  rows: Array<Array<string | number | boolean | null>>,
): string[][] {
  return rows.map((row) => row.map((cell) => formatCellValue(cell)));
}

export async function generatePdfReportBuffer(input: PdfReportInput): Promise<Buffer> {
  const { title, headers, rows } = input;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 40,
      size: 'A4',
      layout: 'landscape',
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
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

    const measureRowHeight = (cells: string[], fontSize: number): number => {
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

    const ensureSpaceForDataRow = (rowHeight: number) => {
      if (y + rowHeight <= bottomLimit()) {
        return;
      }

      doc.addPage();
      y = doc.page.margins.top;
      drawHeaderRow();
    };

    const drawDataRow = (cells: string[], striped: boolean) => {
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
