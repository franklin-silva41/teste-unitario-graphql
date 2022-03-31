const createQueryCreatePost = (data) => {
  const {
    title,
    image_url,
    description,
    location_street,
    location_complement,
    location_neighborhood,
    location_city,
    location_state,
    location_country,
    location_lat,
    location_long,
    sponsored,
    sport_id,
    author_id,
  } = data;

  const query = `
        mutation postRegister {
            postRegister(
                title: "${title}"
                image_url: "${image_url}"
                description: "${description}"
                location_street: "${location_street}"
                location_complement: "${location_complement}"
                location_neighborhood: "${location_neighborhood}"
                location_city: "${location_city}"
                location_state: "${location_state}"
                location_country: "${location_country}"
                location_lat: ${location_lat}
                location_long: ${location_long}
                sponsored: ${sponsored}
                sport_id: ${sport_id}
                author_id: ${author_id}
            ){
                id
                title
                image_url
                description
                location_street
                location_complement
                location_neighborhood
                location_city
                location_state
                location_country
                location_lat
                location_long
                sponsored
                author {
                    id
                    first_name
                }
                sport {
                    id
                    name
                }
            }
        }
    `;

  return query;
};

const createQueryUpdatePost = (data) => {
  const query = `
        mutation updatePost{
            updatePost(
                id: ${data.id}
                title: "${data.title}"
            ){
                id
                title
            }
        }
    `;

  return query;
};

const createQueryFindPostById = (id_post) => {
  const query = `
        query findPostById{
            findPosts(id_post: ${id_post}) {
                data {
                    id
                    title
                    description
                    author{
                        id
                        last_name
                    }
                }
            }
        }
    `;

  return query;
};

const createQueryFindAllPosts = () => {
  const query = `
        query findAllPosts {
            findPosts {
                data {
                    id
                    title
                    description
                    author {
                        id
                        last_name
                    }
                }
            }
        }
    `;

  return query;
};

const createQueryFindPostByAuthorId = (author_id) => {
  const query = `
        query EncontrandoPostagem34{
            findPosts(author_id: ${author_id}){
            data{
                author{
                id
                last_name
                }
            }
            }
        }
    `;

  return query;
};

const createQueryFindPostByTitle = (title) => {
  const query = `
        query findPostByTitle {
            findPosts(title: "${title}"){
                data {
                    id
                    title
                    description
                    author{
                        id
                        last_name
                    }
                }
            }
        }
    `;

  return query;
};

const createQueryLikePost = (post_id, user_id, like) => {
  const query = `
        mutation fieldTestPostId {
            setLikePost(
                post_id: ${post_id}
                user_id: ${user_id}
                like: ${like}
            )
        }
    `;

  return query;
};

module.exports = {
  createQueryCreatePost,
  createQueryUpdatePost,
  createQueryFindPostById,
  createQueryFindAllPosts,
  createQueryFindPostByAuthorId,
  createQueryFindPostByTitle,
  createQueryLikePost,
};
