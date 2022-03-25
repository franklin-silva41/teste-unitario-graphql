const { requestForApiGraphQL } = require("../../utils/requestForApi");

const baseUrl = "https://api-stg.sportidia.com/graphql";

function executeTestNotAuthorizeUser(description, property, value) {
  it(description, async () => {
    const query = `
      mutation {
        postRegister(
          title: "Title Test"
          sport_id: 1
          author_id: 1
          ${property}: ${typeof value === "string" ? `"${value}"` : value}
        ){
          id
          title
          ${property}
          author {
            id
          }
          sport{
            name
          }
        }
      }
    `;

    const response = await requestForApiGraphQL(baseUrl, query);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toBe("NOT AUTHORIZATION");
  });
}

function executeTestsNotAuthorize(property, type) {
  let arrayNumbers = [[123456], [true], [false], [null]];
  let arrayStrings = [['""'], ["@@@@@@@"]];

  let arrayCases = type === "number" ? arrayNumbers : arrayStrings;

  test.each(arrayCases)(
    `Insiro um valor %s no campo ${property}`,
    async (value) => {
      const query = `
        mutation {
          postRegister(
            title: "Title Test"
            sport_id: 1
            author_id: 1
            ${property}: ${typeof value === "string" ? `"${value}"` : value}
          ){
            id
            title
            ${property}
            author {
              id
            }
            sport{
              name
            }
          }
        }
      `;

      const response = await requestForApiGraphQL(baseUrl, query);

      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors[0].message).toBe("NOT AUTHORIZATION");
    }
  );
}

