const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");

const {
  firstPost,
  secundPost,
  updatedFirstPost,
} = require("./scenarios/CreateAndUpdatePosts.json");

const { createQueryLoginUser } = require("../users/functions/querys");

const {
  createQueryCreatePost,
  createQueryUpdatePost,
  createQueryFindAllPosts,
  createQueryRemovePost,
} = require("./functions/querys");

const headers = {
  "Content-Type": "application/json",
};

const baseURL = "https://api-stg.sportidia.com/graphql";
let token;
let headersLoged;
let postsDeleteIds = [];

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

  afterAll(() => {
    postsDeleteIds.map(async (post) => {
      const queryDeletePost = createQueryRemovePost(post);
      await newRequestForApiGraphQL(baseURL, queryDeletePost, headersLoged);
    });
  });

  it("Create a new post and update post", async () => {
    const data = {
      title: firstPost.title,
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
      sponsored: firstPost.sponsored,
      sport_id: firstPost.sport_id,
      author_id: firstPost.author_id,
    };

    const queryCreatePost = createQueryCreatePost(data);

    const responseCreateFirstPost = await newRequestForApiGraphQL(
      baseURL,
      queryCreatePost,
      headersLoged
    );

    const postOne = responseCreateFirstPost.body.data.postRegister;

    const newData = {
      title: secundPost.title,
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
      sponsored: secundPost.sponsored,
      sport_id: secundPost.sport_id,
      author_id: secundPost.author_id,
    };

    const createQueryCreateSecondPost = createQueryCreatePost(newData);

    const responseCreateSecondPost = await newRequestForApiGraphQL(
      baseURL,
      createQueryCreateSecondPost,
      headersLoged
    );

    const postTwo = responseCreateSecondPost.body.data.postRegister;

    const dataFirstPostUpdated = {
      ...postOne,
      id: postOne.id,
      title: updatedFirstPost.title,
    };

    postsDeleteIds.push(dataFirstPostUpdated.id);
    postsDeleteIds.push(postTwo.id);

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
          title: updatedFirstPost.title,
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
