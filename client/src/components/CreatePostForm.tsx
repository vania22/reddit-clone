import Axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { ISub } from '../types';

interface Props {
    initialSubs: ISub[];
}

const CreatePostForm: React.FC<Props> = ({ initialSubs }) => {
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
            router.push(`/r/${formValues.subName}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full px-6 py-4 mt-4 bg-gray-400 rounded">
            <h1 className="my-4 text-xl font-medium">Create Post</h1>
            <form className="flex flex-col w-full h-72" onSubmit={onPostCreate}>
                <input
                    type="text"
                    name="sub"
                    list="subs"
                    placeholder="Choose a community"
                    value={formValues.subName}
                    onChange={onSelectChange}
                    className="max-w-sm p-2 mb-10 text-white bg-gray-700 rounded outline-none"
                />
                <datalist id="subs">
                    {dataList &&
                        dataList.map((sub) => (
                            <option value={sub.name} key={sub.name}>
                                /r/{sub.name}
                            </option>
                        ))}
                </datalist>
                <input
                    value={formValues.title}
                    onChange={(e) =>
                        setFormValues({ ...formValues, title: e.target.value })
                    }
                    className="max-w-sm p-2 mb-10 text-white bg-gray-700 rounded outline-none"
                    placeholder="Post title"
                />
                <textarea
                    value={formValues.body}
                    onChange={(e) =>
                        setFormValues({ ...formValues, body: e.target.value })
                    }
                    className="max-w-sm p-2 mb-10 text-white bg-gray-700 rounded outline-none"
                    placeholder="Post body"
                />
                <button className="py-2 w-36 button blue " type="submit">
                    Create
                </button>
            </form>
        </div>
    );
};

export default CreatePostForm;
