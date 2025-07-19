import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getStatusColor } from './colorUtils'

type ResponseType = {
  status: number | string
  statusText: string
  time: number
  size: number
  headers: Record<string, string>
  body: unknown
  raw: string
}

interface ResponseViewerProps {
  response: ResponseType | null
}

function renderHeaders(headers: Record<string, string>, pretty: boolean) {
  if (pretty) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs mt-1 max-h-[30vh] overflow-auto whitespace-pre-wrap text-gray-900 dark:text-gray-100">
        {Object.entries(headers).map(([k, v]) => (
          <div key={k}>
            <span className="text-purple-700 dark:text-purple-400">{k}</span>
            <span className="text-gray-700 dark:text-gray-300">: </span>
            <span className="text-teal-700 dark:text-teal-300">{v}</span>
          </div>
        ))}
      </div>
    )
  }
  return (
    <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs mt-1 max-h-[30vh] overflow-auto whitespace-pre-wrap text-gray-900 dark:text-gray-100">
      {JSON.stringify(headers, null, 2)}
    </pre>
  )
}

function renderBody(body: unknown, raw: string, pretty: boolean) {
  if (pretty) {
    if (typeof body === 'object' && body !== null) {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs max-h-[40vh] overflow-auto whitespace-pre-wrap text-gray-900 dark:text-gray-100">
          {Object.entries(body as Record<string, unknown>).map(([k, v]) => (
            <div key={k}>
              <span className="text-purple-700 dark:text-purple-400">{k}</span>
              <span className="text-gray-700 dark:text-gray-300">: </span>
              <span className="text-teal-700 dark:text-teal-300">{JSON.stringify(v)}</span>
            </div>
          ))}
        </div>
      )
    }
    return (
      <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs max-h-[40vh] overflow-auto whitespace-pre-wrap text-gray-900 dark:text-gray-100">
        {String(body)}
      </pre>
    )
  }
  return (
    <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs max-h-[40vh] overflow-auto whitespace-pre-wrap text-gray-900 dark:text-gray-100">
      {raw}
    </pre>
  )
}

function hasBody(body: unknown): boolean {
  if (body == null) return false
  if (typeof body === 'string') return body.trim() !== ''
  if (Array.isArray(body)) return body.length > 0
  if (typeof body === 'object') return Object.keys(body).length > 0
  return true
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  const [showRawBody, setShowRawBody] = useState(false)
  const [showRawHeaders, setShowRawHeaders] = useState(false)
  const hasMounted = useRef(false)
  const [glow, setGlow] = useState(false)

  useEffect(() => {
    if (hasMounted.current && response) {
      setGlow(true)
      const t = setTimeout(() => setGlow(false), 700)
      return () => clearTimeout(t)
    }
    hasMounted.current = true
  }, [response]) // <-- trigger on any new response object

  return (
    <AnimatePresence mode="wait">
      {response ? (
        <motion.div
          key={response.raw}
          initial={
            hasMounted.current
              ? { opacity: 0, scale: 0.98 }
              : { opacity: 1, scale: 1 }
          }
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.12 }}
          className="bg-gray-200 dark:bg-gray-900 p-4 rounded shadow font-mono w-full min-w-0"
        >
          <div className="flex flex-wrap gap-4 mb-2">
            <motion.span
              className={`font-bold break-all inline-block rounded-lg ${getStatusColor(response.status)}`}
              animate={glow ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={glow ? { duration: 0.4 } : {}}
            >
              {response.status} {response.statusText}
            </motion.span>
            <span className="text-teal-700 dark:text-teal-300">Time: {response.time} ms</span>
            <span className="text-teal-700 dark:text-teal-300">Size: {response.size} bytes</span>
          </div>
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-teal-700 dark:text-teal-300 font-bold">Headers:</span>
              <button
                type="button"
                className="text-purple-700 dark:text-purple-400 underline text-xs"
                onClick={() => setShowRawHeaders(r => !r)}
              >
                {showRawHeaders ? 'Pretty' : 'Raw'}
              </button>
            </div>
            <div className="relative">
              <CopyButton value={JSON.stringify(response.headers, null, 2)} />
              {renderHeaders(response.headers, !showRawHeaders)}
            </div>
          </div>
          {hasBody(response.body) && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-teal-700 dark:text-teal-300 font-bold">Body:</span>
                <button
                  type="button"
                  className="text-purple-700 dark:text-purple-400 underline text-xs"
                  onClick={() => setShowRawBody(r => !r)}
                >
                  {showRawBody ? 'Pretty' : 'Raw'}
                </button>
              </div>
              <div className="relative">
                <CopyButton value={response.raw} />
                {renderBody(response.body, response.raw, !showRawBody)}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="no-response"
          initial={
            hasMounted.current
              ? { opacity: 0 }
              : { opacity: 1 }
          }
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-gray-200 dark:bg-gray-900 p-4 rounded shadow text-gray-600 dark:text-gray-400 font-mono w-full"
        >
          No response yet.
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-gray-300 dark:bg-gray-700 hover:bg-teal-200 dark:hover:bg-teal-800 text-teal-700 dark:text-teal-300 font-bold transition"
      onClick={() => {
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? "✓" : "⧉"}
    </button>
  )
}

export default ResponseViewer