import {
    getUserByIdQueryString,
    createUserQueryString,
    findVideoByUserQuery, insertStatsQueryString, updateStatsQueryString, watchedVideosQueryString,
} from "./graphql";

export const getUserById = async (userId, token)  => {
   const hasuraResponse = await queryHasuraGraphQL(getUserByIdQueryString, "get_user_by_id", { "user_id": userId }, token);
   return hasuraResponse?.users?.length &&  hasuraResponse.users[0] || undefined;
}

export const userExist = async (userId, token) => {
    try {
        const user = await getUserById(userId, token);
        return !!user;
    } catch (error) {
       console.log("An error Happened when trying to know if the user exists: ", error);
    }
}

export const createUser = async({email, issuer, public_address}, token) => {
    try {
        await queryHasuraGraphQL(createUserQueryString, "create_user", {email, "user_id": issuer, public_address}, token);
    } catch (error) {
        console.error("An error occurred when creating a user: ", error);
    }
}

export const getVideoStatsByUserAndVideoIds = async (user_id, video_id, token) => {
    try {
        const data = await queryHasuraGraphQL(findVideoByUserQuery, 'find_video_by_user', {
            user_id,
            video_id
        }, token);
        return (data?.stats && data?.stats.length && data?.stats[0]) || undefined;
    } catch (error) {
        console.log("An error Happened when getting video by user ", error);
    }
}

export const statsExist = async (user_id, video_id, token) => {
    try {
        const data = await getVideoStatsByUserAndVideoIds(user_id, video_id, token);
        return !!data;
    } catch (error) {
        console.log(`Error when checking stats existence `, error);
    }
}

export const insertStats = async (stats, token) => {
    try {
        return await queryHasuraGraphQL( insertStatsQueryString, `insert_user_video_stats`, stats, token);
    } catch (error) {
        console.log(`An error occurred when inserting a new stats: `, error);
    }
}

export const updateVideoStats = async (stats, token) => {
    try {
        return queryHasuraGraphQL(updateStatsQueryString, `update_user_video_stats`, stats, token);
    } catch (error) {
        console.log(`An error occurred when updating vidoe stats`, error);
    }
}

export const fetchWatchedVideos = async(user_id, token) => {
    try {
        const data = await queryHasuraGraphQL(watchedVideosQueryString, `query_watched_videos`, {user_id}, token);
        return data?.stats;
    } catch (error) {
        console.log(`Fetching watched videos failed! `, error);
    }
}

export async function queryHasuraGraphQL(operationsDoc, operationName, variables, token) {
    const result = await fetch(
        process.env.NEXT_PUBLIC_HASURA_ADMIN_URL,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query: operationsDoc,
                operationName: operationName,
                variables: variables,
            })
        }
    );
    const { data } = await result.json();
    return data;
}