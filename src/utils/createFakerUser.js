const { faker } = require("@faker-js/faker");

const createFakerUser = () => {
  const firstName = faker.name.firstName();

  const lastName = faker.name.lastName();

  const userName = faker.internet.userName().toLowerCase();

  const email = faker.internet.email();

  return {
    firstName,
    lastName,
    userName,
    email,
  };
};

module.exports = { createFakerUser };
