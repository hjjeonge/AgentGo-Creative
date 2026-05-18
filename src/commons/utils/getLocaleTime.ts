export const getLocaleTime = (timestamp: string) => {
  const utcDate = new Date(timestamp);
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  return kstDate;
};
