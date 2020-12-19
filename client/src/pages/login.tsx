import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Axios from 'axios';
import InputGroup from '../components/InputGroup';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const { data: user } = await Axios.post('/auth/login', {
                username,
                password,
            });

            console.log(user);

            router.push('/');
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    return (
        <div className="flex bg-white">
            <Head>
                <title>Reddit | Login</title>
            </Head>
            <div
                className="h-screen bg-center bg-cover w-36"
                style={{ backgroundImage: "url('/images/register-bckg.jpg')" }}
            />
            <div className="flex flex-col justify-center pl-6">
                <div className="max-w-6xl w-72">
                    <h1 className="mb-2 text-lg font-medium">Log In</h1>
                    <p className="mb-10 text-xs">
                        By continuing, you agree to our
                        <a href="#" className="mx-1 text-blue-500">
                            User Agreement
                        </a>
                        and <br />
                        <a href="#" className="text-blue-500">
                            Privacy Policy
                        </a>
                        .
                    </p>
                    <form onSubmit={onSubmit}>
                        <InputGroup
                            placeholder="Username"
                            value={username}
                            onChange={setUsername}
                            error={error}
                        />
                        <InputGroup
                            placeholder="Password"
                            value={password}
                            onChange={setPassword}
                            className={error && 'border-red-500'}
                            type="password"
                        />
                        <button
                            className="w-full py-2 mb-4 text-sm font-bold text-white uppercase bg-blue-500 rounded"
                            type="submit"
                        >
                            Log In
                        </button>
                    </form>
                    <small>
                        New to Reddit?
                        <Link href="/register">
                            <a className="ml-1 text-blue-500 uppercase outline-none">
                                Sign Up
                            </a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    );
}
