import React from 'react'
import { motion } from 'framer-motion'
import { MenuTheme } from '../types/MenuTypes'

interface MenuHeaderProps {
  theme: MenuTheme;
}

export function MenuHeader({ theme }: MenuHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        textAlign: 'center',
        marginBottom: '2rem',
      }}
    >
      <h1 style={{
        fontSize: theme.headerFontSize,
        fontWeight: theme.headerFontWeight,
        color: theme.accentColor,
      }}>
        Restaurant Menu
      </h1>
      <p style={{
        fontSize: theme.itemFontSize,
        color: theme.primaryColor,
        marginTop: '0.5rem',
      }}>
        Discover our delicious offerings
      </p>
    </motion.header>
  )
}

