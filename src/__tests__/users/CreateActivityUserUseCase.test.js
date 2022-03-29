const { newRequestForApiGraphQL } = require("../../utils/newRequestForApi");
const { convertToTimestamp } = require("../../utils/convertToTimestamp");
const {
  createQueryLoginUser,
  createQueryNewActivity,
  createQueryListActivity,
  createQueryUpdateActivity,
  createQueryDeleteActivity,
} = require("./mocks/querys");

const headers = {
  "Content-Type": "application/json",
};

const baseURL = "https://api-stg.sportidia.com/graphql";
let token;
let headersLoged;

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

  it("Create a new activity and delete activity", async () => {
    /* Criação de Atividade */
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
      date: convertToTimestamp("2022-03-30 12:30:00"),
      begins_at: convertToTimestamp("2022-04-05 10:30:00"),
      sport_id: 1,
      author_id: 18,
    };

    const queryCreateActivity = createQueryNewActivity(data);

    const responseActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateActivity,
      headersLoged
    );

    const activity = responseActivity.body.data.activityRegister;

    const newData = {
      title: "Corrida",
      image_url:
        "https://res.cloudinary.com/sportidia/image/upload/v1648148819/ohj0en4augmsndrggskt.jpg",
      description: "Venha Correr com a gente",
      skill_levels: 1,
      privacy: "Public",
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_lat: -23.5668698,
      location_long: -46.6608874,
      date: convertToTimestamp("2022-03-30 12:30:00"),
      begins_at: convertToTimestamp("2022-04-20 07:30:00"),
      sport_id: 1,
      author_id: 18,
    };

    const queryCreateNewActivity = createQueryNewActivity(newData);

    const responseNewActivity = await newRequestForApiGraphQL(
      baseURL,
      queryCreateNewActivity,
      headersLoged
    );

    const newActivity = responseNewActivity.body.data.activityRegister;

    const activityDataUpdate = {
      ...newData,
      id: newActivity.id,
      title: "Basquete na Praça",
    };

    const queryActivityUpdated = createQueryUpdateActivity(activityDataUpdate);

    await newRequestForApiGraphQL(baseURL, queryActivityUpdated, headersLoged);

    /* Listagem da Atividade */
    const queryListActivity = createQueryListActivity(newActivity.id);

    const responseListActivity = await newRequestForApiGraphQL(
      baseURL,
      queryListActivity,
      headersLoged
    );

    const queryListNewActivity = createQueryListActivity(activity.id);

    const responseListNewActivity = await newRequestForApiGraphQL(
      baseURL,
      queryListNewActivity,
      headersLoged
    );

    expect(responseListActivity.body.data.findActivities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Basquete na Praça",
        }),
      ])
    );

    expect(responseListNewActivity.body.data.findActivities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Esporte é d+",
        }),
      ])
    );
  });
});
