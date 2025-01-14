import "twin.macro";

import React from "react";

import { collateralIcons } from "@/components/shared/assets/icons/collaterals";

import { BottomText, TextsContainer, TopText } from ".";

type Props = {
    collateral: string;
    collateralDescription: string;
};

export const Collateral: React.FC<Props> = ({ collateral, collateralDescription }) => {
    const Icon = collateralIcons[collateral];
    return (
        <div tw="flex flex-row items-center gap-4 overflow-hidden">
            {Icon ? (
                <Icon tw="shrink-0 w-[38px] h-[38px]" />
            ) : (
                <div tw="rounded-3xl bg-[var(--light-black-color-15)] h-[38px] w-[38px] flex-[0_0_38px]" />
            )}
            <TextsContainer>
                <TopText tw="!text-20-24">{collateral}</TopText>
                <BottomText tw="whitespace-normal">{collateralDescription}</BottomText>
            </TextsContainer>
        </div>
    );
};
