const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");
const { createQueryLoginUser } = require("../users/mocks/querys");

const {
  createQueryFindPostByAuthorId,
  createQueryCreatePost,
  createQueryFindPostByTitle,
} = require("./mocks/querys");

const headers = {
  "Content-Type": "application/json",
};

const baseURL = "https://api-stg.sportidia.com/graphql";
let token;
let headersLoged;

describe("Search Post", () => {
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

  it("Find my posts", async () => {
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

    await newRequestForApiGraphQL(baseURL, queryCreatePost, headersLoged);

    const queryFindMyPosts = createQueryFindPostByAuthorId(18);

    const responseFindMyPosts = await newRequestForApiGraphQL(
      baseURL,
      queryFindMyPosts,
      headersLoged
    );

    const myPosts = responseFindMyPosts.body.data.findPosts.data;

    expect(myPosts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: {
            id: "18",
            last_name: "Verri",
          },
        }),
      ])
    );
  });

  it("Search a find post by title", async () => {
    const queryFindByPostTitle = createQueryFindPostByTitle("Subida!");

    const responseFindPostByTitle = await newRequestForApiGraphQL(
      baseURL,
      queryFindByPostTitle,
      headersLoged
    );

    const post = responseFindPostByTitle.body.data.findPosts.data;

    expect(post).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Subida!",
        }),
      ])
    );
  });
});
