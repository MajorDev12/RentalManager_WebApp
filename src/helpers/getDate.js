export const getDate = (part = "full", inputDate = new Date()) => {
  // Ensure we have a valid Date object
  const dateObj = inputDate instanceof Date ? inputDate : new Date(inputDate);

  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // JS months are 0-indexed
  const year = dateObj.getFullYear();

  // Return based on requested part
  switch (part.toLowerCase()) {
    case "day":
    case "date":
      return day;
    case "month":
      return month;
    case "year":
      return year;
    case "full":
    default:
      return {
        date: day,
        month,
        year,
        formatted: `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`,
      };
  }
};

