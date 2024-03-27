import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import { AuthPayloadType, PayloadType } from "../types/message.type";
import { env } from "@src/env";

const app = initializeApp(env.VITE_FIREBASE_CONFIG);
const auth = getAuth(app);

chrome.runtime.onMessage.addListener(
  (message: PayloadType, sender, sendResponse) => {
    let payload: AuthPayloadType;
    switch (message.type) {
      case "signInAnonymous":
        signInAnonymously(auth)
          .then((response) => {
            sendResponse({ payload: response.user });
          })
          .catch((e) => {
            sendResponse({ error: e });
          });

        return true;

      case "signInWithCred":
        payload = message?.payload;
        signInWithEmailAndPassword(auth, payload.email, payload.password)
          .then((response) => {
            sendResponse({ payload: response.user });
          })
          .catch((e) => {
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
            sendResponse({ error: e });
          });

        return true;

      case "user":
        sendResponse({ payload: auth.currentUser });

        return true;

      case "userToken":
        auth.currentUser
          ?.getIdToken(true)
          .then((token) => {
            sendResponse({ payload: token });
          })
          .catch((e) => {
            sendResponse({ error: e });
          });
        return true;

      case "signOut":
        signOut(auth)
          .then(() => {
            sendResponse({ payload: true });
          })
          .catch((e) => {
            sendResponse({ error: e });
          });

        return true;

      default:
        return false;
    }
  }
);
