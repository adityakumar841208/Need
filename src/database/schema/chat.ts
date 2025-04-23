import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                required: true
            }
        ],
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        },
        unreadCount: {
            type: Map,
            of: Number,
            default: {}  // Maps userId to unread count
        }
    },
    { timestamps: true }
);

// Ensure a chat exists only once between the same two users
chatSchema.index({ participants: 1 }, { unique: true });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
export default Chat;