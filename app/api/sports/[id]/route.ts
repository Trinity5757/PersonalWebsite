// app/api/sports/[id]/route.ts

import { getSportById, updateSportById, deleteSportById } from '@/app/services/sportService';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sport = await getSportById(id);
    
    return new Response(JSON.stringify(sport), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sport:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return new Response('Sport not found', { status: 404 });
    }
    
    return new Response('Failed to fetch sport', { status: 500 });
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestBody = await request.json();
    
    const { sport, page } = await updateSportById(id, requestBody);
    
    return new Response(JSON.stringify({ sport, page }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating sport:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return new Response('Sport not found', { status: 404 });
    }
    
    return new Response('Failed to update sport', { status: 500 });
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deletedSport = await deleteSportById(id);
    
    return new Response(JSON.stringify(deletedSport), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting sport:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return new Response('Sport not found', { status: 404 });
    }
    
    return new Response('Failed to delete sport', { status: 500 });
  }
}