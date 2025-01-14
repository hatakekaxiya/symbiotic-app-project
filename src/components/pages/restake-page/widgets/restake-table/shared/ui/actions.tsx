import React, { MouseEvent } from "react";
import tw, { styled } from "twin.macro";
import { useAccount } from "wagmi";

import ActionDeposit from "@/components/shared/assets/icons/action-deposit.svg?react";
import ActionWithdraw from "@/components/shared/assets/icons/action-withdraw.svg?react";
import { CollateralType } from "@/components/shared/hooks/web3/symbiotic-data-provider";

type Props = {
    onDeposit: (e: MouseEvent<HTMLDivElement>, collateral: CollateralType) => void;
    onWithdraw: (e: MouseEvent<HTMLDivElement>, collateral: CollateralType) => void;
    collateral: CollateralType;
    className?: string;
};

export const Actions: React.FC<Props> = ({ onDeposit, onWithdraw, collateral, className }) => {
    const account = useAccount();
    const hasData = Boolean(account.address);

    return (
        <ActionsContainer $hasAccount={hasData} className={className}>
            <Action onClick={(e) => onDeposit(e, collateral)} tw="pr-1.5">
                <ActionDeposit width={32} height={32} css={selectedOnHover} />
            </Action>

            <Action onClick={(e) => onWithdraw(e, collateral)} tw="pl-1.5">
                <ActionWithdraw width={32} height={32} css={selectedOnHover} />
            </Action>
        </ActionsContainer>
    );
};

const ActionsContainer = styled.div<{ $hasAccount: boolean }>`
    ${tw`flex flex-row items-center justify-end desktop:pr-6`}
    ${({ $hasAccount }) => (!$hasAccount ? tw`opacity-30` : "")}
`;
const Action = tw.div`relative z-10 cursor-pointer h-[32px] w-[38px]`;

const selectedOnHover = tw`mobile:transition-colors hover:bg-[var(--light-black-color-10)]`;
