import { connectDB } from "@/app/lib/connectDB";
import { createOrFindChatRoom } from "@/app/services/chatServices/chatRoomService";


export async function POST(request: Request, { }: { params: Promise<{ id: string }> }) {

  const { senderId, participantId } = await request.json();

  if (!senderId || !participantId) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await connectDB();
    const chat = await createOrFindChatRoom(senderId, participantId);

    if (!chat) {
      return new Response(JSON.stringify({ error: "Failed to create or find chat." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify(chat), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Failed to create or find chat. Error: ${error}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
