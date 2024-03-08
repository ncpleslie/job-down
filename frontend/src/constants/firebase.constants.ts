import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseConfig from "../../firebase-config.json";

export default class FirebaseConstants {
  // TODO: Put this into an environment variable.

  public static readonly FIREBASE_CONFIG = firebaseConfig;

  public static readonly UI_CONFIG: firebaseui.auth.Config = {
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };
}
