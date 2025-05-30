//app/likes/[user]/[type]

import { LikeType } from "@/app/models/enums/LikeType";
import { getUsersLikesByType } from "@/app/services/likeServices";

// Get a users likes by type
export async function GET(request: Request, { params }: { params: Promise<{ user: string, type: LikeType }> }) {

  const { user, type } = await params;

  try {
    const likes = await getUsersLikesByType(user, type);

    return new Response(JSON.stringify(likes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error fetching users ${type} likes`, error);
    return new Response(`Failed to fetch users ${type} likes: \n${error}`, { status: 500 });
  }
}