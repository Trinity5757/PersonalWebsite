// app/api/requests/users-type/[id]/route.ts
import { RequestType } from '@/app/models/enums/RequestType';
import { getFollowRequestsForUser, getFriendRequestsForUser, getSentFollowRequestsForUser, getSentFriendRequestsForUser, updateFriendRequestStatus } from '@/app/services/requestService';


// Retrieving Follow or Friend Requests
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const requestType = searchParams.get('requestType');
    const direction = searchParams.get('direction');
    const allowAll = searchParams.get('allowAll') === 'true'; // get both

    if (!userId || (!allowAll && !requestType)) {
        return new Response('User ID is required, and Request Type is required unless allowAll is true.', { status: 400 });
    }

    let requests;

    if (allowAll) {
        // Fetch both friend and follow requests
        if (direction === 'sent') {
            const sentFollows = await getSentFollowRequestsForUser(userId);
            const sentFriends = await getSentFriendRequestsForUser(userId);
            requests = [...sentFollows, ...sentFriends];
        } else {
            const receivedFollows = await getFollowRequestsForUser(userId);
            const receivedFriends = await getFriendRequestsForUser(userId);
            requests = [...receivedFollows, ...receivedFriends];
        }
    } else if (direction === 'sent') {
        if (requestType === RequestType.FOLLOW) {
            requests = await getSentFollowRequestsForUser(userId);
        } else if (requestType === RequestType.FRIEND) {
            requests = await getSentFriendRequestsForUser(userId);
        } else {
            return new Response('Invalid request type', { status: 400 });
        }
    } else {
        if (requestType === RequestType.FOLLOW) {
            requests = await getFollowRequestsForUser(userId);
        } else if (requestType === RequestType.FRIEND) {
            requests = await getFriendRequestsForUser(userId);
        } else {
            return new Response('Invalid request type', { status: 400 });
        }
    }

    return new Response(JSON.stringify(requests), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}