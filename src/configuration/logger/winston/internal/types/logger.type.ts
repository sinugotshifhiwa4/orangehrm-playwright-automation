/**
 * The four supported log levels across the application.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Maps each log level to its corresponding log file name.
 */
export type LogFileMap = Record<LogLevel, `${LogLevel}.log`>;

/**
 * Centralizes all Winston logger settings.
 */
export interface LoggerConfig {
  readonly maxFileSize: number;
  readonly timeZone: string;
  readonly dateFormat: string;
  readonly levels: readonly LogLevel[];
  readonly files: LogFileMap;
  readonly directory: string;
}
