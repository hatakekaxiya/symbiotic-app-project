import BigNumber from "bignumber.js";
import React, { MouseEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import tw, { styled } from "twin.macro";

import {
    CollateralType,
    useSymbioticData,
} from "@/components/shared/hooks/web3/symbiotic-data-provider";

import { Actions } from "./actions";
import { Collateral } from "./collateral";
import { Deposited } from "./deposited";
import { Earnings } from "./earnings";
import { Tvl } from "./tvl";

type Props = {
    onDeposit: (e: MouseEvent<HTMLDivElement>, collateral: CollateralType) => void;
    onWithdraw: (e: MouseEvent<HTMLDivElement>, collateral: CollateralType) => void;
};

export const MobileTable: React.FC<Props> = ({ onDeposit, onWithdraw }) => {
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
        <Container>
            {filtered.map((collateral) => {
                const { address, description, symbol, browserData } = collateral;

                const {
                    totalSupplyFloat,
                    totalSupplyUsdFloat,
                    hasDeposit,
                    depositUsdFloat,
                    depositFloat,
                    hasPoints,
                    points,
                } = browserData;

                return (
                    <Block
                        key={address}
                        onClick={() => navigate(`/restake/${symbol.toLocaleLowerCase()}`)}
                    >
                        <BlockHeader>
                            <Collateral collateral={symbol} collateralDescription={description} />

                            <Tvl
                                dollars={totalSupplyUsdFloat}
                                crypto={totalSupplyFloat}
                                collateral={symbol}
                            />
                        </BlockHeader>

                        <Row>
                            <Unit>
                                <UnitTitle>Deposited</UnitTitle>
                                <Deposited
                                    hasData={hasDeposit}
                                    collateral={symbol}
                                    deposited={{
                                        dollars: depositUsdFloat,
                                        crypto: depositFloat,
                                    }}
                                />
                            </Unit>

                            <Unit tw="border-x">
                                <UnitTitle>Points</UnitTitle>
                                <Earnings
                                    hasData={hasPoints}
                                    deposited={{
                                        earnings: points,
                                        earningsLast: 0,
                                    }}
                                    tw="h-full"
                                />
                            </Unit>

                            <Unit tw="items-start justify-center">
                                <UnitTitle>Actions</UnitTitle>
                                <Actions
                                    onDeposit={onDeposit}
                                    onWithdraw={onWithdraw}
                                    collateral={collateral}
                                />
                            </Unit>
                        </Row>
                    </Block>
                );
            })}
        </Container>
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

const Row = tw.div`grid grid-cols-3`;
const Unit = tw.div`flex flex-col gap-2 border-solid pt-3 pb-[0.875rem] px-[1.125rem] border-[var(--border-color)]`;
const UnitTitle = tw.span`text-12-14 text-[var(--light-black-color-50)]`;
