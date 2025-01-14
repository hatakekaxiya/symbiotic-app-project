import React, { useEffect, useState } from "react";

import { PlaceholderImage } from "./placeholder-image";

type Props = {
    src: string | (() => Promise<string>);
    alt: string;
    className?: string;
};

export const AsyncImage: React.FC<Props> = ({ src, alt, className }) => {
    const [url, setUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (typeof src === "string") {
            setUrl(src);
            return;
        }

        src()
            .then((url_) => {
                setUrl(url_);
                return;
            })
            .catch(() => {});
    }, [src]);

    return <PlaceholderImage src={url} alt={alt} className={className} />;
};
