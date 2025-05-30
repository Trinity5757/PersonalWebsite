// api/chatRoutes/[id]/route.ts
import { deleteChatRoomById, getChatRoomById, updateChatRoomById } from "@/app/services/chatServices/chatRoomService";

// GET: Get a specific chat room by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    if (!id) {
      return new Response(JSON.stringify({ error: "Chat room ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    //  fetch the chat room by ID
    const chatRoom = await getChatRoomById(id);

    if (!chatRoom) {
      return new Response(JSON.stringify({ error: "Chat room not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(chatRoom), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching chat room:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat room" }),
      { status: 500 }
    );
  }

}

// DELETE: Delete a chat room
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    if (!id) {
      return new Response(JSON.stringify({ error: "Chat room ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }


    const chatroom = await deleteChatRoomById(id);


    if (!chatroom) {
      return new Response(JSON.stringify({ error: "Chat room not found with given ID" + id }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }


    return new Response(JSON.stringify({ message: "Chat room deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting chat room:", error);


    return new Response(
      JSON.stringify({ error: "Failed to delete chat room with given ID" + id }),
      { status: 500 }
    )
  }
}


// PUT: Update chat room details
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {

    const data = await request.json();

    if (!id || !data) {
      return new Response(JSON.stringify({ error: "Chat room ID and update data are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (data.name && typeof data.name !== "string") {
      return new Response(JSON.stringify({ error: "Invalid name format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedChatRoom = await updateChatRoomById(id, data);

    if (!updatedChatRoom) {
      return new Response(JSON.stringify({ error: "Chat room not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedChatRoom), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error on update chat room", error)
    return new Response(
      JSON.stringify({ error: "Failed to update chat room" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
