import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/features/user/userSlice";
import connectionsReducer from "@/features/user/userSlice";
import messagesReducer from "@/features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    connections: connectionsReducer,
    messages: messagesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
