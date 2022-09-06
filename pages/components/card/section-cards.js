import Card from "./card";
import styles from "./section-cards.module.css";
import Link from "next/link";

const SectionCards = (props) => {
    const { title, videos=[], size="medium" } = props;
    return (
        <section>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.cardWrapper}>
                {
                    videos.map((video, idx) => {
                        const slug = video.id;
                        return (
                           <Link href={`/videos/${slug}`} key={idx}>
                               <a>
                                   <Card id={idx} imgUrl={video.imgUrl} size={size}/>
                               </a>
                           </Link>
                        );
                    })
                }
            </div>
        </section>
    );
};

export default SectionCards;