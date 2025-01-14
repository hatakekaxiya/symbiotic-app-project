import React from "react";
import tw from "twin.macro";

import { tokenNumberFormatter, usdNumberFormatter } from "@/components/shared/lib/format-currency";

import { BottomText, TextsContainer, TopText } from ".";

type Props = {
    hasData: boolean;
    collateral: string;
    deposited: {
        dollars: number;
        crypto: number;
    };
};

export const Deposited: React.FC<Props> = ({ hasData, collateral, deposited }) => {
    return (
        <TextsContainer>
            <TopText
                $noData={!hasData}
            >{`$${usdNumberFormatter.format(deposited.dollars)}`}</TopText>
            <BottomText>
                {hasData ? (
                    `${tokenNumberFormatter.format(deposited.crypto)} ${collateral}`
                ) : (
                    <NoData>-</NoData>
                )}
            </BottomText>
        </TextsContainer>
    );
};

const NoData = tw.span`text-[var(--light-black-color-50)]`;
