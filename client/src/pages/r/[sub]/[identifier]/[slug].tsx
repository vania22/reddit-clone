import { useRouter } from 'next/router';
import Head from 'next/head';

import { SubSidebar } from '../../../../components/Sidebar';
import { IPost } from '../../../../types';
import useSWR from 'swr';
import PostCard from '../../../../components/PostCard';
import { useAuthState } from '../../../../context/auth';
import CreateCommentForm from '../../../../components/CreateCommentForm';
import CommentCard from '../../../../components/CommentCard';

const Post = () => {
    const {
        query: { identifier, slug },
    } = useRouter();
    const { authenticated, user } = useAuthState();
    const { data: post, revalidate } = useSWR<IPost>(
        `/post/${identifier}/${slug}`,
    );

    console.log(post);

    return (
        <div>
            <Head>
                <title>{post && post.title}</title>
            </Head>
            <div className="container flex-col w-full pt-12 mx-auto lg:w-10/12">
                <h1 className="my-4 text-xl font-medium truncate">
                    {post && post.title}
                </h1>
                <div className="flex justify-center">
                    <div className="w-full lg:w-3/5 ">
                        {post && (
                            <PostCard post={post} revalidate={revalidate} />
                        )}
                        {authenticated && (
                            <CreateCommentForm
                                identifier={identifier}
                                slug={slug}
                                username={user.username}
                                revalidate={revalidate}
                            />
                        )}
                        <div className="flex flex-col mt-4">
                            {post &&
                                post.comments.length > 0 &&
                                post.comments.map((c) => (
                                    <CommentCard
                                        comment={c}
                                        post={post}
                                        key={c.identifier}
                                        revalidate={revalidate}
                                    />
                                ))}
                        </div>
                    </div>
                    {post && <SubSidebar sub={post.sub} />}
                </div>
            </div>
        </div>
    );
};

export default Post;
