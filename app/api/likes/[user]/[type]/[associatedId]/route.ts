// app/api/likes/[user]/[type]/[associatedId]/route.ts

import { LikeType } from "@/app/models/enums/LikeType";
import { getObjectLikes, getLike, createLike, deleteLike } from "@/app/services/likeServices";

// Get all likes from a speccific comment/post
export async function GET(request: Request, { params }: { params: Promise<{ user: string, type: LikeType, associatedId: string }> }) {
  const { user, type, associatedId } = await params;

  if (user === 'all-users') { // Get all users that liked a given post, comment, etc.
    try {
      const likes = await getObjectLikes(associatedId, type);

      return new Response(JSON.stringify(likes), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(`Error fetching likes for ${type}`, error);
      return new Response(`Failed to fetch likes for ${type}`, { status: 500 });
    }
  }
  else { // Get a specific like from a post, comment, etc.
    try {
      // console.log("\n" +user, type, associatedId);
      const like = await getLike(user, type, associatedId);
      // If no like exists just return null
      return new Response(JSON.stringify(like), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(`Error fetching like`, error);
      return new Response(`Failed to fetch like for ${type}: \n${error}`, { status: 500 });
    }
  }

}

// A user likes a comment/post
export async function POST(request: Request, { params }: { params: Promise<{ type: LikeType, associatedId: string, user: string }> }) {

  const { type, associatedId, user } = await params;

  try {

    const newLike = await createLike(user, associatedId, type);

    return new Response(JSON.stringify(newLike), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating like:', error);
    return new Response(`Failed to create like \n${error}`, { status: 500 });
  }

}

// A user unlikes a specific comment/post
export async function DELETE(request: Request, { params }: { params: Promise<{ type: LikeType, associatedId: string, user: string }> }) {

  const { type, associatedId, user } = await params;

  try {

    const like = await deleteLike(user, associatedId, type);

    if (!like) {
      return new Response('Like was not found', { status: 404 });
    }

    return new Response(JSON.stringify(like), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error deleting like:', error);
    return new Response(`Failed to delete like: \n${error}`, { status: 500 });
  }

}