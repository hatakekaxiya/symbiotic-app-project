import { WalletButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import tw, { styled } from "twin.macro";

import { Button } from "@/components/shared/ui/button";
import { Modal } from "@/components/shared/ui/modal";

import { useConnectModalContext } from "../connect-modal-context";
import { useReducerAsState } from "../hooks/user-reducer-as-state";
import { AsyncImage } from "./async-image";
import { Checkbox } from "./checkbox";

const wallets: Record<string, string>[] = [
    { slug: "metamask", name: "MetaMask" },
    { slug: "rainbow", name: "Rainbow" },
    { slug: "coinbase", name: "Coinbase Wallet" },
    { slug: "walletconnect", name: "WalletConnect" },
    { slug: "ledger", name: "Ledger Live" },
    { slug: "trust", name: "Trust" },
];

export const ConnectModal: React.FC = () => {
    const { closeConnectModal } = useConnectModalContext();

    const connectModalRef = useRef<HTMLDialogElement | null>(null);

    const [{ termsAccepted, privacyPolicy, termsOfUse }, setState] = useReducerAsState({
        termsAccepted: false,
        privacyPolicy: "https://app.gprptest.net/privacy_policy.pdf",
        termsOfUse: "https://app.gprptest.net/terms_of_use.pdf",
    });

    useLayoutEffect(() => {
        if (!window.location.host.includes("localhost")) {
            setState({
                privacyPolicy: `https://${window.location.host}/privacy_policy.pdf`,
                termsOfUse: `https://${window.location.host}/terms_of_use.pdf`,
            });
        }
    }, [setState]);

    useEffect(() => {
        setState({ termsAccepted: localStorage.getItem("termsAccepted") == "true" });
    }, []);

    const handleToogle = () => {
        setState(({ termsAccepted }) => {
            localStorage.setItem("termsAccepted", !termsAccepted ? "true" : "false");
            return { termsAccepted: !termsAccepted };
        });
    };

    return (
        <Dialog
            onClose={() => closeConnectModal(connectModalRef)}
            animationOnOpen={true}
            closeOnClickOutside={true}
            outerRef={connectModalRef}
        >
            <Title>{"CONNECT WALLET"}</Title>

            <Content tw="flex flex-col px-0">
                <div tw="flex flex-row gap-4 border-solid pb-5 border-[var(--border-color)] px-[1.625rem]">
                    <Checkbox isChecked={termsAccepted} onToggle={handleToogle} />{" "}
                    <Description>
                        I have read, understood, and agreed to the{" "}
                        <TermsLink href={termsOfUse} target="_blank">
                            Terms of Use
                        </TermsLink>{" "}
                        and{" "}
                        <TermsLink href={privacyPolicy} target="_blank">
                            Privacy Policy
                        </TermsLink>
                        .
                    </Description>
                </div>

                <div tw="h-px w-full bg-[var(--border-color)]"></div>

                <div tw="flex flex-col">
                    {wallets.map((wallet) => (
                        <WalletButton.Custom wallet={wallet.slug} key={wallet.slug}>
                            {({ ready, connect, connector }) => {
                                const disabled = !ready || !termsAccepted;
                                return (
                                    <WalletButtonContainer disabled={disabled} onClick={connect}>
                                        <ImageWrapper disabled={disabled}>
                                            <AsyncImage
                                                src={connector.iconUrl}
                                                alt={wallet.slug}
                                                tw="w-[28px] h-[28px]"
                                            />
                                        </ImageWrapper>

                                        <div tw="text-18-20">{wallet.name}</div>
                                    </WalletButtonContainer>
                                );
                            }}
                        </WalletButton.Custom>
                    ))}
                </div>
            </Content>
        </Dialog>
    );
};

const Dialog = styled(Modal)`
    ${tw`overflow-visible !max-w-[26.9375rem] pt-[1.375rem]`}
    ${tw`!min-w-[21.5625rem]`}
`;

const Title = tw.header`flex items-center border-b border-solid text-18-20 pb-[1.375rem] px-[1.625rem] border-[var(--border-color)]`;
const Content = tw.div`flex flex-col pt-[1.375rem] px-[1.625rem]`;

const WalletButtonContainer = styled(Button)`
    ${tw`flex items-center justify-start gap-2 border-x-0 border-solid normal-case border-[var(--bg-color)] bg-[var(--bg-color)] hover:(border-x-0 border-solid border-[var(--accent)])`}
    ${tw`!px-[1.625rem]`}
    ${tw`!py-[0.75rem]`}
    ${tw`disabled:(cursor-default text-[var(--light-black-color-50)])`}    
    ${tw`disabled:hover:(cursor-default border-x-0 border-solid text-[var(--light-black-color-50)] border-[var(--bg-color)])`}
`;

const ImageWrapper = styled.div<{ disabled: boolean }>`
    ${tw`border border-2 border-solid border-[var(--border-color)]`}
    ${(props) => props.disabled && tw`opacity-50`}
    ${(props) => props.disabled && `filter: grayscale(100%);`}
`;

const Description = tw.span`text-16-18`;
const TermsLink = styled.a`
    all: unset;
    ${tw`cursor-pointer underline text-[var(--accent)]`}
`;
