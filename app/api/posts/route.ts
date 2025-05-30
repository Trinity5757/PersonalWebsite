// app/api/posts/route.ts
import { createPost, getAllPosts } from '@/app/services/postService';
import { protectedRouteMiddleware } from '../auth/middleware/protectedRoute';


// handles get all posts
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
    const posts = await getAllPosts(page, limit, fieldsToSelect);

    return new Response(JSON.stringify(
      {
        posts: posts.posts,
        totalPosts: posts.totalPosts,
        totalPages: posts.totalPages,
        currentPage: posts.currentPage
      }
    ), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response('Failed to fetch posts', { status: 500 });
  }
}

export async function POST(request: Request) {

  try {
    const { caption, tags, location, created_by, media } = await request.json();
    //const user = await getUserById(created_by);
    const newPost = await createPost(caption, tags, location, created_by, media);

    return new Response(JSON.stringify(newPost), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response('Failed to create post', { status: 500 });
  }
}








































