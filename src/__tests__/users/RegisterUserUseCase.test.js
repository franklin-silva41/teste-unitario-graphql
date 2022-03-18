const rp = require("request-promise");
const { createFakerUser } = require("../../../src/utils/createFakerUser");
const { requestForApiGraphQL } = require("../../utils/requestForApi");
const baseUrl = "https://api-stg.sportidia.com/graphql";
const { faker } = require("@faker-js/faker");
const header = {
  "Content-Type": "application/json",
  //  Authorization:""
};

describe("Cadastro de usuario", () => {
  it("# 1.0 => Insiro um usuário novo na aplicação com todos os dados!", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();

    const query = `
      mutation registrandoUser{
          userRegister(
            first_name: "${firstName}"
            last_name: "${lastName}"
            user_name: "${userName}"
            email: "${email}"
            password: "123456"
            user_type: "default"
            avatar: "https://midiasegura.com.br/wp-content/uploads/2020/05/criar-um-avatar-no-facebook-ficou-ainda-mais-facil-veja-como-fazer.png"
            birth_date: "2000-01-01"
            genre: "Feminino"
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
          },
      }
    `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { statusCode, body } = response;

    expect(body.data).toHaveProperty("userRegister");
    expect(statusCode).toBe(200);
  });

  it("#1.1 => Insiro dados nos campos obrigatorios !", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();

    const query = `
    mutation registrandoUser1{
    userRegister(
      first_name: "${firstName}"
      last_name: "${lastName}"
      user_name: "${userName}"
      email: "${email}"
      password: "123456"
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

    const response = await requestForApiGraphQL(baseUrl, query);

    const { statusCode, body } = response;

    expect(body.data).toHaveProperty("userRegister");
    expect(body.data.userRegister.user).toHaveProperty("genre");
    expect(body.data.userRegister.user).toEqual(
      expect.objectContaining({
        first_name: firstName,
      })
    );
    expect(statusCode).toBe(200);
  });

  it("#1.2 => Insiro um valor string no campo first_name", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();

    const query = `
    mutation testfirstname{
      userRegister(
        first_name: "${firstName}"
        last_name: "${lastName}"
        user_name: "${userName}"
        email: "${email}"
        password: "testfirst"
      ){
        user {
          first_name
        }
      }
    }
  `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body, statusCode } = response;

    expect(body.data.userRegister).toHaveProperty("user");
    expect(body.data.userRegister.user.first_name).toEqual(firstName);

    expect(statusCode).toBe(200);
  });

  it("#1.3 Insiro um valor vazio no campo first_name", async () => {
    const { lastName, userName, email } = createFakerUser();

    const query = `
    mutation testfirstname{
      userRegister(
        first_name: ""
        last_name: "${lastName}"
        user_name: "${userName}"
        email: "${email}"
        password: "testfirst"
      ){
        user {
          first_name
        }
      }
    }
  `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body, statusCode } = response;

    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Bad Request Exception",
        }),
      ])
    );

    expect(statusCode).toBe(200);
  });
  it("#1.4 Insiro um valor númerico no campo first_name", async () => {
    expect(async () => {
      const { lastName, userName, email } = createFakerUser();

      const query = `
        mutation testfirstname{
          userRegister(
            first_name: 123456
            last_name: "${lastName}"
            user_name: "${userName}"
            email: "${email}"
            password: "testfirst"
          ){
            user {
              first_name
            }
          }
        }
      `;

      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow("String cannot represent a non string value: 123456");
  });
  it("#1.5 Insiro um serie de caracteres especiais no campo first_name ", async () => {
    const { lastName, userName, email } = createFakerUser();

    const query = `
      mutation testfirstname{
        userRegister(
          first_name: "@@@@@@@"
          last_name: "${lastName}"
          user_name: "${userName}"
          email: "${email}"
          password: "testfirst"
        ){
          user {
            first_name
          }
        }
      }
      `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body } = response;

    expect(body.data.userRegister.user.first_name).toEqual("@@@@@@@");
  });
  it("#1.6 Insiro um valor boolean no campo first_name", () => {
    expect(async () => {
      const { lastName, userName, email } = createFakerUser();

      const query = `
        mutation testfirstname{
          userRegister(
              first_name: true
              last_name: "${lastName}"
              user_name: "${userName}"
              email: "${email}"
              password: "testfirst"
          ){
            user {
              first_name
            }
          }
        }
      `;

      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow("String cannot represent a non string value: true");
  });
  it("#1.7 Insiro um valor boolean no campo first_name", () => {
    expect(async () => {
      const { lastName, userName, email } = createFakerUser();

      const query = `
        mutation testfirstname{
          userRegister(
              first_name: false
              last_name: "${lastName}"
              user_name: "${userName}"
              email: "${email}"
              password: "testfirst"
          ){
            user {
              first_name
            }
          }
        }
      `;

      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow("String cannot represent a non string value: false");
  });
  it("#1.8 Insiro um valor null no campo first_name", async () => {
    expect(async () => {
      const { lastName, userName, email } = createFakerUser();

      const query = `
        mutation testfirstname{
          userRegister(
              first_name: null
              last_name: "${lastName}"
              user_name: "${userName}"
              email: "${email}"
              password: "testfirst"
          ){
            user {
              first_name
            }
          }
        }
      `;

      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow('Expected value of type "String!"');
  });

  it("#1.9 Insiro um valor string com uma grande massa no campo first_name", async () => {
    expect(async () => {
      const { lastName, userName, email } = createFakerUser();

      const query = `
          mutation testfirstname{
            userRegister(
                first_name: "Etiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretium"
                last_name: "${lastName}"
                user_name: "${userName}"
                email: "${email}"
                password: "testfirst"
            ){
              user {
                first_name
              }
            }
          }
        `;

      await requestForApiGraphQL(baseUrl, query);
    }).toThrow();
  });
  it("#1.10 insiro um valor string no campo last_name ", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();

    const query = `
      mutation testlastname{
        userRegister(
          first_name: "${firstName}"
          last_name: "${lastName}"
          user_name: "${userName}"
          email: "${email}"
          password: "testlast"
        ){
          user {
            last_name
          }
        }
      }
    `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body, statusCode } = response;

    expect(body.data.userRegister.user).toHaveProperty("last_name");
    expect(body.data.userRegister.user.last_name).toBe(lastName);
    expect(statusCode).toBe(200);
  });

  it("#1.11 Insiro um valor vazio no campo last_name", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();

    const query = `
          mutation testlastname{
            userRegister(
                first_name: "${firstName}"
                last_name: ""
                user_name: "${userName}"
                email: "${email}"          
                password: "testlast"
            ){
              user {
                last_name
              }
            }
          }
        `;

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body } = response;

    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Bad Request Exception",
        }),
      ])
    );
  });

  it("#1.12 Insiro um valor númerico no campo last_name", async () => {
    expect(async () => {
      const { firstName, userName, email } = createFakerUser();

      const query = `
        mutation testlastname{
          userRegister(
            first_name: "${firstName}"
            last_name: 123456
            user_name: "${userName}"
            email: "${email}"
            password: "testlast"
          ){
            user {
              last_name
            }
          }
        }
      `;

      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow("String cannot represent a non string value: 123456");
  });

  it("#1.13 Insiro um serie de caracteres especiais no campo last_name", async () => {
    expect(async () => {
      const { firstName, userName, email } = createFakerUser();

      const query = `
        mutation testlastname{
          userRegister(
            first_name: "${firstName}"
            last_name: "@@@@@@@"
            user_name: "${userName}"
            email: "${email}"
            password: "testlast"
          ){
            user {
              last_name
            }
          }
        }
      `;

      await requestForApiGraphQL(baseUrl, query);
    }).toThrow();
  });

  it("#1.14 Insiro um valor boolean no campo last_name", async () => {
    expect(async () => {
      const { firstName, userName, email } = createFakerUser();

      const query = `
          mutation testlastname{
            userRegister(
              first_name: "${firstName}"
              last_name: true
              user_name: "${userName}"
              email: "${email}"
              password: "testlast"
            ){
              user {
                last_name
              }
            }
          }
        `;

      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow("String cannot represent a non string value: true");
  });

  it("#1.15 Insiro um valor boolean no campo last_name", async () => {
    expect(async () => {
      const { firstName, userName, email } = createFakerUser();

      const query = `
          mutation testlastname{
            userRegister(
              first_name: "${firstName}"
              last_name: false
              user_name: "${userName}"
              email: "${email}"
              password: "testlast"
            ){
              user {
                last_name
              }
            }
          }
        `;

      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow("String cannot represent a non string value: false");
  });

  it("#1.16 Insiro um valor null no campo last_name", async () => {
    expect(async () => {
      const { firstName, userName, email } = createFakerUser();

      const query = `
          mutation testlastname{
            userRegister(
              first_name: "${firstName}"
              last_name: null
              user_name: "${userName}"
              email: "${email}"
              password: "testlast"
            ){
              user{
                last_name
              }
            }
          }
        `;

      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow('"Expected value of type \\"String!\\"');
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
                    password: "${password}"
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
      await requestForApiGraphQL(baseUrl, query);
    }).rejects.toThrow('"Syntax Error: Expected \\\":\\\"');
  });

  it("#1.44 => Cadastro do Usuario com String com o valor default", async () => {
    const { name, lastName, userName, email } = createFakerUser();

    const query = `
      mutation registrandoUser{
          userRegister(
              first_name: "${name}"
              last_name: "${lastName}"
              user_name: "${userName}"
              email: "${email}"
              password: "password"
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
