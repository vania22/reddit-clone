import Axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { ISub } from '../types';
import InputGroup from './InputGroup';

interface Props {
    initialSubs: ISub[];
    revalidate: any;
}

const CreatePostForm: React.FC<Props> = ({ initialSubs, revalidate }) => {
    const router = useRouter();
    const [dataList, setDataList] = useState<ISub[]>([]);
    const [formValues, setFormValues] = useState({
        subName: '',
        title: '',
        body: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        setDataList(initialSubs);
    }, []);

    const onPostTitleChange = (value: string) =>
        setFormValues({ ...formValues, title: value });

    const onPostBodyChange = (value: string) =>
        setFormValues({ ...formValues, body: value });

    const onSelectChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, subName: `${e.target.value}` });
        try {
            const { data }: { data: ISub[] } = await Axios.get(
                `/sub/find/${e.target.value}`,
            );
            setDataList(data);
        } catch (error) {
            console.log(error);
        }
    };

    const onPostCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data }: { data: ISub } = await Axios.post('/post', {
                sub: formValues.subName,
                title: formValues.title,
                body: formValues.body,
            });
            revalidate();
            router.push(`/r/${formValues.subName}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full px-6 py-4 mt-4 bg-gray-400 rounded">
            <h1 className="my-4 text-xl font-medium">Create Post</h1>
            <form
                className="flex flex-col max-w-sm h-72"
                onSubmit={onPostCreate}
            >
                <input
                    type="text"
                    name="sub"
                    list="subs"
                    placeholder="Choose a community"
                    value={formValues.subName}
                    onChange={onSelectChange}
                    className="p-2 mb-10 text-white bg-gray-700 rounded outline-none"
                />
                <datalist id="subs">
                    {dataList &&
                        dataList.map((sub) => (
                            <option value={sub.name} key={sub.name}>
                                /r/{sub.name}
                            </option>
                        ))}
                </datalist>
                <InputGroup
                    onChange={onPostTitleChange}
                    value={formValues.title}
                    placeholder="Post title"
                    className="p-2 py-2 mb-8 text-white bg-gray-700 border-none rounded outline-none hover:bg-gray-700 focus:bg-gray-700"
                />
                <InputGroup
                    onChange={onPostBodyChange}
                    value={formValues.body}
                    placeholder="Post body"
                    textarea
                    className="p-2 py-2 mb-4 text-white bg-gray-700 border-none rounded outline-none hover:bg-gray-700 focus:bg-gray-700"
                />
                <button className="py-2 w-36 button blue " type="submit">
                    Create
                </button>
            </form>
        </div>
    );
};

export default CreatePostForm;
