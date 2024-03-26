import AppConstants from "@/constants/app.constants";
import { useEffect } from "react";

/**
 * A basic hook to update the document title.
 * @param title - The title to set.
 */
const useHead = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ${AppConstants.AppTitle}`;
  }, [title]);
};

export default useHead;
