// Structured logger for terminal output and machine-readable framework logs.
import fs from 'fs';
import { paths } from '@config/paths';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'BDD STEP';

export class Logger {
  private static write(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const line = `[${level}] ${message}`;
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context ? { context } : {})
    };

    if (level === 'ERROR') {
      console.error(line);
    } else if (level === 'WARN') {
      console.warn(line);
    } else {
      console.log(line);
    }

    fs.appendFileSync(paths.structuredLogFile, `${JSON.stringify(payload)}\n`, 'utf8');
  }

  static info(message: string, context?: Record<string, unknown>): void {
    Logger.write('INFO', message, context);
  }

  static warn(message: string, context?: Record<string, unknown>): void {
    Logger.write('WARN', message, context);
  }

  static error(message: string, context?: Record<string, unknown>): void {
    Logger.write('ERROR', message, context);
  }

  static step(message: string, context?: Record<string, unknown>): void {
    Logger.write('BDD STEP', message, context);
  }
}
