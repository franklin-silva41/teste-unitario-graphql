const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.combine(winston.format.json(), winston.format.prettyPrint())
  ),
  transports: [
    new winston.transports.File({ filename: "info.log", level: "info" }),
  ],
});

module.exports = { logger };
