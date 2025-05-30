import { blockUser, getBlockedUsers, getUsersWhoBlocked, removeBlockedUser } from "@/app/services/blockService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const searchForUsersBlockList = searchParams.get('searchForUsersBlockList');

    let blockEntityList = [];
    if (searchForUsersBlockList === 'true') {
      blockEntityList = await getBlockedUsers(id);
    } else {
      blockEntityList = await getUsersWhoBlocked(id);
    }

    return new Response(JSON.stringify(blockEntityList), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(`Failed to fetch users blocked list: \n${error}`, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const { blockedMember } = await request.json();

    const blockedUser = await blockUser(id, blockedMember);

    return new Response(JSON.stringify(blockedUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(`Failed to add user to users blocked list: \n${error}`, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return new Response('ID query parameter is required', { status: 400 });
  }

  try {
    const { blockedMember } = await request.json();

    const deletedBlockEntity = await removeBlockedUser(id, blockedMember);

    return new Response(JSON.stringify(deletedBlockEntity), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(`Failed to remove user from users blocked list: \n${error}`, { status: 500 });
  }
}