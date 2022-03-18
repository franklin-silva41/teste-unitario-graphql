const requestPromise = require("request-promise");

const requestForApiGraphQL = async (uri, query) => {
  const headers = {
    "Content-Type": "application/json",
  };

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

module.exports = { requestForApiGraphQL };
