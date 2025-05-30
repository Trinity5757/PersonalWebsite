import { getUserFollowersById, getUserFollowingById, getUserFriendsById } from "@/app/services/requestService";
import { getUserById } from "@/app/services/userService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = params; // Get ID from params

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    // Get followers and requester details
    const [followers, following, friends, user ] = await Promise.all([
      getUserFollowersById(id),
      getUserFollowingById(id),
      getUserFriendsById(id),
      getUserById(id)
    ]);

    if (!followers || followers.length === 0) {
      return new Response(JSON.stringify({
        message: `No followers found for user ${user?.username || 'unknown'}.`,
        followerCount: 0,
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = {
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar_image,
      },
      followerCount: followers.length,
      followingCount: following.length,
      friendCount: friends.length,
      followers: followers.map(follower => ({
        id: follower.id,
        username: follower.username,
        avatar: follower.avatar_image,
      })),
      following: following.map(following => ({
        id: following.id,
        username: following.username,
        avatar: following.avatar_image,
      })),
      friends: friends.map(friend => ({
        id: friend.id,
        username: friend.username,
        avatar: friend.avatar_image,
      })),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching user followers:', error);
    return new Response('Failed to fetch user followers', { status: 500 });
  }
}
