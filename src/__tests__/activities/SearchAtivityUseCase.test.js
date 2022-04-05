const { convertToTimestamp } = require("../../utils/convertToTimestamp");
const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");

const { fistActivity } = require("./scenarios/CreateAndSearchActivity.json");

const { createQueryLoginUser } = require("../users/functions/querys");
const {
  createQueryActivityById,
  createQueryActivitiesBySport,
  createQuerySearchActivitiesBySkill,
  createQuerySearchActivitiesByPrivacy,
  createQueryNewActivity,
  createQueryListMembersAcitivity,
  createQueryDeleteActivity,
} = require("./functions/querys");

const headers = {
  "Content-Type": "application/json",
};

const baseURL = "https://api-stg.sportidia.com/graphql";
let token;
let headersLoged;
let activitiesIds = [];

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

  afterAll(() => {
    activitiesIds.map(async (activity) => {
      const query = createQueryDeleteActivity(activity);

      await newRequestForApiGraphQL(baseURL, query, headersLoged);
    });
  });

  it(`Listo todas as atividades por um esporte especifico (${fistActivity.sport.name})`, async () => {
    const data = {
      title: fistActivity.title,
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Vamos nos exercitar",
      skill_levels: fistActivity.skill_levels_id,
      privacy: fistActivity.privacy,
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: convertToTimestamp(fistActivity.date),
      begins_at: convertToTimestamp(fistActivity.begins_at),
      sport_id: fistActivity.sport_id,
      author_id: fistActivity.author_id,
    };
    const queryCreateActivity = createQueryNewActivity(data);

    const responseCreatedActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateActivity,
      headersLoged
    );

    const createdActivity = responseCreatedActivity.body.data.activityRegister;

    activitiesIds.push(createdActivity.id);

    const querySearchActivities = createQueryActivitiesBySport(
      fistActivity.sport_id
    );

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
            id: `${fistActivity.sport_id}`,
            name: fistActivity.sport.name,
          },
        }),
      ])
    );
  });

  it(`Listo todas as atividades por um nivel de dificuldade especifico (${fistActivity.skill_level.name})`, async () => {
    const data = {
      title: fistActivity.title,
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Vamos nos exercitar",
      skill_levels: fistActivity.skill_levels_id,
      privacy: fistActivity.privacy,
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: convertToTimestamp(fistActivity.date),
      begins_at: convertToTimestamp(fistActivity.begins_at),
      sport_id: fistActivity.sport_id,
      author_id: fistActivity.author_id,
    };
    const queryCreateActivity = createQueryNewActivity(data);

    const responseCreatedActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateActivity,
      headersLoged
    );

    const createdActivity = responseCreatedActivity.body.data.activityRegister;

    activitiesIds.push(createdActivity.id);

    const querySearchActivities = createQuerySearchActivitiesBySkill(
      fistActivity.skill_levels_id
    );

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
          skill_levels: [
            {
              id: `${fistActivity.skill_levels_id}`,
              name: fistActivity.skill_level.name,
            },
          ],
        }),
      ])
    );
  });

  it(`Listo todas as atividades por uma privacidade especifica (${fistActivity.privacy})`, async () => {
    const data = {
      title: fistActivity.title,
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Vamos nos exercitar",
      skill_levels: fistActivity.skill_levels_id,
      privacy: fistActivity.privacy,
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: convertToTimestamp(fistActivity.date),
      begins_at: convertToTimestamp(fistActivity.begins_at),
      sport_id: fistActivity.sport_id,
      author_id: fistActivity.author_id,
    };
    const queryCreateActivity = createQueryNewActivity(data);

    const responseCreatedActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateActivity,
      headersLoged
    );

    const createdActivity = responseCreatedActivity.body.data.activityRegister;

    activitiesIds.push(createdActivity.id);

    const querySearchActivitiesByPrivacy = createQuerySearchActivitiesByPrivacy(
      fistActivity.privacy
    );

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
          privacy: `${fistActivity.privacy}`,
        }),
      ])
    );
  });

  it("Prourando uma atividade em especifico ", async () => {
    const data = {
      title: fistActivity.title,
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Vamos nos exercitar",
      skill_levels: fistActivity.skill_levels_id,
      privacy: fistActivity.privacy,
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: convertToTimestamp(fistActivity.date),
      begins_at: convertToTimestamp(fistActivity.begins_at),
      sport_id: fistActivity.sport_id,
      author_id: fistActivity.author_id,
    };
    const queryCreateActivity = createQueryNewActivity(data);

    const responseActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateActivity,
      headersLoged
    );

    const createdActivity = responseActivity.body.data.activityRegister;

    activitiesIds.push(createdActivity.id);

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

  it("Pesquisando uma atividade e listando todos os membros dessa atividade", async () => {
    const data = {
      title: fistActivity.title,
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Vamos nos exercitar",
      skill_levels: fistActivity.skill_levels_id,
      privacy: fistActivity.privacy,
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: convertToTimestamp(fistActivity.date),
      begins_at: convertToTimestamp(fistActivity.begins_at),
      sport_id: fistActivity.sport_id,
      author_id: fistActivity.author_id,
    };

    const queryCreateActivity = createQueryNewActivity(data);

    const responseActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateActivity,
      headersLoged
    );

    const createdActivity = responseActivity.body.data.activityRegister;

    activitiesIds.push(createdActivity.id);

    const querySearchActivityById = createQueryActivityById(createdActivity.id);

    const responseActivities = await newRequestForApiGraphQL(
      baseURL,
      querySearchActivityById,
      headersLoged
    );

    const activity = responseActivities.body.data.findActivities;

    const queryListMembersActivity = createQueryListMembersAcitivity(
      activity[0].id
    );

    const responseMembersActivity = await newRequestForApiGraphQL(
      baseURL,
      queryListMembersActivity,
      headersLoged
    );

    const members = responseMembersActivity.body.data;

    expect(members).toHaveProperty("listActivityMembers");
    expect(members.listActivityMembers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          first_name: `${fistActivity.user.first_name}`,
          last_name: `${fistActivity.user.last_name}`,
          user_name: `${fistActivity.user.user_name}`,
        }),
      ])
    );
  });
});
