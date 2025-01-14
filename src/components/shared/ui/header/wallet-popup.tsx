import React, { MutableRefObject, useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import { useAccount, useDisconnect, useEnsName } from "wagmi";

import { ellipsisAddress } from "@/components/shared/lib/utils";

import { useCopyText } from "../../hooks/use-copy-text";
import { ProfileImage } from "../profile-image";

type Props = {
    outerRef?: MutableRefObject<HTMLDialogElement | null>;
    popupCrossRef?: MutableRefObject<HTMLDivElement | null>;
    onPopupClose: () => void;
};

export const WalletPopup: React.FC<Props> = ({ outerRef, popupCrossRef, onPopupClose }) => {
    const { address } = useAccount();
    const { data: ensName } = useEnsName({
        address,
    });

    const { disconnect } = useDisconnect();

    const { copyText } = useCopyText({
        text: address as string,
        title: "Address copied",
        description: address as string,
    });

    const [open, setOpen] = useState(false);

    const handleClickOutside = (event: Event) => {
        if (
            outerRef?.current &&
            !outerRef.current.contains(event?.target as Node) &&
            popupCrossRef?.current &&
            !popupCrossRef.current.contains(event?.target as Node)
        ) {
            onPopupClose();
        }
    };

    useEffect(() => {
        setOpen(true);

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSignOut = () => {
        onPopupClose();
        disconnect();
    };

    return (
        <Container ref={outerRef} open={open} className="desktop:modal">
            <Header>
                <ProfileImage alt={(ensName || address) as string} />
                <AddressInfo>
                    {ensName ? (
                        <ENSName>{ensName}</ENSName>
                    ) : (
                        address && (
                            <ENSName onClick={copyText}>{ellipsisAddress(address, 4, 4)}</ENSName>
                        )
                    )}
                    {ensName && address && (
                        <Address onClick={copyText}>{ellipsisAddress(address, 8, 6)}</Address>
                    )}
                </AddressInfo>
            </Header>
            <Actions>
                <ActionButton onClick={copyText}>COPY ADDRESS</ActionButton>
                <div tw="border-r border-[var(--border-color)]"></div>
                <ActionButton onClick={handleSignOut}>SIGN OUT</ActionButton>
            </Actions>
        </Container>
    );
};

const Container = styled.dialog`
    ${tw`absolute bottom-0 left-0 translate-y-full top-[unset]`}
    ${tw`border-x border-y border-[var(--border-color)]`}
    ${tw`h-fit bg-[rgba(25,25,25,1)]`}
    ${tw`z-20 w-full overflow-y-auto`}
`;

const Header = styled.div`
    ${tw`flex w-full flex-col items-start gap-3 border-b px-6 pt-3 pb-4 border-[var(--border-color)]`}
`;

const AddressInfo = styled.div`
    ${tw`flex w-full flex-col items-start gap-3`}
`;

const ENSName = styled.div`
    ${tw`text-white text-20-22`}
`;

const Address = styled.div`
    ${tw`cursor-pointer text-14-16 transition-opacity text-[var(--light-black-color-50)] hover:opacity-75`}
`;

const Actions = styled.div`
    ${tw`flex w-full justify-center`}
`;

const ActionButton = styled.button`
    ${tw`w-full whitespace-nowrap px-4 py-2 transition-opacity text-[var(--light-black-color-50)] hover:opacity-75`}
`;
