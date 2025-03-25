import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  name: string;
  messages: Message[];
}

interface ChatState {
  chats: Chat[];
}

const initialState: ChatState = {
  chats: [
    {
      id: "1",
      name: "John Doe",
      messages: [
        { id: "m1", sender: "John Doe", text: "Hey, how's it going?", timestamp: "10:30 AM" },
        { id: "m2", sender: "You", text: "All good! Working on the project.", timestamp: "10:32 AM" },
      ],
    },
    {
      id: "2",
      name: "Alice Smith",
      messages: [
        { id: "m1", sender: "Alice Smith", text: "Did you check the new updates?", timestamp: "2:15 PM" },
        { id: "m2", sender: "You", text: "Yes, looks great!", timestamp: "2:18 PM" },
      ],
    },
    {
      id: "3",
      name: "Michael Brown",
      messages: [
        { id: "m1", sender: "Michael Brown", text: "Are we meeting tomorrow?", timestamp: "5:00 PM" },
        { id: "m2", sender: "You", text: "Yeah, let's meet at 11 AM.", timestamp: "5:05 PM" },
      ],
    },
  ],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<{ chatId: string; sender: string; text: string }>) => {
      const chat = state.chats.find((chat) => chat.id === action.payload.chatId);
      if (chat) {
        chat.messages.push({
          id: `m${chat.messages.length + 1}`,
          sender: action.payload.sender,
          text: action.payload.text,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    },
  },
});

export const { sendMessage } = chatSlice.actions;
export default chatSlice.reducer;
