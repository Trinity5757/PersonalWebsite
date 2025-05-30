import { connectDB } from '@/app/lib/connectDB';
import mongoose, { ObjectId, Types } from 'mongoose';
import { IRequest, Request } from '../models/Request';
import { RequestStatus } from '../models/enums/RequestStatus';
import { RequestType } from '../models/enums/RequestType';
import { User } from '../models/Users';
import { Business } from '../models/Business';
import { Team } from '../models/Team';
import { Page } from '../models/Page';


// get a request by id
export async function getRequestById(requestId: string) {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(requestId)) {
      throw new Error('Invalid request ID format');
    }
    const request = await Request.findById(new Types.ObjectId(requestId));
    if (!request) {
      return null;
    }
    return request;
  } catch (error) {
    console.error('Error fetching request:', error);
    throw new Error('Failed to fetch request');
  }
}

export async function deleteRequestById(requestId: string) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(requestId)) {
      throw new Error('Invalid request ID format');
    }

   
    const request = await Request.findById(requestId);
    if (!request) {
      return null;
    }

    const { requester, requestee, requestType } = request;

    // Fetch the requester and requestee
    const requesterUser = await User.findById(requester);
    const requesteeUser = await User.findById(requestee);

    if (!requesterUser || !requesteeUser) {
      throw new Error('Requester or requestee user not found');
    }

    if (requestType === RequestType.FOLLOW) {
      // Remove requester from requestee's followers
      requesteeUser.followers = requesteeUser.followers.filter(
        (followerId: ObjectId) => followerId.toString() !== requester.toString()
      );

      // Remove requestee from requester's following
      requesterUser.following = requesterUser.following.filter(
        (followeeId: ObjectId) => followeeId.toString() !== requestee.toString()
      );

      await requesterUser.save();
      await requesteeUser.save();
    } else if (requestType === RequestType.FRIEND) {
    
      requesteeUser.friends = requesteeUser.friends.filter(
        (friendId: ObjectId) => friendId.toString() !== requester.toString()
      );

      requesterUser.friends = requesterUser.friends.filter(
        (friendId: ObjectId) => friendId.toString() !== requestee.toString()
      );

      await requesterUser.save();
      await requesteeUser.save();
    }

    // Delete the request
    const deletedRequest = await Request.findByIdAndDelete(requestId);
    if (!deletedRequest) {
      return null;
    }

    return {
      message: `Request deleted successfully and relationships updated`,
      deletedRequest,
    };
  } catch (error) {
    console.error('Error deleting request:', error);
    throw new Error('Failed to delete request');
  }
}


export async function updateFollowRequest(requestId: string, updatedData: Partial<IRequest>) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(requestId)) {
      throw new Error('Invalid request ID format');
    }

    const { status } = updatedData;
    if (!status) {
      throw new Error('Updated status is required');
    }

    const request = await Request.findById(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    if (status === RequestStatus.ACCEPTED) {
      const requester = await User.findById(request.requester);
      const requestee = await User.findById(request.requestee);

      if (!requester || !requestee) {
        throw new Error('User not found');
      }

      if (!requestee.followers.includes(requester._id)) {
        requestee.followers.push(requester._id);
      }
      if (!requester.following.includes(requestee._id)) {
        requester.following.push(requestee._id);
      }

      await requestee.save();
      await requester.save();
    } else if (status === RequestStatus.REJECTED) {
      // Use deleteRequestById to handle cleanup
      return await deleteRequestById(requestId);
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    return updatedRequest;
  } catch (error) {
    console.error('Error updating follow request:', error);
    throw new Error('Failed to update follow request');
  }
}



