import JSZip from 'jszip'

async function parseCbz(file) {
  const arrayBuffer = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(arrayBuffer)

  // 获取所有图片文件
  const imageFiles = []
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']

  zip.forEach((relativePath, zipEntry) => {
    const ext = relativePath.split('.').pop().toLowerCase()
    if (!zipEntry.dir && imageExts.includes(ext)) {
      imageFiles.push({ path: relativePath, entry: zipEntry })
    }
  })

  // 排序
  imageFiles.sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }))

  // 加载图片数据
  const images = []
  for (const img of imageFiles) {
    const data = await img.entry.async('base64')
    const ext = img.path.split('.').pop().toLowerCase()
    const mime = ext === 'jpg' ? 'jpeg' : ext
    images.push({
      path: img.path,
      src: `data:image/${mime};base64,${data}`,
      index: images.length,
    })
  }

  return {
    id: crypto.randomUUID(),
    title: file.name.replace(/\.(cbz|zip)$/i, ''),
    author: '未知作者',
    format: 'cbz',
    file,
    fileData: arrayBuffer,
    images,
    chapters: images.map(img => ({
      index: img.index,
      id: `img-${img.index}`,
      title: `第 ${img.index + 1} 页`,
      src: img.src,
    })),
    totalPages: images.length,
    cover: images.length > 0 ? images[0].src : null,
  }
}

export const cbzParser = {
  id: 'cbz',
  name: 'CBZ Comic Reader',
  extensions: ['cbz', 'zip'],
  parse: parseCbz,
}
