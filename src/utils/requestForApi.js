const requestPromise = require("request-promise");

const requestForApiGraphQL = async (uri, query) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
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
  } catch (e) {
    const { error } = e;

    console.log(error.errors[0].message);

    throw new Error(error.errors[0].message);
  }
};

module.exports = { requestForApiGraphQL };
