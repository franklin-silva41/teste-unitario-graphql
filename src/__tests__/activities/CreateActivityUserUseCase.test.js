const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");
const { createQueryLoginUser } = require("../users/functions/querys");
const { convertToTimestamp } = require("../../utils/convertToTimestamp");

const {
  fistActivity,
  secundActivity,
} = require("./scenarios/CreateActivity.json");

const {
  createQueryNewActivity,
  createQueryActivityById,
  createQueryDeleteActivity,
} = require("./functions/querys");

const headers = {
  "Content-Type": "application/json",
};

const baseURL = "https://api-stg.sportidia.com/graphql";
let token;
let headersLoged;
let activitiesIds = [];

describe("Create Activities", () => {
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
      const queryRemoveActivity = createQueryDeleteActivity(activity);
      await newRequestForApiGraphQL(baseURL, queryRemoveActivity, headersLoged);
    });
  });

  it("Create a new activities", async () => {
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

    const activity = responseActivity.body.data.activityRegister;

    const newData = {
      title: secundActivity.title,
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Venha Correr com a gente",
      skill_levels: secundActivity.skill_levels_id,
      privacy: secundActivity.privacy,
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: convertToTimestamp(secundActivity.date),
      begins_at: convertToTimestamp(secundActivity.begins_at),
      sport_id: secundActivity.sport_id,
      author_id: secundActivity.author_id,
    };

    const queryCreateNewActivity = createQueryNewActivity(newData);

    const responseNewActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateNewActivity,
      headersLoged
    );

    const newActivity = responseNewActivity.body.data.activityRegister;

    activitiesIds.push(activity.id);
    activitiesIds.push(newActivity.id);

    const queryListActivity = createQueryActivityById(newActivity.id);

    const responseListActivity = await newRequestForApiGraphQL(
      baseURL,
      queryListActivity,
      headersLoged
    );

    const queryListNewActivity = createQueryActivityById(activity.id);

    const responseListNewActivity = await newRequestForApiGraphQL(
      baseURL,
      queryListNewActivity,
      headersLoged
    );

    expect(responseListActivity.body.data.findActivities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: secundActivity.title,
        }),
      ])
    );

    expect(responseListNewActivity.body.data.findActivities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: fistActivity.title,
        }),
      ])
    );
  });
});
