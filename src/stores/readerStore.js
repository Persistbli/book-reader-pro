import { create } from 'zustand'
import { dbSave } from '../core/storage/db.js'

export const useReaderStore = create((set, get) => ({
  // 当前阅读的书
  book: null,
  currentChapter: 0,
  scrollPosition: 0,
  fontSize: 18,
  lineHeight: 1.8,
  theme: 'light', // light | dark | sepia

  setBook(book) {
    set({ book, currentChapter: 0, scrollPosition: 0 })
  },

  setChapter(index) {
    set({ currentChapter: index, scrollPosition: 0 })
  },

  setScrollPosition(pos) {
    set({ scrollPosition: pos })
  },

  setFontSize(size) {
    set({ fontSize: Math.max(12, Math.min(32, size)) })
  },

  setLineHeight(h) {
    set({ lineHeight: Math.max(1.2, Math.min(3, h)) })
  },

  setTheme(theme) {
    document.documentElement.className = theme === 'dark' ? 'dark theme-dark' : `theme-${theme}`
    set({ theme })
    dbSave('settings', { key: 'theme', value: theme })
  },

  closeBook() {
    set({ book: null, currentChapter: 0, scrollPosition: 0 })
  },
}))
