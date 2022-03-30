const createQuerySearchSport = (sport_id) => {
  const query = `
    query {
        findActivities(sports_id: ${sport_id}) {
            title
            description
            sport {
                id
                name
            }
        }
    }
    `;

  return query;
};

const createQuerySearchSportLevelsSkill = (skill_id) => {
  const query = `
        query {
            findActivities(skill_levels: ${skill_id}) {
                title
                description
                sport {
                    id
                    name
                }
                skill_levels {
                    id
                    name
                }
            }
        }
    `;

  return query;
};

const createQuerySearchSportByPrivacy = (privacy) => {
  const query = `
        query {
            findActivities(privacy: "${privacy}") {
                title
                description
                privacy
                sport {
                    id
                    name
                }
                skill_levels {
                    id
                    name
                }
            }
        }
    `;

  return query;
};

const createQuerySportById = (id_activity) => {
  const createQuery = `
    query {
      findActivities(id_activity: ${id_activity}) {
        id
        title
        description
        privacy
        sport {
          id
          name
        }
        skill_levels {
          id
          name
        }
      }
    }  
  `;

  return createQuery;
};

module.exports = {
  createQuerySearchSport,
  createQuerySearchSportLevelsSkill,
  createQuerySearchSportByPrivacy,
  createQuerySportById,
};
