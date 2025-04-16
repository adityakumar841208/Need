import { Types } from 'mongoose';

interface Comment {
  user: {
    _id: Types.ObjectId;
    name: string;
    profilePicture: string;
    verified: boolean;
  };
  reply: Types.ObjectId | null;
  content: string;
  timestamp: Date;
}

interface Like {
  user: {
    _id: Types.ObjectId;
  };
  timestamp: Date;
}

export interface Post {
  _id: Types.ObjectId;
  user: {
    _id: Types.ObjectId;
    name: string;
    image: string;
    verified: boolean;
    role: 'serviceprovider' | 'customer';
  };
  content: {
    text: string;
    image: string;
  };
  views: number;
  tags: string[];
  timestamp: Date;
  engagement: {
    likes: {
      count: number;
      users: Like[];
    };
    comments: {
      count: number;
      users: Comment[];
    };
    shares: number;
    saves: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Optional: Create a type for creating a new post (without _id and timestamps)
export type CreatePost = Omit<Post, '_id' | 'createdAt' | 'updatedAt'>;

// Optional: Create a type for post response (with string IDs instead of ObjectId)
export interface PostResponse extends Omit<Post, '_id' | 'user' | 'timestamp' | 'createdAt' | 'updatedAt'> {
  _id: string;
  user: Omit<Post['user'], '_id'> & { _id: string };
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}