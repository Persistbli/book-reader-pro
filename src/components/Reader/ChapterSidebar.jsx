import { useReaderStore } from '../../stores/readerStore.js'

export default function ChapterSidebar({ visible, onClose }) {
  const { book, currentChapter, setChapter } = useReaderStore()
  if (!book || !visible) return null

  const chapters = book.chapters || []

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl
        animate-slideUp overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">目录</h2>
          <span className="text-xs text-gray-400">{chapters.length} 章</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chapter list */}
        <div className="flex-1 overflow-y-auto">
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => { setChapter(idx); onClose() }}
              className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 dark:border-gray-700/50
                transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  currentChapter === idx
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-l-2 border-l-indigo-500'
                    : 'text-gray-700 dark:text-gray-300 border-l-2 border-l-transparent'
                }`}
            >
              <span className="line-clamp-1">{ch.title}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
