import { createClient } from '@/lib/supabase/server'

export type LogLevel = 'info' | 'warn' | 'error' | 'critical'
export type LogCategory = 'system' | 'security' | 'content' | 'api' | 'client'

interface LogEntry {
  level: LogLevel
  category: LogCategory
  source: string
  message: string
  metadata?: Record<string, any>
}

/**
 * Structured logging utility.
 * Inserts a log row into the app_logs table.
 * Fails silently — logging should never crash the app.
 */
export async function log(entry: LogEntry): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.from('app_logs').insert({
      level: entry.level,
      category: entry.category,
      source: entry.source,
      message: entry.message,
      metadata: entry.metadata ? truncateMetadata(entry.metadata) : null,
    })
  } catch (e) {
    // Logging must never crash the application
    console.error('[logger] Failed to write app_log:', e)
  }
}

/**
 * Truncate large metadata objects to prevent JSONB bloat.
 * Stack traces and request bodies are capped at 2KB each.
 */
function truncateMetadata(metadata: Record<string, any>): Record<string, any> {
  const MAX_FIELD_LENGTH = 2048
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === 'string' && value.length > MAX_FIELD_LENGTH) {
      result[key] = value.substring(0, MAX_FIELD_LENGTH) + '... [truncated]'
    } else {
      result[key] = value
    }
  }

  return result
}

/**
 * Convenience helpers for common log patterns
 */
export const logger = {
  info: (source: string, message: string, metadata?: Record<string, any>) =>
    log({ level: 'info', category: 'system', source, message, metadata }),

  warn: (source: string, message: string, metadata?: Record<string, any>) =>
    log({ level: 'warn', category: 'system', source, message, metadata }),

  error: (source: string, message: string, metadata?: Record<string, any>) =>
    log({ level: 'error', category: 'system', source, message, metadata }),

  critical: (source: string, message: string, metadata?: Record<string, any>) =>
    log({ level: 'critical', category: 'system', source, message, metadata }),

  security: (source: string, message: string, metadata?: Record<string, any>) =>
    log({ level: 'warn', category: 'security', source, message, metadata }),

  api: (source: string, message: string, level: LogLevel = 'info', metadata?: Record<string, any>) =>
    log({ level, category: 'api', source, message, metadata }),
}
