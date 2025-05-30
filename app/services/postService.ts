// app/services/postService.ts

import { connectDB } from '@/app/lib/connectDB';
import { startSession, Types } from 'mongoose';
import { User } from '../models/Users';
import { Post, IPost } from '@/app/models/post';
import { Like } from '../models/Like';
import { Comment } from '../models/Comment';

interface SearchResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

export const getAllPosts = async (
  page = 1,
  limit = 10,
  fieldsToPopulate = "username avatar_image"
) => {
  try {
    await connectDB();
    const skip = (page - 1) * limit;


    if (page < 1 || limit < 1) {
      throw new Error('Invalid page number');
    }



    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select('-avatar_image')
      .populate({
        path: "created_by",
        select: fieldsToPopulate,
      })
      .lean();

    return {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching posts: ${error.message}`);
    } else {
      console.error('Unknown error occurred:', error);
    }
    throw new Error('Failed to fetch posts');
  }
};


export async function createPost(caption: string, tags: string[], location: string, created_by: string, media: string[]) {
  try {
    await connectDB();

    if (!created_by) {
      throw new Error('Invalid ID format');
    }

    const user = await User.findById(created_by).select('-password'); // Exclude passwords for all users

    if (!user) {
      throw new Error('User not found');
    }

    const newPost = new Post({
      caption,
      tags,
      location,
      created_by,
      media,
      author: user.username

    });

    await newPost.save();



    // Add post ID to the user posts 
    user.posts.push(newPost._id);
    await user.save();


    return newPost;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to create posts');
  }
}


export async function getPostById(id: string) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const post = await Post.findById(id)
      .populate({
        path: "created_by",
        select: "username avatar_image", // Fetch latest avatar
      })
      .populate({
        path: "likes", // Populate likes to get all likes
        select: "userId", // Only need the userId from like
      });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  } catch (error) {
    console.error('Post not found:', error);
    throw new Error('Failed to fetch post from database');
  }
}


// Update post by ID
export async function updatePostById(id: string, updatedData: Partial<IPost>) {


  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const post = await Post.findByIdAndUpdate(id, updatedData, { new: true });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }
  catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

// Delete post by ID
export async function deletePostById(id: string) {
  const session = await startSession();
  session.startTransaction(); // Use Transactions to ensure atomicity

  try {
    await connectDB();

    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }

    const deletedPost = await Post.findByIdAndDelete(id, { session });

    if (!deletedPost) {
      throw new Error('Post not found');
    }

    // Remove deleted post ID from user post field array
    await User.findByIdAndUpdate(
      deletedPost.created_by,
      { $pull: { posts: deletedPost._id } },
      { session }
    );

    // Remove resppective like references from all users who liked the post
    const postLikes = await Like.find({ associatedId: deletedPost._id }, '_id', { session });
    const likesTodelete = postLikes.map(like => like._id);
    await User.updateMany(
      { likes: { $in: likesTodelete } },
      { $pull: { likes: { $in: likesTodelete } } },
      { session }
    );
    await Like.deleteMany({ associatedId: deletedPost._id }, { session });

    // Remove resppective comment references from all users who commented on the post
    const postComments = await Comment.find({ postId: deletedPost._id }, '_id', { session });
    const commentsToDelete = postComments.map(comment => comment._id);
    await User.updateMany(
      { comments: { $in: commentsToDelete } },
      { $pull: { comments: { $in: commentsToDelete } } },
      { session }
    );
    await Comment.deleteMany({ postId: deletedPost._id }, { session });

    await session.commitTransaction();
    session.endSession();

    return deletedPost;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
}



// To do: get 
export async function getPostsByUser(userId: string) {
  try {
    await connectDB();

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid ID format');
    }

    const posts = await Post.where('created_by').equals(userId).populate({
      path: "created_by",
      select: "username avatar_image",
    });

    // Populate likes and add like count to each post
    for (const post of posts) {
      post.likesCount = post.likes.length; // Assign the like count to each post
    }

    if (!posts) {
      throw new Error('Post not found');
    }

    return posts;
  } catch (error) {
    console.error('Post not found:', error);
    throw new Error('Failed to fetch post from database');
  }
}

export const searchPosts = async (
  searchTypes: string[], // search types ex: tags, caption, username
  query: string,
  page = 1,
  limit = 10
): Promise<SearchResult> => {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      throw new Error('Invalid page number or limit');
    }

    // Build the query  based on types
    const filters = [];

    if (searchTypes.includes('tags')) {
      const tagsQuery = query.split(',').map(tag => ({
        tags: { $regex: new RegExp(tag.trim(), 'i') }
      }));
      filters.push({ $or: tagsQuery });
    }

    if (searchTypes.includes('caption')) {
      filters.push({ caption: { $regex: new RegExp(query, 'i') } });
    }

    if (searchTypes.includes('username')) {
      // search for users by username
      const users = await User.find({
        username: { $regex: new RegExp(query, 'i') }
      }).select('_id');

      const userIds = users.map(user => user._id);
      filters.push({ created_by: { $in: userIds } });
    }

    //  final query based on the filters
    const queryObject = filters.length > 0 ? { $or: filters } : {};

    const totalPosts = await Post.countDocuments(queryObject);
    const posts = await Post.find(queryObject)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "created_by",
        select: "username avatar_image",
      })
      .lean();

    return {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error searching posts:', error);
    throw new Error('Failed to search posts');
  }
};

export const searchPostsByTags = async (
  tags: string[],
  page = 1,
  limit = 10
): Promise<SearchResult> => {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      throw new Error('Invalid page number or limit');
    }

    const tagQuery = tags.map(tag => ({
      tags: { $regex: new RegExp(tag, 'i') }
    }));

    const query = { $or: tagQuery };

    const totalPosts = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "created_by",
        select: "username avatar_image",
      })
      .lean();

    return {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error searching posts by tags:', error);
    throw new Error('Failed to search posts by tags');
  }
};

export const searchPostsByCaption = async (
  searchText: string,
  page = 1,
  limit = 10
): Promise<SearchResult> => {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      throw new Error('Invalid page number or limit');
    }

    // Create a case-insensitive search for caption
    const query = {
      caption: { $regex: new RegExp(searchText, 'i') }
    };

    const totalPosts = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "created_by",
        select: "username avatar_image",
      })
      .lean();

    return {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error searching posts by caption:', error);
    throw new Error('Failed to search posts by caption');
  }
};

export const searchPostsByUsername = async (
  username: string,
  page = 1,
  limit = 10
): Promise<SearchResult> => {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      throw new Error('Invalid page number or limit');
    }

    // First find users matching the username
    const users = await User.find({
      username: { $regex: new RegExp(username, 'i') }
    }).select('_id');

    const userIds = users.map(user => user._id);

    // Then find posts by these users
    const query = {
      created_by: { $in: userIds }
    };

    const totalPosts = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "created_by",
        select: "username avatar_image",
      })
      .lean();

    return {
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error searching posts by username:', error);
    throw new Error('Failed to search posts by username');
  }
};
