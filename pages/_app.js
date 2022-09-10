import '../styles/globals.css'
import {useState} from "react";

function DiscoverVideoApplication({ Component, pageProps, router }) {
  const [pageUrl, setPageUrl] =  useState('');
  const changeCurrentUrlHandler  = url => {
    setPageUrl(url);
  }
  return <Component {...pageProps} memorizeCurrentUrl={changeCurrentUrlHandler} />
}

export default DiscoverVideoApplication;
