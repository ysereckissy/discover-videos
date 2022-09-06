import { useRouter } from "next/router";
import { useEffect } from "react";
import { magic } from "../lib/magic-client";
import Loader from "./components/loader/loader";

const Callback = () => {
const router = useRouter();

useEffect(() => {
    finishEmailRedirectLogin();
}, [router.query]);

const finishEmailRedirectLogin = () => {
    if(router.query.magic_credential)
        magic.auth.loginWithCredential()
            .then((didToken) => authenticateWithServer(didToken))
            .catch(error => {
                console.log(`Finish redirection error: ${error}`)
            });
}

const authenticateWithServer = async (didToken) => {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${didToken}`,
        }
    });
    res.status === 200 && router.push('/');
}
return <Loader />;
};
export default Callback;