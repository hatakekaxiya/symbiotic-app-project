// import FarcasterIcon from "./assets/farcaster.svg?react";
import "twin.macro";

import GithubIcon from "./assets/github.svg?react";
import TelegramIcon from "./assets/telegram.svg?react";
import XIcon from "./assets/x.svg?react";

export const items = [
    {
        name: "HOME",
        link: "https://symbiotic.fi",
    },
    {
        name: "CAREERS",
        link: "https://symbioticfi.notion.site/Symbiotic-Careers-7a25421c66fc4951913c3a2bf1b205a5",
    },
    {
        name: "BLOG",
        link: "https://blog.symbiotic.fi",
    },
    {
        name: "DOCUMENTATION",
        link: "https://docs.symbiotic.fi",
    },
];

export const social = [
    {
        Component: XIcon,
        link: "https://x.com/symbioticfi",
    },
    {
        Component: ({ className }: { className?: string }) => (
            <TelegramIcon tw="h-8 w-8 invert" className={className} />
        ),
        link: "https://t.me/symbioticannouncements",
    },
    {
        Component: GithubIcon,
        link: "https://github.com/symbioticfi",
    },
    // {
    //     Component: FarcasterIcon,
    //     link: "https://warpcast.com/symbiotic",
    // },
];
