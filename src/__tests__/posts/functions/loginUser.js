const { newRequestForApiGraphQL } = require("../../../utils/newRequestForApi");
const { createQueryLoginUser } = require("../../users/functions/querys");

const loginUser = async (email, password) => {
  const baseURL = "https://api-stg.sportidia.com/graphql";

  const headers = {
    "Content-Type": "application/json",
  };

  const query = createQueryLoginUser({
    email,
    password,
  });

  const response = await newRequestForApiGraphQL(baseURL, query);

  const { body } = response;
  const token = body.data.login.token;

  const newHeaders = {
    ...headers,
    authorization: `Bearer ${token}`,
  };

  return newHeaders;
};

module.exports = { loginUser };
