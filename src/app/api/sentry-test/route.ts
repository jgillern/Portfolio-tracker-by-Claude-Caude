import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  // Intentional test error for Sentry verification
  const testError = new Error('Sentry test error — this is intentional. If you see this in Sentry, it works!');
  Sentry.captureException(testError);

  // Also flush to make sure the event is sent before the response
  await Sentry.flush(2000);

  return NextResponse.json({
    ok: true,
    message: 'Test error sent to Sentry. Check your Sentry dashboard for an event titled "Sentry test error".',
  });
}
