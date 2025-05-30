//app/api/comments/route.ts

import { createComment } from "@/app/services/commentService";

// Create comment 
export async function POST(request: Request) {
  
  try {
    const { userId, postId, text, parentId  } = await request.json();

    const newComment = await createComment(userId, postId, text, parentId? parentId : null);

    return new Response(JSON.stringify(newComment), {
      status: 201,
      headers: { 'Content-Type': 'application/json'},
    });
  } catch(error) {
    return new Response(`Failed to create comment: ${error}`, { status: 500 });
  }

}