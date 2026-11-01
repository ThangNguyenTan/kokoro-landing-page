import { timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { CLINIC_CACHE_TAG } from '@/sanity/queries';

function isValidSecret(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const providedBuf = Buffer.from(provided.trim(), 'utf8');
  const expectedBuf = Buffer.from(expected.trim(), 'utf8');
  if (providedBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(providedBuf, expectedBuf);
}

function extractProvidedSecret(request: NextRequest): string | null {
  const headerSecret =
    request.headers.get('x-sanity-revalidate-secret') ||
    request.headers.get('x-webhook-secret');

  if (headerSecret) {
    return headerSecret;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }

  return request.nextUrl.searchParams.get('secret');
}

/**
 * On-Demand ISR Revalidation Endpoint for Sanity CMS Webhooks.
 * Usage in Sanity Manage -> API -> Webhooks:
 *   URL: https://<your-domain>/api/revalidate
 *   HTTP Method: POST
 *   Header: x-sanity-revalidate-secret: <SANITY_REVALIDATE_SECRET>
 */
export async function POST(request: NextRequest) {
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!expectedSecret || !expectedSecret.trim()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'SANITY_REVALIDATE_SECRET is not configured in environment variables.',
      },
      { status: 503 },
    );
  }

  const providedSecret = extractProvidedSecret(request);

  if (!isValidSecret(providedSecret, expectedSecret)) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Invalid or missing Sanity revalidation secret.',
      },
      { status: 401 },
    );
  }

  let documentType: string | undefined;
  try {
    const body = (await request.json()) as { _type?: string } | null;
    documentType = body?._type;
  } catch {
    // Webhook body is optional; still revalidate clinic tag and homepage path.
  }

  revalidateTag(CLINIC_CACHE_TAG);
  revalidatePath('/');

  return NextResponse.json({
    ok: true,
    revalidated: true,
    tag: CLINIC_CACHE_TAG,
    path: '/',
    documentType: documentType ?? null,
    timestamp: new Date().toISOString(),
  });
}
