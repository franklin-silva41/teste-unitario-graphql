const { requestForApiGraphQL } = require("../../utils/requestForApi");
const { createFakerUser } = require("../../utils/createFakerUser");

const baseUrl = "https://api-stg.sportidia.com/graphql";

describe("Registro de Esporte Casos de sucesso!", () => {
  it("#3.0 => O sistema cadastra o esporte e me retorna um json da resposta", async () => {
    const { firstName } = createFakerUser();

    const query = `
            mutation fieldTestName{
                sportRegister(
                name: "Basquete"
                slug: "${firstName}"
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
  });

  it("# 3.1 => insiro um valor vazio no campo name", async () => {
    const { firstName } = createFakerUser();

    const query = `
        mutation fieldTestName{
            sportRegister(
            name: ""
            slug: "${firstName}"
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
  });

  test.each([
    {
      campo: "name",
      name: "@@@@@@@",
      suffix: createFakerUser().firstName,
      image_url: "https://testeimagem.com/imagem.png",
      pin_image_url: "testeCampo",
    },
    {
      campo: "slug",
      name: "Basquete",
      suffix: `${createFakerUser().firstName}@@@@@@@`,
      image_url: "https://testeimagem.com/imagem.png",
      pin_image_url: "testeCampo",
    },
    {
      campo: "image_url",
      name: "Basquete",
      suffix: `${createFakerUser().firstName}`,
      image_url: "@@@@@@@",
      pin_image_url: "testeCampo",
    },
    {
      campo: "pin_image_url",
      name: "Basquete",
      suffix: `${createFakerUser().firstName}`,
      image_url: "@@@@@@@",
      pin_image_url: "@@@@@@@",
    },
  ])(
    "Testes com campo $campo com valor de caracteres especiais",
    async ({ campo, name, suffix, image_url, pin_image_url }) => {
      const query = `
        mutation fieldTestName{
            sportRegister(
            name: "${name}"
            slug: "${suffix}"
            image_url: "${image_url}"
            pin_image_url: "${pin_image_url}"
            ){
              ${campo}
            }
        }
    `;

      const response = await requestForApiGraphQL(baseUrl, query);

      const { body } = response;

      expect(body.data).toHaveProperty("sportRegister");
    }
  );

  test.each([["123456"], ["true"], ["false"], ["null"]])(
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
  );

  test.each([["123456"], ["true"], ["false"], ["null"]])(
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
  );

  it("#3.15 => Insiro um valor existente no campo slug", async () => {
    const { suffix } = createFakerUser();

    const query = `
      mutation fieldTestSlug{
          sportRegister(
              name: "testeSlug8"
              slug: "${suffix}"
          ){
            slug
          }
      }
    `;

    await requestForApiGraphQL(baseUrl, query);

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body } = response;

    expect(body).toHaveProperty("errors");
    expect(body.errors[0].message).toBe("SLUGALREADYEXISTS");
  });

  it("# 3.17 => insiro um valor string no campo image_url", async () => {
    const { companySuffix } = createFakerUser();

    const query = `
      mutation fieldTestImageUrl{
          sportRegister(
            name: "testeImageUrl1"
            slug: "${companySuffix}",
            image_url: "https://testeimagem.com/imagem.png"
          ){
            image_url
          }
      }
    `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body } = response;

    expect(body).toHaveProperty("data");
  });

  test.each([[""], ["123456"], [true], [false], [null]])(
    "Espero que o campo image_url não sejam cadastrados com valor %s ",
    async (valor) => {
      await expect(async () => {
        const { companySuffix } = createFakerUser();

        const query = `
            mutation fieldTestName{
                sportRegister(
                    name: "Basquete"
                    slug: "${companySuffix}",
                    image_url: ${valor}
                ){
                  image_url
                }
            }
        `;

        await requestForApiGraphQL(baseUrl, query);
      }).rejects.toThrowError();
    }
  );

  it("# 3.25 insiro um valor string no campo image_url => ", async () => {
    const { firstName } = createFakerUser();

    const query = `
      mutation fieldTestPinImage{
          sportRegister(
            name: "testeImageUrl1"
            slug: "${firstName}",
            image_url: "https://testepinimage.com/pinimagem.png"
            pin_image_url: "testeCampo"
          ){
            pin_image_url
          }
      }
    `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body } = response;

    expect(body.data).toHaveProperty("sportRegister");
    expect(body.data.sportRegister.pin_image_url).toBe("testeCampo");
  });

  test.each([[""], ["123456"], [true], [false], [null]])(
    "Espero que o campo pin_image_url não sejam cadastrados com valor %s ",
    async (valor) => {
      await expect(async () => {
        const { firstName } = createFakerUser();

        const query = `
            mutation fieldTestName{
                sportRegister(
                    name: "Basquete"
                    slug: "${firstName}",
                    image_url: "https://testepinimage.com/pinimagem.png"
                    pin_image_url: ${valor}
                ){
                  pin_image_url
                }
            }
        `;

        await requestForApiGraphQL(baseUrl, query);
      }).rejects.toThrowError();
    }
  );
});
