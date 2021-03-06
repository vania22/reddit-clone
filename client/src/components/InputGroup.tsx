import classNames from 'classnames';

interface InputGroupInterface {
    value: string;
    onChange: (str: string) => void;
    error?: string | undefined;
    placeholder?: string;
    type?: string;
    className?: string;
    textarea?: boolean;
}

const InputGroup: React.FC<InputGroupInterface> = ({
    value,
    onChange,
    error,
    className,
    placeholder = '',
    type = 'text',
    textarea,
}): React.ReactElement => {
    return (
        <div className="mb-2">
            {textarea ? (
                <textarea
                    className={classNames(
                        'w-full p-3 transition duration-200 border-2 border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white',
                        { 'border-red-500': error },
                        className,
                    )}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    className={classNames(
                        'w-full p-3 transition duration-200 border-2 border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white',
                        { 'border-red-500': error },
                        className,
                    )}
                    placeholder={placeholder}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
            {error && (
                <small className="text-xs font-medium text-red-500 whitespace-pre-wrap">
                    {error}
                </small>
            )}
        </div>
    );
};

export default InputGroup;
