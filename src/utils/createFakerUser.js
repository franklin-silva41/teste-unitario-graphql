const { faker } = require("@faker-js/faker");

const createFakerUser = () => {
  const firstName = faker.name.firstName();

  const lastName = faker.name.lastName();

  const userName = faker.internet.userName().toLowerCase();

  const email = `${userName}@teste.tst`;

  const password = faker.internet.password();

  return {
    firstName,
    lastName,
    userName,
    email,
    password,
  };
};

module.exports = { createFakerUser };
