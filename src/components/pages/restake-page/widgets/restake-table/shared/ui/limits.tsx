import React from "react";
import tw, { css } from "twin.macro";

import { CollateralType } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { usdNumberFormatter } from "@/components/shared/lib/format-currency";
import { CircleProgress } from "@/components/shared/ui/circle-progress-bar";

import { BottomText, TextsContainer, TopText } from ".";

type Props = {
    collateral: CollateralType;
};

export const Limits: React.FC<Props> = ({ collateral }) => {
    const {
        browserData: { totalSupplyFloat, limitFloat, supplyPercent },
    } = collateral;

    const remaining = usdNumberFormatter.format(100 - supplyPercent);

    return (
        <div tw="flex flex-nowrap items-center gap-3.5">
            <CircleProgress progress={supplyPercent} diameter={32} strokeWidth={3.7} />
            <TextsContainer>
                <TopText
                    css={css`
                        @media (max-width: 499px) {
                            ${tw`flex flex-col items-start gap-1`}
                        }
                    `}
                >
                    <span>
                        {usdNumberFormatter.format(totalSupplyFloat)}
                        <span
                            css={css`
                                display: none;
                                @media (max-width: 499px) {
                                    display: inline;
                                }
                            `}
                        >
                            {" "}
                            /
                        </span>
                    </span>

                    <span
                        css={css`
                            display: none;
                            color: var(--light-black-color-50);
                            @media (min-width: 500px) {
                                display: inline;
                            }
                        `}
                    >
                        |
                    </span>

                    <span tw="text-[var(--light-black-color-50)]">
                        {usdNumberFormatter.format(limitFloat)}
                    </span>
                </TopText>
                <BottomText tw="whitespace-normal">
                    {Number(remaining) === 0 ? 0 : Number(remaining) < 0.01 ? "< 0.01" : remaining}%
                    remaining
                </BottomText>
            </TextsContainer>
        </div>
    );
};
