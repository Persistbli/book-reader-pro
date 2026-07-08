import { useReaderStore } from '../../stores/readerStore.js'

export default function ComicReader() {
  const { book, currentChapter } = useReaderStore()
  const chapters = book?.chapters || []
  const chapter = chapters[currentChapter]

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {chapter?.src ? (
        <img
          src={chapter.src}
          alt={chapter.title}
          className="max-w-full max-h-full object-contain shadow-lg"
        />
      ) : (
        <p className="text-gray-400">无法加载图片</p>
      )}
    </div>
  )
}
