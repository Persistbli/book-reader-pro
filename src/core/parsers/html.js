async function parseHtml(file) {
  const text = await file.text()

  // 提取标题
  const titleMatch = text.match(/<title[^>]*>(.*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1] : file.name.replace(/\.(html?|xhtml)$/i, '')

  // 提取 body 内容
  const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  const body = bodyMatch ? bodyMatch[1] : text

  return {
    id: crypto.randomUUID(),
    title,
    author: '未知作者',
    format: 'html',
    file,
    fileData: text,
    html: body,
    chapters: [{
      index: 0,
      id: 'html-body',
      title,
      content: body,
    }],
    cover: null,
  }
}

export const htmlParser = {
  id: 'html',
  name: 'HTML Reader',
  extensions: ['html', 'htm', 'xhtml'],
  parse: parseHtml,
}
