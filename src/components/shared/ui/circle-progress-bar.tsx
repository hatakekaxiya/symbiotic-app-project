import "twin.macro";

import React from "react";

// export const CircleProgressBar = styled.div<{
//     $fullnes?: string; // require PERCENTAGES %
//     $fillColor?: string;
//     $emptyColor?: string;
//     $size?: string;
// }>(
//     ({
//         $fullnes = "750%",
//         $emptyColor = "rgba(217, 217, 217, 1)",
//         $fillColor = "rgba(182, 255, 62, 1)",
//         $size = "6.25rem",
//     }) => css`
//         display: flex;
//         justify-content: center;
//         align-items: center;

//         width: ${$size};
//         height: ${$size};
//         border-radius: 50%;
//         background: radial-gradient(closest-side, white 79%, transparent 80% 100%),
//             conic-gradient(${$fillColor} ${$fullnes}, ${$emptyColor} 0);
//     `,
// );

export const CircleProgress: React.FC<{
    progress: number;
    strokeWidth: number;
    diameter: number;
}> = ({ progress, strokeWidth, diameter }) => {
    const radius = (diameter - strokeWidth) / 2; // radius of the circle
    const circumference = 2 * Math.PI * radius; // circumference of the circle
    const offset = circumference - (progress / 100) * circumference; // offset for the progress

    return (
        <svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth} tw="shrink-0">
            <circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                strokeWidth={strokeWidth}
                tw="fill-none stroke-[var(--light-black-color-20)]"
            />
            <circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                tw="fill-none stroke-[var(--accent)]"
                style={{
                    transition: "stroke-dashoffset 0.35s",
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                }}
            />
        </svg>
    );
};
