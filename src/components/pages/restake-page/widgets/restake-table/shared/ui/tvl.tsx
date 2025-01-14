import "twin.macro";

import React from "react";

import { tokenNumberFormatter, usdNumberFormatter } from "@/components/shared/lib/format-currency";
import { Label } from "@/components/shared/ui/label";

import { BottomText, TextsContainer, TopText } from ".";

type Props = {
    dollars: number;
    crypto: number;
    collateral: string;
};

export const Tvl: React.FC<Props> = ({ dollars, crypto, collateral }) => {
    return (
        <TextsContainer tw="mobile:items-end">
            <TopText tw="!text-20-24">
                <Label tw="xl:hidden">TVL</Label>
                {`$${usdNumberFormatter.format(dollars)}`}
            </TopText>
            <BottomText tw="whitespace-normal">{`${tokenNumberFormatter.format(crypto)} ${collateral}`}</BottomText>
        </TextsContainer>
    );
};
