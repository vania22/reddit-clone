import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';

import Card from '../components/Card';
import SubBadge from '../components/SubBadge';
import { IPost, ISub } from '../types';

export default function Home() {
    const { data: posts } = useSWR('/post');
    const { data: subs } = useSWR('/sub/top-subs');

    return (
        <div>
            <Head>
                <title>Reddit</title>
            </Head>
            <div className="container flex-col w-full pt-12 mx-auto lg:w-10/12">
                <h1 className="my-4 text-xl font-medium">Recent posts</h1>
                <div className="flex">
                    <div className="w-full lg:w-3/5">
                        {posts &&
                            posts.map((post: IPost) => (
                                <Card post={post} key={post.identifier} />
                            ))}
                    </div>
                    <div className="hidden w-2/5 ml-6 lg:block">
                        <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                            <h1 className="p-3 text-xl text-white ">
                                New communities to keep you informed
                            </h1>
                            <div className="flex flex-col bg-white">
                                {subs &&
                                    subs.map((sub: ISub) => (
                                        <SubBadge sub={sub} key={sub.name} />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Server-side solution to fetch data

// export const getServerSideProps: GetServerSideProps = async () => {
//     try {
//         const { data }: { data: IPost[] } = await Axios.get('/post');

//         return {
//             props: {
//                 posts: data,
//             },
//         };
//     } catch (error) {
//         console.log(error)

//          return {
//              props: {
//                  error: 'Something went wrong',
//              },
//          };
//     }
// };
