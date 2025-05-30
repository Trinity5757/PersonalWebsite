// app/api/users/[id]/route.ts
// implement user services to reterive mongoDB data
// separation of logic and data layer
import { getUserByUsername } from '@/app/services/userService';



export async function GET(request: Request, { params }: { params: Promise<{ memberUsername: string }> }) {
  const { memberUsername } = await params; // get id from params to comply with dyanmic routes


  // Check if the ID parameter is missing
  if (!memberUsername) {
    return new Response('username query parameter is required', { status: 400 });
  }

  try {
    const user = await getUserByUsername(memberUsername);

    // If user not found
    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // Return the user data a
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response('Failed to fetch user', { status: 500 });
  }

}