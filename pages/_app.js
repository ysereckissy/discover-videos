import '../styles/globals.css'
import {useEffect, useState} from "react";
import { useRouter } from "next/router";
import Loader from "./components/loader/loader";

function DiscoverVideoApplication({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    router.events.on('routeChangeComplete', () => setLoading(false));
    router.events.on('routeChangeError', () => setLoading(false));
    (async () => {
      try {
        /// use the user api to imperatively get user information here.
        /// if the user exists and is valid, go Home otherwise goto login.
        const response = await fetch('/api/user', {
          method: 'POST',
        });
        const { user } = await response.json();
        /// here we make sure the user is known of the data management layer of
        /// the api and is an active user.

        /// don't do any redirect as long as the user fetching promise is not resolved.
        if(user && user.issuer) {
          await router.push('/');
        } else {
          await router.push('/login');
        }
      } catch (error) {
        console.error('Error occurred while getting the user status: ', error)
        await router.push('/login');
      }
    })();
    return () => {
      router.events.off('routeChangeComplete', () => setLoading(false));
      router.events.off('routeChangeError', () => setLoading(false));
    };
  }, []);
  if(loading) return <Loader />
  return <Component {...pageProps} />
}

export default DiscoverVideoApplication;
