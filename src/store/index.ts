import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slices/chatSlice";
import profileReducer from './profile/profileSlice';
// other reducers...

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    profile: profileReducer,
    // other reducers...
  },
});

// Export types that will be needed in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
