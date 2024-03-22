import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { AuthPayloadType, PayloadType } from "../types/message.type";
import { env } from "@src/env";

const app = initializeApp(env.VITE_FIREBASE_CONFIG);
const auth = getAuth(app);

chrome.runtime.onMessage.addListener(
  (message: PayloadType, sender, sendResponse) => {
    let payload: AuthPayloadType;
    switch (message.type) {
      // case "loginAnon":
      //   signInAnonymously(auth)
      //     .then((response) => {
      //       sendResponse(response.user);
      //     })
      //     .catch((e) => {
      //       console.error("Failed to log in: ", e);
      //     });
      //   return true;

      case "signInWithCred":
        payload = message?.payload;
        signInWithEmailAndPassword(auth, payload.email, payload.password)
          .then((response) => {
            sendResponse({ payload: response.user });
          })
          .catch((e) => {
            console.error("Failed to sign in: ", e);
            sendResponse({ error: e });
          });

        return true;

      case "signUpWithCred":
        payload = message?.payload;
        createUserWithEmailAndPassword(auth, payload.email, payload.password)
          .then((response) => {
            sendResponse({ payload: response.user });
          })
          .catch((e) => {
            console.error("Failed to sign up: ", e);
            sendResponse({ error: e });
          });

        return true;

      case "user":
        const user = auth.currentUser;
        sendResponse({ payload: user });
        return true;

      case "userToken":
        console.log("Getting user token", auth);
        auth.currentUser
          ?.getIdToken()

          .then((token) => {
            console.log(token);
            sendResponse({ payload: token });
          })
          .catch((e) => {
            console.error("Failed to get user token: ", e);
            sendResponse({ error: e });
          });
        return true;

      case "signOut":
        signOut(auth)
          .then(() => {
            sendResponse({ payload: true });
          })
          .catch((e) => {
            console.error("Failed to sign out: ", e);
            sendResponse({ error: e });
          });

        return true;

      default:
        return false;
    }
  }
);
