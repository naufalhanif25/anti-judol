export const Point = ({
    title,
    intro,
    list,
}: {
    title: string;
    intro?: string;
    list: string[];
}) => {
    return (
        <li className="font-medium">
            <strong className="font-medium">{title}</strong>
            {intro && <p className="font-normal">{intro}</p>}
            <ul className="font-normal list-disc ml-4">
                {list.map((item) => {
                    return <li>{item}</li>;
                })}
            </ul>
        </li>
    );
};

export const Paragraph = ({
    title,
    paragraph,
}: {
    title: string;
    paragraph: string;
}) => {
    return (
        <li className="font-medium">
            <strong className="font-medium">{title}</strong>
            <p className="font-normal">{paragraph}</p>
        </li>
    );
};
