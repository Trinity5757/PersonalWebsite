// app/api/invites/route.ts

import { createInvite } from "@/app/services/inviteService";

export async function POST(request: Request) {
  try {
    const { inviter, associatedEntity, invitees, title, message } = await request.json();
    const invite = await createInvite(inviter, associatedEntity, invitees, title, message);

    return new Response(JSON.stringify(invite), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    return new Response(`Failed to generate invite: ${error}`);
  }

}