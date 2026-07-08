import ePub from 'epubjs'

function parseEpub(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const book = ePub(e.target.result)
        const metadata = book.packaging.metadata || {}
        const spine = book.spine || {}
        const toc = book.navigation || book.toc || []

        const title = metadata.title || file.name.replace('.epub', '')
        const author = metadata.creator || '未知作者'

        let cover = null
        if (book.cover) {
          try {
            cover = await book.coverUrl()
          } catch (_) { cover = null }
        }

        resolve({
          id: crypto.randomUUID(),
          title,
          author,
          format: 'epub',
          file,
          fileData: e.target.result,
          book,
          cover,
          spine,
          toc,
          chapters: spine.items ? spine.items.map((item, idx) => ({
            index: idx,
            id: item.idref || `chapter-${idx}`,
            title: toc.find(t => t.href?.includes(item.idref))?.label || `第${idx + 1}章`,
          })) : [],
        })
      } catch (err) { reject(err) }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export const epubParser = {
  id: 'epub',
  name: 'EPUB Reader',
  extensions: ['epub'],
  parse: parseEpub,
}
