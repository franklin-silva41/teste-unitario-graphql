const createQueryLoginUser = ({ email, password }) => {
  const query = `
    mutation {
      login(
        email: "${email}"
        password: "${password}"
      ){
        token
      }
    }
  `;

  return query;
};

module.exports = {
  createQueryLoginUser,
};
