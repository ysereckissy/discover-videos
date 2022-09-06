import Card from "./card";
import styles from "./section-cards.module.css";
import Link from "next/link";
import clx from "classnames";

const SectionCards = (props) => {
    const { title, videos=[], size="medium", wrap = false, scale = true} = props;
    return (
        <section>
            <h2 className={styles.title}>{title}</h2>
            <div className={clx(styles.cardWrapper, wrap && styles.wrap)}>
                {
                    videos.map((video, idx) => {
                        const slug = video.id;
                        return (
                           <Link href={`/videos/${slug}`} key={idx}>
                               <a>
                                   <Card
                                       id={idx}
                                       imgUrl={video.imgUrl}
                                       size={size}
                                       scale={scale}
                                   />
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