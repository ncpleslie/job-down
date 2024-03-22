import { ResponseType, MessageType, Message } from "@pages/types/message.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BackgroundState {
  store: {
    [K in MessageType]: ResponseType<Message<MessageType>> | null;
  };
  set: (
    key: MessageType,
    value: ResponseType<Message<MessageType>> | null
  ) => void;
}

const useBackgroundStore = create<BackgroundState>()(
  persist(
    (set) => ({
      store: {} as BackgroundState["store"],
      set: (key, value) =>
        set((state) => {
          if (
            key === "signInWithCred" ||
            key === "signUpWithCred" ||
            key === "user"
          ) {
            return {
              ...state,
              store: {
                ...state.store,
                user: value,
              },
            };
          }

          if (key === "signOut") {
            return {
              ...state,
              store: {
                ...state.store,
                user: null,
              },
            };
          }

          if (key === "userToken") {
            return {
              ...state,
              store: {
                ...state.store,
                userToken: value,
              },
            };
          }

          return state;
        }),
    }),
    {
      name: "background-store",
    }
  )
);

export default useBackgroundStore;
