import { create } from 'zustand'
import { registry } from '../core/parsers/index.js'
import { dbGetAll, dbSave, dbDelete } from '../core/storage/db.js'

export const useBookshelfStore = create((set, get) => ({
  books: [],
  loading: false,
  errors: {},

  // 从 IndexedDB 恢复（仅追加元数据，不覆盖已有数据）
  async restore() {
    set({ loading: true })
    try {
      const stored = await dbGetAll('books')
      const existingIds = new Set(get().books.map(b => b.id))

      // 只添加本地不存在的书籍（保留已有书籍的完整数据）
      const toAdd = stored
        .filter(b => !existingIds.has(b.id))
        .map(b => ({
          ...b,
          file: null,
          fileData: null,
          blobUrl: null,
          book: null,
          pdf: null,
          needsReload: true,
        }))

      if (toAdd.length > 0) {
        set(state => ({ books: [...toAdd, ...state.books] }))
      }
      set({ loading: false })
    } catch (err) {
      console.error('Restore error:', err)
      set({ loading: false })
    }
  },

  // 导入单本书籍
  async addBook(file) {
    const parser = registry.getByFile(file)
    if (!parser) {
      set(state => ({ errors: { ...state.errors, [file.name]: '不支持的格式' } }))
      return null
    }

    try {
      const bookData = await parser.parse(file)

      // 避免重复
      const exists = get().books.find(b => b.title === bookData.title && b.format === bookData.format)
      if (exists) return null

      set(state => ({ books: [bookData, ...state.books] }))

      // 异步保存元数据（排除不可序列化的对象）
      const { file: _f, fileData, book: _b, pdf: _p, images: _i, blobUrl: _bl, ...meta } = bookData
      dbSave('books', { ...meta, fileId: bookData.id }).catch(() => {})

      return bookData
    } catch (err) {
      console.error(`Parse error (${file.name}):`, err)
      set(state => ({
        errors: { ...state.errors, [file.name]: err.message || '解析失败' }
      }))
      return null
    }
  },

  // 批量导入
  async addFiles(files) {
    const results = []
    for (const file of files) {
      const result = await get().addBook(file)
      if (result) results.push(result)
    }
    return results
  },

  // 清除错误
  clearError(fileName) {
    set(state => {
      const errors = { ...state.errors }
      delete errors[fileName]
      return { errors }
    })
  },

  // 移除书籍
  removeBook(id) {
    set(state => ({ books: state.books.filter(b => b.id !== id) }))
    dbDelete('books', id).catch(() => {})
  },

  // 获取书籍
  getBook(id) {
    return get().books.find(b => b.id === id)
  },
}))
