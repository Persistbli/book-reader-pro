// 章节识别正则（支持多种格式）
const CHAPTER_PATTERNS = [
  /^第[0-9零一二三四五六七八九十百千万]+[章节卷部回篇集].*/,
  /^[Cc][Hh][Aa][Pp][Tt][Ee][Rr]\s+[0-9IVXivx]+.*/,
  /^[0-9]+[\.、\s]+.*/,
  /^[序前言后记尾声终章尾声]+.*/,
  /^(Volume|Part|Book|Act|Section)\s+[0-9IVXivx]+/i,
]

function detectEncoding(buffer) {
  // 简单编码检测
  const bytes = new Uint8Array(buffer)
  if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) return 'UTF-8'
  if (bytes[0] === 0xFF && bytes[1] === 0xFE) return 'UTF-16LE'
  if (bytes[0] === 0xFE && bytes[1] === 0xFF) return 'UTF-16BE'
  return 'UTF-8'
}

function isChapterLine(line) {
  const trimmed = line.trim()
  if (trimmed.length === 0) return false
  if (trimmed.length > 40) return false
  return CHAPTER_PATTERNS.some(p => p.test(trimmed))
}

async function parseTxt(file) {
  const encodings = ['UTF-8', 'GBK', 'GB2312', 'BIG5']
  let text = ''
  let usedEncoding = 'UTF-8'

  for (const enc of encodings) {
    try {
      const buf = await file.arrayBuffer()
      const decoder = new TextDecoder(enc, { fatal: false })
      const decoded = decoder.decode(buf)

      // 简单判断是否有乱码（中文字符比例）
      const chineseChars = (decoded.match(/[\u4e00-\u9fff]/g) || []).length
      const totalChars = decoded.length
      if (chineseChars > 0 && chineseChars / Math.max(totalChars - decoded.split('\n').length, 1) > 0.01) {
        text = decoded
        usedEncoding = enc
        break
      }
      // 如果是第一次尝试，保存结果
      if (enc === 'UTF-8' && decoded.length > 0) {
        text = decoded
        usedEncoding = enc
      }
    } catch (_) {}
  }

  const lines = text.split(/\r?\n/)
  const chapters = []
  let currentTitle = '正文开始'
  let currentLines = []
  let foundFirstChapter = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (isChapterLine(line)) {
      if (!foundFirstChapter && currentLines.length > 0) {
        chapters.push({
          index: chapters.length,
          id: `intro-0`,
          title: currentTitle,
          content: currentLines.join('\n'),
        })
        currentLines = []
      }
      foundFirstChapter = true
      if (currentLines.length > 0) {
        chapters.push({
          index: chapters.length,
          id: `ch-${chapters.length}`,
          title: currentTitle,
          content: currentLines.join('\n'),
        })
      }
      currentTitle = line.trim()
      currentLines = []
    } else {
      currentLines.push(line)
    }
  }

  if (currentLines.length > 0) {
    chapters.push({
      index: chapters.length,
      id: `ch-${chapters.length}`,
      title: currentTitle,
      content: currentLines.join('\n'),
    })
  }

  // 如果没找到任何章节，整个文件作为一章
  if (chapters.length === 0) {
    chapters.push({
      index: 0,
      id: 'ch-1',
      title: file.name.replace(/\.txt$/i, ''),
      content: text,
    })
  }

  const title = chapters.length > 1
    ? file.name.replace(/\.txt$/i, '')
    : chapters[0]?.title || file.name.replace(/\.txt$/i, '')

  return {
    id: crypto.randomUUID(),
    title,
    author: '未知作者',
    format: 'txt',
    file,
    fileData: text,
    encoding: usedEncoding,
    chapters,
    cover: null,
    totalChars: text.length,
  }
}

export const txtParser = {
  id: 'txt',
  name: 'TXT Reader',
  extensions: ['txt'],
  parse: parseTxt,
}
