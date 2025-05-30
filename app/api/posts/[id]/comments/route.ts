//app/api/posts/[id]/comments/route.ts

import { getCommentsByPost } from "@/app/services/commentService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '5', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const comments = await getCommentsByPost(id, limit, offset);

    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Failed to get comments for post: ${error}`, { status: 500 });
  }
}
