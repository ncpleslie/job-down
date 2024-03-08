import firebase from "firebase/compat/app";
import FirebaseConstants from "@/constants/firebase.constants";
import { getAuth } from "firebase/auth";

const app = firebase.initializeApp(FirebaseConstants.FIREBASE_CONFIG);
export const auth = getAuth(app);
export const firebaseAuth = app.auth();
