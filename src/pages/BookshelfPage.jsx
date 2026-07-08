import { useEffect, useRef, useCallback, useState } from 'react'
import { useBookshelfStore } from '../stores/bookshelfStore.js'
import { useReaderStore } from '../stores/readerStore.js'
import BookCard from '../components/Bookshelf/BookCard.jsx'
import DropZone from '../components/common/DropZone.jsx'

export default function BookshelfPage() {
  const { books, loading, errors, restore, addFiles, removeBook, clearError } = useBookshelfStore()
  const setBook = useReaderStore(s => s.setBook)
  const fileInput = useRef(null)
  const [importing, setImporting] = useState(false)

  useEffect(() => { restore() }, [])

  const handleFiles = useCallback(async (files) => {
    const supported = files.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase()
      return ['epub', 'pdf', 'txt', 'md', 'markdown', 'cbz', 'html', 'htm'].includes(ext)
    })

    if (supported.length === 0) {
      // 全部不支持
      files.forEach(f => {
        useBookshelfStore.setState(s => ({
          errors: { ...s.errors, [f.name]: '不支持的格式' }
        }))
      })
      return
    }

    setImporting(true)
    try {
      await addFiles(supported)
    } finally {
      setImporting(false)
    }
  }, [addFiles])

  const handleOpen = (book) => {
    setBook(book)
  }

  return (
    <DropZone onFilesDrop={handleFiles} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">我的书架</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {books.length > 0 ? `${books.length} 本书 · 支持拖拽导入` : '拖拽文件到此处开始阅读'}
            </p>
          </div>
          <button
            onClick={() => fileInput.current?.click()}
            disabled={importing}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl
              font-medium text-sm transition-colors shadow-sm hover:shadow-md flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
            {importing ? '导入中...' : '导入书籍'}
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept=".epub,.pdf,.txt,.md,.markdown,.cbz,.html,.htm"
            className="hidden"
            onChange={e => {
              if (e.target.files.length > 0) handleFiles(Array.from(e.target.files))
              e.target.value = ''
            }}
          />
        </div>

        {/* Import errors */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 space-y-2">
            {Object.entries(errors).map(([name, msg]) => (
              <div key={name}
                className="flex items-center justify-between px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 dark:text-red-300 truncate">{name}</span>
                  <span className="text-red-500 dark:text-red-400 flex-shrink-0">— {msg}</span>
                </div>
                <button
                  onClick={() => clearError(name)}
                  className="ml-2 p-1 rounded hover:bg-red-200 dark:hover:bg-red-800/50 text-red-400 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && books.length === 0 && Object.keys(errors).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-xl font-semibold text-gray-400 dark:text-gray-500 mb-2">书架空空如也</p>
            <p className="text-gray-400 dark:text-gray-500 mb-6">拖拽电子书文件到此处，或点击上方按钮导入</p>
            <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-400 dark:text-gray-500">
              {['EPUB', 'PDF', 'TXT', 'Markdown', 'CBZ', 'HTML'].map(f => (
                <span key={f} className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Book grid */}
        {!loading && books.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onOpen={handleOpen}
                onRemove={removeBook}
              />
            ))}
          </div>
        )}
      </div>
    </DropZone>
  )
}
