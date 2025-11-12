// app/api/catalog/products/by-color/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward all query parameters to backend
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    
    console.log('📡 Fetching color variants from Django:', params.toString());
    
    const res = await fetch(`${BACKEND_URL}/catalog/products/by-color/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Failed to fetch products' }));
      throw new Error(errorData.detail || 'Failed to fetch products');
    }
    
    const data = await res.json();
    console.log('✅ Color variants loaded:', data.data?.length || 0);
    
    // Unwrap the envelope response
    return NextResponse.json(data.data || data);
  } catch (error: any) {
    console.error('❌ Error fetching color variants:', error);
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}