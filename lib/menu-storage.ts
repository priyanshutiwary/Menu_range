import { MenuItem, MenuSection, MenuTheme, Table } from './validations/menu'

const STORAGE_KEYS = {
  SECTIONS: 'menu-sections',
  THEME: 'menu-theme',
  TABLES: 'menu-tables',
} as const

export const menuStorage = {
  getSections: (): MenuSection[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEYS.SECTIONS)
    return stored ? JSON.parse(stored) : []
  },

  setSections: (sections: MenuSection[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections))
  },

  getTheme: (): MenuTheme | null => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(STORAGE_KEYS.THEME)
    return stored ? JSON.parse(stored) : null
  },

  setTheme: (theme: MenuTheme): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme))
  },

  getTables: (): Table[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEYS.TABLES)
    return stored ? JSON.parse(stored) : []
  },

  setTables: (tables: Table[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables))
  },

  clear: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.SECTIONS)
    localStorage.removeItem(STORAGE_KEYS.THEME)
    localStorage.removeItem(STORAGE_KEYS.TABLES)
  },
}

