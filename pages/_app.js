import '../styles/globals.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {createMagic} from "../lib/magic-client";
import Loader from "./components/loader/loader";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY);
    (async () => {
      try {
        const loggedIn = await magic.user.isLoggedIn();
        if(loggedIn) {
          await router.push('/');
        } else {
          await router.push('/login');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error occurred while getting the user status: ', error)
        await router.push('/login');
        setLoading(false);
      }
    })();
  }, []);
  return loading ? <Loader /> : <Component {...pageProps} />
}

export default MyApp
