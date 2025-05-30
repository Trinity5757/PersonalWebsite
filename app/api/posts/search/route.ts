// app/api/posts/search/route.ts

import { searchPosts } from "@/app/services/postService";

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

    const searchResult = await searchPosts(searchTypes, query, page, limit);

    /*
    let searchResult;

    switch (searchType) {
      case 'tags':
        // Split the query string into an array of tags
        const tags = query.split(',').map(tag => tag.trim());
        searchResult = await searchPostsByTags(tags, page, limit);
        break;

      case 'caption':
        searchResult = await searchPostsByCaption(query, page, limit);
        break;

      case 'username':
        searchResult = await searchPostsByUsername(query, page, limit);
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid search type. Must be one of: tags, caption, username' }), 
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
    }*/

    return new Response(
      JSON.stringify({
        posts: searchResult.posts,
        totalPosts: searchResult.totalPosts,
        totalPages: searchResult.totalPages,
        currentPage: searchResult.currentPage
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error searching posts:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to search posts' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}