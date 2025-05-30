//app/api/organization/[organizationId]/route.ts

import { addMember, getOrganizationMembers } from "@/app/services/memberService";

export async function GET(request: Request, { params }: { params: Promise<{ organizationId: string }> }) {

  try {
    const { organizationId } = await params;

    const members = await getOrganizationMembers(organizationId);

    return new Response(JSON.stringify(members), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Failed to get all members from organization: ${error}`, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ organizationId: string }> }) {

  try {
    const { organizationId } = await params;

    const { userId, organizationType, role } = await request.json();
    const newMember = await addMember(userId, organizationId, organizationType, role);


    return new Response(JSON.stringify(newMember), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(`Failed to add member to organization: ${error}`, { status: 500 });
  }
}
