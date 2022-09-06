import jwt from "jsonwebtoken";
import {
    getVideoStatsByUserAndVideoIds,
    insertStats,
    statsExist,
    updateVideoStats
} from "../../lib/db/hasura";

const invalidRequest = (req) => req.method !== 'GET' && req.method !== 'POST';
const postRequest = (req) => req.method === 'POST';

const getQueryData = (req) => {
    const inputData = req.method === 'GET' ? req.query : req.body;
    const { videoId: video_id, watched, favourited } = inputData;
    return {
        video_id,
        watched: watched || true,
        favourited,
    }
}

const processPostRequest = async (stats, token) => {
    const { user_id, video_id } = stats;
    const existingStats = await statsExist(user_id, video_id, token);
    let videoStats;
    if(existingStats) {
        /// update stats
        videoStats = await updateVideoStats(stats, token);
        videoStats = videoStats?.update_stats?.returning[0];
    } else {
        /// insert new stats
        videoStats = await insertStats(stats, token);
        videoStats = videoStats?.insert_stats_one;
    }
    return videoStats;
}

const processGetRequest = async (stats, token) => {
    const { user_id, video_id } = stats;
    return await getVideoStatsByUserAndVideoIds(user_id, video_id, token);
}

const stats = async (req, res) => {
    if(!req.cookies.token || invalidRequest(req)) {
        return res.status(403).send();
    }
    try {
        /// verify the token
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { issuer: user_id, public_address, email } = decodedToken;
        /// const user = { user_id, public_address, email};
        /// verify user existence and status
        const queryData = getQueryData(req);
        const stats = {
            user_id,
            ...queryData,
        }
        console.log({ stats });
        let videoStats;
        if(postRequest(req)) {
            console.log(`processing post...`)
            videoStats = await processPostRequest(stats, token);
            console.log({ videoStats });
        } else {
            videoStats = await processGetRequest(stats, token);
            console.log({ videoStats });
        }
        res.status(200).send({ videoStats })
    } catch (error) {
        console.log(`An Error occurred in api/stats `, error);
        res.status(500).send();
    }
}

export default stats;