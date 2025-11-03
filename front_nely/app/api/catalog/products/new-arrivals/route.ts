// app/api/products/new-arrivals/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Route: Fetching new arrivals from Django...');
    console.log('🔗 Backend URL:', `${BACKEND_URL}/catalog/products/new-arrivals/`);
    
    const res = await fetch(`${BACKEND_URL}/catalog/products/new-arrivals/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📥 Django response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Django error response:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch new arrivals', details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log('✅ Successfully fetched data');
    console.log('📦 Data keys:', Object.keys(data));
    console.log('📊 Products count:', data.data?.length || 0);

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}