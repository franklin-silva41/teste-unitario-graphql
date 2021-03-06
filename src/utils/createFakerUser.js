const { faker } = require("@faker-js/faker");

const createFakerUser = () => {
  const firstName = faker.name.firstName();

  const lastName = faker.name.lastName();

  const userName = faker.internet.userName().toLowerCase();

  const email = `${userName}@teste.tst`;

  const password = faker.internet.password();

  const suffix = faker.name.suffix();

  const companySuffix = faker.company.companySuffix();

  const title = faker.name.title();

  return {
    firstName,
    lastName,
    userName,
    email,
    password,
    suffix,
    companySuffix,
    title,
  };
};

module.exports = { createFakerUser };
