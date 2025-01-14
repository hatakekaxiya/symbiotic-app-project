import "twin.macro";

import React, { MouseEvent } from "react";
type Props = {
    className?: string;
};

export const Label: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
    const handleClick = (e: MouseEvent) => e.stopPropagation();
    {
        /* TODO: add condition for tooltip */
    }
    return (
        <div className={`tooltip ${className}`} data-tip={children}>
            <div
                onClick={handleClick}
                tw="flex h-5 w-fit items-center px-1 leading-3 text-[var(--light-black-color-50)] bg-[var(--light-black-color-10)] text-[0.625rem]"
            >
                <span tw="overflow-hidden text-ellipsis whitespace-nowrap">{children}</span>
            </div>
        </div>
    );
};
