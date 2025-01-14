import React, { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import tw, { styled } from "twin.macro";

import {
    CollateralType,
    useSymbioticData,
} from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { Loader } from "@/components/shared/ui/loader";

import { Actions } from "./actions";
import { Collateral } from "./collateral";
import { Limits } from "./limits";
import { Points } from "./points";
import { Tvl } from "./tvl";

type Props = {
    onDeposit: (e: MouseEvent<HTMLDivElement>, collateral: CollateralType) => void;
    onWithdraw: (e: MouseEvent<HTMLDivElement>, collateral: CollateralType) => void;
};

export const DesktopTable: React.FC<Props> = ({ onDeposit, onWithdraw }) => {
    const navigate = useNavigate();
    const { collaterals } = useSymbioticData();

    return (
        <>
            {collaterals.length !== 0 ? (
                <Table className="hidden xl:table">
                    <thead>
                        <tr>
                            <TH>Collateral</TH>
                            <TH>TVL</TH>
                            <TH>Supply | Limit</TH>
                            <TH>Points</TH>
                            <TH tw="text-end">Actions</TH>
                        </tr>
                    </thead>

                    <tbody>
                        {collaterals.map((collateral) => {
                            const { address, description, pointsEnabled, symbol, browserData } =
                                collateral;

                            const { totalSupplyUsdFloat, totalSupplyFloat } = browserData;

                            return (
                                <Row
                                    key={address}
                                    onClick={() =>
                                        navigate(`/restake/${symbol.toLocaleLowerCase()}`)
                                    }
                                >
                                    <td>
                                        <Collateral
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
                                        <Limits collateral={collateral} />
                                    </td>

                                    <td>
                                        <Points pointsEnabled={pointsEnabled} />
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

const Table = styled.table`
    border-collapse: separate;
    border-spacing: 0 0.75rem;
    ${tw`w-full [&_td]:py-[1.125rem]`}
`;
const TH = tw.th`pt-0 text-14-16 uppercase text-[var(--light-black-color-50)]`;
const Row = styled.tr`
    ${tw`duration-300 transition-[outline]`}
    ${tw`relative table-row scale-100 cursor-pointer bg-[var(--light-black-color-05)]`}
    ${tw`outline outline-1 outline-[var(--light-black-color-15)] hover:(bg-[var(--light-black-color-10)] outline-[var(--light-black-color-25)])`}
`;
