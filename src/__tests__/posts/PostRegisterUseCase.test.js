const { createFakerUser } = require("../../../src/utils/createFakerUser");
const { requestForApiGraphQL } = require("../../utils/requestForApi");

const baseUrl = "https://api-stg.sportidia.com/graphql";

describe("Registrando post",()=>{
    
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
              test.each([
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
            );
      })

