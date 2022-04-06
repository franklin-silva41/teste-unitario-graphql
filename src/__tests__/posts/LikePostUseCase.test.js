const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");
const { logger } = require("../../utils/logger");

const { firstPost } = require("./scenarios/CreateAndLikePost.json");

const {
  createQueryCreatePost,
  createQueryLikePost,
  createQueryRemovePost,
} = require("./functions/querys");
const { loginUser } = require("./functions/loginUser");

const baseURL = "https://api-stg.sportidia.com/graphql";
let headersLoged;
let postDeleteId;

describe("Like Post", () => {
  beforeAll(async () => {
    headersLoged = await loginUser("eduardo.verri@sptech.school", "teste123");
  });

  afterAll(async () => {
    const queryRemovePost = createQueryRemovePost(postDeleteId);
    await newRequestForApiGraphQL(baseURL, queryRemovePost, headersLoged);
  });

  it("Like a post", async () => {
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

    postDeleteId = post.id;

    const headersOtherUser = await loginUser(
      "igor.silva@bandtec.com.br",
      "teste123"
    );

    const queryLikePost = createQueryLikePost(
      post.id,
      firstPost.author_id,
      firstPost.sponsored
    );

    const responseLikePost = await newRequestForApiGraphQL(
      baseURL,
      queryLikePost,
      headersOtherUser
    );

    logger.info({
      Teste:
        "Criando postagem e um outro usuario dando like na postagem criada!",
      PostagemCriada: {
        TituloPostagem: firstPost.title,
        Autor: firstPost.author.last_name,
        UsuarioADarLike: "Igor Silva",
        Recebido: { setLikePost: responseLikePost.body.data.setLikePost },
        Esperado: { setLikePost: true },
      },
    });

    expect(responseLikePost.body.data).toHaveProperty("setLikePost");
    expect(responseLikePost.body.data.setLikePost).toBe(true);
  });
});
