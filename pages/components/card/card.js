import Image from "next/image";
import styles from "./card.module.css";
import { motion } from "framer-motion";
import cls from "classnames"

const Card = (props) => {
    const {
        imgUrl = "https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80",
        size="medium",
        id,
    } = props;
    const sizeMap = {
        large: styles.largeItem,
        medium: styles.mediumItem,
        small: styles.smallItem,
    }
    const expand = id === 0 ? {scaleY: 1.1} : {scale: 1.1};
    return (
        <div
            className={styles.container}>
            <motion.div
                whileHover={expand}
                className={cls(styles.imgMotionWrapper, sizeMap[size])}
            >
                <Image
                    className={styles.cardImg}
                    src={imgUrl}
                    alt={`image`}
                    layout={`fill`}
                />
            </motion.div>
        </div>
    );
};

export default Card;
