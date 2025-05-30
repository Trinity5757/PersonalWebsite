// api/chatRoutes/route.ts

import { getAllChatRooms } from "@/app/services/chatServices/chatRoomService";



// GET: Fetch all chat rooms for a specific user
export async function GET() {

  try {
    const chatRooms = await getAllChatRooms();

    return new Response(JSON.stringify(chatRooms), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch chat rooms' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
