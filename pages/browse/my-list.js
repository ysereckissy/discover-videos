import Head from 'next/head';
import Navbar from "../components/navbar/navbar";
import SectionCards from "../components/card/section-cards";
import styles from '../../styles/my-list.module.css';
import {verifyToken} from "../../lib/utils";
import {getMyListVideos} from "../../lib/videos";

export async function getServerSideProps(context) {
    const { user_id, token } = await verifyToken(context.req.cookies.token) || { user_id: null, token: 'invalid-token'};
    /// no valid user per the provided token. Bail out!!
    if(!user_id) {
        return {
            redirect: {
                destination: `/login`,
                permanent: false,
            },
        }
    }
    /// user is authenticated. get the videos list
    const favouritedVideos = await getMyListVideos(user_id, token);
    return {
        props: {
            favouritedVideos: ((videos = []) => videos.map(video => ({
                id: video.video_id,
                imgUrl: `https://i.ytimg.com/vi/${video.video_id}/maxresdefault.jpg`
            })))(favouritedVideos),
        }
    }
}

const myList = ({ favouritedVideos }) => {
    return(<div>
            <Head>
                <title>My List</title>
                <meta name="description" content="My List of favourited videos" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <Navbar />
                <div className={styles.sectionWrapper} >
                    <SectionCards
                        title={`My List`}
                        videos={favouritedVideos}
                        size={`small`}
                        wrap
                        scale={false}
                    />
                </div>
            </main>
    </div>
    );
};

export default myList;