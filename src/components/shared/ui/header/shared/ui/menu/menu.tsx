import React, { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import tw, { css, styled } from "twin.macro";

import CrossIcon from "@/components/shared/assets/icons/cross.svg?react";
import Logo from "@/components/shared/assets/icons/long-logo.svg?react";
import { useReducerAsState } from "@/components/shared/hooks/user-reducer-as-state";

import { items, social } from "./consts";

type Props = {
    outerRef?: MutableRefObject<HTMLDialogElement | null>;
    crossRef?: MutableRefObject<HTMLDivElement | null>;
    pages: {
        title: string;
        href: string;
        label: string;
    }[];
    onMenuClose: () => void;
};

export const Menu: React.FC<Props> = ({ outerRef, crossRef, pages, onMenuClose }) => {
    const [open, setOpen] = useState(false);

    const location = useLocation();

    const rendered = useRef(false);
    useEffect(() => {
        if (!rendered.current) {
            rendered.current = true;
            return;
        }
        onMenuClose();
    }, [location, onMenuClose]);

    const handleClickOutside = (event: Event) => {
        if (
            outerRef?.current &&
            !outerRef.current.contains(event?.target as Node) &&
            crossRef?.current &&
            !crossRef.current.contains(event?.target as Node)
        ) {
            onMenuClose();
        }
    };

    useEffect(() => {
        setOpen(true);

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [{ privacyPolicy, termsOfUse }, setState] = useReducerAsState({
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

    return (
        <Container ref={outerRef} open={open} className="desktop:modal">
            <Header css={hidden}>
                <LogoWrapper>
                    <Logo />
                </LogoWrapper>

                <Close onClick={onMenuClose}>
                    <CrossIcon />
                </Close>
            </Header>

            <Block css={hidden}>
                <BlockTitle>RESTAKING</BlockTitle>

                {pages.map(({ title, href, label }) => {
                    const isDelegate = title === "Delegate";
                    return (
                        <div key={href} tw="flex gap-[0.625rem]">
                            <LinkStyled
                                css={isDelegate && tw`cursor-not-allowed opacity-50`}
                                to={isDelegate ? "_blank" : href}
                                selected={location.pathname === href}
                            >
                                {title}
                            </LinkStyled>

                            {isDelegate && (
                                <ItemLabel>
                                    <LabelText>{label}</LabelText>
                                </ItemLabel>
                            )}
                        </div>
                    );
                })}
            </Block>

            <Block>
                <BlockTitle css={hidden}>COMPANY</BlockTitle>

                {items.map(({ name, link }) => (
                    <LinkStyled key={name} to={link}>
                        {name}
                    </LinkStyled>
                ))}

                {Array.from(
                    [
                        ["PRIVACY POLICY", privacyPolicy],
                        ["TERMS OF USE", termsOfUse],
                    ],
                    ([name, link]) => (
                        <SimpleLinkStyled key={name} href={link} target="_blank">
                            {name}
                        </SimpleLinkStyled>
                    ),
                )}
            </Block>

            <Media>
                <BlockTitle css={hidden}>LINKS</BlockTitle>

                <SocialList>
                    {social.map(({ Component, link }) => (
                        <a key={link} href={link} tw="transition-opacity hover:opacity-75">
                            <Component tw="cursor-pointer" />
                        </a>
                    ))}
                </SocialList>
            </Media>
        </Container>
    );
};

const hidden = css`
    @media (min-width: 776px) {
        display: none;
    }
`;

const Container = styled.dialog`
    ${tw`desktop:(absolute bottom-0 translate-y-full top-[unset])`}
    ${tw`desktop:(border-x border-y border-[var(--border-color)])`}
    ${tw`desktop:(h-fit bg-[rgba(25,25,25,1)] pb-[1.625rem])`}
    ${tw`fixed left-0 top-0`}
    ${tw`z-20 h-full w-full overflow-y-auto bg-black pb-[3.25rem]`}
`;

const Header = tw.div`sticky top-0 grid border-b border-solid bg-black border-[var(--border-color)] grid-cols-[1fr,auto]`;
const LogoWrapper = tw.div`border-r border-solid p-[1.875rem] border-[var(--border-color)] h-[4.375rem]`;
const Close = tw.div`flex cursor-pointer items-center justify-center py-7 px-[1.625rem] w-[4.375rem] h-[4.375rem]`;

const Block = tw.ul`grid border-b border-solid pb-7 pt-[1.875rem] px-[1.625rem] gap-[1.625rem] border-[var(--border-color)]`;
const BlockTitle = tw.span`text-14-16 leading-4 text-[var(--light-black-color-50)]`;

const LinkStyled = styled(Link)<{ selected?: boolean }>`
    ${tw`flex items-center uppercase leading-6 transition-opacity text-[1.25rem] text-[var(--light-black-color-50)] hover:opacity-75`}
    ${({ selected }) =>
        selected
            ? css`
                  color: white;
              `
            : ""}
`;
const SimpleLinkStyled = styled.a<{ selected?: boolean }>`
    ${tw`flex items-center uppercase leading-6 transition-opacity text-[1.25rem] text-[var(--light-black-color-50)] hover:opacity-75`}
    ${({ selected }) =>
        selected
            ? css`
                  color: white;
              `
            : ""}
`;

const Media = tw.div`grid gap-9 px-7 pt-8`;
const SocialList = tw.div`flex items-center gap-[1.375rem]`;

const ItemLabel = tw.div`flex w-fit items-center justify-center py-1 h-[1.375rem] px-[0.375rem] bg-[var(--light-black-color-20)] rounded-[2.5rem]`;
const LabelText = tw.span`whitespace-nowrap text-[0.75rem] leading-[0.875rem] text-[var(--light-black-color-50)]`;
