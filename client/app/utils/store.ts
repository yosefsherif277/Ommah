import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/features/user/userSlice";
import connectionsReducer from "@/features/connections/connectionsSlice";
import messagesReducer from "@/features/messages/messagesSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      connections: connectionsReducer,
      messages: messagesReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
