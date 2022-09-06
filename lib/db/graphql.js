export const getUserByIdQueryString = `
    query get_user_by_id($user_id: String!) {
        users(where: {issuer: {_eq: $user_id}}) {
            email
            issuer
        }
}`;
export const createUserQueryString = `
    mutation create_user($email: String!, $user_id: String!, $public_address: String!) {
        insert_users_one( object: {email: $email, issuer: $user_id, public_address: $public_address }) {
            email
        }
    }
`;

export const findVideoByUserQuery = `
 query find_video_by_user($user_id: String!, $video_id: String!) {
    stats(where: {user_issuer: {_eq: $user_id}, video_id: {_eq: $video_id}}) {
      user_issuer
      video_id
      watched
      favourited
    }
  }
`;

export const insertStatsQueryString = `
mutation insert_user_video_stats($user_id: String!, $video_id: String!, $favourited: Int!, $watched: Boolean!) {
    insert_stats_one(object: {
            user_issuer: $user_id, 
            video_id: $video_id, 
            favourited: $favourited, 
            watched: $watched
            }
    ) {
      user_issuer
      video_id
      favourited
      watched: watched
    }
  }
`;

export const updateStatsQueryString = `
 mutation update_user_video_stats($user_id: String!, $video_id: String!, $favourited: Int!, $watched: Boolean!) {
    update_stats(where: {
        user_issuer: { _eq: $user_id}, 
        video_id: {_eq: $video_id}
        }, 
        _set: {
            favourited: $favourited, 
            watched: $watched
            }
     ) {
      returning {
        favourited
        user_issuer
        video_id
        watched
      }
    }
  }
`;

export const watchedVideosQueryString = `
query query_watched_videos($user_id: String!) {
    stats(where: {
        user_issuer: {_eq: $user_id}, 
        watched: {_eq: true}
        }) 
    {
      video_id
    }
  }
`;
