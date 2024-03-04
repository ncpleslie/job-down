/**
 * A utility function to convert an HTTP status code to a human-readable string.
 * @param status - The HTTP status code.
 * @returns - The human-readable string.
 */
export const httpStatusToText = (status: number): string => {
  switch (status) {
    case 400:
      return "Bad Request";
    case 404:
      return "Not Found - This key does not exist";
    case 409:
      return "Conflict - This key already exists";
    case 500:
      return "Internal Server Error";
    default:
      return "Unknown Error";
  }
};
