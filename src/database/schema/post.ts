import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
        },
        image: {
            type: String,
        }
    },
    tags:{
        type: [String],
        default: []
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    engagement: {
        likes: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        },
        shares: {
            type: Number,
            default: 0
        },
        saves:{
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
postSchema.index({ 'user.type': 1 });
postSchema.index({ timestamp: -1 });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;