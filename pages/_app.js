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
      await router.push('/');
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
