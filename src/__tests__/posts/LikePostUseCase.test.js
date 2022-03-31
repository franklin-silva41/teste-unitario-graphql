const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");
const { createQueryLoginUser } = require("../users/mocks/querys");
const {
  createQueryCreatePost,
  createQueryLikePost,
} = require("./mocks/querys");

const headers = {
  "Content-Type": "application/json",
};

const baseURL = "https://api-stg.sportidia.com/graphql";
let token;
let headersLoged;

describe("Like Post", () => {
  beforeAll(async () => {
    const query = createQueryLoginUser({
      email: "eduardo.verri@sptech.school",
      password: "teste123",
    });

    const response = await newRequestForApiGraphQL(baseURL, query);

    const { body } = response;
    token = body.data.login.token;

    headersLoged = {
      ...headers,
      authorization: `Bearer ${token}`,
    };
  });

  it("Like a post", async () => {
    const data = {
      title: "Teste Encontrando Postagem",
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "teste postagem",
      location_street: "Rua Haddock Lobo",
      location_complement: "12º Andar - Digital Solutions",
      location_neighborhood: "Paulista",
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_country: "Brazil",
      location_lat: -23.5580209,
      location_long: -46.6616788,
      location_raw: "Rua Haddock Lobo, 595",
      sponsored: false,
      sport_id: 1,
      author_id: 23,
    };

    const queryCreatePost = createQueryCreatePost(data);

    const responseCreatePost = await newRequestForApiGraphQL(
      baseURL,
      queryCreatePost,
      headersLoged
    );

    const post = responseCreatePost.body.data.postRegister;

    const queryLikePost = createQueryLikePost(post.id, 23, true);

    const responseLikePost = await newRequestForApiGraphQL(
      baseURL,
      queryLikePost,
      headersLoged
    );

    expect(responseLikePost.body.data).toHaveProperty("setLikePost");
    expect(responseLikePost.body.data.setLikePost).toBe(true);
  });
});
