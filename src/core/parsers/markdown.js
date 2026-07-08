import { marked } from 'marked'

async function parseMarkdown(file) {
  const text = await file.text()
  const html = marked.parse(text)

  // 按标题拆分章节
  const lines = text.split(/\r?\n/)
  const chapters = []
  let currentTitle = file.name.replace(/\.(md|markdown)$/i, '')
  let currentContent = []

  for (const line of lines) {
    if (/^#{1,3}\s+/.test(line.trim())) {
      if (currentContent.length > 0) {
        chapters.push({
          index: chapters.length,
          id: `md-${chapters.length}`,
          title: currentTitle,
          content: marked.parse(currentContent.join('\n')),
        })
      }
      currentTitle = line.trim().replace(/^#{1,3}\s+/, '')
      currentContent = []
    } else {
      currentContent.push(line)
    }
  }

  if (currentContent.length > 0 || chapters.length === 0) {
    chapters.push({
      index: chapters.length,
      id: `md-${chapters.length}`,
      title: currentTitle,
      content: chapters.length === 0 ? html : marked.parse(currentContent.join('\n')),
    })
  }

  return {
    id: crypto.randomUUID(),
    title: chapters.length > 0 ? chapters[0].title : file.name.replace(/\.(md|markdown)$/i, ''),
    author: '未知作者',
    format: 'markdown',
    file,
    fileData: text,
    html,
    chapters,
    cover: null,
  }
}

export const markdownParser = {
  id: 'markdown',
  name: 'Markdown Reader',
  extensions: ['md', 'markdown'],
  parse: parseMarkdown,
}
