import { ChevronDown } from "lucide-react";

export const Dropdown = ({
    className,
    iconClass,
    children,
    onClick,
    title,
}: {
    className?: string;
    iconClass?: string;
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement | undefined>;
    title?: string;
}) => {
    return (
        <span className={className}>
            <button
                onClick={onClick}
                className="w-full text-left bg-gray-200 p-4 gap-4 rounded-md flex items-center justify-between cursor-pointer"
            >
                {title}
                <ChevronDown strokeWidth={1.6} className={iconClass} />
            </button>
            {children}
        </span>
    );
};
