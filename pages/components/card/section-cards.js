import Card from "./card";
import styles from "./section-cards.module.css";

const SectionCards = (props) => {
    const { title, videos=[], size="medium" } = props;
    return (
        <section>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.cardWrapper}>
                {
                    videos.map((video, idx) => <Card key={idx} id={idx} imgUrl={video.imgUrl} size={size}/>)
                }
            </div>
        </section>
    );
};

export default SectionCards;