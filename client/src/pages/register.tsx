import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Axios from 'axios';
import classNames from 'classnames';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';

export default function Home() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [errors, setErrors] = useState<{
        username?: string;
        email?: string;
        password?: string;
    }>({});

    const router = useRouter();

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const { data: user } = await Axios.post('/auth/register', {
                username,
                email,
                password,
            });

            router.push('/login');
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    return (
        <div className="flex">
            <Head>
                <title>Reddit | Register</title>
            </Head>
            <div
                className="h-screen bg-center bg-cover w-36"
                style={{ backgroundImage: "url('/images/register-bckg.jpg')" }}
            />
            <div className="flex flex-col justify-center pl-6">
                <div className="max-w-6xl w-72">
                    <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
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
                        <div className="flex items-center mb-6">
                            <input
                                type="checkbox"
                                className="mr-1 cursor-pointer"
                                id="agreement"
                                checked={agreement}
                                onChange={(e) => setAgreement(e.target.checked)}
                            />
                            <label
                                htmlFor="agreement"
                                className="text-xs cursor-pointer"
                            >
                                I agree to receive a news emails from Reddit
                            </label>
                        </div>
                        <InputGroup
                            placeholder="Username"
                            value={username}
                            onChange={setUsername}
                            error={errors.username}
                        />
                        <InputGroup
                            placeholder="Email"
                            value={email}
                            onChange={setEmail}
                            error={errors.email}
                        />
                        <InputGroup
                            placeholder="Password"
                            value={password}
                            onChange={setPassword}
                            error={errors.password}
                            type="password"
                        />
                        <button
                            className="w-full py-2 mb-4 text-sm font-bold text-white uppercase bg-blue-500 rounded"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </form>
                    <small>
                        Already a redditor?
                        <Link href="/login">
                            <a className="ml-1 text-blue-500 uppercase outline-none">
                                Log In
                            </a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    );
}
