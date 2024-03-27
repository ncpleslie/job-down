import { User } from "firebase/auth";

export type AuthPayloadType = {
  email: string;
  password: string;
};

export type PayloadType =
  | {
      type: "signUpWithCred";
      payload: AuthPayloadType;
    }
  | {
      type: "signInWithCred";
      payload: AuthPayloadType;
    }
  | {
      type: "signInAnonymous";
    }
  | {
      type: "signOut" | "user" | "userToken";
    };

export type Message<T extends MessageType> = {
  type: T;
};

export type MessageType =
  | "signUpWithCred"
  | "signInWithCred"
  | "signInAnonymous"
  | "signOut"
  | "user"
  | "userToken";

export type LoginResponse = User;
export type UserResponse = User;
export type UserTokenResponse = string;
export type SignOutResponse = boolean;

export type ResponseType<T extends Message<MessageType>> = T extends {
  type: "signUpWithCred";
}
  ? LoginResponse
  : T extends { type: "signInWithCred" }
    ? LoginResponse
    : T extends { type: "signInAnonymous" }
      ? LoginResponse
      : T extends { type: "signOut" }
        ? SignOutResponse
        : T extends { type: "user" }
          ? UserResponse
          : T extends { type: "userToken" }
            ? UserTokenResponse
            : never;

export type BackgroundMessage<T extends Message<MessageType>> = {
  payload: ResponseType<T> | null;
  error?: Error | null;
};
