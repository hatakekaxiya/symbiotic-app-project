import React, { useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import tw, { css, styled } from "twin.macro";
import { useAccount } from "wagmi";

import BurgerMenuIcon from "@/components/shared/assets/icons/burger-menu.svg?react";
import CrossIcon from "@/components/shared/assets/icons/cross.svg?react";

import { useReducerAsState } from "../../hooks/user-reducer-as-state";
import Logo from "./assets/header-logo.svg?react";
import { Menu } from "./shared/ui/menu/menu";
import { WalletConnectButton } from "./wallet-connect-button";

const pages = [
    {
        title: "Dashboard",
        href: "/dashboard",
        label: "",
    },
    {
        title: "Restake",
        href: "/restake",
        label: "",
    },
    {
        title: "Delegate",
        href: "/delegate",
        label: "COMING SOON",
    },
];
export const Header: React.FC = () => {
    const { address } = useAccount();

    const [{ dropdownMenu }, setState] = useReducerAsState({
        dropdownMenu: false,
    });

    const menuRef = useRef<HTMLDialogElement | null>(null);
    const handleMenuToogle = useCallback(() => {
        if (menuRef.current) {
            menuRef.current.close();
            setTimeout(
                () => setState(({ dropdownMenu }) => ({ dropdownMenu: !dropdownMenu })),
                200,
            );
            return;
        }
        setState(({ dropdownMenu }) => ({ dropdownMenu: !dropdownMenu }));
    }, [setState]);

    const crossRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <HeaderRoot>
            <div tw="flex">
                <LogoWrapper onClick={() => navigate("/restake")}>
                    <Logo />
                </LogoWrapper>

                <PageList>
                    {pages.map(({ href, title }) => {
                        const isDelegate = title === "Delegate";
                        return (
                            <PageButton
                                key={title}
                                selected={location.pathname === href}
                                css={isDelegate && tw`cursor-not-allowed`}
                                onClick={() => {
                                    if (!isDelegate) {
                                        navigate(href);
                                    }
                                }}
                            >
                                {title}

                                {isDelegate && (
                                    <ItemLabel>
                                        <LabelText>SOON</LabelText>
                                    </ItemLabel>
                                )}
                            </PageButton>
                        );
                    })}
                </PageList>
            </div>

            <MenuWrapper $connected={Boolean(address)}>
                <WalletConnectButton />

                <Close onClick={handleMenuToogle} ref={crossRef}>
                    {dropdownMenu ? <CrossIcon /> : <BurgerMenuIcon />}
                </Close>

                {dropdownMenu && (
                    <Menu
                        outerRef={menuRef}
                        crossRef={crossRef}
                        pages={pages}
                        onMenuClose={handleMenuToogle}
                    />
                )}
            </MenuWrapper>
        </HeaderRoot>
    );
};

const HeaderRoot = styled.header`
    @media (min-width: 776px) {
        ${tw`flex justify-between`}
    }
    ${tw`grid w-full select-none border-b h-[4.5rem] border-[var(--light-gray-color-20)] grid-cols-[auto,1fr]`}
`;
const LogoWrapper = tw.div`flex h-full w-fit shrink-0 cursor-pointer items-center justify-center border-y border-r p-5 border-[var(--light-gray-color-20)] border-y-[transparent]`;
const PageList = styled.div`
    display: none;
    flex-shrink: 0;
    @media (min-width: 776px) {
        display: flex;
    }
`;
const PageButton = styled.div<{ selected: boolean }>`
    ${tw`flex cursor-pointer items-center justify-center border-r p-6 uppercase gap-[0.625rem] border-[var(--light-gray-color-20)] text-[var(--light-black-color-50)]`}
    ${tw`border-y border-y-[transparent]`}
    ${tw`hover:(text-[white] bg-[#FFFFFF26])`}
    ${({ selected }) =>
        selected
            ? css`
                  color: white;
                  border-bottom: 1px solid var(--accent);
              `
            : ""}
`;

const MenuWrapper = styled.div<{ $connected: boolean }>`
    ${tw`relative grid grid-cols-[1fr,auto]`}
`;

const Close = tw.div`flex cursor-pointer items-center justify-center py-7 px-[1.625rem] w-[4.375rem] h-[4.375rem]`;
const ItemLabel = tw.div`flex w-fit items-center justify-center py-1 opacity-50 h-[1.375rem] px-[0.375rem] bg-[var(--light-black-color-20)] rounded-[2.5rem]`;
const LabelText = tw.span`whitespace-nowrap text-[0.75rem] leading-[0.875rem] text-[var(--light-black-color-50)]`;
