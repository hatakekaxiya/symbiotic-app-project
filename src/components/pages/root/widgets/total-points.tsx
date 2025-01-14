import React, { useMemo } from "react";
import tw from "twin.macro";
import { useAccount } from "wagmi";

import DesktopLogo from "@/components/shared/assets/icons/middle-logo-circle.svg?react";
import MobileLogo from "@/components/shared/assets/icons/small-logo-circle.svg?react";
import { useSymbioticData } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { pointsFormatter } from "@/components/shared/lib/format-currency";

export const TotalPoints: React.FC = () => {
    const { collaterals } = useSymbioticData();
    const { address } = useAccount();

    const points = useMemo(() => {
        if (collaterals.find((it) => !it.browserData)) return undefined;
        return collaterals.reduce(
            (acc, collateral) => acc + (collateral?.browserData.points || 0),
            0,
        );
    }, [collaterals]);
    const tokens = pointsFormatter.format(points || 0);
    // @ts-expect-error nonused
    const increment = 0; //(223.343).toFixed(0);

    return (
        <Root>
            <TextsWrapper>
                <TopText>Total Points</TopText>
                {address ? (
                    <Tokens>
                        <span>{tokens}</span>
                        <MobileLogo tw="desktop:hidden" />
                        <DesktopLogo tw="mobile:hidden" />
                    </Tokens>
                ) : (
                    <NoData>No data</NoData>
                )}
            </TextsWrapper>

            {/* <TextsWrapper tw="items-end justify-between">
                <TopText>Last week</TopText>
                {hasData ? <Increment>{`+${increment}`}</Increment> : <NoData>-</NoData>}
            </TextsWrapper> */}
        </Root>
    );
};

const Root = tw.div`flex w-full flex-row items-center justify-between gap-2 border px-[26px] py-[22px] bg-[var(--light-black-color-05)] border-[var(--light-black-color-20)] mobile:h-[6.75rem]`;
const TextsWrapper = tw.div`flex h-full flex-col items-start justify-between`;
const TopText = tw.div`whitespace-nowrap text-14-16 uppercase`;
const NoData = tw.span`text-24-30 text-[var(--light-black-color-20)]`;
const Tokens = tw.span`flex items-center text-34-40 gap-[0.625rem] mobile:text-24-30`;
// const Increment = tw.span`text-34-40 text-[var(--accent)] mobile:text-24-30`;