describe("Registrando post", () => {
  /*  test.each([
                  ["title", ""],
                  ["description", ""],
                  ["sport_id", ""],
                  ["pass_word", ""],
                  ["e_mail", ""],
                ])(
                  "Espero que me retorne um erro quando colocamos uma String vazia nos campos obrigatorios",
                  async (campo, valor) => {
                    console.log(campo)
                    await expect(async()=>{
                      
                    dataTest[campo] = valor;
            
                    const query =`
                              mutation{
                                  postRegister(
                                    title:"${dataTest.title}"
                                    description:"${dataTest.description}"
                                    sport_id: "${dataTest.sport_id}"
                                    author_id: "${dataTest.author_id}"
                                  ){
                                    id
                                    title
                                    description
                                    author{
                                      id
                                    }
                                    sport{
                                      name
                                    }
                                }`
                    
                  
                    await requestForApiGraphQL(baseUrl, query);
                  }).rejects.toThrowError();
                  }
              );*/
  /*  test.each([
                ["title", "Corrida matinal"],
                ["description", "Corrida matinal"],
                ["sport_id", "Corrida matinal"],
                ["pass_word", "Corrida matinal"],
                ["e_mail", "Corrida matinal"],
              ])(
                "Espero que me retorne um erro quando colocamos uma String vazia nos campo %s",
                async (campo, valor) => {
                  console.log(campo)
                  await expect(async()=>{
                    
                  dataTest[campo] = valor;
          
                  const query =`
                            mutation{
                                postRegister(
                                  title:"${dataTest.title}"
                                  description:"${dataTest.description}"
                                  sport_id: "${dataTest.sport_id}"
                                  author_id: "${dataTest.author_id}"
                                ){
                                  id
                                  title
                                  description
                                  author{
                                    id
                                  }
                                  sport{
                                    name
                                  }
                              }`
                  
                
                  await requestForApiGraphQL(baseUrl, query);
                }).rejects.toThrowError();
                }
            ); */

  it("#4.122 => Insiro um valor string no campo title", async () => {
    const query = `
      mutation {
        postRegister(
          title: "Corrida matinal"
          sport_id: 1
          author_id: 1
        ){
          id
          title
          author {
            id
          }
          sport{
            name
          }
        }
      }
    `;

    const response = await requestForApiGraphQL(baseUrl, query);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toBe("NOT AUTHORIZATION");
  });

  test.each([[123456], [true], [false], [null]])(
    `Insiro um valor %s no campo title`,
    async (value) => {
      const query = `
        mutation {
          postRegister(
            title: ${value}
            sport_id: 1
            author_id: 1
          ){
            id
            title
            author {
              id
            }
            sport{
              name
            }
          }
        }
      `;

      const response = await requestForApiGraphQL(baseUrl, query);

      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors[0].message).toBe("NOT AUTHORIZATION");
    }
  );

  test.each([['""'], ["@@@@@@@"]])(
    `Insiro um valor %s no campo title`,
    async (value) => {
      const query = `
        mutation {
          postRegister(
            title: ${value}
            sport_id: 1
            author_id: 1
          ){
            id
            title
            author {
              id
            }
            sport{
              name
            }
          }
        }
      `;

      const response = await requestForApiGraphQL(baseUrl, query);

      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors[0].message).toBe("NOT AUTHORIZATION");
    }
  );

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.130 => Insiro um valor string no campo image_url",
    "description",
    "https://www.imagem.com/imagem.png"
  );
  executeTestsNotAuthorize("image_url", "number");
  executeTestsNotAuthorize("image_url", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.138 => Insiro um valor string no campo description",
    "description",
    "testeDescription testeDescription testeDescription testeDescription testeDescription testeDescription testeDescription testeDescription"
  );
  executeTestsNotAuthorize("description", "number");
  executeTestsNotAuthorize("description", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.146 => Insiro um valor string no campo location_street",
    "location_street",
    "Haddock Lobo"
  );
  executeTestsNotAuthorize("location_street", "number");
  executeTestsNotAuthorize("location_street", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.154 => Insiro um valor string no campo location_complement",
    "location_neighbordood",
    "Prédio 12º andar"
  );
  executeTestsNotAuthorize("location_complement", "number");
  executeTestsNotAuthorize("location_complement", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.154 => Insiro um valor string no campo location_complement",
    "location_neighbordood",
    "Prédio 12º andar"
  );
  executeTestsNotAuthorize("location_complement", "number");
  executeTestsNotAuthorize("location_complement", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.162 => Insiro um valor string no campo location_neighbordood",
    "location_neighbordood",
    "Paulista"
  );
  executeTestsNotAuthorize("location_neighbordood", "number");
  executeTestsNotAuthorize("location_neighbordood", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.170 => Insiro um valor string no campo location_city",
    "location_city",
    "São Paulo"
  );
  executeTestsNotAuthorize("location_city", "number");
  executeTestsNotAuthorize("location_city", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.178 => Insiro um valor string no campo location_state",
    "location_state",
    "SP"
  );
  executeTestsNotAuthorize("location_state", "number");
  executeTestsNotAuthorize("location_state", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.186 => Insiro um valor string no campo location_country",
    "location_country",
    "Brasil"
  );
  executeTestsNotAuthorize("location_country", "number");
  executeTestsNotAuthorize("location_country", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.194 => Insiro um valor númerico no campo location_lat",
    "location_lat",
    -23.558223141696832
  );
  executeTestsNotAuthorize("location_lat", "number");
  executeTestsNotAuthorize("location_lat", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.202 => Insiro um valor númerico no campo location_long",
    "location_long",
    -46.661423817350176
  );
  executeTestsNotAuthorize("location_long", "number");
  executeTestsNotAuthorize("location_long", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.210 => Insiro um valor string no campo sponsored",
    "location_raw",
    "testeCampoRaw"
  );
  executeTestsNotAuthorize("location_raw", "number");
  executeTestsNotAuthorize("location_raw", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.218 => Insiro um valor string no campo sponsored",
    "sponsored",
    "testeCampoSponsored"
  );
  executeTestsNotAuthorize("sponsored", "number");
  executeTestsNotAuthorize("sponsored", "string");

  // ==============================================
  executeTestNotAuthorizeUser(
    "#4.226 => Insiro um valor string no campo sport_id",
    "sport_id",
    "testeCampoSportId"
  );
  executeTestsNotAuthorize("sport_id", "number");
  executeTestsNotAuthorize("sport_id", "string");

  // ==============================================

  executeTestNotAuthorizeUser(
    "#4.235 => Insiro um valor string no campo author_id",
    "author_id",
    "testeCampoAuthorId"
  );
  executeTestsNotAuthorize("author_id", "number");
  executeTestsNotAuthorize("author_id", "string");
});
