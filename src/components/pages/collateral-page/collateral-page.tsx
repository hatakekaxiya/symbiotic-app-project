import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tw from "twin.macro";

import { ErrorComponent } from "@/_error.tsx";
import {
    CollateralType,
    useSymbioticData,
} from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { NavigationLink } from "@/components/shared/ui/navigation-link";
import { SelectTransaction } from "@/components/widgets/select-transaction";

import { GetStarted } from "../root/widgets/get-started";
import { CollateralInfo } from "./shared/ui/collateral";
import { Description } from "./shared/ui/description";
import { Details } from "./shared/ui/details";
import { Points } from "./shared/ui/points";

export const CollateralPage: React.FC = () => {
    const { collaterals } = useSymbioticData();
    const { collateral: collateralSymbol } = useParams();

    const [collateral, setCollateral] = useState<CollateralType | undefined>(undefined);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const collateral_ = collaterals.find(
            (item) => item.symbol.toLocaleLowerCase() === collateralSymbol,
        );

        if (collateral_) {
            setCollateral(collateral_);
            return;
        }

        if (collaterals?.length && collateralSymbol) {
            setNotFound(true);
        }
    }, [collaterals, collateralSymbol]);

    return (
        <>
            {collateral ? (
                <Root>
                    <GetStarted />
                    <div tw="w-full">
                        <NavigationLink
                            title="RESTAKE"
                            link="/restake"
                            tw="mb-10 block mobile:(mb-6 mt-2)"
                        />

                        <MobileContainer>
                            <CollateralInfo collateral={collateral} />
                            <Details collateral={collateral} />
                            <SelectTransaction collateral={collateral} />
                            <Points collateral={collateral} />
                            <Description text={collateral.descriptionFull} />
                        </MobileContainer>

                        <DesktopContainer>
                            <DesktopColumn>
                                <CollateralInfo collateral={collateral} />
                                <Details collateral={collateral} />
                                <Description text={collateral.descriptionFull} />
                            </DesktopColumn>

                            <DesktopColumn>
                                <Points collateral={collateral} />
                                <SelectTransaction collateral={collateral} />
                            </DesktopColumn>
                        </DesktopContainer>
                    </div>
                </Root>
            ) : (
                notFound && <ErrorComponent />
            )}
        </>
    );
};

const Root = tw.div`flex flex-col items-start gap-10`;
const MobileContainer = tw.section`grid gap-[1.375rem] xl:hidden`;
const DesktopContainer = tw.section`hidden gap-[1.375rem] xl:(grid grid-cols-[1fr,1.4fr])`;
const DesktopColumn = tw.div`flex flex-col gap-[1.375rem]`;
