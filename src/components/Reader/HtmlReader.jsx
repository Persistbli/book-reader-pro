import { useReaderStore } from '../../stores/readerStore.js'

export default function HtmlReader() {
  const { book } = useReaderStore()

  return (
    <div className="w-full h-full overflow-y-auto">
      <div
        className="max-w-3xl mx-auto py-8 px-4"
        dangerouslySetInnerHTML={{ __html: book?.html || '' }}
      />
    </div>
  )
}
