const { convertToTimestamp } = require("../../utils/convertToTimestamp");
const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");

const { activityOne, activityTwo } = require("../../params");

const { createQueryLoginUser } = require("../users/functions/querys");
const {
  createQueryActivityById,
  createQueryActivitiesBySport,
  createQuerySearchActivitiesBySkill,
  createQuerySearchActivitiesByPrivacy,
  createQueryNewActivity,
  createQueryListMembersAcitivity,
} = require("./functions/querys");

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

  it(`Listo todas as atividades por um esporte especifico (${activityOne.sport.name})`, async () => {
    const querySearchActivities = createQueryActivitiesBySport(
      activityOne.sport_id
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
            id: `${activityOne.sport_id}`,
            name: activityOne.sport.name,
          },
        }),
      ])
    );
  });

  it(`Listo todas as atividades por um nivel de dificuldade especifico (${activityOne.skill_level.name})`, async () => {
    const querySearchActivities = createQuerySearchActivitiesBySkill(
      activityOne.skill_levels
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
              id: `${activityOne.skill_levels}`,
              name: activityOne.skill_level.name,
            },
          ],
        }),
      ])
    );
  });

  it(`Listo todas as atividades por uma privacidade especifica (${activityOne.privacy})`, async () => {
    const querySearchActivitiesByPrivacy = createQuerySearchActivitiesByPrivacy(
      activityOne.privacy
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
          privacy: `${activityOne.privacy}`,
        }),
      ])
    );
  });

  it("Prourando uma atividade em especifico ", async () => {
    const data = {
      title: activityOne.title,
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Vamos nos exercitar",
      skill_levels: activityOne.skill_levels,
      privacy: activityOne.privacy,
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: activityOne.date,
      begins_at: activityOne.begins_at,
      sport_id: activityOne.sport_id,
      author_id: activityOne.author_id,
    };
    const queryCreateActivity = createQueryNewActivity(data);

    const responseActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateActivity,
      headersLoged
    );

    const createdActivity = responseActivity.body.data.activityRegister;

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
      title: activityOne.title,
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Vamos nos exercitar",
      skill_levels: activityOne.skill_levels,
      privacy: activityOne.privacy,
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: activityOne.date,
      begins_at: activityOne.begins_at,
      sport_id: activityOne.sport_id,
      author_id: activityOne.author_id,
    };

    const queryCreateActivity = createQueryNewActivity(data);

    const responseActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateActivity,
      headersLoged
    );

    const createdActivity = responseActivity.body.data.activityRegister;

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
          first_name: `${activityOne.user.first_name}`,
          last_name: `${activityOne.user.last_name}`,
          user_name: `${activityOne.user.user_name}`,
        }),
      ])
    );
  });
});
