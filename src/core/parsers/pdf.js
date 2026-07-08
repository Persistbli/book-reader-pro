import * as pdfjsLib from 'pdfjs-dist'

// 使用 CDN worker（更稳定）
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs'

async function parsePdf(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const totalPages = pdf.numPages

  // 获取元数据
  let title = file.name.replace(/\.pdf$/i, '')
  let author = '未知作者'
  try {
    const meta = await pdf.getMetadata()
    title = meta.info?.Title || title
    author = meta.info?.Author || author
  } catch (_) {}

  // 生成章节（每页为一章）
  const chapters = []
  for (let i = 1; i <= totalPages; i++) {
    chapters.push({ index: i - 1, id: `page-${i}`, title: `第 ${i} 页` })
  }

  // 尝试获取目录
  try {
    const outline = await pdf.getOutline()
    if (outline && outline.length > 0) {
      const flatten = (items, result = []) => {
        items.forEach(item => {
          const dest = item.dest
          let pageNum = 1
          if (typeof dest === 'string') pageNum = 1
          else if (Array.isArray(dest) && dest.length > 0) {
            if (typeof dest[0] === 'number') pageNum = dest[0]
            else if (dest[0]?.num !== undefined) pageNum = dest[0].num
            else if (dest[0]?.gen !== undefined) pageNum = 1
          }
          result.push({ index: pageNum - 1, id: `outline-${result.length}`, title: item.title, page: pageNum })
          if (item.items) flatten(item.items, result)
        })
        return result
      }
      chapters.length = 0
      flatten(outline, chapters)
    }
  } catch (_) {}

  return {
    id: crypto.randomUUID(),
    title,
    author,
    format: 'pdf',
    file,
    fileData: arrayBuffer,
    pdf,
    totalPages,
    chapters,
    cover: null,
  }
}

export const pdfParser = {
  id: 'pdf',
  name: 'PDF Reader',
  extensions: ['pdf'],
  parse: parsePdf,
}
