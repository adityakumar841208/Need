import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    user: {
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
        type: {
            type: String,
            enum: ['client', 'provider'],
            required: true
        }
    },
    content: {
        text: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        }
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