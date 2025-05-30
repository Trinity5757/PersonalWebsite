// app/api/events/[id]/route.ts
// implement event services to reterive mongoDB data
// separation of logic and data layer
import { getEventById, updateEventById, deleteEventById } from '@/app/services/eventService';

// Note - server side to only use fetch and not axios

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const event = await getEventById(id);

    // If event not found
    if (!event) {
      return new Response('Event not found', { status: 404 });
    }

    // Return the event data a
    return new Response(JSON.stringify(event), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return new Response('Failed to fetch event', { status: 500 });
  }

}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes


  // Check if the ID parameter is missing
  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const updatedEventData = await request.json(); // Get the updated event data from the request body
    const event = await updateEventById(id, updatedEventData);


    if (!event) {
      return new Response('Event not found', { status: 404 });
    }


    // Return the updated event data 
    return new Response(JSON.stringify(event), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return new Response('Failed to update event', { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;


  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const event = await deleteEventById(id);

    // If event not found

    if (!event) {
      return new Response('Event not found', { status: 404 });
    }

    // Return the updated event data 
    return new Response(JSON.stringify({
      "message": "Event deleted successfully with id: " + event._id,
      "event": event
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return new Response('Failed to delete event', { status: 500 });
  }
}

