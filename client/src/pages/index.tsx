import Head from 'next/head';
import useSWR from 'swr';

import PostCard from '../components/PostCard';
import CreatePostForm from '../components/CreatePostForm';
import { Sidebar } from '../components/Sidebar';
import SubBadge from '../components/SubBadge';
import { useAuthState } from '../context/auth';
import { IPost, ISub } from '../types';

export default function Home() {
    const { data: posts, revalidate } = useSWR('/post');
    const { data: subs } = useSWR('/sub/top-subs');
    const { authenticated } = useAuthState();

    return (
        <div>
            <Head>
                <title>Reddit</title>
            </Head>
            <div className="container flex-col w-full pt-12 mx-auto lg:w-10/12">
                {/* Create post form */}
                {authenticated && (
                    <CreatePostForm
                        initialSubs={subs}
                        revalidate={revalidate}
                    />
                )}
                <h1 className="my-4 text-xl font-medium">Recent posts</h1>
                <div className="flex justify-center">
                    <div className="w-full lg:w-3/5">
                        {posts &&
                            posts.map((post: IPost) => (
                                <PostCard
                                    post={post}
                                    key={post.identifier}
                                    revalidate={revalidate}
                                />
                            ))}
                    </div>
                    <Sidebar>
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
                    </Sidebar>
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
