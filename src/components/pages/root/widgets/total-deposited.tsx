import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import tw from "twin.macro";
import { useAccount } from "wagmi";

import { useSymbioticData } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { usdNumberFormatter } from "@/components/shared/lib/format-currency";
import { assetToFloat } from "@/components/shared/lib/utils";

export const TotalDeposited: React.FC = () => {
    const { collaterals } = useSymbioticData();
    const { address } = useAccount();

    const hasData = useMemo(
        () => collaterals.some((item) => (item.browserData.deposit || BigNumber(0)).gt(0)),
        [collaterals],
    );

    const totalDeposited = useMemo(() => {
        if (!hasData) return 0;
        return collaterals.reduce((acc, collateral) => {
            const browserData = collateral.browserData;
            if (!browserData) {
                return acc;
            }

            const usdDeposited = browserData.deposit.multipliedBy(collateral.usdPrice);
            return acc + assetToFloat(usdDeposited, collateral.assetDecimals);
        }, 0);
    }, [collaterals, hasData]);

    return (
        <Root>
            <TextsWrapper>
                <TopText>Total deposited</TopText>
                {address ? (
                    <Dollars>{`$${usdNumberFormatter.format(totalDeposited)}`}</Dollars>
                ) : (
                    <NoData>No data</NoData>
                )}
            </TextsWrapper>
            {hasData && <Indicator />}
        </Root>
    );
};

const Root = tw.div`relative flex w-full flex-row items-center justify-between border px-[26px] py-[22px] bg-[var(--light-black-color-05)] border-[var(--light-black-color-20)] mobile:h-[6.75rem] desktop:h-[9.625rem]`;
const TextsWrapper = tw.div`flex h-full flex-col items-start justify-between`;
const TopText = tw.div`whitespace-nowrap text-14-16 uppercase`;
const NoData = tw.span`text-24-30 text-[var(--light-black-color-20)]`;
const Dollars = tw.span`text-34-40 text-[var(--accent)] mobile:text-24-30`;
const Indicator = tw.div`absolute top-3 right-[1.125rem] h-[0.375rem] w-[0.375rem] bg-[var(--accent)] mobile:hidden`;
