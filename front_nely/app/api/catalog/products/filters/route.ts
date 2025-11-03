// app/api/catalog/products/filters/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    console.log('📡 Fetching filters from Django:', `${BACKEND_URL}/catalog/products/filters/`);
    
    const res = await fetch(`${BACKEND_URL}/catalog/products/filters/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📥 Django filters response status:', res.status);

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('❌ Django filters error:', error);
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    console.log('✅ Filters fetched from Django');
    
    // Your APIResponse.success() returns:
    // {
    //   status: 'success',
    //   message: 'Available filter options',
    //   data: { price_range, categories, colors, sizes, seasons }
    // }
    // 
    // Return the inner 'data' object directly
    
    if (data.data) {
      // Wrapped response - extract the data
      return NextResponse.json(data.data);
    }
    
    // Fallback: return as-is if not wrapped
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching filters:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch filters', error: String(error) },
      { status: 500 }
    );
  }
}