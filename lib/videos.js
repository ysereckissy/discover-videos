import videoTestData from '../data/videos.json';
import {fetchFavouritedVideos, fetchWatchedVideos} from "./db/hasura";

const fetchFromYoutube = async (url) => {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = `https://youtube.googleapis.com/youtube/v3`;

    const response = await fetch(
        `${BASE_URL}/${url}&maxResults=25&key=${API_KEY}`
    );
    return await response.json();
};

export const getCommonVideos = async (url) => {
    try {
        const isDev = process.env.DEVELOPMENT;
        const data = isDev ? videoTestData : await fetchFromYoutube(url);

        if(data?.error) {
            console.error(`Youtube API Error!`, data.error);
            return [];
        }
        return data?.items.map(item => {
            const snippet = item.snippet;
            const id = item.id?.videoId || item.id;
            return {
            title: snippet.title,
            imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
            id,
            description: snippet.description,
            publishedTime: snippet.publishedAt,
            channelTitle: snippet.channelTitle,
            statistics: item.statistics ? item.statistics : {viewCount: 0},
        }
        });
    } catch (error) {
        console.error(`Something went wrong with the videos`)
        return [];
    }
}

export const getVideos = (searchQuery) => {
    const URL = `search?part=snippet&q=${searchQuery}&type=video`
    return getCommonVideos(URL);
};

export const getPopularVideos = () => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US`;
    return getCommonVideos(URL);
};

export const getYoutubeVideoById = (id) => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&regionCode=US&id=${id}`;
    return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (user_id, token) => await fetchWatchedVideos(user_id, token);

export const getMyListVideos = async (user_id, token) => await fetchFavouritedVideos(user_id, token);
