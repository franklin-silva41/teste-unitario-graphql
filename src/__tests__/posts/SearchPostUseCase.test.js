const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");
const { logger } = require("../../utils/logger");

const {
  firstPost,
  searchTitle,
} = require("./scenarios/CreateAndSearchPost.json");

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

  it(`Find my posts author_id: ${firstPost.author_id}`, async () => {
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

    const responseCreatePost = await newRequestForApiGraphQL(
      baseURL,
      queryCreatePost,
      headersLoged
    );

    const post = responseCreatePost.body.data.postRegister;

    postsDeleteIds.push(post.id);

    const queryFindMyPosts = createQueryFindPostByAuthorId(firstPost.author_id);

    const responseFindMyPosts = await newRequestForApiGraphQL(
      baseURL,
      queryFindMyPosts,
      headersLoged
    );

    logger.info({
      Teste: "Procurando a postagem criado pelo usuario",
      PostagemProcurada: {
        TituloPostagem: firstPost.title,
        Autor: firstPost.author.last_name,
        AutorID: firstPost.author_id,
        Recebidos: {
          AutorID: firstPost.author_id,
          LastName: firstPost.author.last_name,
        },
        Esperados: {
          AutorID: firstPost.author_id,
          LastName: firstPost.author.last_name,
        },
      },
    });

    const myPosts = responseFindMyPosts.body.data.findPosts.data;

    expect(myPosts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: {
            id: `${firstPost.author_id}`,
            last_name: firstPost.author.last_name,
          },
        }),
      ])
    );
  });

  it(`Search a find post by title: ${searchTitle}`, async () => {
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

    const responseCreatePost = await newRequestForApiGraphQL(
      baseURL,
      queryCreatePost,
      headersLoged
    );

    const createdPost = responseCreatePost.body.data.postRegister;

    postsDeleteIds.push(createdPost.id);

    const queryFindByPostTitle = createQueryFindPostByTitle(searchTitle);

    const responseFindPostByTitle = await newRequestForApiGraphQL(
      baseURL,
      queryFindByPostTitle,
      headersLoged
    );

    const post = responseFindPostByTitle.body.data.findPosts.data;

    logger.info({
      Teste: "Procurando uma postagem com titulo especifico",
      PostagemProcurada: {
        IDPostagem: createdPost.id,
        TituloPostagem: firstPost.title,
        AutorID: firstPost.author_id,
        Recebidos: searchTitle,
        Esperado: post[0].title,
      },
    });

    expect(post).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: `${searchTitle}`,
        }),
      ])
    );
  });
});
