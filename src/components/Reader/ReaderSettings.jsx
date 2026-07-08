import { useReaderStore } from '../../stores/readerStore.js'

const FONT_SIZES = [14, 16, 18, 20, 22, 24, 28]
const THEMES = [
  { id: 'light', label: '明亮', icon: '☀️' },
  { id: 'dark', label: '暗色', icon: '🌙' },
  { id: 'sepia', label: '护眼', icon: '📜' },
]

export default function ReaderSettings() {
  const { fontSize, lineHeight, theme, setFontSize, setLineHeight, setTheme } = useReaderStore()

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
      rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-sm">
      {/* Font Size */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setFontSize(fontSize - 2)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
            text-gray-600 dark:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="w-10 text-center font-mono text-xs text-gray-600 dark:text-gray-300">{fontSize}px</span>
        <button
          onClick={() => setFontSize(fontSize + 2)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
            text-gray-600 dark:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="w-px h-5 bg-gray-200 dark:bg-gray-600" />

      {/* Line Height */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setLineHeight(lineHeight - 0.2)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
            text-gray-600 dark:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <span className="w-8 text-center font-mono text-xs text-gray-500">{lineHeight.toFixed(1)}</span>
        <button
          onClick={() => setLineHeight(lineHeight + 0.2)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
            text-gray-600 dark:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h7l4 8h7M3 8l4 8m-4-8h18" />
          </svg>
        </button>
      </div>

      <div className="w-px h-5 bg-gray-200 dark:bg-gray-600" />

      {/* Theme */}
      <div className="flex items-center gap-1">
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`px-2 py-1 rounded-lg text-xs transition-colors ${
              theme === t.id
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
            }`}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      {/* Preset fonts */}
      <div className="w-px h-5 bg-gray-200 dark:bg-gray-600" />
      <div className="flex items-center gap-1">
        {FONT_SIZES.map(s => (
          <button
            key={s}
            onClick={() => setFontSize(s)}
            className={`w-7 h-7 rounded-lg text-xs font-mono transition-colors ${
              fontSize === s
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
