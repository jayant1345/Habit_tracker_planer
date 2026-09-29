import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'morpankh-habit-tracker',
    version: '1.0.0',
    concurrency_engine: 'active',
  });
}
