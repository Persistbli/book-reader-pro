import ePub from 'epubjs'

async function parseEpub(file) {
  // 使用 Blob URL 而不是 ArrayBuffer — epub.js 0.3.x 对 Blob URL 支持最稳定
  const blobUrl = URL.createObjectURL(file)

  try {
    const book = ePub(blobUrl)
    await book.ready

    const metadata = book.packaging?.metadata || {}
    const spine = book.spine || {}
    const toc = book.navigation || book.toc || []

    const title = metadata.title || file.name.replace(/\.epub$/i, '')
    const author = metadata.creator || '未知作者'

    // 获取封面
    let cover = null
    try {
      if (book.cover) cover = await book.coverUrl()
    } catch (_) { /* ignore */ }

    // 构建章节目录
    const chapters = []
    if (spine.items) {
      spine.items.forEach((item, idx) => {
        const tocEntry = toc.find(t => t.href?.includes(item.idref))
        chapters.push({
          index: idx,
          id: item.idref || `chapter-${idx}`,
          title: tocEntry?.label || `第${idx + 1}章`,
        })
      })
    }

    // 保存 ArrayBuffer 用于持久化（如果以后需要）
    const arrayBuffer = await file.arrayBuffer()

    return {
      id: crypto.randomUUID(),
      title,
      author,
      format: 'epub',
      blobUrl,
      file,
      fileData: arrayBuffer,
      book,
      cover,
      spine,
      toc,
      chapters,
    }
  } catch (err) {
    URL.revokeObjectURL(blobUrl)
    throw new Error(`EPUB 解析失败: ${err.message}`)
  }
}

export const epubParser = {
  id: 'epub',
  name: 'EPUB Reader',
  extensions: ['epub'],
  parse: parseEpub,
}
