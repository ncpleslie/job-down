import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { env } from "@/env";

export default class FirebaseConstants {
  public static readonly FIREBASE_CONFIG = JSON.parse(env.VITE_FIREBASE_CONFIG);

  public static readonly UI_CONFIG: firebaseui.auth.Config = {
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };
}
