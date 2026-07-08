import { useEffect, useRef, useState } from 'react'
import { useReaderStore } from '../../stores/readerStore.js'
import ePub from 'epubjs'

export default function EpubReader() {
  const { book, currentChapter, fontSize, lineHeight } = useReaderStore()
  const containerRef = useRef(null)
  const bookObj = useRef(null)
  const renditionRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  // 初始化 epub.js book 对象
  useEffect(() => {
    if (!book?.blobUrl && !book?.fileData) return

    setError(null)
    setReady(false)

    try {
      // 优先使用 blobUrl（新格式），降级到 fileData（旧格式）
      const source = book.blobUrl || URL.createObjectURL(new Blob([book.fileData]))
      const epubBook = ePub(source)
      bookObj.current = epubBook
    } catch (err) {
      console.error('EPUB init error:', err)
      setError('EPUB 文件初始化失败')
    }
  }, [book?.id])

  // 渲染到 DOM
  useEffect(() => {
    if (!bookObj.current || !containerRef.current) return

    try {
      const rendition = bookObj.current.renderTo(containerRef.current, {
        width: '100%',
        height: '100%',
        flow: 'scrolled-doc',
        manager: 'default',
      })

      renditionRef.current = rendition

      // 导航到指定章节
      const chapters = book?.chapters || []
      const chIdx = chapters[currentChapter]?.index ?? currentChapter

      rendition.display().then(() => {
        if (chapters.length > 0 && chIdx > 0) {
          try {
            const spineItems = bookObj.current.spine?.items || []
            const idx = Math.min(chIdx, spineItems.length - 1)
            if (spineItems[idx]) {
              rendition.display(spineItems[idx].href)
            }
          } catch (_) { /* ignore */ }
        }
        setReady(true)
      }).catch(err => {
        console.error('EPUB render error:', err)
        setError('EPUB 渲染失败: ' + err.message)
      })

    } catch (err) {
      console.error('EPUB renderTo error:', err)
      setError('EPUB 渲染失败')
    }

    return () => {
      try { renditionRef.current?.destroy() } catch (_) { }
      renditionRef.current = null
    }
  }, [bookObj.current, currentChapter])

  // 更新字体大小
  useEffect(() => {
    if (!renditionRef.current) return
    try {
      renditionRef.current.themes.register('custom', {
        body: {
          'font-size': `${fontSize}px !important`,
          'line-height': `${lineHeight} !important`,
        },
        p: {
          'font-size': `${fontSize}px !important`,
          'line-height': `${lineHeight} !important`,
        },
      })
      renditionRef.current.themes.select('custom')
    } catch (_) { /* ignore */ }
  }, [fontSize, lineHeight, ready])

  // 更新章节
  useEffect(() => {
    if (!renditionRef.current || !bookObj.current) return
    const chapters = book?.chapters || []
    if (chapters.length === 0) return

    const chIdx = chapters[currentChapter]?.index ?? currentChapter
    try {
      const spineItems = bookObj.current.spine?.items || []
      const idx = Math.min(chIdx, spineItems.length - 1)
      if (spineItems[idx]) {
        renditionRef.current.display(spineItems[idx].href)
      }
    } catch (_) { /* ignore */ }
  }, [currentChapter])

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
        <svg className="w-12 h-12 mb-3 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-sm">{error}</p>
        <p className="text-xs mt-2 text-gray-300">请尝试重新导入文件</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">加载中...</span>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full epub-container"
      />
    </div>
  )
}
