const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");
const { createQueryLoginUser } = require("./mocks/querys");
const {
  createQuerySearchSport,
  createQuerySearchSportLevelsSkill,
  createQuerySearchSportByPrivacy,
  createQuerySportById,
} = require("../sport/mocks/querys");

const headers = {
  "Content-Type": "application/json",
};

const baseURL = "https://api-stg.sportidia.com/graphql";
let token;
let headersLoged;

describe("Search Activities", () => {
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

  /* it("Listo todas as atividades por um esporte especifico (Running)", async () => {
    // Pesquisando Atividade especifico (Corrida => Running)
    const querySearchActivities = createQuerySearchSport(1);

    const responseActivities = await newRequestForApiGraphQL(
      baseURL,
      querySearchActivities,
      headersLoged
    );

    const { body } = responseActivities;

    const activities = body.data.findActivities;

    expect(activities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sport: {
            id: "1",
            name: "Running",
          },
        }),
      ])
    );
  }); */

  /* it("Listo todas as atividades por um nivel de dificuldade especifico (Intermediate)", async () => {
    // Pesquisando Atividade com nivel de dificuldade especifica (Intermediate)
    const querySearchActivities = createQuerySearchSportLevelsSkill(2);

    const responseActivities = await newRequestForApiGraphQL(
      baseURL,
      querySearchActivities,
      headersLoged
    );

    const { body } = responseActivities;

    const activities = body.data.findActivities;

    expect(activities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          skill_levels: [{ id: "2", name: "Intermediate" }],
        }),
      ])
    );
  }); */

  /* it("Listo todas as atividades por uma privacidade especifica (Publica)", async () => {
    // Pesquisando Atividade por uma privacidade especifica (Publica)
    const querySearchActivitiesByPrivacy =
      createQuerySearchSportByPrivacy("Public");

    const responseActivities = await newRequestForApiGraphQL(
      baseURL,
      querySearchActivitiesByPrivacy,
      headersLoged
    );

    const { body } = responseActivities;

    const activities = body.data.findActivities;

    expect(activities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          privacy: "Public",
        }),
      ])
    );
  }); */

  it("Prourando uma atividade em especifico ", async () => {
    // Pesquisando Atividade com nivel de dificuldade especifica (Intermediate)
    const querySearchActivityById = createQuerySportById(43);

    const responseActivities = await newRequestForApiGraphQL(
      baseURL,
      querySearchActivityById,
      headersLoged
    );

    const { body } = responseActivities;

    const activity = body.data.findActivities;

    expect(activity).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "43",
        }),
      ])
    );
  });
});
