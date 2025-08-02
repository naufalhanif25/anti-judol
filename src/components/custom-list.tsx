import type { ReactNode } from "react";

export const Point = ({
    className,
    list,
}: {
    className?: string;
    list: string[] | ReactNode[];
}) => {
    return (
        <ul className={className}>
            {list.map((item, index) => {
                return <li key={`list-${index}`}>{item}</li>;
            })}
        </ul>
    );
};

export const TreePoint = ({
    title,
    intro,
    list,
    headFontClass,
    listClass,
}: {
    title?: string;
    intro?: string;
    list: string[];
    headFontClass?: string;
    listClass?: string;
}) => {
    return (
        <li className={headFontClass}>
            {title && <strong className={headFontClass}>{title}</strong>}
            {intro && <p className="font-normal">{intro}</p>}
            <Point className={listClass} list={list} />
        </li>
    );
};

export const Paragraph = ({
    title,
    paragraph,
    headFontClass,
}: {
    title?: string;
    paragraph: string;
    headFontClass?: string;
}) => {
    return (
        <li className={headFontClass}>
            {title && <strong className={headFontClass}>{title}</strong>}
            <p className="font-normal">{paragraph}</p>
        </li>
    );
};
