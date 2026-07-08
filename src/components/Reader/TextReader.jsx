import { useReaderStore } from '../../stores/readerStore.js'

export default function TextReader() {
  const { book, currentChapter, fontSize, lineHeight } = useReaderStore()
  const chapters = book?.chapters || []
  const chapter = chapters[currentChapter] || chapters[0]

  const content = chapter?.content || ''

  return (
    <div className="w-full h-full overflow-y-auto px-4">
      <div
        className="max-w-3xl mx-auto py-8"
        style={{ fontSize: `${fontSize}px`, lineHeight }}
      >
        {/* Chapter title */}
        {chapters.length > 1 && (
          <h2 className="text-2xl font-bold text-center mb-8" style={{ lineHeight: 1.4 }}>
            {chapter?.title || ''}
          </h2>
        )}

        {/* Content */}
        {book.format === 'markdown' ? (
          <div
            className="prose prose-base max-w-none"
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
