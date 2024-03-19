import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { MessageType } from "../types/message.type";

const firebaseConfig = {
  // Replace with env
};

const app = initializeApp(firebaseConfig);
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
            console.error(e);
          });

        return true;

      case "user":
        const user = auth.currentUser;
        sendResponse(user);
        return true;

      case "userToken":
        auth.currentUser?.getIdToken().then((token) => sendResponse(token));
        return true;

      case "signOut":
        signOut(auth)
          .then(() => {
            sendResponse();
          })
          .catch((e) => {
            console.error(e);
          });

        return true;

      default:
        return false;
    }
  }
);
