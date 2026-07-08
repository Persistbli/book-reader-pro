/**
 * Parser Registry — 格式解析器注册中心
 * 每个解析器是独立模块，通过 register() 注入
 * 新格式只需新建一个 parser 模块并注册
 */
class ParserRegistry {
  constructor() {
    this.parsers = new Map()
    this.extensions = new Map()
  }

  register(parser) {
    if (!parser.id || !parser.name) {
      throw new Error('Parser must have "id" and "name"')
    }
    this.parsers.set(parser.id, parser)
    parser.extensions.forEach(ext => {
      this.extensions.set(ext.toLowerCase(), parser.id)
    })
  }

  getById(id) {
    return this.parsers.get(id)
  }

  getByExtension(ext) {
    const id = this.extensions.get(ext.toLowerCase())
    return id ? this.parsers.get(id) : null
  }

  getByFile(file) {
    const ext = file.name.split('.').pop().toLowerCase()
    return this.getByExtension(ext)
  }

  getAll() {
    return [...this.parsers.values()]
  }

  canParse(file) {
    return this.getByFile(file) !== undefined
  }
}

export const registry = new ParserRegistry()
export default registry
