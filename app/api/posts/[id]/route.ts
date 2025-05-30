// app/api/posts/[id]/route.ts to handle requests with ids

// app/api/posts/route.ts to handle requests get all
// to handle pagination of offset

import { deletePostById, getPostById, updatePostById } from '@/app/services/postService';
import { Types } from 'mongoose';
// Note - server side to only use fetch and not axios

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes
  // Check if the ID parameter is missing
  if (!Types.ObjectId.isValid(id)) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {

    // Fetch post by ID, excluding the password
    const post = await getPostById(id);

    // If post not found
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    // Return the post data a
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response('Failed to fetch post', { status: 500 });
  }

}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // get id from params to comply with dyanmic routes

  // Check if the ID parameter is missing
  if (!Types.ObjectId.isValid(id)) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const updatedPostData = await request.json(); // Get the updated post data from the request body

    // Update post by ID
   
    //const post = await Post.findByIdAndUpdate(id, updatedPostData, { new: true }); 
    const post = await updatePostById(id, updatedPostData);
    console.log("updatedPostData", post.caption + " " + post.tags + " " + post.location);

    // If post not found
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    // Return the updated post data 
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return new Response('Failed to update post', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Get the post ID from the query parameters

  // Check if the ID parameter is missing
  if (!Types.ObjectId.isValid(id)) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    // Update post by ID
    const post = await deletePostById(id);

    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    // Return the updated post data 
    return new Response(JSON.stringify({
      message: `Post with ID ${id} was successfully deleted`,
      post,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(JSON.stringify({
      message: 'Failed to delete post',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

