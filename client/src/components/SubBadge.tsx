import Link from 'next/link';
import Image from 'next/image';
import { ISub } from '../types';

const SubBadge: React.FC<{ sub: ISub }> = ({ sub }): React.ReactElement => (
    <Link href={`/r/${sub.name}`} key={sub.name}>
        <a>
            <div className="flex items-center h-16 pl-10 pr-10 border-b-2 border-gray-300 hover:opacity-60">
                <Image
                    src={sub.imageUrl}
                    alt="Sub image"
                    width={40}
                    height={40}
                    className="object-cover rounded-full"
                />
                <p className="ml-2 text-lg font-medium">/r/{sub.name}</p>
                <small className="ml-auto text-sm font-medium">
                    {sub.postCount}
                </small>
            </div>
        </a>
    </Link>
);

export default SubBadge;
