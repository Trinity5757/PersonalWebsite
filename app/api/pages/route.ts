// app/api/pages/route.ts
import { createPage, getAllPages } from '@/app/services/pageService';


// handles get all posts
export async function GET(request: Request) {
   
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '6', 10); // Default limit of 4
    const offset = parseInt(url.searchParams.get('offset') || '0', 10); // Default offset of 0
  
    try {
     const businesses = await getAllPages(limit, offset);

      

      
  
      return new Response(JSON.stringify(businesses), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching page:', error);
      return new Response('Failed to fetch pages', { status: 500 });
    }
  }

export async function POST(request: Request) {
  
    try {
      const { name, owner } = await request.json();
      const newPage = await createPage(name, owner);
  
      return new Response(JSON.stringify(newPage), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating page:', error);
      return new Response('Failed to create page', { status: 500 });
    }
}








































