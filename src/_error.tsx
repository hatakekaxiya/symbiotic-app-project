import "twin.macro";

import React from "react";

export const ErrorComponent: React.FC = () => {
    return (
        <div tw="grid h-full w-full grid-rows-2 items-center justify-items-center gap-4">
            <span tw="text-34-40">404</span>
            <span>Page not found</span>
        </div>
    );
};
