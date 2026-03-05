/**
 * @file Structured logging utility.
 *
 * WHY: Consistent log format makes debugging easier and allows
 * piping logs to external services in production.
 *
 * In production, only warnings and errors are emitted.
 */

import { env } from '@/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  context?: string;
  data?: unknown;
}

function shouldLog(level: LogLevel): boolean {
  if (env.IS_DEV) return true;
  return level === 'warn' || level === 'error';
}

function log(level: LogLevel, { message, context, data }: LogPayload): void {
  if (!shouldLog(level)) return;

  const prefix = context ? `[${context}]` : '';
  const timestamp = new Date().toISOString();

  const entry = { timestamp, level, message: `${prefix} ${message}`.trim(), data };

  switch (level) {
    case 'debug':
      console.debug(entry);
      break;
    case 'info':
      console.info(entry);
      break;
    case 'warn':
      console.warn(entry);
      break;
    case 'error':
      console.error(entry);
      break;
  }
}

export const logger = {
  debug: (message: string, data?: unknown, context?: string) =>
    log('debug', { message, data, context }),
  info: (message: string, data?: unknown, context?: string) =>
    log('info', { message, data, context }),
  warn: (message: string, data?: unknown, context?: string) =>
    log('warn', { message, data, context }),
  error: (message: string, data?: unknown, context?: string) =>
    log('error', { message, data, context }),
};
