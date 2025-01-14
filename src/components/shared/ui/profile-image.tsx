import makeBlockie from "ethereum-blockies-base64";
import React, { useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import { useAccount } from "wagmi";

import { PlaceholderImage } from "./placeholder-image";

type Props = {
    alt: string;
    className?: string;
};

export const ProfileImage: React.FC<Props> = ({ alt, className }) => {
    const { address } = useAccount();

    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        setProfileImage(makeBlockie(address as string));
    }, [address]);

    return <ProfileImageContainer src={profileImage} alt={alt} className={className} />;
};

const ProfileImageContainer = styled(PlaceholderImage)`
    ${tw`h-10 w-10 border border-2 border-solid bg-[var(--light-black-color-15)] border-[var(--border-color)]`}
`;
