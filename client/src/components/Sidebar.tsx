import { ReactNode } from 'react';

const Sidebar: React.FC<{ children: ReactNode }> = ({
    children,
}): React.ReactElement => (
    <div className="hidden w-2/5 max-w-sm ml-6 lg:block">{children}</div>
);

export default Sidebar;
