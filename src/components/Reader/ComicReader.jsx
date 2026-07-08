import { useReaderStore } from '../../stores/readerStore.js'
import { useState } from 'react'

export default function ComicReader() {
  const { book, currentChapter } = useReaderStore()
  const chapters = book?.chapters || []
  const chapter = chapters[currentChapter]
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  if (!chapters.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <p className="text-sm">漫画文件中未找到图片</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-black/5 dark:bg-black/20 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <p>图片加载失败</p>
          <p className="text-xs text-gray-300">{currentChapter + 1} / {chapters.length}</p>
        </div>
      )}
      {chapter?.src && (
        <img
          src={chapter.src}
          alt={chapter.title || `第${currentChapter + 1}页`}
          className="max-w-full max-h-full object-contain shadow-lg rounded"
          style={{ display: error ? 'none' : 'block' }}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true) }}
        />
      )}
    </div>
  )
}
