import useSWR from 'swr';

const fetchUser = url => fetch(url, { method: 'POST' })
        .then(r => r.json())
        .then(data => {
            return { user: data?.user || null};
        })
        .catch(error => {
            console.error(`Exception ${error} occurred while fetching user`);
        });

export const useUser = () => {
    const { data, error} = useSWR('/api/user', fetchUser);
    return {
        user: data && data?.user,
        isLoading: !error && !data,
        isError: error,
    };
}