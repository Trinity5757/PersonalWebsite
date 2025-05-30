// app/api/business/route.ts
import { createBusiness, getAllBusinesses } from '@/app/services/businessService';

// handles get all posts
export async function GET(request: Request) {
   
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '6', 10); // Default limit of 4
    const offset = parseInt(url.searchParams.get('offset') || '0', 10); // Default offset of 0
  
    try {
     const businesses = await getAllBusinesses(limit, offset);
      return new Response(JSON.stringify(businesses), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching business:', error);
      return new Response('Failed to fetch business', { status: 500 });
    }
  }

export async function POST(request: Request) {
  
    try {
      const { businessName, owner, cover_picture, profilePicture, tags, category, address, website, contactEmail, phone} = await request.json();
      const newBusiness = await createBusiness(businessName, owner, cover_picture, profilePicture, tags, category, address, website, contactEmail, phone);
  
      return new Response(JSON.stringify(newBusiness), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating business:', error);
      return new Response('Failed to create business', { status: 500 });
    }
}








































