import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
    return (
        <div className="flex">
            <Head>
                <title>Reddit | Register</title>
            </Head>

            <div
                className="w-40 h-screen bg-center bg-cover"
                style={{ backgroundImage: "url('/images/register-bckg.jpg')" }}
            />
            <div className="flex flex-col justify-center pl-6">
                <div className="w70">
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
                    <form>
                        <div className="flex items-center mb-6">
                            <input
                                type="checkbox"
                                className="mr-1 cursor-pointer"
                                id="agreement"
                            />
                            <label
                                htmlFor="agreement"
                                className="text-xs cursor-pointer"
                            >
                                I agree to receive a news emails from Reddit
                            </label>
                        </div>
                        <div className="mb-2">
                            <input
                                className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-400 rounded"
                                placeholder="Username"
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-400 rounded"
                                placeholder="Email"
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-400 rounded"
                                placeholder="Password"
                            />
                        </div>
                        <button className="w-full py-2 mb-4 text-sm font-bold text-white uppercase bg-blue-500 rounded">
                            Sign Up
                        </button>
                    </form>
                    <small>
                        Already a redditor?
                        <Link href="/login">
                            <a className="ml-1 text-blue-500 uppercase">
                                Log In
                            </a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    );
}
