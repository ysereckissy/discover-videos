import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Banner from "./components/banner/banner";
import NavBar from "./components/navbar/navbar";
import SectionCards from "./components/card/section-cards";
import {getPopularVideos, getVideos, getWatchItAgainVideos} from "../lib/videos";
import {verifyToken} from "../lib/utils";

export async function getServerSideProps(context) {
    /// verify the token first, making sure the user is authenticated.
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
    /// Get videos
    const disneyVideos = await getVideos(`disney trailer`);
    const productivityVideos = await getVideos(`productivity`);
    const travelVideos = await getVideos(`travel`);
    const popularVideos = await getPopularVideos();
    const watchedItAgainVideos = await getWatchItAgainVideos(user_id, token);
    return { props: {
        disneyVideos,
        productivityVideos,
        travelVideos,
        popularVideos,
        watchedItAgainVideos: ((videos) => videos.map(video => ({
            id: video.video_id,
            imgUrl: `https://i.ytimg.com/vi/${video.video_id}/maxresdefault.jpg`
        })))(watchedItAgainVideos),
    }};
}

export default function Home({ disneyVideos, productivityVideos, travelVideos, popularVideos, watchedItAgainVideos }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div className={styles.main}>
            <NavBar />
            <Banner
                title='Clifford the red dog'
                subTitle="a very cute dog"
                imgUrl={`/static/clifford.webp`}
                videoId={`4zH5iYM4wJo`}
            />
            <div className={styles.sectionWrapper}>
                { (!!watchedItAgainVideos?.length) && <SectionCards title={`Watch It Again`} videos={watchedItAgainVideos} size={`small`}/>}
                <SectionCards title={`Disney`} videos={disneyVideos} size={`large`}/>
                <SectionCards title={`Travel`} videos={travelVideos} size={`small`}/>
                <SectionCards title={`Productivity`} videos={productivityVideos} size={`medium`}/>
                <SectionCards title={`Popular`} videos={popularVideos}  size={`small`}/>
            </div>
        </div>
    </div>
  )
}
