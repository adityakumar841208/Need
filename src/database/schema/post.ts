import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            required: true,
            default: false
        },
        profilePicture: {
            type: String,
            required: true
        },
    },
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // ✅ Reference to another comment for threaded replies
        default: null
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}); // ✅ Optional: if embedded inside another doc like Post


const likeSchema = new mongoose.Schema({
    user: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const postSchema = new mongoose.Schema(
    {
        user: {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            name: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            verified: {
                type: Boolean,
                required: true,
                default: false
            },
            role: {
                type: String,
                enum: ['serviceprovider', 'customer'],
                required: true
            }
        },
        content: {
            text: {
                type: String,
                default: ''
            },
            image: {
                type: String,
                default: ''
            }
        },
        views: {
            type: Number,
            default: 0
        },
        tags: {
            type: [String],
            default: []
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        engagement: {
            likes: {
                count: { type: Number, default: 0 },
                users: {
                    type: [likeSchema],
                    default: []
                }
            },
            comments: {
                count: { type: Number, default: 0 },
                users: {
                    type: [commentSchema],
                    default: []
                }
            },
            shares: {
                type: Number,
                default: 0
            },
            saves: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

// Create indexes for better query performance
postSchema.index({ timestamp: -1 });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;