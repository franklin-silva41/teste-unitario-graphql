const { createFakerUser } = require("../../../src/utils/createFakerUser");
const { requestForApiGraphQL } = require("../../utils/requestForApi");

const baseUrl = "https://api-stg.sportidia.com/graphql";

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

  it("Insiro valores vazios em alguns campos", () => {
    test.each([
      ["first_name", ""],
      ["last_name", ""],
      ["email", ""],
      ["password", ""],
      ["user_name", ""],
    ])(
      "Espero que me retorne um erro quando tentamos cadastrar um campo com string vazia",
      async (campo, valor) => {
        const { firstName, lastName, userName, email, password } =
          createFakerUser();

        const dataTest = {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          user_name: userName,
        };

        dataTest[campo] = valor;

        const query = `
        mutation testvaluesempty{
          userRegister(
            first_name: "${dataTest.first_name}"
            last_name: "${dataTest.last_name}"
            user_name: "${dataTest.user_name}"
            email: "${dataTest.email}"
            password: "${dataTest.password}"
          ){
            user {
              ${campo}
            }
          }
        }
      `;

        await requestForApiGraphQL(baseUrl, query);
      }
    );
  });

  it("#1.4 Insiro um valor númerico no campo first_name", async () => {
    await expect(async () => {
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

  it("#1.6 Insiro um valor boolean no campo first_name", async () => {
    await expect(async () => {
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

  it("#1.7 Insiro um valor boolean no campo first_name", async () => {
    await expect(async () => {
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
    await expect(async () => {
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
    }).rejects.toThrowError();
  });

  it("#1.10 insiro um valor string no campo last_name ", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();

    const query = `
      mutation testlastname{
        userRegister(
          first_name: "${firstName}"
          last_name: "Silva"
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
    expect(body.data.userRegister.user.last_name).toBe("Silva");
    expect(statusCode).toBe(200);
  });

  it("#1.12 Insiro um valor númerico no campo last_name", async () => {
    await expect(async () => {
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

  it("#1.14 Insiro um valor boolean no campo last_name", async () => {
    await expect(async () => {
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
    await expect(async () => {
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
    await expect(async () => {
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
    }).rejects.toBeInstanceOf(Error);
  });

  it("#1.35 => Email invalido", async () => {
    const { firstName, lastName, userName } = createFakerUser();

    const emailInvalido = "teste.com";

    const query = `
        mutation registrandoUser{
            userRegister(
                first_name: "${firstName}"
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

    const response = await requestForApiGraphQL(baseUrl, query);

    const { body, statusCode } = response;
    expect(statusCode).toBe(200);
    expect(body.errors[0].message).toBe("Bad Request Exception");
  });

  it("#1.36 => Cadastrando inserindo um valor string no campo Senha", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();

    const query = `
        mutation registrandoUser{
            userRegister(
                first_name: "${firstName}"
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
    const response = await requestForApiGraphQL(baseUrl, query);

    const { body, statusCode } = response;

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty("data");
  });

  it("#1.38 => Senha com numeros", async () => {
    await expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();

      let password = 123456;

      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${firstName}"
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
    }).rejects.toEqual(
      new Error("String cannot represent a non string value: 123456")
    );
  });

  it("#1.40 => Dar erro ao tentar criar SENHA COM BOOLEAN(true)", async () => {
    await expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();

      const password = true;

      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${firstName}"
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
    }).rejects.toEqual(
      new Error("String cannot represent a non string value: true")
    );
  });

  it("#1.41 => Dar erro ao tentar criar SENHA COM BOOLEAN(false)", async () => {
    await expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();

      const password = false;

      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${firstName}"
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
    }).rejects.toThrow(
      new Error("String cannot represent a non string value: false")
    );
  });

  it("#1.42 => Dar erro ao tentar criar como NULL", async () => {
    await expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();

      const password = null;

      const query = `
            mutation registrandoUser{
                userRegister(
                    first_name: "${firstName}"
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
    }).rejects.toEqual(
      new Error('Expected value of type "String!", found null.')
    );
  });

  it("#1.44 => Cadastro do Usuario com String com o valor default", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();

    const query = `
      mutation registrandoUser{
          userRegister(
              first_name: "${firstName}"
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

  it("#1.46 => userType com numero", async () => {
    await expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();

      const userType = 123456;

      const query = `
              mutation registrandoUser{
                  userRegister(
                      first_name: "${firstName}"
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
    }).rejects.toEqual(
      new Error("String cannot represent a non string value: 123456")
    );
  });

  it("#1.48 => userType com o valor boolean(true)", async () => {
    const { name, lastName, userName, email } = createFakerUser();
    await expect(async () => {
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
    }).rejects.toBeInstanceOf(Error);
  });

  it("#1.49 => userType com o valor boolean(false)", async () => {
    await expect(async () => {
      const { name, lastName, userName, email } = createFakerUser();

      const query = `
          mutation registrandoUser{
              userRegister(
                  first_name: "${name}"
                  last_name: "${lastName}"
                  user_name: "${userName}"
                  email: "${email}"
                  password: "password"
                  user_type: false
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
    }).rejects.toEqual(
      new Error("String cannot represent a non string value: false")
    );
  });

  it("#1.50 => userType com o valor null", async () => {
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
    const { body } = response;
    expect(body).toHaveProperty("errors");
  });

  it("#1.52 => avatar com String", async () => {
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
    const { body } = response;
    expect(body.data.userRegister).toHaveProperty("user");
  });

  it("#1.54 => avatar com Numero", async () => {
    await expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();
      const avatar = 123456;
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
  });

  it("#1.56 => avatar com Bolean(true)", async () => {
    await expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();
      const avatar = true;
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
    }).rejects.toEqual(
      new Error("String cannot represent a non string value: true")
    );
  });

  it("#1.57 => avatar com Bolean(False)", async () => {
    expect(async () => {
      const { firstName, lastName, userName, email } = createFakerUser();
      const avatar = false;
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
    }).rejects.toEqual(
      new Error("String cannot represent a non string value: false")
    );
  });

  it("#1.58 => avatar com valor Null", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const avatar = null;
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

    const { body } = response;
    expect(body.data.userRegister).toHaveProperty("user");
  });

  it("#1.60 => No campo birth_day inserir um valor String", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const birth_day = "2000-01-01";
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

    const { body } = response;
    expect(body.data.userRegister).toHaveProperty("user");
  });

  it("#1.62 => No campo birth_day inserir um valor numerico ", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const birth_day = 123456;
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

    const { body } = response;

    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message,
        }),
      ])
    );
  });

  it("#1.64 => No campo birth_day inserir um valor boolean(true)", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const birth_day = true;
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

    const { body } = response;

    expect(body.errors[0].message).toBe(
      'USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"'
    );
  });

  it("#1.65 => No campo birth_day inserir um valor boolean(false)", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const birth_day = true;
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

    const { body } = response;
    expect(body.errors[0].message).toBe(
      'USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"'
    );
  });

  it("#1.66 => No campo birth_day inserir um valor null", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const birth_day = null;
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

    const { body } = response;
    expect(body.errors[0].message).toBe(
      'USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"'
    );
  });

  it("#1.67 => No campo birth_day inserir uma data dentro de uma String ex.('01/01/2000')", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const birth_day = "01/01/2000";
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

    const { body } = response;
    expect(body.data.userRegister).toHaveProperty("user");
  });

  it("#1.68 => No campo birth_day inserir uma data dentro de uma String sem separação ex.('01012000')", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const birth_day = "01012000";
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

    const { body } = response;
    expect(body.errors[0].message).toBe(
      'USERNOTSAVED Error: QueryFailedError: invalid input syntax for type timestamp: "0NaN-NaN-NaNTNaN:NaN:NaN.NaN+NaN:NaN"'
    );
  });

  it("#1.70 => No campo genre inserir uma string valida", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const genre = "masculino";
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

    const { body } = response;
    expect(body.data.userRegister).toHaveProperty("user");
  });

  it("#1.71 => No campo genre inserir uma valor String vazia", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const genre = "";
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

    const { body } = response;
    expect(body.data.userRegister.user.genre).toBe("other");
  });

  it("#1.72 => No campo genre inserir uma valor Numerico", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const genre = 123456;
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

    const { body } = response;
    expect(body.errors[0].message).toBe(
      "String cannot represent a non string value: 123456"
    );
  });

  it("#1.74 => No campo genre inserir um valor Boolean(true)", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const genre = true;
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

    const { body } = response;

    expect(body).toHaveProperty("errors");

    /* expect(body.errors[0].message).toBe(
      "String cannot represent a non string value: true"
    ); */
  });
  it("#1.75 => No campo genre inserir um valor Boolean(false)", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const genre = false;
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

    const { body } = response;

    expect(body).toHaveProperty("errors");

    /* expect(body.errors[0].message).toBe(
      "String cannot represent a non string value: true"
    ); */
  });

  it("#1.76 => No campo genre inserir um valor null", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const genre = null;
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

    const { body } = response;
    expect(body.data.userRegister).toHaveProperty("user");
  });

  it("#1.78 => No campo push_id inserir uma String", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const push_id = "testepushid";
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

    const { body } = response;
    expect(body.data.userRegister).toHaveProperty("user");
  });

  it("#1.80 => No campo push_id inserir um valor Numerico", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const push_id = 123456;
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

    const { body } = response;

    expect(body).toHaveProperty("errors");

    /* expect(body.errors[0].message).toBe(
      "String cannot represent a non string value: 123456"
    ); */
  });

  it("#1.82 => No campo push_id inserir um boolean(true)", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const push_id = true;
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
              user {
                first_name
                push_id
              }
           }
       }
   `;
    const response = await requestForApiGraphQL(baseUrl, query);

    const { body } = response;

    expect(body).toHaveProperty("errors");

    /* expect(body.errors[0].message).toBe(
      "String cannot represent a non string value: true"
    ); */
  });

  it("#1.83 => No campo push_id inserir um boolean(false)", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const push_id = false;
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

    const { body } = response;

    expect(body).toHaveProperty("errors");

    /* expect(body.errors[0].message).toBe(
      "String cannot represent a non string value: false"
    ); */
  });

  it("#1.84 => No campo push_id inserir um valor Null", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const push_id = null;
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

    const { body } = response;
    console.log(body.data.userRegister.user.push_id);
    expect(body.data.userRegister.user.push_id).toBe("null");
  });

  it("#1.86 => No campo language inserir uma String", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const language = "testelanguage";
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

    const { body } = response;
    expect(body.data.userRegister).toHaveProperty("user");
  });

  it("#1.87 => No campo language inserir uma String vazia", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const language = "";
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

    const { body } = response;
    expect(body.data.userRegister.user.language).toBe("null");
  });

  it("#1.88 => No campo language inserir um valor Numerico", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const language = 123456;
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

    const { body } = response;

    expect(body).toHaveProperty("errors");

    /* expect(body.errors[0].message).toBe(
      "String cannot represent a non string value: 123456"
    ); */
  });

  it("#1.90 => No campo language inserir um Boolean(true)", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const language = true;
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
              user {
                first_name
                language
              }
           }
       }
   `;
    const response = await requestForApiGraphQL(baseUrl, query);

    const { body } = response;

    expect(body).toHaveProperty("errors");

    /* expect(body.errors[0].message).toBe(
      "String cannot represent a non string value: true"
    ); */
  });

  it("#1.91 => No campo language inserir um Boolean(false)", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const language = false;
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

    const { body } = response;

    expect(body).toHaveProperty("errors");

    /* expect(body.errors[0].message).toBe(
      "String cannot represent a non string value: false"
    ); */
  });

  it("#1.92 => No campo language inserir um Boolean(false)", async () => {
    const { firstName, lastName, userName, email } = createFakerUser();
    const language = false;
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

    const { body } = response;
    expect(body.data.userRegister.user.language).toBe("null");
  });
});
//
