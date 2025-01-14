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

export const DesktopTable: React.FC<Props> = ({ onDeposit, onWithdraw }) => {
    const { collaterals } = useSymbioticData();

    const navigate = useNavigate();

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
        <>
            <Table className="hidden xl:table">
                <thead>
                    <tr>
                        <TH>Collateral</TH>
                        <TH>TVL</TH>
                        <TH>Deposited</TH>
                        <TH>Points</TH>
                        <TH tw="text-end">Actions</TH>
                    </tr>
                </thead>

                <tbody>
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
                            <Row
                                key={address}
                                onClick={() => navigate(`/restake/${symbol.toLocaleLowerCase()}`)}
                            >
                                <td>
                                    <Collateral
                                        tw="pl-2"
                                        collateral={symbol}
                                        collateralDescription={description}
                                    />
                                </td>

                                <td>
                                    <Tvl
                                        dollars={totalSupplyUsdFloat}
                                        crypto={totalSupplyFloat}
                                        collateral={symbol}
                                    />
                                </td>

                                <td>
                                    <Deposited
                                        hasData={hasDeposit}
                                        collateral={symbol}
                                        deposited={{
                                            dollars: depositUsdFloat,
                                            crypto: depositFloat,
                                        }}
                                    />
                                </td>

                                <td>
                                    <Earnings
                                        hasData={hasPoints}
                                        deposited={{
                                            earnings: points,
                                            earningsLast: 0,
                                        }}
                                    />
                                </td>

                                <td>
                                    <Actions
                                        onDeposit={onDeposit}
                                        onWithdraw={onWithdraw}
                                        collateral={collateral}
                                    />
                                </td>
                            </Row>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );
};

const Table = styled.table`
    & *,
    &::after,
    &:before {
        border: 0;
    }

    border-collapse: separate;
    border-spacing: 0 0.75rem;
    ${tw`w-full [&_td]:py-[1.125rem]`}
`;
const TH = tw.th`text-14-16 uppercase text-[var(--light-black-color-50)]`;
const Row = styled.tr`
    ${tw`duration-300 transition-[outline]`}
    ${tw`relative table-row scale-100 cursor-pointer bg-[var(--light-black-color-05)]`}
    ${tw`outline outline-1 outline-[var(--light-black-color-15)] hover:(bg-[var(--light-black-color-10)] outline-[var(--light-black-color-25)])`}
`;
