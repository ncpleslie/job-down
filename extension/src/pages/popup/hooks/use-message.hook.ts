import { MessageType } from "@src/pages/types/message.type";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

type LoginResponse = User;
type UserResponse = User;
type UserTokenResponse = string;
type SignOutResponse = Promise<void>;

type ResponseType<T> = T extends "login"
  ? LoginResponse
  : T extends "signOut"
    ? SignOutResponse
    : T extends "user"
      ? UserResponse
      : T extends "userToken"
        ? UserTokenResponse
        : never;

const useMessage = () => {
  const sendMessage = <T extends MessageType>(
    message: T
  ): { data: ResponseType<T>; error: Error | null; isPending: boolean } => {
    const [error, setError] = useState<Error | null>(null);
    const [response, setResponse] = useState<ResponseType<T> | null>(null);
    const [isPending, setIsPending] = useState(true);

    useEffect(() => {
      (async () => {
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
      })();
    }, [message]);

    return {
      data: response as ResponseType<T>,
      error: error,
      isPending: isPending,
    };
  };

  return sendMessage;
};

export default useMessage;
