export const convertUTCEpochToDate = (date: number): string => {
  let d = new Date(0);
  d.setUTCSeconds(date);
  const day = d.getDay();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
