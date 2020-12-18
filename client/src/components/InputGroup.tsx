import classNames from 'classnames';
import { ChangeEvent } from 'react';

interface InputGroupInterface {
    value: string;
    onChange: (str: string) => void
    error: string | undefined;
    placeholder?: string;
    type?: string;
}

const InputGroup: React.FC<InputGroupInterface> = ({
    value,
    onChange,
    error,
    placeholder = '',
    type = 'text',
}): React.ReactElement => {
    return (
        <div className="mb-2">
            <input
                className={classNames(
                    'w-full p-3 transition duration-200 border-2 border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white',
                    { 'border-red-500': error },
                )}
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && (
                <small className="text-xs font-medium text-red-500 whitespace-pre-wrap">
                    {error}
                </small>
            )}
        </div>
    );
};

export default InputGroup;
