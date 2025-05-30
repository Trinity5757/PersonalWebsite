// app/api/users/route.ts
import { getAllUsers } from '@/app/services/userService';
import { protectedRouteMiddleware } from "@/app/api/auth/middleware/protectedRoute";
export async function GET(request: Request) {

  const authResponse = await protectedRouteMiddleware(request);
  
  if (authResponse) {
    return authResponse;
  }

  
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10); // Default page of 1
  const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default limit of 10
  const fieldsToSelect = url.searchParams.get('fields') || "-password";
  

  try {

    const { users, totalUsers, totalPages, currentPage } = await getAllUsers(page, limit, fieldsToSelect);

    return new Response(
      JSON.stringify({
        users,
        metadata: {
          totalUsers,
          totalPages,
          currentPage,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response('Failed to fetch users', { status: 500 });
  }
}