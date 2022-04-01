const { convertToTimestamp } = require("./utils/convertToTimestamp");

const activityOne = {
  title: "Esporte é d+",
  skill_levels: 2,
  privacy: "Public",
  date: convertToTimestamp("2022-04-30 12:30:00"),
  begins_at: convertToTimestamp("2022-05-30 10:30:00"),
  sport_id: 1,
  author_id: 18,
  sport: {
    name: "Running",
  },
  skill_level: {
    name: "Intermediate",
  },
  user: {
    first_name: "Eduardo",
    last_name: "Verri",
    user_name: "eduardoverri",
  },
};

const activityTwo = {
  title: "Corrida",
  skill_levels: 1,
  privacy: "Public",
  date: convertToTimestamp("2022-04-30 12:30:00"),
  begins_at: convertToTimestamp("2022-05-30 10:30:00"),
  sport_id: 1,
  author_id: 18,
  sport: {
    name: "Running",
  },
  skill_level: {
    name: "Intermediate",
  },
  user: {
    first_name: "Eduardo",
    last_name: "Verri",
    user_name: "eduardoverri",
  },
};

const postOne = {
  title: "Teste Postagem",
  searchTitle: "Subida!",
  sponsored: false,
  sport_id: 1,
  author_id: 23,
  author: {
    last_name: "Andrade",
  },
  comment: "Teste de Comentario",
};

const postTwo = {
  title: "Teste Postagem 2",
  searchTitle: "Subida!",
  sponsored: false,
  sport_id: 1,
  author_id: 23,
  author: {
    last_name: "Andrade",
  },
  comment: "Teste de Comentario",
};

module.exports = { activityOne, activityTwo, postOne, postTwo };
