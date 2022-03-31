const { convertToTimestamp } = require("../../utils/convertToTimestamp");
const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");

const { createQueryLoginUser } = require("../users/mocks/querys");
const {
  createQueryActivityById,
  createQueryActivitiesBySport,
  createQuerySearchActivitiesBySkill,
  createQuerySearchActivitiesByPrivacy,
  createQueryNewActivity,
} = require("./mocks/querys");

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

  it("Listo todas as atividades por um esporte especifico (Running)", async () => {
    // Pesquisando Atividade especifico (Corrida => Running)
    const querySearchActivities = createQueryActivitiesBySport(1);

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
  });

  it("Listo todas as atividades por um nivel de dificuldade especifico (Intermediate)", async () => {
    // Pesquisando Atividade com nivel de dificuldade especifica (Intermediate)
    const querySearchActivities = createQuerySearchActivitiesBySkill(2);

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
  });

  it("Listo todas as atividades por uma privacidade especifica (Publica)", async () => {
    // Pesquisando Atividade por uma privacidade especifica (Publica)
    const querySearchActivitiesByPrivacy =
      createQuerySearchActivitiesByPrivacy("Public");

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
  });

  it("Prourando uma atividade em especifico ", async () => {
    const data = {
      title: "Esporte é d+",
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Vamos nos exercitar",
      skill_levels: 1,
      privacy: "Public",
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: convertToTimestamp("2022-04-30 12:30:00"),
      begins_at: convertToTimestamp("2022-05-30 10:30:00"),
      sport_id: 1,
      author_id: 18,
    };

    const queryCreateActivity = createQueryNewActivity(data);

    const responseActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateActivity,
      headersLoged
    );

    const createdActivity = responseActivity.body.data.activityRegister;

    // Pesquisando Atividade com nivel de dificuldade especifica (Intermediate)
    const querySearchActivityById = createQueryActivityById(createdActivity.id);

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
          id: `${createdActivity.id}`,
        }),
      ])
    );
  });
});
