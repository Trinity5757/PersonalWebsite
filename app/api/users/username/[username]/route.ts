// app/api/users/[id]/route.ts
// implement user services to reterive mongoDB data
// separation of logic and data layer
import { getUserByUsername } from '@/app/services/userService';


// Note - server side to only use fetch and not axios

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  if (!username) {
    return new Response('username query parameter is required', { status: 400 });
  }

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // Return the user data
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response('Failed to fetch user', { status: 500 });
  }
}