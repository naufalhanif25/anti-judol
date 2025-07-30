export const Popup = ({
    className,
    children,
}: {
    className: string;
    children?: React.ReactNode;
}) => {
    return (
        <section className="z-999 w-screen h-screen fixed bottom-0 left-0 bg-black/20">
            <div className="w-full h-full flex items-center justify-center relative">
                <span className={className}>{children}</span>
            </div>
        </section>
    );
};
