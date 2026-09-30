import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, BorderStyle } from 'docx'
import type { Report } from './report'

/** Renders "**bold**" fragments inside a line as bold runs. */
function runs(text: string, rtl: boolean): TextRun[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map(part => {
    const bold = part.startsWith('**') && part.endsWith('**')
    return new TextRun({ text: bold ? part.slice(2, -2) : part, bold, rightToLeft: rtl, font: rtl ? 'Vazir' : 'Calibri' })
  })
}

export async function reportToDocx(r: Report, rtl: boolean): Promise<Blob> {
  const align = rtl ? AlignmentType.RIGHT : AlignmentType.LEFT
  const P = (text: string, opts: Partial<{ heading: (typeof HeadingLevel)[keyof typeof HeadingLevel]; bullet: boolean; muted: boolean }> = {}) =>
    new Paragraph({ children: runs(text, rtl), heading: opts.heading, bidirectional: rtl, alignment: align, bullet: opts.bullet ? { level: 0 } : undefined, spacing: { after: 80 } })
  const children: (Paragraph | Table)[] = [P(r.title, { heading: HeadingLevel.TITLE }), P(r.subtitle)]
  for (const s of r.sections) {
    if (s.title) children.push(P(s.title, { heading: HeadingLevel.HEADING_1 }))
    for (const b of s.blocks) {
      if (b.kind === 'p') children.push(P(b.text))
      else if (b.kind === 'bullets') children.push(...b.items.map(i => P(i, { bullet: true })))
      else {
        const cell = (text: string, head = false) => new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text, bold: head, rightToLeft: rtl, font: rtl ? 'Vazir' : 'Calibri', size: 18 })], bidirectional: rtl, alignment: align })],
          shading: head ? { fill: '101114', color: 'FFFFFF' } : undefined,
        })
        children.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          visuallyRightToLeft: rtl,
          borders: { top: { style: BorderStyle.SINGLE, size: 4, color: 'DEDFE4' }, bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DEDFE4' }, left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'DEDFE4' }, insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' } },
          rows: [new TableRow({ tableHeader: true, children: b.header.map(h => cell(h, true)) }), ...b.rows.map(row => new TableRow({ children: row.map(c => cell(c || '')) }))],
        }), P(''))
      }
    }
  }
  children.push(P(r.footer))
  const doc = new Document({
    creator: 'Meeting RunBook', title: r.title,
    styles: { default: { document: { run: { font: rtl ? 'Vazir' : 'Calibri', size: 22 } } } },
    sections: [{ properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } }, children }],
  })
  return Packer.toBlob(doc)
}
