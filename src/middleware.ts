import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - API routes (Yahoo Finance proxy etc.)
     * - Locale JSON files
     * - Image files
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|locales/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
