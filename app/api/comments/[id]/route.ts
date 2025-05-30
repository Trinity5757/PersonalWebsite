import { deleteComment, getComment, updateComment } from "@/app/services/commentService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const comment = await getComment(id);

    return new Response(JSON.stringify(comment), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Failed to get comment: ${error}`, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const updatedCommentData = await request.json();

    const comment = await updateComment(id, updatedCommentData.text);

    return new Response(JSON.stringify(comment), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(`Failed to update comment: ${error}`, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const comment = await deleteComment(id);

    return new Response(JSON.stringify({
      message: `Comment with ID ${id} was successfully deleted`,
      comment
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(`Failed to delete comment: ${error}`, { status: 500 });
  }
}

