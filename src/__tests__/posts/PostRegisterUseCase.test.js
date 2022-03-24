const { createFakerUser } = require("../../../src/utils/createFakerUser");
const { requestForApiGraphQL } = require("../../utils/requestForApi");

const baseUrl = "https://api-stg.sportidia.com/graphql";

function executeTestsNotAuthorize(property, type) {
  let arrayNumbers = [[123456], [true], [false], [null]];
  let arrayStrings = [['""'], ["@@@@@@@"]];

  let arrayCases = type === "number" ? arrayNumbers : arrayStrings;

  test.each(arrayCases)(
    `Insiro um valor %s no campo ${property}`,
    async (valor) => {
      let data = {
        title: "Title Test",
        description: "Test Description",
        sport_id: 1,
        author_id: 1,
        sponsored: true,
        location_street: "locationTest",
        location_complement: "complementTest",
        location_neighborhood: "neighborhoodTest",
        location_city: "cityTest",
        location_state: "stateTest",
        location_country: "countryTest",
        location_lat: 1.0,
        location_long: 1.0,
        location_raw: "rawTest",
      };

      data[property] = valor;

      const query = `
        mutation {
          postRegister(
            title: "${data.title}"
            description: "${data.description}"
            sport_id: ${data.sport_id}
            author_id: ${data.author_id}
            sponsored: ${data.sponsored}
            location_street: "${data.location_street}"
            location_complement: "${data.location_complement}"
            location_neighborhood: "${data.location_neighborhood}"
            location_city: "${data.location_city}"
            location_state: "${data.location_state}"
            location_country: "${data.location_country}"
            location_lat: ${data.location_lat}
            location_long: ${data.location_long}
            location_raw: "${data.location_raw}"
          ){
            id
            title
            description
            sponsored
            location_street
            location_complement
            location_neighborhood
            location_city
            location_state
            location_country
            location_lat
            location_long
            location_raw
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
  // executeTestsNotAuthorize("location_raw", "number");
  // executeTestsNotAuthorize("location_raw", "string");
  // executeTestsNotAuthorize("sponsored", "number");
  // executeTestsNotAuthorize("sponsored", "string");
  // executeTestsNotAuthorize("sport_id", "number");
  // executeTestsNotAuthorize("sport_id", "string");
  // executeTestsNotAuthorize("author_id", "number");
  // executeTestsNotAuthorize("author_id", "string");
});
