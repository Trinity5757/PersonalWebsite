// api/chatRoutes/route.ts

import { createChatRoom, getAllChatRooms, /*getAllChatRooms,*/ getChatRoomsByUser } from "@/app/services/chatServices/chatRoomService";



// GET: Fetch all chat rooms for a specific user
export async function GET(request: Request) {
  const url = new URL(request.url);
  const getAll = url.searchParams.get('getAll');
  const userId = url.searchParams.get('userId');


  if (!userId && !getAll) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }



  try {
    if (getAll) {
      const chatRooms = await getAllChatRooms();
      return new Response(JSON.stringify(chatRooms), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } 


    if (userId) {

      const userChats = await getChatRoomsByUser(userId);
      return new Response(JSON.stringify({
        message: 'Chat rooms fetched successfully',
        totalChatRooms: userChats.length, 
        userId: userId,
        userChats: userChats
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    }



  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch chat rooms' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST: Create a new chat room
export async function POST(request: Request) {
  try {
    const { userId, chatName, role, participants } = await request.json();

    if (!userId  || !chatName || !role|| !participants) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json'  },
      });
    }

    

    const newChatRoom = await createChatRoom({
      userId,
      role,
      chatName,
      participants,
    });

    return new Response(JSON.stringify(newChatRoom), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating chat room:', error);
    return new Response(JSON.stringify({ error: 'Failed to create chat room' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

