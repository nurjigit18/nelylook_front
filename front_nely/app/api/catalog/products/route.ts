// app/api/catalog/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Build query string for Django backend
    const params = new URLSearchParams();
    
    // Transform parameters to match Django filter expectations
    searchParams.forEach((value, key) => {
      // Transform plural to singular for Django filters
      if (key === 'colors') {
        params.append('color', value);
      } else if (key === 'sizes') {
        params.append('size', value);
      } else if (key === 'categories') {
        params.append('category', value);
      } else {
        params.append(key, value);
      }
    });
    
    console.log('📡 Fetching products from Django:', `${BACKEND_URL}/catalog/products/?${params.toString()}`);
    
    const res = await fetch(`${BACKEND_URL}/catalog/products/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📥 Django response status:', res.status);

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('❌ Django error:', error);
      return NextResponse.json(error, { status: res.status });
    }

    const data = await res.json();
    console.log('✅ Products fetched from Django');
    
    if (data.data) {
      return NextResponse.json(data.data);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json(
      { detail: 'Failed to fetch products', error: String(error) },
      { status: 500 }
    );
  }
}