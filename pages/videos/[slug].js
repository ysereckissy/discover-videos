import {useRouter} from "next/router";
import Modal from "react-modal";
import cls from 'classnames';
import styles from "../../styles/video.module.css";
import {getYoutubeVideoById} from "../../lib/videos";
import Navbar from "../components/navbar/navbar";
import Like from "../components/icons/like-icon";
import DisLike from "../components/icons/dislike-icon";
import {useEffect, useState} from "react";

Modal.setAppElement("#__next");

export async function getStaticProps(context) {
    const { params: { slug }} = context;
    /// console.log(context)
    const videoArray = await getYoutubeVideoById(slug);
    /// console.log(videoArray);

    return {
        props: {
            video: (videoArray.length > 0 && videoArray[0]) || {},
        },
        /// Next.js will attempt to re-generate the page:
        /// - When a request comes in
        /// - At most once every 10 seconds
        revalidate: 10,
    };
}

export async function getStaticPaths() {
    const videoList = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
    const paths = videoList.map(slug => ({
        params: {slug},
    }));

    return {
        paths,
        fallback: 'blocking',
    };
}
const Video = ({video}) => {
    const router = useRouter();
    const [ toggleLike, setToggleLike ] = useState(false);
    const [ toggleDislike, setToggleDislike ] = useState(false);
    const videoId = router.query.slug;
    const {
        title,
        publishedTime,
        description,
        channelTitle,
        statistics: { viewCount } = { viewCount: 0},
    } = video;

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/stats?videoId=${videoId}`);
            const { videoStats } = await response.json();
            /// if like and dislike have the same value, then we are in the initial condition
            videoStats && setToggleLike(!!videoStats.favourited);
            videoStats && setToggleDislike(!videoStats.favourited);
        })();
    }, [])

    const toggleLikeHandler = (e) => {
        e.preventDefault();
        const newValue = !toggleLike;
        setToggleLike(newValue);
        setToggleDislike(toggleLike);
        (async() => {
            const apiResponse = await fetch('/api/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    videoId,
                    favourited: (value => value ? 1 : 0)(newValue),
                }),
            });
        })();
    }

    const toggleDislikeHandler = (e) => {
        e.preventDefault();
        const newValue = !toggleDislike;
        setToggleDislike(newValue);
        setToggleLike(toggleDislike);
        (async() => {
            const apiResponse = await fetch('/api/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    videoId,
                    favourited: (value => value ? 0 : 1)(newValue),
                }),
            });
        })();
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <Modal
                className={styles.modal}
                isOpen={true}
                contentLabel={`Watch the video`}
                onRequestClose={() => router.back()}
                overlayClassName={styles.overlay}
            >
                <iframe
                    className={styles.videoPlayer}
                    id="ytplayer"
                    type="text/html"
                    width="100%"
                    height="75%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&origin=http://example.com&controls=0&rel=0`}
                        frameBorder="0"></iframe>
                <div className={styles.likeDislikeBtnWrapper}>
                    <div className={styles.likeBtnWrapper}>
                        <button onClick={toggleLikeHandler}>
                            <div className={styles.btnWrapper}>
                                <Like selected={toggleLike}/>
                            </div>
                        </button>
                    </div>
                    <button onClick={toggleDislikeHandler}>
                        <div className={styles.btnWrapper}>
                                <DisLike selected={toggleDislike}/>
                        </div>
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.modalBodyContent}>
                       <div className={styles.col1} >
                           <p className={styles.publishTime}>
                               {publishedTime}
                           </p>
                           <p className={styles.title}>
                               {title}
                           </p>
                           <p className={styles.description}>
                               {description}
                           </p>
                       </div>
                        <div className={styles.col2} >
                            <p className={cls(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>Cast:</span>
                                <span className={styles.channelTitle}>{channelTitle}</span>
                            </p>
                            <p className={styles.subText}>
                                <span className={styles.textColor}>View count:</span>
                                <span className={styles.channelTitle}>{viewCount}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Video;