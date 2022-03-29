const requestPromise = require("request-promise");

const newRequestForApiGraphQL = async (
  uri,
  query,
  headers = { "Content-Type": "application/json" }
) => {
  const response = await requestPromise.post({
    uri,
    body: {
      query,
    },
    headers,
    json: true,
    resolveWithFullResponse: true,
  });

  return response;
};

module.exports = { newRequestForApiGraphQL };
