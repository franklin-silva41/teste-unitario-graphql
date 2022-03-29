const createQueryLoginUser = ({ email, password }) => {
  const query = `
    mutation {
      login(
        email: "${email}"
        password: "${password}"
      ){
        token
      }
    }
  `;

  return query;
};

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

const createQueryListActivity = (idActivity) => {
  const query = `
    query {
      findActivities(id_activity: ${idActivity}){
        title
      }
    }
  `;

  return query;
};

const createQueryDeleteActivity = (idActivity) => {
  const query = `
    mutation activityDelete {
      deleteActivity(id: ${idActivity})
    }
  `;

  return query;
};

module.exports = {
  createQueryLoginUser,
  createQueryNewActivity,
  createQueryListActivity,
  createQueryUpdateActivity,
  createQueryDeleteActivity,
};
