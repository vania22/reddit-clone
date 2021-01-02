import { ReactNode } from 'react';
import { FaBirthdayCake } from 'react-icons/fa';
import dayjs from 'dayjs';

import { useAuthState } from '../context/auth';
import { ISub } from '../types';

export const Sidebar: React.FC<{ children: ReactNode }> = ({
    children,
}): React.ReactElement => (
    <div className="hidden w-2/5 max-w-sm ml-6 lg:block">{children}</div>
);

export const SubSidebar: React.FC<{ sub: ISub }> = ({ sub }) => {
    const { authenticated, user } = useAuthState();

    return (
        <Sidebar>
            <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                <h1 className="p-3 text-xl text-white ">About Community</h1>
                <div className="flex flex-col p-3 bg-white">
                    {sub?.description && (
                        <p className="text-lg">{sub.description}</p>
                    )}
                    <div className="flex mt-4">
                        <div className="flex flex-col">
                            <p>5.2k</p>
                            <p className="font-semibold">members</p>
                        </div>
                        <div className="flex flex-col ml-16">
                            <p>150</p>
                            <p className="font-semibold">online</p>
                        </div>
                    </div>
                    <div className="flex items-center mt-4">
                        <FaBirthdayCake size={20} />
                        <h6 className="ml-2 text-lg">
                            Created
                            <span className="ml-1">
                                {dayjs(sub?.createdAt).format('D MMM YYYY')}
                            </span>
                        </h6>
                    </div>
                    {authenticated && (
                        <button className="py-2 mt-6 button blue">Post</button>
                    )}
                </div>
            </div>
        </Sidebar>
    );
};
