const { requestForApiGraphQL } = require("../../utils/requestForApi");
const { createFakerUser } = require("../../utils/createFakerUser");

const baseUrl = "https://api-stg.sportidia.com/graphql";

describe("Registro de Esporte Casos de sucesso!", () => {
  /*  it("#3.0 => O sistema cadastra o esport e me retorna um json da resposta", async () => {
    const { suffix } = createFakerUser();

    const query = `
            mutation fieldTestName{
                sportRegister(
                name: "Basquete"
                slug: "${suffix}"
                ){
                name
                }
            }
        `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body } = response;

    expect(body.data).toHaveProperty("sportRegister");
    expect(body.data.sportRegister).toHaveProperty("name");
    expect(body.data.sportRegister.name).toBe("Basquete");
  }); */
  /* it("# 3.1 => insiro um valor vazio no campo name", async () => {
    const { suffix } = createFakerUser();

    const query = `
        mutation fieldTestName{
            sportRegister(
            name: ""
            slug: "${suffix}"
            ){
                name
            }
        }
    `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body } = response;

    expect(body).toHaveProperty("errors");

    const [error] = body.errors;

    expect(error.message).toBe("Bad Request Exception");
  }); */
  /* it("# 3.3 => Insiro uma serie de caratcteres especiais no campo name", async () => {
    const { suffix } = createFakerUser();

    const query = `
        mutation fieldTestName{
            sportRegister(
            name: "@@@@@@"
            slug: "${suffix}"
            ){
                name
            }
        }
    `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body } = response;

    expect(body.data).toHaveProperty("sportRegister");
    expect(body.data.sportRegister.name).toBe("@@@@@@");
  }); */

  test.each([
    {
      campo: "name",
      name: "@@@@",
      suffix: createFakerUser().suffix,
    },
    {
      campo: "suffix",
      name: "Basquete",
      suffix: "@@@@",
    },
  ])(
    "Testes com valores com caracteres especiais",
    async ({ campo, name, suffix }) => {
      const query = `
        mutation fieldTestName{
            sportRegister(
            name: "${name}"
            slug: "${suffix}"
            ){
                ${campo}
            }
        }
    `;

      const response = await requestForApiGraphQL(baseUrl, query);

      const { body } = response;

      console.log(body);

      /* expect(body.data).toHaveProperty("sportRegister");
      expect(body.data.sportRegister[campo]).toBe("@@@@@@"); */
    }
  );

  /* test.each([["123456"], ["true"], ["false"], ["null"]])(
    "Espero que o campo name não sejam cadastrados com valor %s ",
    async (valor) => {
      await expect(async () => {
        const { suffix } = createFakerUser();

        const query = `
            mutation fieldTestName{
                sportRegister(
                    name: ${valor}
                    slug: "${suffix}"
                ){
                    name
                }
            }
        `;

        await requestForApiGraphQL(baseUrl, query);
      }).rejects.toThrowError();
    }
  ); */
  /* test.each([["123456"], ["true"], ["false"], ["null"]])(
    "Espero que o campo slug não sejam cadastrados com valor %s ",
    async (valor) => {
      await expect(async () => {
        const query = `
            mutation fieldTestName{
                sportRegister(
                    name: "Basquete"
                    slug: ${valor}
                ){
                    slug
                }
            }
        `;

        await requestForApiGraphQL(baseUrl, query);
      }).rejects.toThrowError();
    }
  ); */
});
