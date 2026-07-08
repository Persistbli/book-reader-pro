import { create } from 'zustand'
import { registry } from '../core/parsers/index.js'
import { dbGetAll, dbSave, dbDelete } from '../core/storage/db.js'

export const useBookshelfStore = create((set, get) => ({
  books: [],
  loading: false,

  // 从 IndexedDB 恢复
  async restore() {
    set({ loading: true })
    try {
      const stored = await dbGetAll('books')
      // 只恢复元数据（不恢复文件引用，文件需重新导入）
      const books = stored.map(b => ({
        ...b,
        file: null,
        fileData: null,
        book: null,
        pdf: null,
        needsReload: true,
      }))
      set({ books, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  // 导入书籍
  async addBook(file) {
    const parser = registry.getByFile(file)
    if (!parser) return null

    try {
      const bookData = await parser.parse(file)
      set(state => {
        // 避免重复
        const exists = state.books.find(b => b.title === bookData.title)
        if (exists) return state
        const books = [bookData, ...state.books]

        // 异步保存元数据
        const { file, fileData, book, pdf, ...meta } = bookData
        dbSave('books', { ...meta, fileId: bookData.id })

        return { books }
      })
      return bookData
    } catch (err) {
      console.error('Parse error:', err)
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

  // 移除书籍
  removeBook(id) {
    set(state => ({ books: state.books.filter(b => b.id !== id) }))
    dbDelete('books', id)
  },

  // 获取书籍
  getBook(id) {
    return get().books.find(b => b.id === id)
  },
}))
