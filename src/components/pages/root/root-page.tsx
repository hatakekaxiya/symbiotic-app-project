import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import tw from "twin.macro";

import { BondsTable } from "@/components/pages/root/widgets/bonds-table/bonds-table";
import { GetStarted } from "@/components/pages/root/widgets/get-started";
import { TotalDeposited } from "@/components/pages/root/widgets/total-deposited";
import { TotalPoints } from "@/components/pages/root/widgets/total-points";
import { useSymbioticData } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { Button } from "@/components/shared/ui/button";
import { SectionTitle } from "@/components/shared/ui/section-title";

export const RootPage: React.FC = () => {
    const navigate = useNavigate();
    const { collaterals } = useSymbioticData();

    const filtered = useMemo(
        () =>
            collaterals.filter(
                (item) =>
                    (item.browserData.deposit || BigNumber(0)).gt(0) ||
                    (item.browserData.points || 0) > 0,
            ),
        [collaterals],
    );

    return (
        <Root>
            <GetStarted />
            <SectionTitle title="Overview" subtitle="Your activity" />

            {/*<div tw="flex w-full justify-between gap-4">*/}
            {/*    <SectionTitle title="Overview" subtitle="Your activity" />*/}
            {/*    <Button>Claim rewards</Button>*/}
            {/*</div>*/}

            <CardsWrapper>
                <TotalDeposited />
                <TotalPoints />
            </CardsWrapper>

            <div tw="flex w-full justify-between gap-2">
                <SectionTitle title="COLLATERALS" subtitle="your positions" />
                <Button tw="desktop:hidden" onClick={() => navigate("/restake")}>
                    Restake
                </Button>
                {!filtered?.length && (
                    <Button tw="mobile:hidden" onClick={() => navigate("/restake")}>
                        Restake
                    </Button>
                )}
            </div>

            <BondsTable />
        </Root>
    );
};

const Root = tw.div`flex flex-col items-start gap-10 mobile:gap-6`;
const CardsWrapper = tw.div`flex w-full flex-row gap-10 mobile:(grid gap-4)`;
