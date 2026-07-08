import { useRef, useState, useCallback } from 'react'

export default function DropZone({ onFilesDrop, children, className = '' }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const counter = useRef(0)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    counter.current++
    if (e.dataTransfer.items?.length > 0) setIsDragOver(true)
  }, [])

  const handleDragOut = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    counter.current--
    if (counter.current === 0) setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    counter.current = 0

    if (e.dataTransfer.files?.length > 0) {
      onFilesDrop(Array.from(e.dataTransfer.files))
    }
  }, [onFilesDrop])

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`${className} ${isDragOver ? 'ring-2 ring-indigo-400 bg-indigo-50/10' : ''}`}
    >
      {isDragOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center">
            <svg className="w-16 h-16 mx-auto mb-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">释放文件开始阅读</p>
            <p className="text-sm text-gray-500 mt-1">支持 EPUB / PDF / TXT / Markdown / CBZ</p>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
