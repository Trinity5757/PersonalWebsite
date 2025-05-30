//app/api/organization/members/[memberId]/route.ts

import { removeMember, updateMember } from "@/app/services/memberService";

export async function DELETE(request: Request, { params }: { params: Promise<{ memberId: string }> }) {

  try {
    const { memberId } = await params;
    const deletedLike = await removeMember(memberId);

    return new Response(JSON.stringify(deletedLike), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error removing member: ', error);
    return new Response(`Failed to delete member from organization: ${error}`, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ memberId: string }> }) {

  try {
    const { memberId } = await params;
    const memberData = await request.json();
    const updatedMember = await updateMember(memberId, memberData);

    return new Response(JSON.stringify(updatedMember), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error updating member: ', error);
    return new Response(`Failed to update member data: ${error}`, { status: 500 });
  }
}
