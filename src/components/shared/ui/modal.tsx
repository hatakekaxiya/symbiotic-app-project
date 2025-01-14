import React, { MutableRefObject, useEffect, useLayoutEffect, useState } from "react";
import tw, { styled } from "twin.macro";

import { useClickOutside } from "../hooks/use-click-outside";

type Props = {
    outerRef?: MutableRefObject<HTMLDialogElement | null>;
    className?: string;
    closeOnClickOutside?: boolean;
    animationOnOpen?: boolean;
    onClose: (succeed?: boolean) => void;
};

export const Modal: React.FC<React.PropsWithChildren<Props>> = ({
    outerRef,
    className,
    children,
    closeOnClickOutside,
    animationOnOpen,
    onClose,
}) => {
    const [open, setOpen] = useState(false);

    const contentRef = useClickOutside<HTMLDivElement>(() => onClose(), closeOnClickOutside);

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose?.();
        }
    };

    useEffect(() => {
        if (animationOnOpen) {
            setOpen(true);
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [animationOnOpen]);

    useLayoutEffect(() => {
        if (!animationOnOpen) {
            setOpen(true);
        }
    }, [animationOnOpen]);

    return (
        <dialog
            ref={outerRef}
            open={open}
            className="modal"
            tw="z-50 outline-none bg-[rgba(0,0,0,0.7)]"
        >
            <Content ref={contentRef} className={`modal-box ${className}`} tw="z-50">
                {children}
            </Content>
        </dialog>
    );
};

const Content = styled.div`
    --bg-color: #0d0d0d;
    ${tw`overflow-x-hidden p-0 min-w-[21.875rem] desktop:min-w-[40.25rem]`}
    ${tw`rounded-none border border-solid border-[var(--border-color)] bg-[var(--bg-color)]`}
`;
