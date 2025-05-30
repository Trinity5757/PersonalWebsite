// app/api/messages/[id]/route.ts
// implement message services to reterive mongoDB data
// separation of logic and data layer
import { getMessageById, updateMessageById, deleteMessageById } from '@/app/services/chatServices/messageService';

// Note - server side to only use fetch and not axios

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes


  // Check if the ID parameter is missing
  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const message = await getMessageById(id);

    // If message not found
    if (!message) {
      return new Response('Message not found', { status: 404 });
    }

    // Return the message data a
    return new Response(JSON.stringify(message), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    return new Response('Failed to fetch message', { status: 500 });
  }

}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes


  // Check if the ID parameter is missing
  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const updatedMessageData = await request.json(); // Get the updated message data from the request body
    const message = await updateMessageById(id, updatedMessageData);

    // Update message by ID


    // If message not found
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message not found or invalid ID' }), { status: 404 });
    }

    // Return the updated message data 
    return new Response(JSON.stringify(message), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return new Response('Failed to update message', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Get the message ID from the query parameters

  // Check if the ID parameter is missing
  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {

    const message = await deleteMessageById(id);

    // delete message by ID

    // If message not found
    if (!message) {
      return new Response('Message not found', { status: 404 });
    }


    // Return the updated message data 
    return new Response(JSON.stringify(message), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return new Response('Failed to update message', { status: 500 });
  }
}
