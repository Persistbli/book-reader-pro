import { useReaderStore } from './stores/readerStore.js'
import { dbGet } from './core/storage/db.js'
import BookshelfPage from './pages/BookshelfPage.jsx'
import ReaderPage from './pages/ReaderPage.jsx'
import { useEffect } from 'react'

export default function App() {
  const book = useReaderStore(s => s.book)
  const setTheme = useReaderStore(s => s.setTheme)

  // 初始化主题
  useEffect(() => {
    dbGet('settings', 'theme').then(rec => {
      const theme = rec?.value || 'light'
      document.documentElement.className = theme === 'dark' ? 'dark theme-dark' : `theme-${theme}`
      setTheme(theme)
    }).catch(() => {
      document.documentElement.className = 'theme-light'
    })
  }, [])

  if (book) {
    return <ReaderPage />
  }

  return <BookshelfPage />
}
