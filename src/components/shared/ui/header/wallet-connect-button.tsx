import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import tw, { styled } from "twin.macro";
import { useAccount, useConfig, useSwitchChain } from "wagmi";

import { ellipsisAddress } from "@/components/shared/lib/utils";

import { useConnectModalContext } from "../../connect-modal-context";
import { useReducerAsState } from "../../hooks/user-reducer-as-state";
import { useNotificationContext } from "../../notification-context";
import { ProfileImage } from "../profile-image";
import { WalletPopup } from "./wallet-popup";

export const WalletConnectButton: React.FC = () => {
    const [{ prevConnect, dropdownPopup }, setState] = useReducerAsState({
        prevConnect: false,
        dropdownPopup: false,
    });

    const { chains } = useConfig();
    const { address, chainId, isReconnecting } = useAccount();
    const { switchChain } = useSwitchChain();
    const { openConnectModal } = useConnectModalContext();

    const navigate = useNavigate();

    const { setState: setNotification, description } = useNotificationContext();

    const isProperlyConnected = useMemo(() => {
        return address && chains.some((chain) => chain.id === chainId);
    }, [address, chainId, chains]);

    useEffect(() => {
        if (description === undefined || description?.toLowerCase().includes("switch")) {
            if (address && !isProperlyConnected) {
                setNotification({
                    show: true,
                    title: "This network is not supported",
                    description: "Please switch network!",
                    actions: [
                        {
                            title: "Switch",
                            onAction() {
                                switchChain(
                                    {
                                        chainId: chains[0].id,
                                    },
                                    {
                                        onError: (e) =>
                                            console.error("Error when chainId was changing " + e),
                                    },
                                );
                            },
                        },
                    ],
                });
            } else {
                setNotification({ show: false });
            }
        }
    }, [address, chainId, setNotification, description, isProperlyConnected]);

    useEffect(() => {
        if (address && !isReconnecting && !prevConnect) {
            setState({ prevConnect: true });
        }

        if (!address && prevConnect) {
            navigate(0);
        }
    }, [address, isReconnecting, prevConnect, navigate, setState]);

    const popupRef = useRef<HTMLDialogElement | null>(null);
    const handlePopupToogle = () => {
        if (popupRef.current) {
            popupRef.current.close();
            setTimeout(
                () => setState(({ dropdownPopup }) => ({ dropdownPopup: !dropdownPopup })),
                200,
            );
            return;
        }
        setState(({ dropdownPopup }) => ({ dropdownPopup: !dropdownPopup }));
    };

    const popupCrossRef = useRef<HTMLDivElement | null>(null);

    return (
        <ConnectButton.Custom>
            {({ account, chain, authenticationStatus, mounted }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === "authenticated");

                if (!connected)
                    return (
                        <ConnectWalletButton onClick={openConnectModal}>
                            Connect Wallet
                        </ConnectWalletButton>
                    );

                const address = ellipsisAddress(account.address);

                return (
                    <>
                        <AccountInfo onClick={handlePopupToogle} ref={popupCrossRef}>
                            <AccountInfoIcon alt={address as string} />
                            {address}
                        </AccountInfo>
                        {dropdownPopup && (
                            <WalletPopup
                                outerRef={popupRef}
                                popupCrossRef={popupCrossRef}
                                onPopupClose={handlePopupToogle}
                            />
                        )}
                    </>
                );
            }}
        </ConnectButton.Custom>
    );
};

const AccountInfo = styled.div`
    @media (min-width: 776px) {
        ${tw`border-x`}
    }
    ${tw`flex shrink-0 cursor-pointer items-center justify-center gap-3.5 border-r px-6 border-[var(--light-gray-color-20)]`}
`;

const AccountInfoIcon = styled(ProfileImage)`
    ${tw`h-8 w-8`}
`;

const ConnectWalletButton = styled.button`
    ${tw`relative flex items-center justify-center p-6 uppercase text-[var(--accent)] bg-[var(--accent-20)]`}
`;
