const FORMAT_COLORS = {
  epub: 'bg-emerald-500',
  pdf: 'bg-red-500',
  txt: 'bg-blue-500',
  markdown: 'bg-purple-500',
  cbz: 'bg-orange-500',
  html: 'bg-cyan-500',
}

export default function BookCard({ book, onOpen, onRemove }) {
  return (
    <div
      onClick={() => onOpen(book)}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm
        hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer
        border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
    >
      {/* Cover */}
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200
        dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative">
        {book.cover ? (
          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 font-medium">{book.title}</p>
          </div>
        )}
        {/* Format badge */}
        <span className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded font-bold text-white ${FORMAT_COLORS[book.format] || 'bg-gray-500'}`}>
          {book.format.toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{book.author}</p>

        {/* Actions on hover */}
        <div className="mt-auto pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(book.id) }}
            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            移除
          </button>
        </div>
      </div>
    </div>
  )
}
