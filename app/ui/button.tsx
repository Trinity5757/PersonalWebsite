import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        ' w-full mt-4 bg-purple-400 text-black font-bold p-2 rounded hover:bg-purple-500 transition',
        className,
      )}
    >
      {children}
    </button>
  );
}