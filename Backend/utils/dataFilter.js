const getDataRange = (range) => {
  const now = new Date();
  let start;

  switch (range) {
    case "daily":
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      break;

    case "weekly":
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      break;

    case "monthly":
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      break;

    case "yearly":
      start = new Date(
        now.getFullYear(),
        0,
        1
      );
      break;

    default:
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ); //default monthly
  }

  return {
    start,
    end: new Date(),
  };
};

export default getDataRange;