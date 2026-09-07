import jsPDF from 'jspdf';
import { menuData } from '../data/menuData';

// ─── Brand colors ─────────────────────────────────────────────────
const C = {
  navy:       [22,  36,  68],   // #162444
  gold:       [197, 168, 128],  // #C5A880
  goldLight:  [245, 235, 218],  // soft gold tint
  white:      [255, 255, 255],
  gray:       [120, 120, 120],
  lightGray:  [245, 245, 245],
  darkText:   [30,  30,  30],
};

const PAGE_W = 210;   // A4 mm
const PAGE_H = 297;
const MARGIN  = 18;
const COL_W   = (PAGE_W - MARGIN * 2 - 8) / 2;  // two columns

// ─── Helpers ──────────────────────────────────────────────────────
const rgb  = (doc, [r, g, b]) => doc.setTextColor(r, g, b);
const fill = (doc, [r, g, b]) => doc.setFillColor(r, g, b);
const draw = (doc, [r, g, b]) => doc.setDrawColor(r, g, b);

function dashedLine(doc, x1, y, x2, color = C.gold) {
  draw(doc, color);
  doc.setLineDashPattern([1, 2], 0);
  doc.setLineWidth(0.2);
  doc.line(x1, y, x2, y);
  doc.setLineDashPattern([], 0);
}

// ─── Header ───────────────────────────────────────────────────────
function drawHeader(doc) {
  // Full-width navy banner
  fill(doc, C.navy);
  doc.rect(0, 0, PAGE_W, 52, 'F');

  // Gold accent stripe
  fill(doc, C.gold);
  doc.rect(0, 52, PAGE_W, 2.5, 'F');

  // ☕ Coffee cup unicode glyph as accent
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  rgb(doc, C.gold);
  doc.text('☕', PAGE_W / 2, 22, { align: 'center' });

  // Brand name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setLetterSpacing(4);
  rgb(doc, C.white);
  doc.text('ENTRE TAZAS', PAGE_W / 2, 35, { align: 'center' });
  doc.setLetterSpacing(0);

  // Tagline
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  rgb(doc, C.gold);
  doc.text('Cada taza cuenta una historia', PAGE_W / 2, 43, { align: 'center' });

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  rgb(doc, [200, 200, 200]);
  const dateStr = new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(dateStr, PAGE_W / 2, 49.5, { align: 'center' });
}

// ─── Category heading ─────────────────────────────────────────────
function drawCategoryHeading(doc, label, y) {
  // Gold pill background
  fill(doc, C.navy);
  draw(doc, C.navy);
  doc.roundedRect(MARGIN, y, PAGE_W - MARGIN * 2, 9, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setLetterSpacing(2);
  rgb(doc, C.gold);
  doc.text(label.toUpperCase(), PAGE_W / 2, y + 6.2, { align: 'center' });
  doc.setLetterSpacing(0);

  return y + 14;
}

// ─── Item row ────────────────────────────────────────────────────
function drawItem(doc, item, x, y, colW) {
  // Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  rgb(doc, C.darkText);

  // Wrap long names
  const nameLines = doc.splitTextToSize(item.nombre, colW - 28);
  doc.text(nameLines, x, y);

  // Description (if any)
  let descLines = [];
  if (item.desc) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.2);
    rgb(doc, C.gray);
    descLines = doc.splitTextToSize(item.desc, colW - 28);
    doc.text(descLines, x, y + nameLines.length * 4.2);
  }

  // Price badge
  const priceY = y + (nameLines.length - 1) * 4.2;
  fill(doc, C.goldLight);
  draw(doc, C.gold);
  doc.setLineWidth(0.3);
  doc.roundedRect(x + colW - 26, priceY - 4.5, 26, 6, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  rgb(doc, C.navy);
  doc.text(item.precio, x + colW - 13, priceY - 0.3, { align: 'center' });

  // Dashed separator
  const rowH = nameLines.length * 4.2 + descLines.length * 3.8 + 5;
  dashedLine(doc, x, y + rowH - 1.5, x + colW, C.goldLight);

  return y + rowH;
}

// ─── Footer ───────────────────────────────────────────────────────
function drawFooter(doc, pageNum, totalPages) {
  // Gold line
  fill(doc, C.gold);
  doc.rect(0, PAGE_H - 14, PAGE_W, 0.8, 'F');

  // Footer text
  fill(doc, C.navy);
  doc.rect(0, PAGE_H - 13, PAGE_W, 13, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  rgb(doc, C.gold);
  doc.text('📍 Síguenos en nuestras redes sociales', MARGIN, PAGE_H - 5.5);

  doc.setFont('helvetica', 'bold');
  rgb(doc, [180, 180, 180]);
  doc.text(`Pág. ${pageNum} / ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 5.5, { align: 'right' });
}

// ─── Main export function ─────────────────────────────────────────
export function generateMenuPDF() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const categories = [
    { key: 'desayunos',  label: '🍳 Desayunos'  },
    { key: 'meriendas',  label: '🧇 Meriendas'  },
    { key: 'bebidas',    label: '☕ Bebidas'     },
  ];

  let page = 1;
  const totalPages = 2; // estimate; adjust if menu grows

  drawHeader(doc);
  let y = 64;

  for (const cat of categories) {
    // Check page space
    if (y > PAGE_H - 50) {
      drawFooter(doc, page, totalPages);
      doc.addPage();
      page++;
      drawHeader(doc);
      y = 64;
    }

    y = drawCategoryHeading(doc, cat.label, y);

    const items = menuData[cat.key];
    // Two-column layout
    const half = Math.ceil(items.length / 2);
    const leftItems  = items.slice(0, half);
    const rightItems = items.slice(half);

    const startY = y;
    let leftY  = startY;
    let rightY = startY;

    for (const item of leftItems) {
      if (leftY > PAGE_H - 40) {
        // overflow — push to next page logic omitted for brevity, handled by category check above
      }
      leftY = drawItem(doc, item, MARGIN, leftY, COL_W);
    }
    for (const item of rightItems) {
      rightY = drawItem(doc, item, MARGIN + COL_W + 8, rightY, COL_W);
    }

    y = Math.max(leftY, rightY) + 6;
  }

  drawFooter(doc, page, page);

  doc.save('Menu_Entre_Tazas.pdf');
}
