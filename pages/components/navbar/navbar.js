import styles from "./navbar.module.css";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Image from "next/image";
import {useUser} from "../../../lib/hooks";

const NavBar = () => {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState('');
    const userInfo = useUser();

    useEffect(() => {
        (async () => {
            try {
                userInfo.user && setUsername(userInfo.user?.email);
            } catch (error) {
                console.error(`Unable to get valid user information`, error);
            }
        })();
    }, [userInfo])

    const goHomeHandler = (e) => {
        e.preventDefault();
        (async () => {
            await router.push('/');
        })();
    }
    const moviesListHandler = (e) => {
        e.preventDefault();
        (async () => await router.push('/browse/my-list'))();
    }
    const showDropdownHandler = (e) => {
        e.preventDefault();
        setShowDropdown(!showDropdown);
    }
    const signOUtHandler = (e) => {
       e.preventDefault();
        (async () => {
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer '
                }
            });
            router.push('/login');
        })();
    }
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <a className={styles.logoLink} href={`/`}>
                    <div className={styles.logoWrapper}>
                        <Image src={`/static/netflix.svg`} alt={`Netflix Logo`} width={`128px`} height={`34px`}/>
                    </div>
                </a>
                <ul className={styles.navItems}>
                    <li className={styles.navItem} onClick={goHomeHandler}>Home</li>
                    <li className={styles.navItem2} onClick={moviesListHandler}>My List</li>
                </ul>
                <nav className={styles.navContainer}>
                    <div>
                        <button className={styles.usernameBtn} onClick={showDropdownHandler}>
                            <p className={styles.username}>{username}</p>
                            <Image src={`/static/expand-more.svg`} alt={`Expand more`} width={`24px`} height={`24px`}/>
                        </button>
                        {showDropdown && (<div className={styles.navDropdown}>
                            <div>
                                <a className={styles.linkName} onClick={signOUtHandler}>Sign out</a>
                            </div>
                            <div className={styles.lineWrapper}></div>
                        </div>)}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default NavBar;
