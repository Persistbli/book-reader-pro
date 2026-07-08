import { useReaderStore } from '../../stores/readerStore.js'

export default function HtmlReader() {
  const { book } = useReaderStore()

  if (!book?.html) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <p className="text-sm">HTML 内容为空</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <div
        className="max-w-3xl mx-auto py-8 px-6 prose prose-base max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: book.html }}
      />
    </div>
  )
}
