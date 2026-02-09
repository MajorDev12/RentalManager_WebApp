export const formatDate = (
  dateString,
  options = { dateStyle: "medium", timeStyle: "short" }
) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", options).format(date);
};
