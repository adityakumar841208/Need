// models/Message.ts
import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true // Index on chatId for faster lookups
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    readBy: [{
      type: Schema.Types.ObjectId,
    }],
    // Optional: Add attachments, reactions, etc.
  },
  { 
    timestamps: true 
  }
);

// Create compound index on chatId + createdAt for efficient pagination and sorting
messageSchema.index({ chatId: 1, createdAt: -1 });

// If you frequently query by sender within a specific chat
messageSchema.index({ chatId: 1, sender: 1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;