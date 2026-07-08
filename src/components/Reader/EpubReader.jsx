import { useEffect, useRef } from 'react'
import { useReaderStore } from '../../stores/readerStore.js'

export default function EpubReader() {
  const { book, currentChapter, fontSize, lineHeight } = useReaderStore()
  const containerRef = useRef(null)
  const renditionRef = useRef(null)

  useEffect(() => {
    if (!book?.book || !containerRef.current) return

    // 使用 scrolled 模式更稳定
    const rendition = book.book.renderTo(containerRef.current, {
      width: '100%',
      height: '100%',
      flow: 'scrolled-doc',
      manager: 'default',
    })

    renditionRef.current = rendition

    // 导航到指定章节
    const chapters = book.chapters || []
    if (chapters.length > 0 && currentChapter > 0) {
      try {
        const spineItems = book.book.spine.items
        const idx = Math.min(currentChapter, spineItems.length - 1)
        rendition.display(spineItems[idx].href)
      } catch (_) {
        rendition.display()
      }
    } else {
      rendition.display()
    }

    return () => {
      try { renditionRef.current?.destroy() } catch (_) {}
      renditionRef.current = null
    }
  }, [book?.id, currentChapter])

  // 更新字体
  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.register('custom', {
        body: { 'font-size': `${fontSize}px !important`, 'line-height': `${lineHeight} !important` },
        p: { 'font-size': `${fontSize}px !important`, 'line-height': `${lineHeight} !important` },
      })
      renditionRef.current.themes.select('custom')
    }
  }, [fontSize, lineHeight])

  return (
    <div
      ref={containerRef}
      className="w-full h-full epub-container"
    />
  )
}
