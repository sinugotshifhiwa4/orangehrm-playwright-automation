import path from "path";
import type {
  LoggerConfig,
  LogLevel,
  LogFileMap,
} from "./types/logger.type.js";

/**
 * All supported log levels in ascending severity order.
 */
export const LOG_LEVELS = [
  "debug",
  "info",
  "warn",
  "error",
] as const satisfies readonly LogLevel[];

/**
 * Maps each log level to its output file name.
 * Derived directly from LOG_LEVELS — adding a level here automatically adds its file.
 */
export const LOG_FILES: LogFileMap = Object.fromEntries(
  LOG_LEVELS.map((level) => [level, `${level}.log`]),
) as LogFileMap;

/**
 * Logger settings used by Winston throughout the application.
 */
export const loggerConfig: LoggerConfig = {
  maxFileSize: 10 * 1024 * 1024,
  timeZone: "Africa/Johannesburg",
  dateFormat: "yyyy-MM-dd'T'HH:mm:ssZZ",
  levels: LOG_LEVELS,
  files: LOG_FILES,
  directory: path.resolve(process.cwd(), "logs"),
};

/**
 * Maps each log level to its console output color.
 */
export const CONSOLE_COLORS = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "magenta",
} as const;
