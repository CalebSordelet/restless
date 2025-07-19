/*

RESTless - Minimal REST API client
Copyright (C) 2025 Caleb Sordelet

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

*/

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import RequestBuilder from './components/RequestBuilder'
import RequestHistory from './components/RequestHistory'
import ResponseViewer from './components/ResponseViewer'
import ThemeToggle from './components/ThemeToggle'
import './App.css'

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

type ResponseType = {
  status: number | string
  statusText: string
  time: number
  size: number
  headers: Record<string, string>
  body: unknown
  raw: string
}

function App() {
  // Persist history in localStorage
  const [history, setHistory] = useState<RequestHistoryItem[]>(() => {
    const saved = localStorage.getItem('restless_history')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('restless_history', JSON.stringify(history))
  }, [history])

  const [response, setResponse] = useState<ResponseType | null>(null)
  const [builderState, setBuilderState] = useState<RequestHistoryItem>({
    method: 'GET',
    url: '',
    headers: {},
    requestBody: '',
  })

  // Handler for selecting a history item
  const handleSelectHistory = (item: RequestHistoryItem) => {
    setBuilderState({
      ...item,
      headers: item.headers,
      requestBody:
        typeof item.requestBody === 'object' && item.requestBody !== null
          ? JSON.stringify(item.requestBody, null, 2)
          : item.requestBody || '',
    })
    if (item.status) {
      setResponse({
        status: item.status,
        statusText: item.statusText ?? '',
        time: item.time ?? 0,
        size: item.size ?? 0,
        headers: item.responseHeaders ?? {},
        body: item.responseBody,
        raw: item.raw ?? (typeof item.responseBody === 'string' ? item.responseBody : JSON.stringify(item.responseBody, null, 2)),
      })
    } else {
      setResponse(null)
    }
  }

  const handleClearHistory = () => setHistory([])

  return (
    <div className="min-h-screen font-mono bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex flex-col relative pb-8">
      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center py-8">
        <motion.pre
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: [ -7, 7 ] }}
          transition={{
            opacity: { duration: 0.7, ease: "easeOut" }, // fade in once
            y: {
              duration: 2, // slow gentle float
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse", // smooth oscillation
            },
          }}
          className="text-purple-700 dark:text-purple-400 text-lg leading-none font-bold mb-2 select-none"
        >
{`
   ___  ________________          
  / _ \\/ __/ __/_  __/ /__ ___ ___
 / , _/ _/_\\ \\  / / / / -_|_-<(_-<
/_/|_/___/___/ /_/ /_/\\__/___/___/
                                  
`}
        </motion.pre>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl font-bold mb-2"
        >
          Test REST APIs, without the bloat.
        </motion.h2>
      </section>

      {/* Main Tool */}
      <main className="flex flex-col md:flex-row gap-6 p-4 w-full max-w-screen-xl mx-auto">
        <section className="flex-1 min-w-0 flex flex-col gap-6">
          <RequestBuilder
            value={builderState}
            onChange={setBuilderState}
            onSend={setResponse}
            onSaveHistory={setHistory}
          />
          <RequestHistory
            history={history}
            onSelect={handleSelectHistory}
            onClear={handleClearHistory}
          />
        </section>
        <section className="flex-1 min-w-0 h-[60vh]">
          <ResponseViewer response={response} />
        </section>
      </main>

      {/* Purpose/About Section */}
      <section className="mt-12 mb-8 px-4 max-w-screen-md mx-auto text-center">
        <h3 className="text-lg font-bold mb-2 text-teal-700 dark:text-teal-300">Why RESTless?</h3>
        <p className="mb-4 text-base">
          RESTless is a minimal, fast, and open-source tool for testing REST APIs.
          No sign-up, no clutter, just the essentials for developers who want to focus on their API.
        </p>
        <div className="flex justify-center gap-8">
          <motion.a
            href="https://coff.ee/calebsordelet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-700 dark:text-blue-400 visited:text-blue-700 dark:visited:text-blue-400 underline font-bold text-lg"
            whileHover={{
              scale: 1.10,
              color: "#2563eb",
              backgroundColor: "rgba(37,99,235,0.07)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M352 200v240a40.12 40.12 0 0 1-40 40H136a40.12 40.12 0 0 1-40-40V224"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M352 224h40a56.16 56.16 0 0 1 56 56v80a56.16 56.16 0 0 1-56 56h-40"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M224 256v160M288 256v160M160 256v160M320 112a48 48 0 0 1 0 96c-13.25 0-29.31-7.31-38-16H160c-8 22-27 32-48 32a48 48 0 0 1 0-96 47.9 47.9 0 0 1 26 9"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M91.86 132.43a40 40 0 1 1 60.46-52S160 91 160 96M145.83 64.71C163.22 44.89 187.57 32 216 32c52.38 0 94 42.84 94 95.21a95 95 0 0 1-1.67 17.79"
              />
            </svg>
            Buy me a beer
          </motion.a>
          <motion.a
            href="https://github.com/CalebSordelet/restless"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-700 dark:text-blue-400 visited:text-blue-700 dark:visited:text-blue-400 underline font-bold text-lg"
            whileHover={{
              scale: 1.10,
              color: "#2563eb",
              backgroundColor: "rgba(37,99,235,0.07)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.012c0 4.428 2.865 8.184 6.839 9.525.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.646.35-1.088.636-1.34-2.22-.253-4.555-1.112-4.555-4.945 0-1.092.39-1.987 1.029-2.686-.103-.254-.446-1.274.098-2.656 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.909-1.295 2.747-1.025 2.747-1.025.546 1.382.202 2.402.099 2.656.64.699 1.028 1.594 1.028 2.686 0 3.842-2.338 4.688-4.566 4.937.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.192 22 16.44 22 12.012 22 6.484 17.523 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </motion.a>
        </div>
      </section>
    </div>
  )
}

export default App