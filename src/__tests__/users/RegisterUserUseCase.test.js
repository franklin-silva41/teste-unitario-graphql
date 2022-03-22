const rp = require("request-promise");
const { createFakerUser } = require("../../../src/utils/createFakerUser");
const { requestForApiGraphQL } = require("../../utils/requestForApi");
const baseUrl = "https://api-stg.sportidia.com/graphql";
const { faker } = require("@faker-js/faker");
const { response } = require("express");
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
  it("#1.48 => userType com o valor boolean(true)",async()=>{
    const { name, lastName, userName, email } = createFakerUser();
    expect(async () => {
      const userType = true;
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${name}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
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
    }).rejects.toThrow('\"String cannot represent a non string value: true\"');
  })
  it("#1.49 => userType com o valor boolean(false)",async()=>{
    const { name, lastName, userName, email } = createFakerUser();
    expect(async () => {
      const userType = false;
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${name}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
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
    }).rejects.toThrow('\"String cannot represent a non string value: false\"');
  })
  
  it("#1.50 => userType com o valor null",async()=>{
    const { name, lastName, userName, email } = createFakerUser();
    
      const userType = null;
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${name}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
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
    const response = await requestForApiGraphQL(baseUrl, query);
    const{body} = response;
    expect(body).toHaveProperty("errors");
  })
  
  it("#1.51 => userType com grande massa de caracters",async()=>{
    const { name, lastName, userName, email } = createFakerUser();
    
      const userType =  "Etiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretium";
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
    const{body} = response;
    expect(body).toHaveProperty("errors");
  })
  
  it("#1.52 => avatar com String",async()=>{
    const { firstName, lastName, userName, email } = createFakerUser();
    
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${firstName}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
                  avatar: "https://midiasegura.com.br/wp-content/uploads/2020/05/criar-um-avatar-no-facebook-ficou-ainda-mais-facil-veja-como-fazer.png"
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
    const{body} = response;
    expect(body.data.userRegister).toHaveProperty("user");
  })
  it("#1.53 => avatar com uma String vazia",async()=>{
    const { firstName, lastName, userName, email } = createFakerUser();
    
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${firstName}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
                  avatar: ""
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
    const{body} = response;
    expect(body.data.userRegister).toHaveProperty("user");
  })
  
  it("#1.54 => avatar com Numero",async()=>{
    expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();
      const avatar= 123456
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${firstName}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
                  avatar: ${avatar}
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
    
    }).rejects.toThrow("String cannot represent a non string value: 123456");
  })
  
  it("#1.55 => avatar com caracter especial",async()=>{
    expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();
      const avatar= "@@@@@"
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${firstName}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
                  avatar: ${avatar}
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
    
    }).rejects.toThrow('\"Syntax Error: Unexpected \\\"@\\\".\"');
  })
  it("#1.56 => avatar com Bolean(true)",async()=>{
    expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();
      const avatar= true
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${firstName}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
                  avatar: ${avatar}
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
    
    }).rejects.toThrow('\"String cannot represent a non string value: true\"');
  })
  
  it("#1.57 => avatar com Bolean(False)",async()=>{
    expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();
      const avatar= false
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${firstName}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
                  avatar: ${avatar}
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
    
    }).rejects.toThrow('\"String cannot represent a non string value: false\"');
  })
  
  it("#1.58 => avatar com valor Null",async()=>{
    
      const { firstName, lastName, userName, email } = createFakerUser();
      const avatar= null
      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${firstName}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
                  avatar: ${avatar}
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

    const {body}= response
    expect(body.data.userRegister).toHaveProperty("user");

  })
 
  it("#1.59 => avatar com uma massa de caracteres grande",async()=>{
    
    const { firstName, lastName, userName, email } = createFakerUser();
    const avatar= "Etiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretium"
    const query = `
        mutation registrandoUser{
            userRegister(
                first_name: "${firstName}"
                last_name: "${lastName}"
                user_name: "${userName}"
                email: "${email}"
                password: "password"
                avatar: "${avatar}"
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

  const {body}= response
  expect(body.errors[0].message).toBe("Bad Request Exception");

})
 
it("#1.60 => No campo birth_day inserir um valor String",async()=>{
    
  const { firstName, lastName, userName, email } = createFakerUser();
  const birth_day= "2000-01-01"
  const query = `
      mutation registrandoUser{
          userRegister(
              first_name: "${firstName}"
              last_name: "${lastName}"
              user_name: "${userName}"
              email: "${email}"
              password: "password"
              avatar: "avatar"
              birth_date: "${birth_day}"
              genre: null
          ){
              user{
                  first_name
              }
          }
      }
  `;
const response = await requestForApiGraphQL(baseUrl, query);

const {body}= response
expect(body.data.userRegister).toHaveProperty("user");

})

it("#1.61 => No campo birth_day inserir um valor String vazia",async()=>{
    
  const { firstName, lastName, userName, email } = createFakerUser();
  const birth_day= ""
  const query = `
      mutation registrandoUser{
          userRegister(
              first_name: "${firstName}"
              last_name: "${lastName}"
              user_name: "${userName}"
              email: "${email}"
              password: "password"
              avatar: "avatar"
              birth_date: "${birth_day}"
              genre: null
          ){
              user{
                  first_name
              }
          }
      }
  `;
const response = await requestForApiGraphQL(baseUrl, query);

const {body}= response
expect(body.errors[0].message).toBe('USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"');

})

it("#1.62 => No campo birth_day inserir um valor numerico ",async()=>{
    
  const { firstName, lastName, userName, email } = createFakerUser();
  const birth_day= 123456
  const query = `
      mutation registrandoUser{
          userRegister(
              first_name: "${firstName}"
              last_name: "${lastName}"
              user_name: "${userName}"
              email: "${email}"
              password: "password"
              avatar: "avatar"
              birth_date: "${birth_day}"
              genre: null
          ){
              user{
                  first_name
              }
          }
      }
  `;
const response = await requestForApiGraphQL(baseUrl, query);

const {body}= response
expect(body.errors[0].message).toBe('USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"');

})

it("#1.63 => No campo birth_day inserir caracteres especiais",async()=>{
    
  const { firstName, lastName, userName, email } = createFakerUser();
  const birth_day= "@@@@@@@"
  const query = `
      mutation registrandoUser{
          userRegister(
              first_name: "${firstName}"
              last_name: "${lastName}"
              user_name: "${userName}"
              email: "${email}"
              password: "password"
              avatar: "avatar"
              birth_date: "${birth_day}"
              genre: null
          ){
              user{
                  first_name
              }
          }
      }
  `;
const response = await requestForApiGraphQL(baseUrl, query);

const {body}= response
expect(body.errors[0].message).toBe('USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"');

})

it("#1.64 => No campo birth_day inserir um valor boolean(true)",async()=>{
 const { firstName, lastName, userName, email } = createFakerUser();
  const birth_day= true
  const query = `
      mutation registrandoUser{
          userRegister(
              first_name: "${firstName}"
              last_name: "${lastName}"
              user_name: "${userName}"
              email: "${email}"
              password: "password"
              avatar: "avatar"
              birth_date: "${birth_day}"
              genre: null
          ){
              user{
                  first_name
              }
          }
      }
  `;
const response = await requestForApiGraphQL(baseUrl, query);

const {body}= response
expect(body.errors[0].message).toBe('USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"');

})   
  
it("#1.65 => No campo birth_day inserir um valor boolean(false)",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const birth_day= true
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "${birth_day}"
               genre: null
           ){
               user{
                   first_name
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe('USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"');
 
 })
 
 it("#1.66 => No campo birth_day inserir um valor null",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const birth_day= null
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "${birth_day}"
               genre: null
           ){
               user{
                   first_name
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe('USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"');
 
 })

 it("#1.67 => No campo birth_day inserir uma data dentro de uma String ex.('01/01/2000')",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const birth_day= "01/01/2000"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "${birth_day}"
               genre: null
           ){
               user{
                   first_name
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.data.userRegister).toHaveProperty("user"); 
 })
 
 it("#1.68 => No campo birth_day inserir uma data dentro de uma String sem separação ex.('01012000')",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const birth_day= "01012000"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "${birth_day}"
               genre: null
           ){
               user{
                   first_name
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe('USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"');

 })
 
 it("#1.69 => No campo birth_day inserir uma data com grande massa de caracteres",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const birth_day=  "Etiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretium"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "${birth_day}"
               genre: null
           ){
               user{
                   first_name
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe('USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"');

 })
 
 it("#1.70 => No campo genre inserir uma string valida",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const genre= "masculino" 
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "${genre}"
           ){
               user{
                   first_name
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.data.userRegister).toHaveProperty("user"); 
 })
 
 it("#1.71 => No campo genre inserir uma valor String vazia",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const genre= "" 
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "${genre}"
           ){
               user{
                   first_name
                   genre
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 console.log(body.data.userRegister.user)
 expect(body.data.userRegister.user.genre).toBe("other"); 
 })

 it("#1.72 => No campo genre inserir uma valor Numerico",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const genre= 123456
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "${genre}"
           ){
               user{
                   first_name
                   genre
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe("String cannot represent a non string value: 123456");
 
 })
 
 it("#1.73 => No campo genre inserir Caracteres especiais",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const genre= "@@@@@@"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "${genre}"
           ){
               user{
                   first_name
                   genre
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe("String cannot represent a non string value: @@@@@");
 
 })
 
 it("#1.74 => No campo genre inserir um valor Boolean(true)",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const genre= true
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "${genre}"
           ){
               user{
                   first_name
                   genre
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe("String cannot represent a non string value: true");
 
 })
 it("#1.75 => No campo genre inserir um valor Boolean(false)",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const genre= false
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "${genre}"
           ){
               user{
                   first_name
                   genre
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe("String cannot represent a non string value: true");
 
 })
 
 it("#1.76 => No campo genre inserir um valor null",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const genre= null
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "${genre}"
           ){
               user{
                   first_name
                   genre
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.data.userRegister).toHaveProperty("user");
 
 })

 it("#1.77 => No campo genre inserir uma String com uma grande massa",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const genre=  "Etiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretium"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "${genre}"
           ){
               user{
                   first_name
                   genre
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe("Bad Request Exception");
 
 })

 

it("#1.78 => No campo push_id inserir uma String",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const push_id=  "testepushid"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "masculino"
               push_id:"${push_id}"
           ){
               user{
                   first_name
                   genre
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.data.userRegister).toHaveProperty("user");
 
 })


it("#1.79 => No campo push_id inserir uma String vazia",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
  const push_id=  ""
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               push_id:"${push_id}"
           ){
               user{
                   first_name
                   push_id
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 console.log(body.data.userRegister.user.push_id)
 expect(body.data.userRegister.user.push_id).toBe(null);
 
 })
 it("#1.80 => No campo push_id inserir um valor Numerico",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
  const push_id=  123456
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               push_id:"${push_id}"
           ){
               user{
                   first_name
                   push_id
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe( "String cannot represent a non string value: 123456");
 
 })

 it("#1.81 => No campo push_id inserir caracteres especiais",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
  const push_id=  "@@@@@@@"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               push_id:"${push_id}"
           ){
               user{
                   first_name
                   push_id
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.data.userRegister).toHaveProperty("user");
})

it("#1.82 => No campo push_id inserir um boolean(true)",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
  const push_id=  true
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               push_id:"${push_id}"
           ){
               user{
                   first_name
                   push_id
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe("String cannot represent a non string value: true")
})
it("#1.83 => No campo push_id inserir um boolean(false)",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
  const push_id=  false
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               push_id:"${push_id}"
           ){
               user{
                   first_name
                   push_id
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe("String cannot represent a non string value: false")
})

it("#1.84 => No campo push_id inserir um valor Null",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
  const push_id=  null
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               push_id:"${push_id}"
           ){
               user{
                   first_name
                   push_id
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 console.log(body.data.userRegister.user.push_id)
 expect(body.data.userRegister.user.push_id).toBe("null");

})

it("#1.85 => No campo push_id inserir um valor Null",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
  const push_id=  "Etiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretium"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               push_id:"${push_id}"
           ){
               user{
                   first_name
                   push_id
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 
 expect(body.errors[0].message).toBe("Bad Request Exception")

})


 it("#1.86 => No campo language inserir uma String",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const language=  "testelanguage"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "masculino"
               language:"${language}"
           ){
               user{
                   first_name
                   language
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.data.userRegister).toHaveProperty("user");
 
 })
 it("#1.87 => No campo language inserir uma String vazia",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const language=  ""
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "masculino"
               language:"${language}"
           ){
               user{
                   first_name
                   language
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.data.userRegister.user.language).toBe("null");
 
 })
 
 it("#1.88 => No campo language inserir um valor Numerico",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const language=  123456
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "masculino"
               language:"${language}"
           ){
               user{
                   first_name
                   language
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe( "String cannot represent a non string value: 123456");

 })

 it("#1.89 => No campo language inserir caracteres especiais",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const language=  "@@@@@"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "masculino"
               language:"${language}"
           ){
               user{
                   first_name
                   language
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.data.userRegister).toHaveProperty("user");
})

it("#1.90 => No campo language inserir um Boolean(true)",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const language=  true
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "masculino"
               language:"${language}"
           ){
               user{
                   first_name
                   language
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe( "String cannot represent a non string value: true");
})

it("#1.91 => No campo language inserir um Boolean(false)",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const language=  false
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "masculino"
               language:"${language}"
           ){
               user{
                   first_name
                   language
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe( "String cannot represent a non string value: false");
})

it("#1.92 => No campo language inserir um Boolean(false)",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const language=  false
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "masculino"
               language:"${language}"
           ){
               user{
                   first_name
                   language
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.data.userRegister.user.language).toBe("null");
})


it("#1.93 => No campo language inserir uma String com grande massa de caracteres",async()=>{
  const { firstName, lastName, userName, email } = createFakerUser();
   const language=   "Etiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretiumEtiam posuere quam ac quam. Maecenas aliquet accumsan leo. Nullam dapibus fermentum ipsum. Etiam quis quam. Integer lacinia. Nulla est. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Integer vulputate sem a nibh rutrum consequat. Maecenas lorem. Pellentesque pretium"
   const query = `
       mutation registrandoUser{
           userRegister(
               first_name: "${firstName}"
               last_name: "${lastName}"
               user_name: "${userName}"
               email: "${email}"
               password: "password"
               avatar: "avatar"
               birth_date: "01/01/1999"
               genre: "masculino"
               language:"${language}"
           ){
               user{
                   first_name
                   language
               }
           }
       }
   `;
 const response = await requestForApiGraphQL(baseUrl, query);
 
 const {body}= response
 expect(body.errors[0].message).toBe("Bad Request Exception");
})

});
//
