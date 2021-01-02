import Link from 'next/link';
import Axios from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { IComment, IPost } from '../types';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ActionButton: React.FC = ({ children }): React.ReactElement => (
    <a className="px-1 py-1 mr-1 text-xs font-medium text-center text-gray-400 rounded cursor-pointer hover:bg-gray-100">
        {children}
    </a>
);

const CommentCard: React.FC<{
    post: IPost;
    comment: IComment;
    revalidate?: any;
}> = ({ post, revalidate, comment }): React.ReactElement => {
    const vote = async (value: number) => {
        try {
            const { data } = await Axios.post('/vote', {
                postId: post.identifier,
                slug: post.slug,
                value,
                commentId: comment.identifier,
            });
            revalidate();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex mb-4 bg-white rounded">
            {/* Vote section */}
            <div className="flex flex-col justify-center w-10 text-center text-gray-400 bg-gray-200 rounded-l">
                <i
                    onClick={() => vote(1)}
                    className={classNames(
                        'text-xl  cursor-pointer fas fa-arrow-up hover:text-gray-500',
                        comment.userVote === 1 &&
                            'text-blue-500  hover:text-blue-400',
                    )}
                />
                <span className="py-2 font-medium text-gray-500">
                    {comment.voteScore}
                </span>
                <i
                    onClick={() => vote(-1)}
                    className={classNames(
                        'text-xl  cursor-pointer fas fa-arrow-down hover:text-gray-500',
                        comment.userVote === -1 &&
                            'text-red-500  hover:text-red-400',
                    )}
                />
            </div>
            {/* Comment data section */}
            <div className="w-full p-2">
                <div className="flex items-center">
                    <Link href={`/u/${post.user.username}`}>
                        <img
                            src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                            className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                        />
                    </Link>
                    <Link href={`/u/${post.user.username}`}>
                        <a className="text-xs font-bold cursor-pointer hover:underline">
                            /u/{post.user.username}
                        </a>
                    </Link>
                    <p className="text-xs text-gray-500">
                        <a className="mx-1 hover:underline">
                            {dayjs(comment.createdAt).fromNow()}
                        </a>
                    </p>
                </div>
                <p className="my-1 text-lg">{comment.body}</p>
                <div className="flex items-start mt-2">
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

export default CommentCard;
