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
};

export const Actions: React.FC<Props> = ({ onDeposit, onWithdraw, collateral }) => {
    const account = useAccount();
    const hasData = Boolean(account.address);

    return (
        <ActionsContainer $hasAccount={hasData}>
            <Action onClick={(e) => onDeposit(e, collateral)}>
                <ActionDeposit width={32} height={32} />
            </Action>

            <Action onClick={(e) => onWithdraw(e, collateral)}>
                <ActionWithdraw width={32} height={32} />
            </Action>
        </ActionsContainer>
    );
};

const ActionsContainer = styled.div<{ $hasAccount: boolean }>`
    ${tw`flex flex-row items-center justify-end gap-3 desktop:pr-6`}
    ${({ $hasAccount }) => (!$hasAccount ? tw`opacity-30` : "")}
`;
const Action = tw.div`relative z-10 cursor-pointer h-[32px] w-[32px]`;
