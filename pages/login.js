import Head from "next/head";
import styles from "../styles/login.module.css";
import Image from "next/image";
import {useEffect, useState} from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic-client";
import Loader from "./components/loader/loader";

const Login = () => {
    const [email, setEmail] = useState("");
    const [userMsg, setUserMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    useEffect(() => {
        router.events.on('routeChangeComplete', () => setLoading(false));
        router.events.on('routeChangeError', () => setLoading(false));
        return () => {
            router.events.off('routeChangeComplete', () => setLoading(false));
            router.events.off('routeChangeError', () => setLoading(false));
        };
    }, [router]);

    const loginHandler = (e) => {
       e.preventDefault();
        setLoading(true);
        (async() => {
            try {
                const didToken = await magic.auth.loginWithMagicLink({
                    email,
                    redirectURI: new URL('/callback', window.location.origin).href,
                });
                /// validate the didToken
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${didToken}`,
                    }
                });
                const loggedIn = await res.json();
                res.status === 200 && loggedIn.success && router.push('/');
            } catch (error) {
                setUserMessage(`Something went wrong while logging in!`)
                setLoading(false);
            }
        })();
    }
    const inputUpdateHandler = (e) => {
       e.preventDefault();
       const email = e.target.value;
       setEmail(email);
       setUserMessage("");
    }
    return loading ? <Loader /> : (
        <div className={styles.container}>
            <Head>
                <title>Netflix SignIn</title>
            </Head>
            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <a className={styles.logoLink} href={`/`}>
                        <div className={styles.logoWrapper}>
                            <Image
                                src={`/static/netflix.svg`}
                                alt={`Netflix Logo`}
                                width={`128px`}
                                height={`34px`}
                            />
                        </div>
                    </a>
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                    <h1 className={styles.signinHeader}>Sing In</h1>
                    <input
                        type={`text`}
                        placeholder={`Email address`}
                        className={styles.emailInput}
                        onChange={inputUpdateHandler}
                    />
                    {userMsg &&
                        <p className={styles.userMsg}>{userMsg}</p>
                    }
                    <button onClick={loginHandler} className={styles.loginBtn}>
                        Sign In
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;