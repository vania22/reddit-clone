import Axios from 'axios';
import { useState } from 'react';
import InputGroup from './InputGroup';

const CreateCommentForm: React.FC<{
    identifier: string | string[];
    slug: string | string[];
    username: string;
    revalidate?: any;
}> = ({ identifier, slug, username, revalidate }): React.ReactElement => {
    const [value, setValue] = useState('');

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await Axios.post(`/post/comment/${identifier}/${slug}`, {
                body: value,
            });
            revalidate();
            setValue('');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-3 border-2 border-gray-400 rounded-md">
            <p>
                Comment as
                <span className="ml-1 font-bold text-blue-500">{username}</span>
            </p>
            <form className="flex flex-col w-full" onSubmit={onFormSubmit}>
                <InputGroup
                    textarea
                    value={value}
                    onChange={setValue}
                    placeholder="What are your thoughts?"
                />
                <button
                    type="submit"
                    className="self-end p-2 button hollow blue"
                    disabled={!value.trim()}
                >
                    Comment
                </button>
            </form>
        </div>
    );
};

export default CreateCommentForm;
