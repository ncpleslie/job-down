export const dateStringToTimeAndDate = (date: string) => {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleTimeString()} - ${dateObj.toLocaleDateString()}`;
};
