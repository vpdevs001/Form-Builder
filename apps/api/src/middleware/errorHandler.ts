import { Request, Response, NextFunction } from 'express';
import { logger } from '@repo/logger';

/**
 * Global error handler middleware for Express
 * Should be placed AFTER all other middleware and route handlers
 * 
 * Catches all errors thrown in route handlers and middleware
 * Logs them and returns appropriate HTTP responses
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Extract error information
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errorId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Log error with context
  logger.error('Unhandled error in route handler', {
    errorId,
    statusCode,
    message,
    stack: isDevelopment ? err.stack : undefined,
    path: req.path,
    method: req.method,
    ip: req.ip,
    cause: err.cause,
  });

  // Don't send stack traces to client in production
  const responseError: any = {
    message,
    statusCode,
    errorId,
  };

  if (isDevelopment && err.stack) {
    responseError.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json({
    error: responseError,
  });
}

/**
 * 404 handler middleware
 * Should be placed at the END of all route definitions
 */
export function notFoundHandler(req: Request, res: Response) {
  logger.warn('404 Not Found', {
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  res.status(404).json({
    error: {
      message: 'Not Found',
      statusCode: 404,
      path: req.path,
    },
  });
}

/**
 * Async error wrapper for route handlers
 * Wraps async route handlers to catch errors and pass to error handler
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
