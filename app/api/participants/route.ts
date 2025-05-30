// app/api/participants/route.ts

import { createParticipant, getAllParticipants } from "@/app/services/chatServices/participantService";

export async function GET(request: Request) {
    try {

        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);
        const participants = await getAllParticipants(page, limit);
      return new Response(JSON.stringify(participants), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error fetching participants:', error);
      return new Response('Failed to fetch participants', { status: 500 });
    }
  }


export async function POST(request: Request) {
    try {
      const { chatId, userId, role } = await request.json();
      const newParticipant = await createParticipant(chatId, userId, role);
      return new Response(JSON.stringify(newParticipant), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating participant:', error);
      return new Response('Failed to create participant', { status: 500 });
    }
  }