// Update friend request status
export async function updateFriendRequestStatus(requestId: string, updatedData: Partial<IRequest>) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(requestId)) {
      throw new Error('Invalid request ID format');
    }

    const { status } = updatedData;
    if (!status) {
      throw new Error('Updated status is required');
    }

    if (status === RequestStatus.ACCEPTED) {
      const request = await Request.findByIdAndUpdate(
        requestId,
        { status: RequestStatus.ACCEPTED, rejectedAt: null, acceptedAt: new Date() },
        { new: true }
      );

      if (!request) {
        throw new Error('Friend request not found');
      }

      const requester = await User.findById(request.requester);
      const requestee = await User.findById(request.requestee);

      if (!requester || !requestee) {
        throw new Error('User not found');
      }

      requester.friends.push(requestee._id);
      requestee.friends.push(requester._id);

      await requester.save();
      await requestee.save();

      return request;
    } else if (status === RequestStatus.REJECTED) {
      // Use deleteRequestById to handle cleanup
      return await deleteRequestById(requestId);
    } else if (status === RequestStatus.PENDING) {
      const request = await Request.findByIdAndUpdate(
        requestId,
        { status: RequestStatus.PENDING, rejectedAt: null, acceptedAt: null },
        { new: true }
      );

      if (!request) {
        throw new Error('Friend request not found');
      }

      return request;
    }
  } catch (error) {
    console.error('Error updating friend request status:', error);
    throw new Error('Failed to update friend request status');
  }
}


// Send a follow request
export async function sendFollowRequest(followerId: string, followerType: string, followeeId: string, followeeType: string) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(followerId) || !Types.ObjectId.isValid(followeeId)) {
      throw { status: 400, message: 'Invalid ID format.' };
    }

    let followeePage;

    if (followeeType === 'user') {
      const followee = await User.findById(followeeId).populate('settings.privacy');
      if (!followee) {
        throw { status: 404, message: 'Followee of type user not found.' };
      }

      if (!followee.settings?.privacy?.canBeFollowed) {
        throw { status: 403, message: `User ${followeeId} cannot be followed due to privacy settings.` };
      }

      if (followee.settings?.privacy?.requireFriendRequests) {
        console.log(`User ${followeeId} requires friend requests.`);
        return await sendFriendRequest(followerId, followeeId);
      }
    } else if (followeeType === 'business' || followeeType === 'team') {
      const followee = followeeType === 'business' 
        ? await Business.findById(followeeId).populate('pageId') 
        : await Team.findById(followeeId).populate('pageId');

      if (!followee || !followee.pageId) {
        throw { status: 404, message: `${followeeType.charAt(0).toUpperCase() + followeeType.slice(1)} not found or missing associated page.` };
      }

      followeePage = await Page.findById(followee.pageId);

      if (!followeePage) {
        throw { status: 404, message: 'Associated page not found.' };
      }

      if (!followeePage.canBeFollowed) {
        throw { status: 403, message: `${followeeType.charAt(0).toUpperCase() + followeeType.slice(1)} ${followeeId} cannot be followed due to privacy settings.` };
      }
    } else {
      throw { status: 400, message: 'Invalid followee type.' };
    }

    // Transaction for follow and follower updates
    const session = await mongoose.startSession();
    session.startTransaction();

    const followRequest = new Request({
      requester: followerId,
      requestee: followeeId,
      requesterType: followerType,
      requesteeType: followeeType,
      requestType: RequestType.FOLLOW,
      status: RequestStatus.ACCEPTED,
      requestedAt: new Date(),
    });

    try {
      await Request.create([followRequest], { session });

      if (followeeType === 'user') {
        await User.findByIdAndUpdate(
          followerId,
          { $addToSet: { following: followeeId } },
          { session }
        );
        await User.findByIdAndUpdate(
          followeeId,
          { $addToSet: { followers: followerId } },
          { session }
        );
      } else if (followeeType === 'business' || followeeType === 'team') {
        // Update the follower's `following` list
        if (followerType === 'user') {
          await User.findByIdAndUpdate(
            followerId,
            { $addToSet: { following: followeePage._id } },
            { session }
          );
        } else if (followerType === 'business' || followerType === 'team') {
          const followerModel = followerType === 'business' ? Business : Team;
          await followerModel.findByIdAndUpdate(
            followerId,
            { $addToSet: { following: followeePage._id } },
            { session }
          );
        }

        // Update the followee's `followers` list on the page
        await Page.findByIdAndUpdate(
          followeePage._id,
          { $addToSet: { followers: followerId } },
          { session }
        );
      }

      await session.commitTransaction();
      return { success: true, data: followRequest };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error(`Error sending follow request from ${followerId} to ${followeeId}:`, error);
    throw { status: 500, message: 'Failed to send follow request. Please try again later.' };
  }
}


