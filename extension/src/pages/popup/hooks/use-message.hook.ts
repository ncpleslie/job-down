import { useEffect, useState } from "react";
import useBackgroundStore from "../store/background.store";
import {
  ResponseType,
  MessageType,
  Message,
  PayloadType,
  BackgroundMessage,
} from "@pages/types/message.type";

const useMessage = <T extends Message<MessageType>>(
  message: T,
  options?: { enabled: boolean }
): {
  data: ResponseType<T> | null;
  error: Error | null;
  isPending: boolean;
  callAsync: (message: PayloadType) => Promise<void>;
} => {
  const store = useBackgroundStore();
  const [error, setError] = useState<Error | null>(null);
  const response = store.store[message.type];
  const [isPending, setIsPending] = useState(false);

  const callAsync = async (message: PayloadType) => {
    try {
      setIsPending(true);
      const result = (await chrome.runtime.sendMessage(
        message
      )) as BackgroundMessage<T>;
      if (result.error) {
        setError(result.error);

        return;
      }

      // eslint-disable-next-line
      store.set(message.type, result.payload as any);

      // Get a new token if the user is logged in.
      // This is to force the token to be updated and persisted in the store.
      if (
        message.type === "signInAnonymous" ||
        message.type === "signInWithCred" ||
        message.type === "signUpWithCred" ||
        message.type === "user"
      ) {
        await callAsync({ type: "userToken" });
      }

      setIsPending(false);
    } catch (err) {
      console.error("Message hook error: ", err);
      setError(err as Error);
    }
  };

  useEffect(() => {
    if (!options?.enabled) {
      return;
    }

    (async () => {
      await callAsync(message as PayloadType);
    })();
  }, [message, options?.enabled]);

  return {
    data: response as ResponseType<T> | null,
    error: error,
    isPending: isPending,
    callAsync: callAsync,
  };
};

export default useMessage;
