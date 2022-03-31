const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");

const { createQueryLoginUser } = require("../users/mocks/querys");

const {
  createQueryCreatePost,
  createQueryUpdatePost,
  createQueryFindAllPosts,
} = require("./mocks/querys");

const headers = {
  "Content-Type": "application/json",
};

const baseURL = "https://api-stg.sportidia.com/graphql";
let token;
let headersLoged;

describe("Create Post", () => {
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

  it("Create a new post and update post", async () => {
    /* Criando Post */

    const data = {
      title: "Teste Postagem",
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

    const responseCreateFirstPost = await newRequestForApiGraphQL(
      baseURL,
      queryCreatePost,
      headersLoged
    );

    const firstPost = responseCreateFirstPost.body.data.postRegister;

    const newData = {
      title: "Teste Postagem 2",
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

    const createQueryCreateSecondPost = createQueryCreatePost(newData);

    const responseCreateSecondPost = await newRequestForApiGraphQL(
      baseURL,
      createQueryCreateSecondPost,
      headersLoged
    );

    const secundPost = responseCreateSecondPost.body.data.postRegister;

    const dataFirstPostUpdated = {
      ...firstPost,
      id: firstPost.id,
      title: "Atualizando a postagem Teste",
    };

    const queryPostUpdate = createQueryUpdatePost(dataFirstPostUpdated);

    await newRequestForApiGraphQL(baseURL, queryPostUpdate, headersLoged);

    const queryFindAllPosts = createQueryFindAllPosts();

    const responseAllPosts = await newRequestForApiGraphQL(
      baseURL,
      queryFindAllPosts,
      headersLoged
    );

    const allPosts = responseAllPosts.body.data.findPosts.data;

    expect(allPosts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Atualizando a postagem Teste",
        }),
      ])
    );

    expect(allPosts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: secundPost.title,
        }),
      ])
    );
  });
});