// app/api/sports/route.ts

import { getAllSports, createSport } from '@/app/services/sportService';
import { create } from 'domain';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '6', 10); // Default limit of 6
  const offset = parseInt(url.searchParams.get('offset') || '0', 10); // Default offset of 0

  try {
    const sports = await getAllSports(limit, offset);
    return new Response(JSON.stringify(sports), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sports:', error);
    return new Response('Failed to fetch sports', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { sportName, description, createdBy, icon, slug } = await request.json();
    
    const newSport = await createSport(sportName, description, createdBy, icon, slug);

    return new Response(JSON.stringify(newSport), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating sport:', error);
    return new Response('Failed to create sport', { status: 500 });
  }
}