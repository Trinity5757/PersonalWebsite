// app/api/business/[id]/route.ts to handle requests with ids

// app/api/business/route.ts to handle requests get all
// to handle pagination of offset

import { deleteBusinessById, getBusinessById, updateBusinessById } from '@/app/services/businessService';
import { Types } from 'mongoose';


// Note - server side to only use fetch and not axios

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes
  // Check if the ID parameter is missing
  if (!Types.ObjectId.isValid(id)) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {

    // Fetch business by ID, excluding the password
    const business = await getBusinessById(id);

    // If business not found
    if (!business) {
      return new Response('business not found', { status: 404 });
    }

    // Return the business data a
    return new Response(JSON.stringify(business), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching business:', error);
    return new Response('Failed to fetch business', { status: 500 });
  }

}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes


  // Check if the ID parameter is missing
  if (!Types.ObjectId.isValid(id)) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const updatedBusinessData = await request.json(); // Get the updated business data from the request body


    // Update business by ID
    console.log("updatedBusinessData", updatedBusinessData, id);
    const business = await updateBusinessById(id, updatedBusinessData);

    // If business not found
    if (!business) {
      return new Response('business not found', { status: 404 });
    }


    // Return the updated business data 
    return new Response(JSON.stringify(business), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating business:', error);
    return new Response('Failed to update business', { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Get the business ID from the query parameters

  // Check if the ID parameter is missing
  if (!Types.ObjectId.isValid(id)) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {

    // Update business by ID
    const business = await deleteBusinessById(id);

    // If business not found
    if (!business) {
      return new Response('Business not found', { status: 404 });
    }


    // Return the updated business data 
    return new Response(JSON.stringify({
      message: 'Business deleted successfully with ID: ' + id,
      business
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting business:', error);
    return new Response('Failed to delete business', { status: 500 });
  }
}
