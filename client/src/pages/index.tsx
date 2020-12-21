import Head from 'next/head';
import useSWR from 'swr';

import Card from '../components/Card';

export default function Home() {
    const { data: posts } = useSWR('/post');

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
                            posts.map((post) => (
                                <Card post={post} key={post.identifier} />
                            ))}
                    </div>
                    <div className="hidden w-2/5 bg-green-600 lg:block">
                        hello
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
