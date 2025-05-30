// app/api/businesses/search/route.ts

import { searchBusinesses } from "@/app/services/businessService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchTypes = url.searchParams.get('types')?.split(',') || [];
    const query = url.searchParams.get('q');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    if (searchTypes.length === 0 || !query) {
      return new Response(
        JSON.stringify({ error: 'At least one search type and query parameters are required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate search types
    const validSearchTypes = ['businessName', 'category', 'tags'];
    const invalidTypes = searchTypes.filter(type => !validSearchTypes.includes(type));
    
    if (invalidTypes.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid search type(s): ${invalidTypes.join(', ')}. Valid types are: ${validSearchTypes.join(', ')}` 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const searchResult = await searchBusinesses(searchTypes, query, page, limit);

    return new Response(
      JSON.stringify({
        businesses: searchResult.businesses,
        totalBusinesses: searchResult.totalBusinesses,
        totalPages: searchResult.totalPages,
        currentPage: searchResult.currentPage
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error searching businesses:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to search businesses' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}