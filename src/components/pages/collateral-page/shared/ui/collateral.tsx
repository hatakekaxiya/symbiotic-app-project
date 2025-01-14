import React, { useEffect, useState } from "react";
import tw from "twin.macro";

import { collateralIcons } from "@/components/shared/assets/icons/collaterals";
import { useCopyText } from "@/components/shared/hooks/use-copy-text";
import { CollateralType } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { ellipsisAddress } from "@/components/shared/lib/utils";
import { Card } from "@/components/shared/ui/card";
type Props = {
    collateral: CollateralType;
};

export const CollateralInfo: React.FC<Props> = ({ collateral }) => {
    const { copyText } = useCopyText({
        text: collateral.address,
        title: "Address is copied!",
        description: collateral.address,
    });

    const Icon = collateralIcons[collateral.symbol];

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth);
        });
    }, []);

    return (
        <Card tw="pb-3 pt-[1.625rem]">
            <Info>
                {Icon ? <Icon tw="w-[3.5rem] h-[3.5rem]" /> : <NoImage />}
                <div tw="grid gap-[0.375rem]">
                    <Collateral>{collateral.symbol}</Collateral>
                    <CollateralDescription>{collateral.description}</CollateralDescription>
                </div>
            </Info>

            <Address>
                <span tw="flex gap-[0.875rem]">
                    <AddressTitle>Address</AddressTitle>
                    <Account onClick={copyText}>
                        {windowWidth > 640
                            ? collateral.address
                            : windowWidth > 440
                              ? ellipsisAddress(collateral.address, 8, 8)
                              : ellipsisAddress(collateral.address, 4, 4)}
                    </Account>
                </span>

                <CopyAdress onClick={copyText}>COPY</CopyAdress>
            </Address>
        </Card>
    );
};

const Info = tw.article`flex items-center border-b border-solid px-5 pb-6 border-[var(--border-color)] gap-[1.125rem]`;
const Address = tw.div`flex w-full justify-between gap-2 px-5 pt-[0.875rem]`;
const AddressTitle = tw.span`text-16-18 text-[var(--light-black-color-50)]`;
const Account = tw.span`cursor-pointer text-16-18 transition-colors hover:text-[var(--accent)]`;
const CopyAdress = tw.span`cursor-pointer text-14-16 leading-4 transition-colors text-[var(--accent)] hover:text-[var(--accent-75)]`;

const NoImage = tw.div`rounded-full bg-[var(--light-black-color-25)] h-[3.5rem] w-[3.5rem]`;
const Collateral = tw.span`leading-8 text-[1.75rem]`;
const CollateralDescription = tw.span`text-16-18 text-[var(--light-black-color-50)]`;
