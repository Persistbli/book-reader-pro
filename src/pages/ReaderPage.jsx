import { useState } from 'react'
import { useReaderStore } from '../stores/readerStore.js'
import ReaderSettings from '../components/Reader/ReaderSettings.jsx'
import ChapterSidebar from '../components/Reader/ChapterSidebar.jsx'
import EpubReader from '../components/Reader/EpubReader.jsx'
import PdfReader from '../components/Reader/PdfReader.jsx'
import TextReader from '../components/Reader/TextReader.jsx'
import ComicReader from '../components/Reader/ComicReader.jsx'
import HtmlReader from '../components/Reader/HtmlReader.jsx'

// 格式 → 渲染组件映射
const RENDERERS = {
  epub: EpubReader,
  pdf: PdfReader,
  txt: TextReader,
  markdown: TextReader,
  cbz: ComicReader,
  html: HtmlReader,
}

export default function ReaderPage() {
  const { book, currentChapter, chapters, setChapter, closeBook } = useReaderStore()
  const [showToc, setShowToc] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  if (!book) return null

  const cls = chapters || []
  const Renderer = RENDERERS[book.format] || TextReader
  const total = cls.length || (book.totalPages || 0)

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-reader-bg" style={{ background: 'var(--reader-bg)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={closeBook}
            className="p-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700/60 text-gray-600 dark:text-gray-300 transition-colors"
            title="返回书架"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="truncate">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[200px]">{book.title}</h2>
            <p className="text-xs text-gray-400 truncate">{cls[currentChapter]?.title || ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* TOC */}
          <button
            onClick={() => setShowToc(true)}
            className="p-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700/60 text-gray-600 dark:text-gray-300 transition-colors"
            title="目录"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                : 'hover:bg-gray-200/60 dark:hover:bg-gray-700/60 text-gray-600 dark:text-gray-300'
            }`}
            title="阅读设置"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings bar */}
      {showSettings && (
        <div className="flex justify-center py-2 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30 flex-shrink-0 animate-fadeIn">
          <ReaderSettings />
        </div>
      )}

      {/* Reader content */}
      <div className="flex-1 overflow-hidden">
        <Renderer />
      </div>

      {/* Bottom navigation bar */}
      {(book.format === 'pdf' || book.format === 'cbz') && total > 1 && (
        <div className="flex items-center justify-center gap-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
          <button
            onClick={() => currentChapter > 0 && setChapter(currentChapter - 1)}
            disabled={currentChapter === 0}
            className="px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
              disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            上一页
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
            {currentChapter + 1} / {total}
          </span>
          <button
            onClick={() => currentChapter < total - 1 && setChapter(currentChapter + 1)}
            disabled={currentChapter >= total - 1}
            className="px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
              disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            下一页
          </button>
        </div>
      )}

      {/* EPUB: previous/next buttons */}
      {book.format === 'epub' && cls.length > 1 && (
        <div className="flex items-center justify-center gap-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
          <button
            onClick={() => currentChapter > 0 && setChapter(currentChapter - 1)}
            disabled={currentChapter === 0}
            className="px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
              disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            上一章
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
            {currentChapter + 1} / {cls.length}
          </span>
          <button
            onClick={() => currentChapter < cls.length - 1 && setChapter(currentChapter + 1)}
            disabled={currentChapter >= cls.length - 1}
            className="px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
              disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            下一章
          </button>
        </div>
      )}

      {/* Chapter sidebar */}
      <ChapterSidebar visible={showToc} onClose={() => setShowToc(false)} />
    </div>
  )
}
