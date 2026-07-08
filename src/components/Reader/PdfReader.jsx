import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { useReaderStore } from '../../stores/readerStore.js'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs'

export default function PdfReader() {
  const { book, currentChapter } = useReaderStore()
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!book?.pdf || !canvasRef.current) return

    setLoading(true)
    const pageNum = Math.max(1, Math.min(currentChapter + 1, book.totalPages || 1))

    book.pdf.getPage(pageNum).then(page => {
      const canvas = canvasRef.current
      if (!canvas) return

      const viewport = page.getViewport({ scale: 1 })
      const container = canvas.parentElement
      const scale = Math.min(
        container.clientWidth / viewport.width,
        container.clientHeight / viewport.height,
        2.5
      )
      const scaledViewport = page.getViewport({ scale })

      canvas.width = scaledViewport.width
      canvas.height = scaledViewport.height

      const ctx = canvas.getContext('2d')
      page.render({ canvasContext: ctx, viewport: scaledViewport }).promise
        .then(() => setLoading(false))
    }).catch(() => setLoading(false))
  }, [book?.id, currentChapter])

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas ref={canvasRef} className="max-w-full max-h-full shadow-lg rounded" />
    </div>
  )
}
