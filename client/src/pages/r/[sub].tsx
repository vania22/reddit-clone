import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Card from '../../components/Card';

export default function Home() {
    const router = useRouter();
    const { data: sub } = useSWR(`/sub/${router.query.sub}`);

    return (
        <div>
            <Head>
                <title>Reddit</title>
            </Head>
            <div className="container flex-col w-full pt-12 mx-auto lg:w-10/12">
                <h1 className="my-4 text-xl font-medium">Recent posts</h1>
                <div className="flex">
                    <div className="w-full lg:w-3/5">
                        {sub?.posts &&
                            sub.posts.map((post) => (
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
