import React from "react";
import tw from "twin.macro";
import { useAccount } from "wagmi";

import { useConnectModalContext } from "@/components/shared/connect-modal-context";

export const GetStarted: React.FC = () => {
    const account = useAccount();
    const { openConnectModal } = useConnectModalContext();

    if (account.address) {
        return null;
    }

    return (
        <Root>
            <TextsWrapper>
                <GetStartedText>Get started</GetStartedText>
                <ConnectWalletText>Connect your wallet to start staking.</ConnectWalletText>
            </TextsWrapper>
            <ConnectButton onClick={openConnectModal}>Connect</ConnectButton>
        </Root>
    );
};

const Root = tw.div`flex w-full flex-row items-center justify-between border px-7 py-5 border-[var(--accent-50)] mobile:(flex flex-col items-start gap-4)`;
const ConnectButton = tw.button`py-4 px-11 text-black uppercase bg-[var(--accent)] mobile:w-full`;
const TextsWrapper = tw.div`flex flex-col items-start gap-2`;
const GetStartedText = tw.div`text-18-22 uppercase opacity-50`;
const ConnectWalletText = tw.div`text-24-26`;
