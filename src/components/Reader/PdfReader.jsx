import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { useReaderStore } from '../../stores/readerStore.js'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs'

export default function PdfReader() {
  const { book, currentChapter } = useReaderStore()
  const canvasRef = useRef(null)
  const pdfDoc = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 从 fileData 重新加载 PDF（确保渲染时始终可用）
  useEffect(() => {
    if (!book?.fileData) return
    setError(null)
    setLoading(true)

    pdfjsLib.getDocument({ data: book.fileData }).promise
      .then(pdf => { pdfDoc.current = pdf })
      .catch(err => {
        console.error('PDF load error:', err)
        setError('PDF 加载失败')
        setLoading(false)
      })
  }, [book?.id])

  // 渲染当前页
  useEffect(() => {
    if (!pdfDoc.current || !canvasRef.current) return

    setLoading(true)
    const pageNum = Math.max(1, Math.min(currentChapter + 1, pdfDoc.current.numPages || 1))

    pdfDoc.current.getPage(pageNum).then(page => {
      const canvas = canvasRef.current
      if (!canvas) return

      const viewport = page.getViewport({ scale: 1 })
      const container = canvas.parentElement
      const scale = Math.min(
        (container.clientWidth - 32) / viewport.width,
        (container.clientHeight - 32) / viewport.height,
        2.5
      )
      const scaledViewport = page.getViewport({ scale })

      canvas.width = scaledViewport.width
      canvas.height = scaledViewport.height
      canvas.style.width = scaledViewport.width + 'px'
      canvas.style.height = scaledViewport.height + 'px'

      const ctx = canvas.getContext('2d')
      page.render({ canvasContext: ctx, viewport: scaledViewport }).promise
        .then(() => setLoading(false))
        .catch(err => {
          console.error('PDF render error:', err)
          setError('PDF 页面渲染失败')
          setLoading(false)
        })
    }).catch(err => {
      console.error('PDF getPage error:', err)
      setError('PDF 页面加载失败')
      setLoading(false)
    })
  }, [book?.id, currentChapter, pdfDoc.current])

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
        <svg className="w-12 h-12 mb-3 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative overflow-auto">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">加载页面...</span>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="shadow-lg rounded" />
    </div>
  )
}
