// app/api/users/[id]/route.ts
// implement user services to reterive mongoDB data
// separation of logic and data layer
import { getUserById, updateUserById, deleteUserById } from '@/app/services/userService';


// Note - server side to only use fetch and not axios

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const user = await getUserById(id);

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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const updatedUserData = await request.json(); // Get the updated user data from the request body
    const user = await updateUserById(id, updatedUserData);

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found or invalid ID' }), { status: 404 });
    }

    // Return the updated user data 
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response('Failed to update user', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const user = await deleteUserById(id);

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    // Return the updated user data 
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response('Failed to update user', { status: 500 });
  }
}