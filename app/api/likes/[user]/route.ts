// app/api/likes/[userId]/[objectId]

import { getUsersLikes } from "@/app/services/likeServices";

// Get all the users likes
export async function GET(request: Request, { params }: { params: Promise<{ user: string }> }) {

  const { user } = await params;

  try {
    const userLikes = await getUsersLikes(user);

    if (userLikes.length <= 0) {
      return new Response("Couldn't find likes for given user", { status: 404 });
    }

    return new Response(JSON.stringify(userLikes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching users likes:', error);
    return new Response(`Failed to fetch users likes: ${error}`, { status: 500, headers: { 'Content-Type': 'text/plain' } });
  }
}
