import React, { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import tw, { css, styled } from "twin.macro";

import {
    CollateralType,
    useSymbioticData,
} from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { tokenNumberFormatter } from "@/components/shared/lib/format-currency";
import { Label } from "@/components/shared/ui/label";
import { Loader } from "@/components/shared/ui/loader";

import { TopText } from ".";
import { Actions } from "./actions";
import { Collateral } from "./collateral";
import { Limits } from "./limits";
import { Points } from "./points";
import { Tvl } from "./tvl";

type Props = {
    onDeposit: (e: MouseEvent<HTMLDivElement>, collateral: CollateralType) => void;
    onWithdraw: (e: MouseEvent<HTMLDivElement>, collateral: CollateralType) => void;
};

export const MobileTable: React.FC<Props> = ({ onDeposit, onWithdraw }) => {
    const { collaterals } = useSymbioticData();

    const navigate = useNavigate();

    return (
        <>
            {collaterals.length ? (
                <Container>
                    {collaterals.map((collateral) => {
                        const { address, description, pointsEnabled, symbol, browserData } =
                            collateral;

                        const { totalSupplyUsdFloat, totalSupplyFloat, depositFloat } = browserData;

                        return (
                            <Block
                                key={address}
                                onClick={() => navigate(`/restake/${symbol.toLocaleLowerCase()}`)}
                            >
                                <BlockHeader>
                                    <Collateral
                                        collateral={symbol}
                                        collateralDescription={description}
                                    />

                                    <Tvl
                                        dollars={totalSupplyUsdFloat}
                                        crypto={totalSupplyFloat}
                                        collateral={symbol}
                                    />
                                </BlockHeader>

                                <Row>
                                    <Unit
                                        tw="border-r border-b pr-0"
                                        css={css`
                                            @media (max-width: 380px) {
                                                ${tw`max-w-[13.5rem]`}
                                            }
                                        `}
                                    >
                                        <UnitTitle>Supply | Limit</UnitTitle>
                                        <Limits collateral={collateral} />
                                    </Unit>

                                    <Unit tw="border-b">
                                        <UnitTitle>Points</UnitTitle>
                                        <Points pointsEnabled={pointsEnabled} tw="h-full" />
                                    </Unit>
                                </Row>

                                <Row>
                                    <Unit tw="border-r">
                                        <div tw="flex flex-col gap-2">
                                            <UnitTitle>Position</UnitTitle>

                                            <div tw="flex items-center gap-2">
                                                <TopText tw="block overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {tokenNumberFormatter.format(depositFloat)}
                                                </TopText>
                                                <Label>{symbol}</Label>
                                            </div>
                                        </div>
                                    </Unit>
                                    <Unit>
                                        <UnitTitle>Actions</UnitTitle>
                                        <Actions
                                            onDeposit={onDeposit}
                                            onWithdraw={onWithdraw}
                                            collateral={collateral}
                                            tw="justify-start"
                                        />
                                    </Unit>
                                </Row>
                            </Block>
                        );
                    })}
                </Container>
            ) : (
                <Loader
                    progress={100 / 3}
                    strokeWidth={4}
                    diameter={64}
                    tw="absolute top-[calc(50vh - 32px)] left-[calc(50vw - 32px)]"
                />
            )}
        </>
    );
};

const Container = styled.section`
    --outer-border: var(--light-black-color-25);
    --inner-border: var(--border-color);
    ${tw`grid w-full cursor-pointer gap-[0.875rem] xl:hidden`}
`;

const Block = tw.article`grid border border-solid grid-rows-[repeat(3,auto)] bg-[var(--light-black-color-10)] border-[var(--outer-border)]`;
const BlockHeader = styled.header`
    ${tw`flex justify-between border-b border-solid p-5 gap-[2.625rem] border-[var(--inner-border)]`};
    @media (max-width: 400px) {
        gap: 0.5rem;
    }
`;

const Row = tw.div`grid grid-cols-[3fr,2fr]`;
const Unit = tw.div`flex flex-col gap-2 border-solid pt-3 pb-[0.875rem] px-[1.125rem] border-[var(--border-color)]`;
const UnitTitle = tw.span`text-12-14 text-[var(--light-black-color-50)]`;
