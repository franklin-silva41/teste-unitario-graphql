const createQueryNewActivity = (data) => {
  const {
    title,
    image_url,
    description,
    skill_levels,
    privacy,
    location_city,
    location_state,
    location_lat,
    location_long,
    date,
    begins_at,
    sport_id,
    author_id,
  } = data;

  const query = `
      mutation acitivityRegister {
        activityRegister(
          title: "${title}"
          image_url: "${image_url}"
          description: "${description}"
          skill_levels: ${skill_levels}
          privacy: "${privacy}"
          location_city: "${location_city}"
          location_state: "${location_state}"
          location_lat: ${location_lat}
          location_long: ${location_long}
          date: ${date}
          begins_at: ${begins_at}
          sport_id: ${sport_id}
          author_id: ${author_id}
        ){
          id
          title
          image_url
          description
          skill_levels{
            id
            name
          }
          privacy
          location_city
          location_state
          location_lat
          location_long
          date
          begins_at
          sport{
            id
          }
          author{
            id
          }
        }
      }
    `;

  return query;
};

const createQueryUpdateActivity = (data) => {
  const {
    id,
    title,
    image_url,
    description,
    skill_levels,
    privacy,
    location_city,
    location_state,
    location_lat,
    location_long,
    date,
    begins_at,
    sport_id,
    author_id,
  } = data;

  const query = `
      mutation activityUpdate {
        updateActivity(
          id: ${id},
          title: "${title}"
          image_url: "${image_url}"
          description: "${description}"
          skill_levels: ${skill_levels}
          privacy: "${privacy}"
          location_city: "${location_city}"
          location_state: "${location_state}"
          location_lat: ${location_lat}
          location_long: ${location_long}
          date: ${date}
          begins_at: ${begins_at}
          sport_id: ${sport_id}
          author_id: ${author_id}
        ){
          id
          title
          image_url
          description
          skill_levels{
            id
            name
          }
          privacy
          location_city
          location_state
          location_lat
          location_long
          date
          begins_at
          sport{
            id
          }
          author{
            id
          }
        }
      }
    `;

  return query;
};

const createQueryActivitiesBySport = (sport_id) => {
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

const createQuerySearchActivitiesBySkill = (skill_id) => {
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

const createQuerySearchActivitiesByPrivacy = (privacy) => {
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

const createQueryActivityById = (id_activity) => {
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
  createQueryNewActivity,
  createQueryUpdateActivity,
  createQueryActivitiesBySport,
  createQuerySearchActivitiesBySkill,
  createQuerySearchActivitiesByPrivacy,
  createQueryActivityById,
};
