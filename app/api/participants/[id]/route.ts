// app/api/participants/[id]/route.ts
import { deleteParticipantById, getParticipantById, updateParticipantById } from '@/app/services/chatServices/participantService';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes


  // Check if the ID parameter is missing
  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const participant = await getParticipantById(id);

    // If participant not found
    if (!participant) {
      return new Response('Participant not found', { status: 404 });
    }

    // Return the participant data a
    return new Response(JSON.stringify(participant), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching participant:', error);
    return new Response('Failed to fetch participant', { status: 500 });
  }

}

// PUT : Update a participant
// update role or paticipant detials

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const updatedParticipantData = await request.json(); // Get the updated participant data from the request body

    const participant = await updateParticipantById(id, updatedParticipantData);


    // If particpant not found
    if (!participant) {
      return new Response(JSON.stringify({ error: 'Participant not found or invalid ID' }), { status: 404 });
    }

    // Return the updated participant data 
    return new Response(JSON.stringify(participant), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating participant:', error);
    return new Response('Failed to update participant', { status: 500 });
  }
}

// DELETE : Delete a participant
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Get the participant ID from the query parameters

  // Check if the ID parameter is missing
  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {

    const participant = await deleteParticipantById(id);

    // delete participant by ID

    // If particpant not found
    if (!participant) {
      return new Response('User not found', { status: 404 });
    }


    // Return the updated participant data 
    return new Response(JSON.stringify(participant), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating participant:', error);
    return new Response('Failed to update participant', { status: 500 });
  }
}

