const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");

const { postOne } = require("../../params");

const { createQueryLoginUser } = require("../users/functions/querys");

const {
  createQueryFindPostByAuthorId,
  createQueryCreatePost,
  createQueryFindPostByTitle,
  createQueryRemovePost,
} = require("./functions/querys");

const headers = {
  "Content-Type": "application/json",
};

const baseURL = "https://api-stg.sportidia.com/graphql";
let token;
let headersLoged;
let postsDeleteIds = [];

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

  afterAll(() => {
    postsDeleteIds.map(async (post) => {
      const queryRemovePost = createQueryRemovePost(post);
      await newRequestForApiGraphQL(baseURL, queryRemovePost, headersLoged);
    });
  });

  it(`Find my posts author_id: ${postOne.author_id}`, async () => {
    const data = {
      title: postOne.title,
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
      sponsored: postOne.sponsored,
      sport_id: postOne.sport_id,
      author_id: postOne.author_id,
    };

    const queryCreatePost = createQueryCreatePost(data);

    const responseCreatePost = await newRequestForApiGraphQL(
      baseURL,
      queryCreatePost,
      headersLoged
    );

    const post = responseCreatePost.body.data.postRegister;

    postsDeleteIds.push(post.id);

    const queryFindMyPosts = createQueryFindPostByAuthorId(postOne.author_id);

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
            id: `${postOne.author_id}`,
            last_name: postOne.author.last_name,
          },
        }),
      ])
    );
  });

  it(`Search a find post by title: ${postOne.searchTitle}`, async () => {
    const data = {
      title: postOne.title,
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
      sponsored: postOne.sponsored,
      sport_id: postOne.sport_id,
      author_id: postOne.author_id,
    };

    const queryCreatePost = createQueryCreatePost(data);

    const responseCreatePost = await newRequestForApiGraphQL(
      baseURL,
      queryCreatePost,
      headersLoged
    );

    const createdPost = responseCreatePost.body.data.postRegister;

    postsDeleteIds.push(createdPost.id);

    const queryFindByPostTitle = createQueryFindPostByTitle(
      postOne.searchTitle
    );

    const responseFindPostByTitle = await newRequestForApiGraphQL(
      baseURL,
      queryFindByPostTitle,
      headersLoged
    );

    const post = responseFindPostByTitle.body.data.findPosts.data;

    expect(post).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: `${postOne.searchTitle}`,
        }),
      ])
    );
  });
});
