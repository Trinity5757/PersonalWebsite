// app/api/invites/[id]/route.ts

import { deleteEntitiesInvites, deleteInvite, getInvitesByEntity, getInvitesById, updateInvite } from "@/app/services/inviteService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const url = new URL(request.url);
    const searchType = url.searchParams.get('searchType');

    if (!searchType) {
      return new Response('SearchType is not defined', { status: 400 });
    }

    let inviteResults;
    if (searchType === 'inviteId') {
      inviteResults = await getInvitesById(id);
    } else if (searchType === 'entityId') {
      inviteResults = await getInvitesByEntity(id);
    }

    return new Response(JSON.stringify(inviteResults), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });


  } catch (error) {
    return new Response(`Failed to retrieve invite(s): ${error}`, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const url = new URL(request.url);
    const deleteType = url.searchParams.get('deleteType');

    if (!deleteType) {
      return new Response('deleteType is not defined', { status: 400 });
    }

    let deletionResults;
    if (deleteType === 'inviteId') {
      deletionResults = await deleteInvite(id);
    } else if (deleteType === 'entityId') {
      deletionResults = await deleteEntitiesInvites(id);
    }

    return new Response(JSON.stringify(deletionResults), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });


  } catch (error) {
    return new Response(`Failed to delete invite(s): ${error}`, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { editorId, ...updatedData } = await request.json();

    const updatedInvite = await updateInvite(id, editorId, updatedData);

    return new Response(JSON.stringify(updatedInvite), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Failed to update invite: ${error}`, { status: 500 });
  }
}