import { MessageType } from "@src/pages/types/message.type";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

type LoginResponse = User;
type UserResponse = User;
type UserTokenResponse = string;
type SignOutResponse = boolean;

type ResponseType<T> = T extends "login"
  ? LoginResponse
  : T extends "signOut"
    ? SignOutResponse
    : T extends "user"
      ? UserResponse
      : T extends "userToken"
        ? UserTokenResponse
        : never;

// TODO: Add a reactive store to manage the state of the message such as zustand

const useMessage = <T extends MessageType>(
  message: T,
  options?: { enabled: boolean }
): {
  data: ResponseType<T> | null;
  error: Error | null;
  isPending: boolean;
  callAsync: (message: string) => Promise<void>;
} => {
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<ResponseType<T> | null>(null);
  const [isPending, setIsPending] = useState(false);

  const callAsync = async (message: string) => {
    try {
      setIsPending(true);
      const result = await chrome.runtime.sendMessage(message);
      setResponse(result);
    } catch (err) {
      console.error(err);
      setError(new Error(err as string));
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (!options?.enabled) {
      return;
    }

    (async () => {
      await callAsync(message);
    })();
  }, [message]);

  return {
    data: response as ResponseType<T> | null,
    error: error,
    isPending: isPending,
    callAsync: callAsync,
  };
};

export default useMessage;
