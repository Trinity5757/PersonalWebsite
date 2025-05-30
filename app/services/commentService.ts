//app/services/commentService.ts

import { Types } from "mongoose";
import { connectDB } from "../lib/connectDB";
import { getUserById } from "./userService";
import { getPostById } from "./postService";
import { Comment } from "../models/Comment";
import { Post } from "../models/post";
import { User } from "../models/Users";
import { Like } from "../models/Like";

export async function getComment(commentId: string) {
  try {
    if(!Types.ObjectId.isValid(commentId)) {
      throw new Error('Invalid comment ID format');
    }

    await connectDB();

    const comment = await Comment.findById(commentId);

    if(!comment) {
      throw new Error('Comment was not found');
    }

    return comment;
  } catch(error) {
    throw new Error(`Failed to get comment: \n${error}`);
  }
}

export async function getCommentsByPost(postId: string, limit: number, offset: number) {
  try {
    if(!Types.ObjectId.isValid(postId)) {
      throw new Error('Invalid post ID format');
    }

    await connectDB();

    const comments = await Comment.find({ postId: postId, parentId: null})
      .populate({
        path: "userId",
        select: "username avatar_image"
      })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    return comments;
    
  } catch (error) {
    throw new Error(`Failed to get comments for post: ${error}`);
  }
}

export async function createComment(userId: string, postId: string, text: string, parentId?: string,) {
  try {

    if(!Types.ObjectId.isValid(userId)) {
      throw new Error("Invlaid user ID format");
    }
    
    if(!Types.ObjectId.isValid(postId)) {
      throw new Error("Invlaid post ID format");
    }
    
    if(parentId && !Types.ObjectId.isValid(userId)) {
      throw new Error("Invlaid parent ID format");
    }
    
    await connectDB();

    const user = await getUserById(userId);

    const post = await getPostById(postId);
    
    if(parentId) {
      const comment = await getComment(parentId);

      // Verify that the post ID we are assigning to the child comment matches post ID assigned to the parent comment
      if(comment.postId.toString() !== postId) {
        throw new Error('The provided post ID does not match with the parents post ID');
      }
    }

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      text,
      parentId: parentId? parentId : null, // Assign parentId when provided
    });

    
    if(!parentId) { // Comment is a comment to a post
      const postUpdate = await Post.updateOne(
        { _id: post._id },
        { $addToSet: { comments: comment._id } }, // Add the new comment to comments array in a post
      );
      if(!postUpdate) {
        throw new Error('Failed to update post comments array upon comment creation');
      }
    } else { // Comment is a reply to a comment (Can probably also reply to a reply)
      const commentUpdate = await Comment.updateOne(
        { _id: parentId },
        { $addToSet: { childIds: comment._id } }, // Add the new comment to comments array in a post
      );
      if(!commentUpdate) {
        throw new Error('Failed to update comment children array upon comment creation');
      }
    }

    const userUpdate = await User.updateOne(
      { _id: user._id },
      { $addToSet: { comments: comment._id } },
    );
    if(!userUpdate) {
      throw new Error('Failed to update User comments array upon comment creation');
    }
    
    comment.save();

    const commentWithUserData = await comment.populate('userId');

    return commentWithUserData;
    
  } catch(error) {
    throw new Error(`Failed to create comment: \n${error}`);
  }
}

export async function updateComment(commentId: string, text: string) {
  
  try {
    if(!Types.ObjectId.isValid(commentId)) {
      throw new Error('Invalid comment ID format');
    }

    await connectDB();

    // Verify user matches with comment creator
    const comment = await Comment.findByIdAndUpdate(commentId, {text: text},  {new: true}).populate({path:'userId', select: 'username avatar_image'});;

    if(!comment) {
      throw new Error("Comment not found");
    }

    return comment;

  } catch(error) {
    throw new Error(`Failed to update comment: ${error}`);
  }

}

export async function deleteComment(commentId: string) {

  try {
    if(!Types.ObjectId.isValid(commentId)){
      throw new Error('Invalid comment ID format');
    }

    await connectDB();

    const comment = await Comment.findByIdAndDelete(commentId);

    if(!comment) {
      throw new Error('Comment was not found');
    }

    if(!comment.parentId) { // Delete commentId in comments array for corresponding post
      const postUpdate = await Post.findByIdAndUpdate(
        comment.postId,
        { $pull: { comments: comment._id } },
        { new: true }
      );
      if(!postUpdate) {
        throw new Error('Failed to update post comments array upon comment deletion');
      }
    } else { // Delete commentId in child array for corresponding comment 
      const commentUpdate = await Comment.findByIdAndUpdate(
        comment.parentId,
        { $pull: { childIds: comment._id}},
        { new: true }
      );
      if(!commentUpdate) {
        throw new Error('Failed to update comment children array upon comment deletion');
      }
    }

    // Must delete any related likes made to the comment we want to delete
    const likesToDelete = await Like.find({ associatedId: comment._id }).select("_id");
    
    // Update likes array for all users that liked the comment
    if(likesToDelete.length > 0) {
      const likeIds = likesToDelete.map(like => like._id);

      const affectedUsers = await User.updateMany( 
        {},
        { $pull: { likes: { $in: likeIds } } },
        { multi: true },
       ); // Remove the users corresponding likes

       if(!affectedUsers) {
        throw new Error('Failed to delete affected users likes');
       }
    }

    // Perform DB likes deleteion
    const deletedLikes = await Like.deleteMany({associatedId: comment._id});
    if(!deletedLikes) {
      throw new Error('Failed to delete all likes for comment');
    }

    // Delete replies associated with comment
    if(comment.childIds) {
      const affectedComments = await User.updateMany( 
        {},
        { $pull: { comment: { $in: comment.childIds } } },
        { multi: true },
       );

       if(!affectedComments) {
        throw new Error('Failed to delete affected comments');
       }

      const deletedReplies = await Comment.deleteMany( {_id: { $in: comment.childIds} } );
      if(!deletedReplies) {
        throw new Error('Failed to delete all replies for comment');
      }

    }

    const userUpdate = await User.findByIdAndUpdate(
      comment.userId,
      { $pull: { comments: comment._id}},
      { new: true }
    );
    if(!userUpdate) {
      throw new Error('Failed to update user comments array upon comment deletion');
    }

    return comment;

  } catch (error) {
    throw new Error(`Failed to delete comment: \n${error}`);
  }

}
