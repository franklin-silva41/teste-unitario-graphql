const convertToTimestamp = (fullDate) => {
  const date = new Date(fullDate);

  const timestamp = date.getTime();

  return timestamp;
};

module.exports = { convertToTimestamp };
