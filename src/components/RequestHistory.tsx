import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { getStatusColor } from './colorUtils'

type RequestHistoryItem = {
  method: string
  url: string
  headers: Record<string, string>
  responseHeaders?: Record<string, string>
  requestBody?: string | unknown
  responseBody?: string | unknown
  status?: number | string
  statusText?: string
  time?: number
  size?: number
  raw?: string
}

interface RequestHistoryProps {
  history: RequestHistoryItem[]
  onSelect: (item: RequestHistoryItem) => void
  onClear?: () => void
}

const getKey = (item: RequestHistoryItem, idx: number) =>
  `${item.method}-${item.url}-${item.time ?? ''}-${idx}`

const RequestHistory: React.FC<RequestHistoryProps> = ({ history, onSelect, onClear }) => {
  const listRef = useRef<HTMLUListElement>(null)
  const hasMounted = useRef(false)
  const prevLength = useRef(history.length)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
    hasMounted.current = true
  }, [])

  useEffect(() => {
    prevLength.current = history.length
  }, [history.length])

  if (!history.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-200 dark:bg-gray-900 p-4 rounded shadow mt-4 text-gray-600 dark:text-gray-400 font-mono"
      >
        No request history yet.
      </motion.div>
    )
  }

  // Only animate if the list grew (new item added) and not on initial mount
  const shouldAnimateFirst =
    hasMounted.current && history.length > prevLength.current

  return (
    <div className="bg-gray-200 dark:bg-gray-900 p-4 rounded shadow text-gray-600 dark:text-gray-400 font-mono">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-teal-700 dark:text-teal-300 font-bold font-mono">History</span>
        {onClear && (
          <button
            type="button"
            className="text-xs px-2 py-1 rounded bg-gray-300 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900 text-red-700 dark:text-red-400 font-bold transition"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
      <motion.ul
        ref={listRef}
        className="space-y-2 max-h-[30vh] overflow-auto overflow-x-hidden"
      >
        {history.map((item, idx) => {
          const isFirstAnimated = idx === 0 && shouldAnimateFirst
          return (
            <motion.li
              key={getKey(item, idx)}
              initial={isFirstAnimated ? { opacity: 0, x: 40 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={isFirstAnimated ? { duration: 0.4, ease: "easeOut" } : {}}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer font-mono flex items-center gap-2"
              onClick={() => onSelect(item)}
              title={`${item.method} ${item.url}`}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-purple-700 dark:text-purple-400">{item.method}</span>
              <span className="mx-2 text-gray-900 dark:text-gray-100">{item.url}</span>
              <motion.span
                className={`font-bold inline-block px-3 py-1 rounded-lg ${getStatusColor(item.status ?? '')}`}
              >
                {item.status} {item.statusText}
              </motion.span>
            </motion.li>
          )
        })}
      </motion.ul>
    </div>
  )
}

export default RequestHistory