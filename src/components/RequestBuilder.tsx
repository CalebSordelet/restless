/*

RESTless - Minimal REST API client
Copyright (C) 2025 Caleb Sordelet

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

*/

import type { FormEvent } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
  responseHeaders?: Record<string, string>
}

type RequestBuilderProps = {
  value: RequestHistoryItem
  onChange: (value: RequestHistoryItem) => void
  onSend: (response: ResponseType) => void
  onSaveHistory: (updater: (prev: RequestHistoryItem[]) => RequestHistoryItem[]) => void
}

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const MIN_LOADING_MS = 400

const RequestBuilder: React.FC<RequestBuilderProps> = ({
  value,
  onChange,
  onSend,
  onSaveHistory,
}) => {
  const [loading, setLoading] = useState(false)

  const headersArr = Object.entries(value.headers).length
    ? Object.entries(value.headers)
    : [['', '']]

  const handleFieldChange = (field: keyof RequestHistoryItem, val: unknown) => {
    onChange({ ...value, [field]: val })
  }

  const handleHeaderChange = (idx: number, field: 'key' | 'value', val: string) => {
    const arr = [...headersArr]
    if (field === 'key') arr[idx][0] = val
    else arr[idx][1] = val
    const filtered = arr.filter(([k]) => k)
    onChange({ ...value, headers: Object.fromEntries(filtered) })
  }

  const addHeader = () => {
    const arr = [...headersArr, ['', '']]
    onChange({ ...value, headers: Object.fromEntries(arr.filter(([k]) => k)) })
  }

  const removeHeader = (idx: number) => {
    const arr = [...headersArr]
    arr.splice(idx, 1)
    onChange({ ...value, headers: Object.fromEntries(arr.filter(([k]) => k)) })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const startLoading = Date.now()

    const options: RequestInit = {
      method: value.method,
      headers: value.headers,
    }
    if (value.requestBody && value.method !== 'GET') {
      options.body =
        typeof value.requestBody === 'object' && value.requestBody !== null
          ? JSON.stringify(value.requestBody)
          : typeof value.requestBody === 'string'
            ? value.requestBody
            : ''
    }

    const start = performance.now()
    let res: Response, text: string, size = 0
    try {
      res = await fetch(value.url, options)
      text = await res.text()
      size = text.length
      let data: unknown
      try {
        data = JSON.parse(text)
      } catch {
        data = text
      }
      const end = performance.now()
      const response: ResponseType = {
        status: res.status,
        statusText: res.statusText,
        time: Math.round(end - start),
        size,
        headers: Object.fromEntries(res.headers.entries()),
        body: data,
        raw: text,
        responseHeaders: Object.fromEntries(res.headers.entries()),
      }
      onSend(response)
      onSaveHistory(prev => [
        {
          ...value,
          status: response.status,
          statusText: response.statusText,
          headers: value.headers,
          responseHeaders: response.headers,
          requestBody: value.requestBody,
          responseBody: response.body,
          time: response.time,
          size: response.size,
          raw: response.raw,
        },
        ...prev,
      ])
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: unknown }).message)
          : String(err)
      onSend({
        status: 'Error',
        statusText: message,
        time: 0,
        size: 0,
        headers: {},
        responseHeaders: {},
        body: '',
        raw: '',
      })
      onSaveHistory(prev => [
        {
          ...value,
          status: 'Error',
          statusText: message,
          headers: {},
          responseHeaders: {},
          body: '',
          time: 0,
          size: 0,
          raw: '',
        },
        ...prev,
      ])
    } finally {
      const elapsed = Date.now() - startLoading
      if (elapsed < MIN_LOADING_MS) {
        setTimeout(() => setLoading(false), MIN_LOADING_MS - elapsed)
      } else {
        setLoading(false)
      }
    }
  }

  return (
    <motion.form
      className="space-y-4 bg-gray-200 dark:bg-gray-900 p-4 rounded shadow"
      onSubmit={handleSubmit}
    >
      <div className="flex gap-2">
        <select
          className="bg-gray-100 dark:bg-gray-800 text-purple-700 dark:text-purple-300 px-2 py-1 rounded font-mono"
          value={value.method}
          onChange={e => handleFieldChange('method', e.target.value)}
        >
          {METHODS.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input
          className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded font-mono"
          type="url"
          placeholder="https://api.example.com/resource"
          value={value.url}
          onChange={e => handleFieldChange('url', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-teal-700 dark:text-teal-300 mb-1 font-mono">Headers</label>
        {headersArr.map(([key, val], idx) => (
          <div key={idx} className="flex gap-2 mb-1">
            <input
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded font-mono w-1/3"
              placeholder="Key"
              value={key}
              onChange={e => handleHeaderChange(idx, 'key', e.target.value)}
            />
            <input
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded font-mono w-1/2"
              placeholder="Value"
              value={val}
              onChange={e => handleHeaderChange(idx, 'value', e.target.value)}
            />
            <button
              type="button"
              className="text-red-600 dark:text-red-400 px-2"
              onClick={() => removeHeader(idx)}
              disabled={headersArr.length === 1}
            >×</button>
          </div>
        ))}
        <button
          type="button"
          className="text-teal-700 dark:text-teal-400 mt-1 font-mono"
          onClick={addHeader}
        >+ Add Header</button>
      </div>
      {value.method !== 'GET' && (
        <div>
          <label className="block text-teal-700 dark:text-teal-300 mb-1 font-mono">Body</label>
          <textarea
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 py-1 rounded font-mono"
            rows={4}
            placeholder='{"key": "value"}'
            value={
              typeof value.requestBody === 'object' && value.requestBody !== null
                ? JSON.stringify(value.requestBody, null, 2)
                : typeof value.requestBody === 'string'
                  ? value.requestBody
                  : ''
            }
            onChange={e => handleFieldChange('requestBody', e.target.value)}
          />
        </div>
      )}
      <motion.button
        type="submit"
        className="bg-purple-400 dark:bg-purple-600 hover:bg-purple-300 dark:hover:bg-purple-700 text-gray-900 dark:text-white px-4 py-2 rounded font-mono flex items-center justify-center min-w-[80px] h-8"
        disabled={loading}
      >
        {loading ? (
          <div className="flex gap-1 items-center justify-center w-10 h-5">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="inline-block w-2 h-2 rounded-full bg-purple-700 dark:bg-purple-300"
                initial={{ y: 0, opacity: 0.7 }}
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.13,
                }}
              />
            ))}
          </div>
        ) : (
          <span className="inline-block">Send</span>
        )}
      </motion.button>
    </motion.form>
  )
}

export default RequestBuilder