import { useReaderStore } from '../../stores/readerStore.js'

export default function TextReader() {
  const { book, currentChapter, fontSize, lineHeight } = useReaderStore()
  const chapters = book?.chapters || []
  const chapter = chapters[currentChapter] || chapters[0]

  // 空内容检测
  if (!chapter || !chapter.content) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
        <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p className="text-sm">暂无内容</p>
      </div>
    )
  }

  const content = chapter.content

  return (
    <div className="w-full h-full overflow-y-auto">
      <div
        className="max-w-3xl mx-auto py-8 px-6"
        style={{ fontSize: `${fontSize}px`, lineHeight }}
      >
        {/* Chapter title */}
        {chapters.length > 1 && (
          <h2 className="text-2xl font-bold text-center mb-8" style={{ lineHeight: 1.4 }}>
            {chapter.title || ''}
          </h2>
        )}

        {/* Content */}
        {book.format === 'markdown' ? (
          <div
            className="prose prose-base max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {content.split('\n').map((line, i) => (
              <p key={i} className="mb-1" style={{ textIndent: '2em' }}>
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
