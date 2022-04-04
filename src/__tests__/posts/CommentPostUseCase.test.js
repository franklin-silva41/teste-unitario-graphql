const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");

const { postOne } = require("../../params");

const {
  createQueryCreatePost,
  createQueryCommentPost,
  createQueryRemovePost,
} = require("./functions/querys");

const { loginUser } = require("./functions/loginUser");

const baseURL = "https://api-stg.sportidia.com/graphql";
let headersLoged;
let postDeleteId;

describe("Comment Post", () => {
  beforeAll(async () => {
    headersLoged = await loginUser("eduardo.verri@sptech.school", "teste123");
  });

  afterAll(async () => {
    const queryRemovePost = createQueryRemovePost(postDeleteId);
    await newRequestForApiGraphQL(baseURL, queryRemovePost, headersLoged);
  });

  it("User comment other post", async () => {
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

    postDeleteId = post.id;

    const headersOtherUser = await loginUser(
      "igor.silva@bandtec.com.br",
      "teste123"
    );

    const queryCommentPost = createQueryCommentPost(post.id, postOne.comment);

    const responseComment = await newRequestForApiGraphQL(
      baseURL,
      queryCommentPost,
      headersOtherUser
    );

    const comment = responseComment.body.data;

    expect(comment).toHaveProperty("createCommentPost");
    expect(comment.createCommentPost).toBe(true);
  });
});
