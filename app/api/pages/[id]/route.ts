// app/api/page/[id]/route.ts to handle requests with ids

// app/api/page/route.ts to handle requests get all
// to handle pagination of offset

import { deletePageById, getPageById, updatePageById } from '@/app/services/pageService';
import { Types } from 'mongoose';


// Note - server side to only use fetch and not axios

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes
  // Check if the ID parameter is missing
  if (!Types.ObjectId.isValid(id)) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {

    // Fetch page by ID, excluding the password
    const page = await getPageById(id);

    // If page not found
    if (!page) {
      return new Response('Page not found', { status: 404 });
    }

    // Return the page data a
    return new Response(JSON.stringify(page), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    return new Response('Failed to fetch page', { status: 500 });
  }

}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes


  // Check if the ID parameter is missing
  if (!Types.ObjectId.isValid(id)) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const updatedPageData = await request.json(); // Get the updated page data from the request body


    // Update page by ID
    console.log("updatedpageData", updatedPageData, id);
    const page = await updatePageById(id, updatedPageData);

    // If page not found
    if (!page) {
      return new Response('page not found', { status: 404 });
    }


    // Return the updated page data 
    return new Response(JSON.stringify(page), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating page:', error);
    return new Response('Failed to update page', { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Get the page ID from the query parameters

  // Check if the ID parameter is missing
  if (!Types.ObjectId.isValid(id)) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    // Update page by ID
    const page = await deletePageById(id);

    // If page not found
    if (!page) {
      return new Response('Page not found', { status: 404 });
    }


    // Return the updated page data 
    return new Response(JSON.stringify(
      {
        message: 'Page deleted successfully with ID: ' + id,
        page
      }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    return new Response('Failed to delete page', { status: 500 });
  }
}

