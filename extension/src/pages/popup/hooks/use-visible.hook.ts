import { useSyncExternalStore } from "react";

export const useVisible = () => {
  const visibilitySubscription = (callback: () => void) => {
    document.addEventListener("visibilitychange", callback);

    return () => {
      document.removeEventListener("visibilitychange", callback);
    };
  };

  const getVisibilitySnapshot = () => {
    return document.visibilityState;
  };

  const visibilityState = useSyncExternalStore(
    visibilitySubscription,
    getVisibilitySnapshot
  );

  return visibilityState === "visible";
};
