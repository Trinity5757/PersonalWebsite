// app/api/requests/[id]/route.ts
import { deleteRequestById, getRequestById, updateFollowRequest, updateFriendRequestStatus } from '@/app/services/requestService';

// GET - Retrieve Request by ID

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }


  try {
    const requestToFind = await getRequestById(id);

    if (!requestToFind) {
      return new Response('Request not found', { status: 404 });
    }

    return new Response(JSON.stringify(requestToFind), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching request:', error);
    return new Response('Failed to fetch request', { status: 500 });
  }
}

// DELETE - Delete Request by ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id?: string }> }) {

  const { id } = await params;


  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }


  try {
    const requestToDelete = await deleteRequestById(id);

    if (!requestToDelete) {
      return new Response('Request not found', { status: 404 });
    }


    return new Response(JSON.stringify(requestToDelete), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    return new Response('Failed to delete request', { status: 500 });
  }
}

// PUT - Update Request Status by ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new Response('Request ID is required', { status: 400 });
  }

  try {
    const { status, requestType } = await request.json();

    let updatedRequest;


    if (requestType === 'friend') {
      updatedRequest = await updateFriendRequestStatus(id, { status });
    } else if (requestType === 'follow') {
      updatedRequest = await updateFollowRequest(id, { status });
    } else {
      updatedRequest = await updateFollowRequest(id, { status });
    }

    if (!updatedRequest) {
      return new Response('Failed to update request or request not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedRequest), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating friend request status:', error);
    return new Response('Failed to update friend request status', { status: 500 });
  }
}
