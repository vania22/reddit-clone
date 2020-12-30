import Link from 'next/link';
import Axios from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { IPost } from '../types';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ActionButton: React.FC = ({ children }): React.ReactElement => (
    <a className="px-1 py-1 mr-1 text-xs font-medium text-center text-gray-400 rounded cursor-pointer hover:bg-gray-100">
        {children}
    </a>
);

const Card: React.FC<{ post: IPost; revalidate: any }> = ({
    post,
    revalidate,
}): React.ReactElement => {
    const vote = async (value: number) => {
        try {
            const { data } = await Axios.post('/vote', {
                postId: post.identifier,
                slug: post.slug,
                value,
            });
            revalidate();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex mb-4 bg-white rounded" key={post.identifier}>
            {/* Vote section */}
            <div className="flex flex-col justify-center w-10 text-center text-gray-400 bg-gray-200 rounded-l">
                <i
                    onClick={() => vote(1)}
                    className={classNames(
                        'text-xl  cursor-pointer fas fa-arrow-up hover:text-gray-500',
                        post.userVote === 1 &&
                            'text-blue-500  hover:text-blue-400',
                    )}
                />
                <span className="py-2 font-medium text-gray-500">
                    {post.voteScore}
                </span>
                <i
                    onClick={() => vote(-1)}
                    className={classNames(
                        'text-xl  cursor-pointer fas fa-arrow-down hover:text-gray-500',
                        post.userVote === -1 &&
                            'text-red-500  hover:text-red-400',
                    )}
                />
            </div>
            {/* Post data section */}
            <div className="w-full p-2">
                <div className="flex items-center">
                    <Link href={`/r/${post.subName}`}>
                        <img
                            src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                            className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                        />
                    </Link>
                    <Link href={`/r/${post.subName}`}>
                        <a className="text-xs font-bold cursor-pointer hover:underline">
                            /r/{post.subName}
                        </a>
                    </Link>
                    <p className="text-xs text-gray-500">
                        <span className="mx-1">•</span>
                        Posted by
                        <Link href={`/u/${post.user.username}`}>
                            <a className="mx-1 hover:underline">
                                /u/{post.user.username}
                            </a>
                        </Link>
                        <Link href={post.url}>
                            <a className="mx-1 hover:underline">
                                {dayjs(post.createdAt).fromNow()}
                            </a>
                        </Link>
                    </p>
                </div>
                <Link href={post.url}>
                    <a>
                        <p className="my-1 text-lg font-medium">{post.title}</p>
                    </a>
                </Link>
                {post.body && <p className="my-1 text-sm">{post.body}</p>}
                <div className="flex items-start mt-2">
                    <ActionButton>
                        <i className="mr-1 fas fa-comment-alt" />
                        {post.commentsCount} Comments
                    </ActionButton>
                    <ActionButton>
                        <i className="mr-1 fas fa-share" />
                        Share
                    </ActionButton>
                    <ActionButton>
                        <i className="mr-1 fas fa-bookmark" />
                        Save
                    </ActionButton>
                </div>
            </div>
        </div>
    );
};

export default Card;
