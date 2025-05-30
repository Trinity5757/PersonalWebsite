// app/api/users/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchUsers } from '@/app/services/userService';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const exactMatch = searchParams.get('exact') === 'true';
    const fields = searchParams.get('fields')?.split(',') as ('username' | 'first_name' | 'last_name')[] || undefined;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    if (isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid limit parameter. Must be between 1 and 50' },
        { status: 400 }
      );
    }

    const users = await searchUsers(query, {
      limit,
      exactMatch,
      searchFields: fields
    });

    return NextResponse.json({
      users,
      count: users.length,
      query,
      searchOptions: {
        limit,
        exactMatch,
        searchFields: fields || ['username', 'first_name']
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, limit = 10, exactMatch = false, searchFields } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be between 1 and 50' },
        { status: 400 }
      );
    }

    const users = await searchUsers(query, {
      limit,
      exactMatch,
      searchFields
    });

    return NextResponse.json({
      users,
      count: users.length,
      query,
      searchOptions: {
        limit,
        exactMatch,
        searchFields: searchFields || ['username', 'first_name']
      }
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}