import { ChangeEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { BsPencil } from 'react-icons/bs';
import { FaBirthdayCake } from 'react-icons/fa';

import { ISub } from '../../types';
import { useAuthState } from '../../context/auth';
import Card from '../../components/Card';
import Sidebar from '../../components/Sidebar';

import Axios from 'axios';
import dayjs from 'dayjs';

export default function Sub() {
    const { authenticated, user } = useAuthState();
    const [ownSub, setOwnSub] = useState(false);
    const router = useRouter();
    const { data: sub, error, revalidate } = useSWR<ISub>(
        `/sub/sub/${router.query.sub}`,
    );
    if (error) router.push('/');

    useEffect(() => {
        if (!sub || !user) return;

        setOwnSub(sub.user.username === user?.username);
    }, [sub, user]);

    const fileInputRef = useRef<HTMLInputElement>();

    const openFileInput = (imgType: string): void => {
        if (!ownSub) return;

        fileInputRef.current.click();
        fileInputRef.current.name = imgType;
    };

    const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];
        console.log(event.target.name);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', fileInputRef.current.name);

        try {
            await Axios.post<ISub>(`/sub/${sub.name}/image`, formData);

            revalidate();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Head>
                <title>{sub?.title || 'Reddit'}</title>
            </Head>
            {sub && (
                <>
                    <div className="mt-12">
                        {/* Sub Banner */}
                        <div className="relative bg-blue-500">
                            <div
                                className={classNames(
                                    'absolute items-center justify-center text-white bg-gray-600 rounded-full cursor-pointer w-9 h-9 hover:opacity-90',
                                    ownSub ? 'flex' : 'hidden',
                                )}
                                style={{ right: 20, top: 20 }}
                                onClick={() => openFileInput('banner')}
                            >
                                <input
                                    hidden
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={uploadImage}
                                />
                                <BsPencil size={22} />
                            </div>

                            {sub.bannerUrl ? (
                                <div
                                    className="h-56 bg-blue-500"
                                    style={{
                                        backgroundImage: `url(${sub.bannerUrl})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                ></div>
                            ) : (
                                <div className="h-20 bg-blue-500"></div>
                            )}
                        </div>
                    </div>
                    {/* Sub meta */}
                    <div className="h-20 bg-white">
                        <div className="container relative flex">
                            <div className="absolute" style={{ top: -15 }}>
                                <Image
                                    src={sub.imageUrl}
                                    alt="Sub image "
                                    width={70}
                                    height={70}
                                    className="object-cover rounded-full"
                                />
                                <div
                                    className={classNames(
                                        'absolute items-center justify-center text-white bg-gray-600 rounded-full cursor-pointer w-6 h-6 hover:opacity-90',
                                        ownSub ? 'flex' : 'hidden',
                                    )}
                                    style={{ right: -5, bottom: 0 }}
                                    onClick={() => openFileInput('image')}
                                >
                                    <BsPencil size={16} />
                                </div>
                            </div>
                            <div className="pt-1 pl-24">
                                <div className="flex items-center">
                                    <h1 className="mb-2 text-3xl font-bold">
                                        {sub.title || sub.name}
                                    </h1>
                                </div>
                                <p className="text-sm font-bold text-gray-500">
                                    /r/{sub.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className="container flex-col w-full pt-12 mx-auto lg:w-10/12">
                <h1 className="my-4 text-xl font-medium">Recent posts</h1>
                <div className="flex">
                    {/* Sub posts */}
                    <div className="w-full lg:w-3/5">
                        {sub && sub.posts.length !== 0 ? (
                            sub.posts.map((post) => (
                                <Card post={post} key={post.identifier} />
                            ))
                        ) : (
                            <h1 className="mt-8 text-2xl font-medium text-center">
                                No posts yet
                            </h1>
                        )}
                    </div>
                    <Sidebar>
                        <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                            <h1 className="p-3 text-xl text-white ">
                                About Community
                            </h1>
                            <div className="flex flex-col p-3 bg-white">
                                {sub?.description && (
                                    <p className="text-lg">{sub.description}</p>
                                )}
                                <div className="flex mt-4">
                                    <div className="flex flex-col">
                                        <p>5.2k</p>
                                        <p className="font-semibold">members</p>
                                    </div>
                                    <div className="flex flex-col ml-16">
                                        <p>150</p>
                                        <p className="font-semibold">online</p>
                                    </div>
                                </div>
                                <div className="flex items-center mt-4">
                                    <FaBirthdayCake size={20} />
                                    <h6 className="ml-2 text-lg">
                                        Created
                                        {dayjs(sub?.createdAt).format(
                                            'D MMM YYYY',
                                        )}
                                    </h6>
                                </div>
                                {authenticated && (
                                    <button className="py-2 mt-6 button blue">
                                        Post
                                    </button>
                                )}
                            </div>
                        </div>
                    </Sidebar>
                </div>
            </div>
        </div>
    );
}
