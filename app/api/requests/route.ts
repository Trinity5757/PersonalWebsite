import { RequestType } from '@/app/models/enums/RequestType';
import { sendFollowRequest, sendFriendRequest } from '@/app/services/requestService';

export async function POST(request: Request) {
  try {
    const { requesterId, requesterType, requesteeId, requesteeType, requestType } = await request.json();

    // Validate required fields
    if (!requesterId || !requesteeId || !requestType || !requesterType || !requesteeType) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Requester ID, Requestee ID, Request Type, Requester Type, and Requestee Type are required.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let result;

    // Handle different request types
    if (requestType === RequestType.FOLLOW) {
      result = await sendFollowRequest(requesterId, requesterType.toLowerCase(), requesteeId, requesteeType.toLowerCase());
    } else if (requestType === RequestType.FRIEND) {
      if (requesterType.toLowerCase() !== 'user' || requesteeType.toLowerCase() !== 'user') {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Friend requests are only allowed between users.',
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      result = await sendFriendRequest(requesterId, requesteeId);
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid request type.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Respond with the result
    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error sending request:', error);

    // Handle known error cases
    if (error.status && error.message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.message,
        }),
        { status: error.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle unknown errors
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to send request. Please try again later.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
