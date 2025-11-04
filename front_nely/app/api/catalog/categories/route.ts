// app/api/catalog/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const url = `${BACKEND_URL}/catalog/categories/`;
    console.log('📡 Fetching categories from Django:', url);
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('❌ Django error:', res.status);
      const errorData = await res.json().catch(() => ({ detail: 'Failed to fetch categories' }));
      return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    console.log('✅ Django response received:', JSON.stringify(data).substring(0, 200));
    
    // Handle different response formats:
    // 1. Paginated: { count, results: [...] }
    // 2. APIResponse: { status, data: [...] }
    // 3. Direct array: [...]
    let categories;
    
    if (data.results && Array.isArray(data.results)) {
      categories = data.results;  // ← Paginated response
      console.log('📊 Found paginated results:', categories.length);
    } else if (data.data && Array.isArray(data.data)) {
      categories = data.data;  // ← APIResponse wrapper
      console.log('📊 Found data wrapper:', categories.length);
    } else if (Array.isArray(data)) {
      categories = data;  // ← Direct array
      console.log('📊 Found direct array:', categories.length);
    } else {
      console.error('❌ Unexpected response format:', Object.keys(data));
      categories = [];
    }
    
    console.log('📊 Returning categories:', categories.length);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { detail: 'Server error', error: String(error) },
      { status: 500 }
    );
  }
}