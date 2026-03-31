import * as Sentry from '@sentry/nextjs';

/**
 * Log and report an error to Sentry + console.
 * Use instead of bare console.error in API routes and server-side code.
 */
export function captureError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);
  Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
    tags: { context },
  });
}
