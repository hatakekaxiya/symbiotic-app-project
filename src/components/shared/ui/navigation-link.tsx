import "twin.macro";

import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    title: string;
    link?: string;
    className?: string;
};

export const NavigationLink: React.FC<Props> = ({ title, link, className }) => {
    const navigate = useNavigate();
    return (
        <span
            className={className}
            tw="w-fit cursor-pointer text-16-18 uppercase transition-colors text-[var(--accent)] hover:text-[var(--accent-75)]"
            onClick={() => (link ? navigate(link) : navigate(-1))}
        >{`← ${title}`}</span>
    );
};