// Send a friend request
export async function sendFriendRequest(followerId: string, followeeId: string) {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(followerId) || !Types.ObjectId.isValid(followeeId)) {
      throw new Error('Invalid ID format');
    }

    const isFollowerUser = User.findById(followerId);
    const isFolloweeUser = await User.findById(followeeId).populate("settings.privacy");

    if (!isFollowerUser || !isFolloweeUser) {
      throw new Error('User not found - friend requests are only between users');
    }

    // Create a new friend request
    const friendRequest = new Request({
      requester: followerId,
      requestee: followeeId,
      requesterType: 'user',
      requesteeType: 'user',
      requestType: RequestType.FRIEND, // Type is friend
      requestedAt: new Date(),
    });
    await friendRequest.save();
    return friendRequest;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw new Error('Failed to send friend request');
  }
}


// Get follow requests for a user
export async function getFollowRequestsForUser(userId: string) {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    const followRequests = await Request.find({ requestee: userId, requestType: RequestType.FOLLOW })
      .populate('requester', 'username avatar_image') // Populate follower details
      .exec();
    return followRequests;
  } catch (error) {
    console.error('Error fetching follow requests:', error);
    throw new Error('Failed to fetch follow requests');
  }
}

// get sent follow requests for a user
export async function getSentFollowRequestsForUser(userId: string) {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    const followRequests = await Request.find({ requester: userId, requestType: RequestType.FOLLOW })
      .populate('requester', 'username avatar_image') // Populate follower details
      .exec();
    return followRequests;
  } catch (error) {
    console.error('Error fetching sent follow requests:', error);
    throw new Error('Failed to fetch sent follow requests');
  }
}


// Get friend requests for a user
export async function getFriendRequestsForUser(userId: string) {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    const friendRequests = await Request.find({ requestee: userId, requestType: RequestType.FRIEND })
      .populate('requester', 'username avatar_image') // Populate follower details
      .exec();
    return friendRequests;
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    throw new Error('Failed to fetch friend requests');
  }
}

export async function getSentFriendRequestsForUser(userId: string) {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    const friendRequests = await Request.find({ requester: userId, requestType: RequestType.FRIEND })
      .populate('requester', 'username avatar_image') // Populate follower details
      .exec();
    return friendRequests;
  } catch (error) {
    console.error('Error fetching sent friend requests:', error);
    throw new Error('Failed to fetch sent friend requests');
  }
}

export async function getUserFollowersById(userId: string) {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    const followers = await Request.find({ 
      requestee: userId, 
      requestType: RequestType.FOLLOW, 
      status: RequestStatus.ACCEPTED // Only accepted follow requests
    })
    .populate('requester', 'username avatar_image')  // Populate the follower details
    .exec();
    
    return followers;
  } catch (error) {
    console.error('Error fetching user followers:', error);
    throw new Error('Failed to fetch user followers');
  }
}

export async function getUserFollowingById(userId: string) {  
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    const following = await Request.find({ 
      requester: userId, 
      requestType: RequestType.FOLLOW, 
      status: RequestStatus.ACCEPTED // Only accepted follow requests
    })
    .populate('requestee', 'username avatar_image')  // Populate the follower details
    .exec();
    
    return following;
  } catch (error) {
    console.error('Error fetching user following:', error);
    throw new Error('Failed to fetch user following');
  }
}

export async function getUserFriendsById(userId: string) {
  try {
    await connectDB();
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    const friends = await Request.find({ 
      requestee: userId, 
      requestType: RequestType.FRIEND, 
      status: RequestStatus.ACCEPTED // Only accepted follow requests
    })
    .populate('requester', 'username avatar_image')  // Populate the follower details
    .exec();
    
    return friends;
  } catch (error) {
    console.error('Error fetching user friends:', error);
    throw new Error('Failed to fetch user friends');
  }
}