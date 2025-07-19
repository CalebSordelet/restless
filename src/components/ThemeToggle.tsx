import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'light' ? false : true
  })
  const hasMounted = useRef(false)

  useEffect(() => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    hasMounted.current = true
  }, [dark])

  return (
    <motion.button
      type="button"
      className="text-teal-400 font-mono px-2 py-1 rounded border border-teal-400 hover:bg-teal-900 transition"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark/light mode"
      style={{ overflow: 'hidden', display: 'inline-block' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={dark ? 'dark' : 'light'}
          initial={
            hasMounted.current
              ? { opacity: 0, y: dark ? -12 : 12 }
              : { opacity: 1, y: 0 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={hasMounted.current ? { opacity: 0, y: dark ? 12 : -12 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="inline-block"
          style={{ willChange: 'transform' }}
        >
          {dark ? '🌙 Dark' : '☀️ Light'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

export default ThemeToggle