// app/api/chatRoutes/[id]/participants/route.ts

import { addParticipants } from "@/app/services/chatServices/participantService";

// add multiple participants to chat room
// check if chat exists
// add participants if they don't exist
// PATCH: Update chat room details
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const participants = await request.json();

  if (participants)

    if (!id || !participants || !Array.isArray(participants)) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

  try {

    const updatedChatRoom = await addParticipants(id, participants);

    if (!updatedChatRoom) {
      return new Response(JSON.stringify({ error: "Chat room not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({
      message: "Chat room updated successfully with participants",
      updatedChatRoom

    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });


  } catch (error) {

    if (error.code === 11000) {
      return new Response(
        JSON.stringify({ error: "Some participants are already added." }),
        {
          status: 409, // 409 Conflict
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.error("Error adding participants:", error);

    return new Response(
      JSON.stringify({ error: "Failed to update chat room" + error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


