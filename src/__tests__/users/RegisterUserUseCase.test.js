const rp = require("request-promise");
const { createFakerUser } = require("../../../src/utils/createFakerUser");
const { requestForApiGraphQL } = require("../../utils/requestForApi");
const baseUrl = "https://api-stg.sportidia.com/graphql";
const { faker } = require("@faker-js/faker");
const { response } = require("express");
const { urlencoded } = require("express");
const header = {
  "Content-Type": "application/json",
  //  Authorization:""
};

describe("cadastro de usuario", () => {
  it("#1.0 =>Espero um usuario ", async () => {
    const name = faker.name.firstName();
    const lastName = faker.name.lastName();
    const userName = faker.internet.userName();
    const email = faker.internet.email();
    const query = `
        mutation registrandoUser{
            userRegister(
                first_name: "${name}"
                last_name: "${lastName}"
                user_name: "${userName}"
                email: "${email}"
                password: "teste123"
                user_type: "default"
                avatar: "testegenre"
                birth_date: "2000-01-01"
                genre: null
            ){
                user {
                    first_name
                    last_name
                    user_name
                    email
                    password
                    user_type
                    avatar
                    birth_date
                    genre
                }
            }
        }
      `;
    const response = await rp.post({
      uri: baseUrl,
      body: {
        query,
      },
      header,
      json: true,
      resolveWithFullResponse: true,
    });

    const { body, statusCode } = response;
    console.log(body);
    expect(statusCode).toBe(200);
    expect(body.data.userRegister.user).toHaveProperty("first_name");
  });
  it("#1.35 => Email invalido", async () => {
    const name = faker.name.firstName();
    const lastName = faker.name.lastName();
    const userName = faker.internet.userName();
    const emailInvalido = "teste.com";
    const query = `
        mutation registrandoUser{
            userRegister(
                first_name: "${name}"
                last_name: "${lastName}"
                user_name: "${userName}"
                email: "${emailInvalido}"
                password: "teste123"
                user_type: "default"
                avatar: "testegenre"
                birth_date: "2000-01-01"
                genre: null
            ){
                user{
                    first_name
                }
            }
        }
      `;
    const response = await rp.post({
      uri: baseUrl,
      body: {
        query,
      },
      header,
      json: true,
      resolveWithFullResponse: true,
    });
    const { body, statusCode } = response;
    console.log(body);
    expect(statusCode).toBe(200);
    expect(body.errors[0].message).toBe("Bad Request Exception");
  });
  it("#1.36 => Cadastrando inserindo um valor string no campo Senha", async () => {
    const name = faker.name.firstName();
    const lastName = faker.name.lastName();
    const userName = faker.internet.userName();
    const email = faker.internet.email();
    const query = `
        mutation registrandoUser{
            userRegister(
                first_name: "${name}"
                last_name: "${lastName}"
                user_name: "${userName}"
                email: "${email}"
                password: "senhateste"
                user_type: "default"
                avatar: "testegenre"
                birth_date: "2000-01-01"
                genre: null
            ){
                user{
                    first_name
                }
            }
        }
      `;
    const response = await rp.post({
      uri: baseUrl,
      body: {
        query,
      },
      header,
      json: true,
      resolveWithFullResponse: true,
    });
    const { body, statusCode } = response;
    console.log(body.data);
    expect(statusCode).toBe(200);
    expect(body).toHaveProperty("data");
  });
  it("#1.37 => Senha com uma String vazia", async () => {
    const name = faker.name.firstName();
    const lastName = faker.name.lastName();
    const userName = faker.internet.userName();
    const email = faker.internet.email();
    const query = `
        mutation registrandoUser{
            userRegister(
                first_name: "${name}"
                last_name: "${lastName}"
                user_name: "${userName}"
                email: "${email}"
                password: ""
                user_type: "default"
                avatar: "testegenre"
                birth_date: "2000-01-01"
                genre: null
            ){
                user{
                    first_name
                }
            }
        }
      `;
    const response = await rp.post({
      uri: baseUrl,
      body: {
        query,
      },
      header,
      json: true,
      resolveWithFullResponse: true,
    });
    const { body, statusCode } = response;
    console.log(body);
    expect(statusCode).toBe(200);
    expect(body.errors[0].message).toBe("Bad Request Exception");
  });

  it("#1.38 => Senha com numeros", async () => {
    expect(async () => {
      const name = faker.name.firstName();
      const lastName = faker.name.lastName();
      const userName = faker.internet.userName();
      const email = faker.internet.email();
      const password = 123456;
      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${name}"
                    last_name: "${lastName}"
                    user_name: "${userName}"
                    email: "${email}"
                    password: ${password}
                    user_type: "default"
                    avatar: "testegenre"
                    birth_date: "2000-01-01"
                    genre: null
                ){
                    user{
                        first_name
                    }
                }
            }
        `;
      await rp.post({
        uri: baseUrl,
        body: {
          query,
        },
        header,
        json: true,
        resolveWithFullResponse: true,
      });
    }).rejects.toThrow("String cannot represent a non string value: 123456");
  });

  it("#1.39 => Erro ao tentar criar senha com CARACTER ESPECIAL", async () => {
    expect(async () => {
      const name = faker.name.firstName();
      const lastName = faker.name.lastName();
      const userName = faker.internet.userName();
      const email = faker.internet.email();
      const password = "@@@@@";
      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${name}"
                    last_name: "${lastName}"
                    user_name: "${userName}"
                    email: "${email}"
                    password: ${password}
                    user_type: "default"
                    avatar: "testegenre"
                    birth_date: "2000-01-01"
                    genre: null
                ){
                    user{
                        first_name
                    }
                }
            }
        `;
      await rp.post({
        uri: baseUrl,
        body: {
          query,
        },
        header,
        json: true,
        resolveWithFullResponse: true,
      });
    }).rejects.toThrow("Bad Request");
  });

  it("#1.40 => Dar erro ao tentar criar SENHA COM BOOLEAN(true)", async () => {
    expect(async () => {
      const name = faker.name.firstName();
      const lastName = faker.name.lastName();
      const userName = faker.internet.userName();
      const email = faker.internet.email();
      const password = true;
      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${name}"
                    last_name: "${lastName}"
                    user_name: "${userName}"
                    email: "${email}"
                    password: ${password}
                    user_type: "default"
                    avatar: "testegenre"
                    birth_date: "2000-01-01"
                    genre: null
                ){
                    user{
                        first_name
                    }
                }
            }
        `;
      await rp.post({
        uri: baseUrl,
        body: {
          query,
        },
        header,
        json: true,
        resolveWithFullResponse: true,
      });
    }).rejects.toThrow("String cannot represent a non string value: true");
  });

  it("#1.41 => Dar erro ao tentar criar SENHA COM BOOLEAN(false)", async () => {
    expect(async () => {
      const name = faker.name.firstName();
      const lastName = faker.name.lastName();
      const userName = faker.internet.userName();
      const email = faker.internet.email();
      const password = false;
      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${name}"
                    last_name: "${lastName}"
                    user_name: "${userName}"
                    email: "${email}"
                    password: ${password}
                    user_type: "default"
                    avatar: "testegenre"
                    birth_date: "2000-01-01"
                    genre: null
                ){
                    user{
                        first_name
                    }
                }
            }
        `;
      await rp.post({
        uri: baseUrl,
        body: {
          query,
        },
        header,
        json: true,
        resolveWithFullResponse: true,
      });
    }).rejects.toThrow("String cannot represent a non string value: false");
  });

  it("#1.42 => Dar erro ao tentar criar como NULL", async () => {
    expect(async () => {
      const name = faker.name.firstName();
      const lastName = faker.name.lastName();
      const userName = faker.internet.userName();
      const email = faker.internet.email();
      const password = null;
      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${name}"
                    last_name: "${lastName}"
                    user_name: "${userName}"
                    email: "${email}"
                    password: ${password}
                    user_type: "default"
                    avatar: "testegenre"
                    birth_date: "2000-01-01"
                    genre: null
                ){
                    user{
                        first_name
                    }
                }
            }
        `;
      await rp.post({
        uri: baseUrl,
        body: {
          query,
        },
        header,
        json: true,
        resolveWithFullResponse: true,
      });
    }).rejects.toThrow('"Expected value of type \\"String!\\"');
  });

  it("#1.43 => Erro, senha com grande massa", async () => {
    expect(async () => {
      const { name, lastName, userName, email } = createFakerUser();
      const password =
        "Etiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretium";
      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${name}"
                    last_name: "${lastName}"
                    user_name: "${userName}"
                    email: "${email}"
                    password: ${password}
                    user_type: "default"
                    avatar: "testegenre"
                    birth_date: "2000-01-01"
                    genre: null
                ){
                    user{
                        first_name
                    }
                }
            }
        `;
      const response = await requestForApiGraphQL(baseUrl, query);
      const { body } = response;
      console.log(body);
    }).rejects.toThrow('"Syntax Error: Expected \\":\\"');
  });

  it("#1.44 => Cadastro do Usuario com String com o valor 'default'", async () => {
    const { name, lastName, userName, email } = createFakerUser();
    const userType = "default";
    const query = `
      mutation registrandoUser{
          userRegister(
              first_name: "${name}"
              last_name: "${lastName}"
              user_name: "${userName}"
              email: "${email}"
              password: "password"
              user_type: "${userType}"
              avatar: "testegenre"
              birth_date: "2000-01-01"
              genre: null
          ){
              user{
                  first_name
              }
          }
      }
    `;
    const response = await requestForApiGraphQL(baseUrl, query);
    const { body } = response;
    console.log(body.data);
    expect(body.data).toHaveProperty("userRegister");
  });

  it("#1.45 => userType String vazia ", async () => {
    const { name, lastName, userName, email } = createFakerUser();

    expect(async () => {
      const userType = "";
      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${name}"
                    last_name: "${lastName}"
                    user_name: "${userName}"
                    email: "${email}"
                    password: password
                    user_type: ${userType}
                    avatar: "testegenre"
                    birth_date: "2000-01-01"
                    genre: null
                ){
                    user{
                        first_name
                    }
                }
            }
        `;
      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow('"Syntax Error: Expected Name, found \\":\\"."');
  });

  it("#1.46 => userType com numero", async () => {
    const { name, lastName, userName, email } = createFakerUser();

    expect(async () => {
      const userType = 123456;
      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${name}"
                    last_name: "${lastName}"
                    user_name: "${userName}"
                    email: "${email}"
                    password: password
                    user_type: ${userType}
                    avatar: "testegenre"
                    birth_date: "2000-01-01"
                    genre: null
                ){
                    user{
                        first_name
                    }
                }
            }
        `;
      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow(
      '"String cannot represent a non string value: password"'
    );
  });

  it("#1.47 => userType com caracter especial", async () => {
    const { name, lastName, userName, email } = createFakerUser();

    expect(async () => {
      const userType = "@@@@@";
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${name}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: password
                  user_type: ${userType}
                  avatar: "testegenre"
                  birth_date: "2000-01-01"
                  genre: null
              ){
                  user{
                      first_name
                  }
              }
          }
      `;
      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow('"Syntax Error: Unexpected \\"@\\"."');
  });
});
