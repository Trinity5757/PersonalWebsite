// app/api/teams/route.ts

import { getAllTeams, createTeam } from '@/app/services/teamService';

export async function GET(request: Request) {
   
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10); // Default limit of 4
  const offset = parseInt(url.searchParams.get('offset') || '0', 10); // Default offset of 0

  try {
   const teams = await getAllTeams(limit, offset);
    return new Response(JSON.stringify(teams), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return new Response('Failed to fetch teams', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {

    const { name, sportType, owner, cover_picture, profilePicture} = await request.json();
    
    const newTeam = await createTeam(name, sportType, owner, cover_picture, profilePicture);
//"message": "Team created successfully with id: " + newTeam._id,
    return new Response(JSON.stringify(newTeam), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating team:', error);
    return new Response('Failed to create team', { status: 500 });
  }
}