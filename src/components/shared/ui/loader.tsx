import "twin.macro";

import React from "react";

import { CircleProgress } from "./circle-progress-bar";

export const Loader: React.FC<{
    progress: number;
    strokeWidth: number;
    diameter: number;
    className?: string;
}> = ({ progress, strokeWidth, diameter, className }) => {
    return (
        <div tw="animate-spin" className={className}>
            <CircleProgress progress={progress} strokeWidth={strokeWidth} diameter={diameter} />
        </div>
    );
};
