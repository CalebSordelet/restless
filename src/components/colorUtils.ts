/*

RESTless - Minimal REST API client
Copyright (C) 2025 Caleb Sordelet

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

*/

export function getStatusColor(status: number | string): string {
  const code = typeof status === 'string' ? parseInt(status, 10) : status
  if (isNaN(code)) return 'text-gray-500'
  if (code >= 500) return 'text-red-600 dark:text-red-400'
  if (code >= 400) return 'text-orange-500 dark:text-orange-400'
  if (code >= 300) return 'text-yellow-500 dark:text-yellow-400'
  if (code >= 200) return 'text-green-600 dark:text-green-400'
  if (code >= 100) return 'text-blue-600 dark:text-blue-400'
  return 'text-gray-500'
}
