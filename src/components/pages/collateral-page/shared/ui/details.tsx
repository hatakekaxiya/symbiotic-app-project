import React from "react";
import tw from "twin.macro";

import { CollateralType } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { usdNumberFormatter } from "@/components/shared/lib/format-currency";
import { Card } from "@/components/shared/ui/card";

type Props = {
    collateral: CollateralType;
};

export const Details: React.FC<Props> = ({ collateral }) => {
    const {
        browserData: { totalSupplyUsdFloat, totalSupplyFloat, limitFloat, limitUsdFloat },
        symbol,
    } = collateral;
    return (
        <Card>
            <Header>
                <HeaderTitle>Details</HeaderTitle>
            </Header>

            <div tw="grid grid-cols-2 px-[1.625rem]">
                <Block tw="border-r border-solid border-[var(--border-color)]">
                    <BlockTitle>Value Locked</BlockTitle>
                    <Amount>
                        <Dollars>{`$${usdNumberFormatter.format(totalSupplyUsdFloat)}`}</Dollars>
                        <Crypto>{`${usdNumberFormatter.format(totalSupplyFloat)} ${symbol}`}</Crypto>
                    </Amount>
                </Block>

                <Block tw="pl-[1.625rem]">
                    <BlockTitle>Current Limit</BlockTitle>
                    <Amount>
                        <Dollars>{`$${usdNumberFormatter.format(limitUsdFloat)}`}</Dollars>
                        <Crypto>{`${usdNumberFormatter.format(limitFloat)} ${symbol}`}</Crypto>
                    </Amount>
                </Block>
            </div>
        </Card>
    );
};

const Header = tw.div`hidden border-b border-solid pb-4 px-[1.625rem] border-[var(--border-color)] py-[1.125rem] desktop:block`;
const HeaderTitle = tw.span`text-14-16 uppercase text-[--light-black-color-50]`;
const Block = tw.div`grid justify-items-start pt-6 pb-4 gap-[1.125rem]`;
const BlockTitle = tw(HeaderTitle)``;
const Amount = tw.div`grid justify-items-start gap-[0.625rem]`;
const Dollars = tw.span`text-22-26`;
const Crypto = tw(HeaderTitle)`normal-case`;
