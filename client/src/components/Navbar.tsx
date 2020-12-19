import Link from 'next/link';
import Logo from '../images/logo.svg';

const Navbar: React.FC = (): React.ReactElement => {
    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
            <div className="flex items-center">
                <Link href="/">
                    <a>
                        <Logo className="w-8 h-8 mr-2" />
                    </a>
                </Link>
                <span className="text-2xl font-semibold">
                    <Link href="/">
                        <a>reddit</a>
                    </Link>
                </span>
            </div>
            <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
                <i className="ml-2 text-gray-500 fas fa-search"></i>
                <input
                    type="text"
                    placeholder="Search"
                    className="py-1 pl-2 pr-3 text-gray-700 bg-transparent rounded outline-none xl:w-160 md:w-96"
                />
            </div>
            <div className="flex items-center justify-center">
                <Link href="/login">
                    <a className="w-32 py-1 mr-4 hollow blue button">log in</a>
                </Link>
                <Link href="/register">
                    <a className="w-32 py-1 blue button">register</a>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
