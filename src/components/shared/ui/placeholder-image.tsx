import React, { useEffect, useState } from "react";
import tw from "twin.macro";

type Props = {
    src: string | undefined;
    alt: string;
    className?: string;
    onError?: () => void;
};

export const PlaceholderImage: React.FC<Props> = ({ src, alt, className, onError = () => {} }) => {
    const [, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    const handleImageError = () => {
        setError(true);
        onError();
    };

    useEffect(() => {
        setIsLoaded(false);
        setError(false);
    }, [src]);

    return (
        <Container className={className}>
            {!error && src && (
                <img src={src} alt={alt} onLoad={handleImageLoad} onError={handleImageError} />
            )}
            {(error || !src) && <Placeholder />}
        </Container>
    );
};

const Container = tw.div`relative`;
const Placeholder = tw.div`h-full w-full bg-[var(--light-black-color-15)]`;
