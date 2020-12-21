import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Axios from 'axios';
import { SWRConfig } from 'swr';

import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/auth';

import '../styles/globals.css';

Axios.defaults.baseURL = 'http://localhost:5000/api';
Axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
    const { pathname } = useRouter();
    const authRoutes = ['/register', '/login'];
    const authRoute = authRoutes.includes(pathname);

    return (
        <SWRConfig
            value={{
                fetcher: (url) => Axios.get(url).then((res) => res.data),
                dedupingInterval: 10000,
            }}
        >
            <AuthProvider>
                {!authRoute && <Navbar />}
                <Component {...pageProps} />
            </AuthProvider>
        </SWRConfig>
    );
}

export default MyApp;
