import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { MessageType } from "../types/message.type";
import { env } from "@src/env";

const app = initializeApp(env.VITE_FIREBASE_CONFIG);
const auth = getAuth(app);

chrome.runtime.onMessage.addListener(
  (message: MessageType, sender, sendResponse) => {
    switch (message) {
      case "login":
        signInAnonymously(auth)
          .then((response) => {
            sendResponse(response.user);
          })
          .catch((e) => {
            console.error("Failed to log in: ", e);
          });

        return true;

      case "user":
        const user = auth.currentUser;
        sendResponse(user);
        return true;

      case "userToken":
        auth.currentUser
          ?.getIdToken()
          .then((token) => {
            console.log(token);
            sendResponse(token);
          })
          .catch((e) => {
            console.error("Failed to get user token: ", e);
          });
        return true;

      case "signOut":
        signOut(auth)
          .then(() => {
            sendResponse(true);
          })
          .catch((e) => {
            sendResponse(false);
            console.error("Failed to sign out: ", e);
          });

        return true;

      default:
        return false;
    }
  }
);
