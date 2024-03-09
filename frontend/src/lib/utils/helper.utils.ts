/**
 * Convert a snakeCase string a human-readable string.
 * @param snakeCase - The snake_case string to convert.
 * @returns - The human-readable string.
 */
export const snakeCaseToTitleCase = (snakeCase: string) => {
  return snakeCase.split("_").join(" ");
};
