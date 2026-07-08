/**
 * 格式解析器集合入口
 * 一个 import 即可注册全部解析器
 */
import registry from './registry.js'
import { epubParser } from './epub.js'
import { pdfParser } from './pdf.js'
import { txtParser } from './txt.js'
import { markdownParser } from './markdown.js'
import { cbzParser } from './cbz.js'
import { htmlParser } from './html.js'

// 注册全部解析器
registry.register(epubParser)
registry.register(pdfParser)
registry.register(txtParser)
registry.register(markdownParser)
registry.register(cbzParser)
registry.register(htmlParser)

export { registry }
export { epubParser, pdfParser, txtParser, markdownParser, cbzParser, htmlParser }
