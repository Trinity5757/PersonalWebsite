// app/api/teams/[id]/route.ts
// implement team services to reterive mongoDB data
// separation of logic and data layer
import { getTeamById, updateTeamById, deleteTeamById, getTeamBySlug } from '@/app/services/teamService';
import { Types } from 'mongoose';

// Note - server side to only use fetch and not axios

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes

  // Check if the ID parameter is missing
  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {

    let team;
    // if valid mongoDB id
    if (Types.ObjectId.isValid(id)) {
      team = await getTeamById(id);
    } else {
      // if not valid mongoDB id but a potential team name
      team = await getTeamBySlug(id);
    }

    // If team not found
    if (!team) {
      return new Response('Team not found', { status: 404 });
    }

    // Return the team data a
    return new Response(JSON.stringify(team), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    return new Response('Failed to fetch team', { status: 500 });
  }

}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes


  // Check if the ID parameter is missing
  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const updatedTeamData = await request.json(); // Get the updated team data from the request body
    const team = await updateTeamById(id, updatedTeamData);
    // Update team by ID


    // If team not found
    if (!team) {
      return new Response('Team not found', { status: 404 });
    }


    // Return the updated team data 
    return new Response(JSON.stringify(team), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating team:', error);
    return new Response('Failed to update team', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } =  await params; // Get the team ID from the query parameters

  // Check if the ID parameter is missing

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const team = await deleteTeamById(id);

    if (!team) {
      return new Response('Team not found', { status: 404 });
    }

    // Return the updated team data 
    return new Response(JSON.stringify({
      "message": "Team deleted successfully with id: " + team._id,
      "team": team
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting team:', error);
    return new Response('Failed to delete team', { status: 500 });
  }
}
