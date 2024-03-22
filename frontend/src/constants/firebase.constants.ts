import "firebase/compat/auth";
import { env } from "@/env";

export default class FirebaseConstants {
  public static readonly FIREBASE_CONFIG = env.VITE_FIREBASE_CONFIG;
}
