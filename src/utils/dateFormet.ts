import dayjs from "dayjs";

export const formatDateTime = (date: string | Date | undefined): string => {
  // date is less than 1min ago, return "just now"
  // date is less than 1 hour ago, return "x minutes ago"
  // date is less than 1 day ago, return "HH:mm"
  // date is greater than 1 day ago, return "DD / MM / YYYY"
  const now = dayjs();
  const messageDate = dayjs(date);

  if (now.diff(messageDate, "minute") < 1) return "just now";
  if (now.diff(messageDate, "hour") < 1)
    return `${now.diff(messageDate, "minute")} minutes ago`;
  if (now.diff(messageDate, "day") < 1) return messageDate.format("HH:mm");
  return messageDate.format("DD - MMM - YYYY"); // Fixed: used "DD / MM / YYYY"
};

export const formatDate = (date: string | Date | undefined): string => {
  const messageDate = dayjs(date);

  return messageDate.format("DD / MM / YYYY"); // Fixed: used "DD / MM / YYYY"
};

export const formetDateAndTime = (date: string | Date | undefined): string => {
  const messageDate = dayjs(date);

  return messageDate.format("DD / MM / YYYY HH:mm"); // Fixed: used "DD / MM / YYYY"
};

export const formetTime = (date: string | Date | undefined): string => {
  const messageDate = dayjs(date);

  return messageDate.format("HH:mm"); // 24-hour format
};
