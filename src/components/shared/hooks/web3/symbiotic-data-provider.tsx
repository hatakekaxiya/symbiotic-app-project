import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import React, { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { Abi, Address } from "viem";
import {
    useAccount,
    useConfig,
    useReadContract,
    UseReadContractReturnType,
    useReadContracts,
    UseReadContractsReturnType,
} from "wagmi";

import { AppProps } from "@/_app.tsx";
import ICollateral from "@/components/shared/assets/abi/IDefaultCollateral.json";
import IWstETH from "@/components/shared/assets/abi/IWstETH.json";
import { assetToFloat } from "@/components/shared/lib/utils";

const ICollateralAbi = ICollateral as Abi;
const IWstETHAbi = IWstETH as Abi;

const wstETHAddresses: {
    [key: number]: {
        [key: Address]: Address;
    };
} = {
    // mainnet
    1: {
        // wstETH -> stEth
        "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0": "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    },
    // holesky
    17000: {
        // wstETH -> stEth
        "0x8d09a4502cc8cf1547ad300e066060d043f6982d": "0x3f1c547b21f65e10480de3ad8e19faac46c95034",
    },
};

export type CollateralType = UnknownCollateralType | GenericCollateralType | WSTEthCollateralType;

export const emptyBrowserData = () => ({
    filled: false,

    points: 0,
    allowance: BigNumber(0),

    totalSupply: BigNumber(0),
    totalSupplyFloat: 0,
    totalSupplyUsd: BigNumber(0),
    totalSupplyUsdFloat: 0,

    balanceOf: BigNumber(0),
    balanceOfFloat: 0,
    balanceOfUsd: BigNumber(0),
    balanceOfUsdFloat: 0,

    deposit: BigNumber(0),
    depositFloat: 0,
    depositUsd: BigNumber(0),
    depositUsdFloat: 0,

    limit: BigNumber(0),
    limitFloat: 0,
    limitUsd: BigNumber(0),
    limitUsdFloat: 0,

    supplyPercent: 0,
    hasDeposit: false,
    hasPoints: false,
});
export type CollateralBrowserData = ReturnType<typeof emptyBrowserData>;

export type ServerCollateral = {
    usdPrice: number;
    assetDecimals: number;
    address: Address;
    assetAddress: Address;
    name: string;
    symbol: string;
    description: string;
    descriptionFull: string;
    pointsEnabled: boolean;
};

export type UnknownCollateralType = ServerCollateral & {
    type: "unknown";
    browserData: CollateralBrowserData;
};

export type GenericCollateralType = Omit<UnknownCollateralType, "type"> & {
    type: "generic";
};

export type WSTEthCollateralType = Omit<GenericCollateralType, "type"> & {
    type: "wstEth";
    wstEthData?: {
        stEthAddress: Address;
        balanceOfStEth: BigNumber;
        allowanceOfStEth: BigNumber;
        balanceOfWStEth: BigNumber;
    };
};

export type SymbioticData = {
    collaterals: CollateralType[];
};
export type SymbioticServerData = {
    collaterals: ServerCollateral[];
};

export type PointsData = {
    totalPoints: number;
    byCollateral: { collateralAddress: string; points: number }[];
};

const SymbioticDataContext = createContext<SymbioticData>({ collaterals: [] });

export const useSymbioticData = () => useContext(SymbioticDataContext);

export const useMemoizeBigNumberContractRead = (contractRead: UseReadContractReturnType) => {
    return useMemo(
        () =>
            (typeof contractRead.data !== "undefined"
                ? BigNumber((contractRead.data as bigint).toString(10))
                : undefined) as BigNumber | undefined,
        [contractRead.data],
    );
};
export const useMemoizeBigNumberContractsRead = (contractsRead: UseReadContractsReturnType) => {
    return useMemo(
        () =>
            (typeof contractsRead.data !== "undefined"
                ? contractsRead.data.map(({ result }) =>
                      typeof result !== "undefined"
                          ? BigNumber((result as bigint).toString(10))
                          : undefined,
                  )
                : []) as BigNumber[] | undefined[],
        [contractsRead.data],
    );
};

export const SymbioticDataProvider: React.FC<{ appProps: AppProps } & PropsWithChildren> = ({
    children,
    appProps,
}) => {
    const { symbioticData: value } = appProps;
    const { chains } = useConfig();
    const { address } = useAccount();
    const chainId = chains[0].id;

    // Fetch points from the backend
    const { data: pointsData } = useQuery<PointsData>({
        queryKey: ["points", address],
        queryFn: () =>
            fetch(`${Symbiotic.SYMBIOTIC_API_URL}/api/v1/points/${address}`).then((res) =>
                res.json(),
            ),
        refetchInterval: 1000 * 60,
        retry: true,
        retryDelay: 1000 * 5,
        enabled: Boolean(address),
    });

    const collateralsWithTypes: CollateralType[] = useMemo(() => {
        return value.collaterals
            .sort((a, b) => a.symbol.localeCompare(b.symbol))
            .map((collateral) => {
                if (!chainId) {
                    return { ...collateral, type: "unknown", browserData: emptyBrowserData() };
                }
                const wstEthAddress = (wstETHAddresses[chainId] || {})[
                    collateral.assetAddress.toLowerCase() as Address
                ];
                if (wstEthAddress) {
                    return { ...collateral, type: "wstEth", browserData: emptyBrowserData() };
                }
                return { ...collateral, type: "generic", browserData: emptyBrowserData() };
            });
    }, [value, chainId]);

    const readyForOnChain = useMemo(() => {
        return Boolean(collateralsWithTypes.length) && Boolean(chainId);
    }, [chainId, collateralsWithTypes]);

    const onChainDataGeneral = useMemoizeBigNumberContractsRead(
        useReadContracts({
            query: {
                enabled: readyForOnChain,
            },
            contracts: collateralsWithTypes.flatMap((collateral) => [
                {
                    address: collateral.address,
                    abi: ICollateralAbi,
                    functionName: "totalSupply",
                    chainId: chainId,
                },
                {
                    address: collateral.address,
                    abi: ICollateralAbi,
                    functionName: "limit",
                    chainId: chainId,
                },
            ]),
        }),
    );

    const wstEthAddress = useMemo(() => {
        return collateralsWithTypes.find((collateral) => collateral?.type === "wstEth")
            ?.assetAddress as Address;
    }, [collateralsWithTypes]);

    const stEthAddress = useMemo(() => {
        return (
            chainId ? wstETHAddresses[chainId][wstEthAddress?.toLowerCase() as Address] : undefined
        ) as Address;
    }, [wstEthAddress, chainId]);

    const perCollateralOnChainData = useMemoizeBigNumberContractsRead(
        useReadContracts({
            query: {
                enabled: address && stEthAddress && readyForOnChain,
            },
            contracts: [
                ...collateralsWithTypes.flatMap((collateral) => [
                    {
                        address: collateral.address,
                        abi: ICollateralAbi,
                        functionName: "balanceOf",
                        args: [address],
                        chainId: chainId,
                    },
                    {
                        address: collateral.assetAddress,
                        abi: ICollateralAbi,
                        functionName: "balanceOf",
                        args: [address],
                        chainId: chainId,
                    },
                    {
                        address: collateral.assetAddress,
                        abi: ICollateralAbi,
                        functionName: "allowance",
                        args: [address, collateral.address],
                        chainId: chainId,
                    },
                ]),
                ...[
                    {
                        address: stEthAddress,
                        abi: ICollateralAbi,
                        functionName: "balanceOf",
                        args: [address],
                        chainId: chainId,
                    },
                    {
                        address: stEthAddress,
                        abi: ICollateralAbi,
                        functionName: "allowance",
                        args: [address, wstEthAddress],
                        chainId: chainId,
                    },
                ],
            ],
        }),
    );

    const stBalanceOfInWstEth = useMemoizeBigNumberContractRead(
        useReadContract({
            query: {
                enabled:
                    Boolean(perCollateralOnChainData.length) &&
                    Boolean(!perCollateralOnChainData.some((data) => typeof data == "undefined")) &&
                    wstEthAddress &&
                    Boolean(chainId),
            },
            address: wstEthAddress,
            abi: IWstETHAbi,
            functionName: "getWstETHByStETH",
            args: [perCollateralOnChainData[perCollateralOnChainData.length - 2]],
            chainId: chainId,
        }),
    );

    const symbioticData = useMemo(() => {
        const collaterals = collateralsWithTypes.map((collateral, index) => {
            const totalSupply = onChainDataGeneral[index * 2];
            const limit = onChainDataGeneral[index * 2 + 1];
            const deposit = address ? perCollateralOnChainData[index * 3] : BigNumber(0);
            const balanceOf = address ? perCollateralOnChainData[index * 3 + 1] : BigNumber(0);
            const allowance = address ? perCollateralOnChainData[index * 3 + 2] : BigNumber(0);
            const points =
                pointsData?.byCollateral.find((it) => it.collateralAddress === collateral.address)
                    ?.points || 0;

            if (!totalSupply || !limit || !deposit || !balanceOf || !allowance) {
                return {
                    ...collateral,
                    browserData: emptyBrowserData(),
                };
            }

            if (collateral?.type !== "unknown") {
                const totalSupplyUsdFloat = assetToFloat(
                    totalSupply.multipliedBy(collateral.usdPrice),
                    collateral.assetDecimals,
                );
                const limitUsdFloat = assetToFloat(
                    limit.multipliedBy(collateral.usdPrice),
                    collateral.assetDecimals,
                );

                const general = {
                    ...collateral,
                    browserData: {
                        filled: true,
                        points,
                        hasPoints: true,

                        totalSupply: totalSupply,
                        totalSupplyFloat: assetToFloat(totalSupply, collateral.assetDecimals),
                        totalSupplyUsd: totalSupply.multipliedBy(collateral.usdPrice),
                        totalSupplyUsdFloat: totalSupplyUsdFloat,

                        limit: limit,
                        limitFloat: assetToFloat(limit, collateral.assetDecimals),
                        limitUsd: limit.multipliedBy(collateral.usdPrice),
                        limitUsdFloat: limitUsdFloat,

                        supplyPercent:
                            limitUsdFloat === 0 ? 100 : (totalSupplyUsdFloat / limitUsdFloat) * 100,

                        allowance: allowance,

                        balanceOf: balanceOf,
                        balanceOfFloat: assetToFloat(balanceOf, collateral.assetDecimals),
                        balanceOfUsd: balanceOf.multipliedBy(collateral.usdPrice),
                        balanceOfUsdFloat: assetToFloat(
                            balanceOf.multipliedBy(collateral.usdPrice),
                            collateral.assetDecimals,
                        ),

                        deposit: deposit,
                        depositFloat: assetToFloat(deposit, collateral.assetDecimals),
                        depositUsd: deposit.multipliedBy(collateral.usdPrice),
                        depositUsdFloat: assetToFloat(
                            deposit.multipliedBy(collateral.usdPrice),
                            collateral.assetDecimals,
                        ),

                        hasDeposit: deposit.gt(BigNumber(0)),
                    },
                } as CollateralType;

                if (collateral?.type === "wstEth") {
                    return {
                        ...general,
                        wstEthData: {
                            ...collateral.wstEthData,
                            stEthAddress: (wstETHAddresses[chainId] || {})[
                                collateral.assetAddress.toLowerCase() as Address
                            ],
                            balanceOfStEth:
                                perCollateralOnChainData[perCollateralOnChainData.length - 2] ||
                                BigNumber(0),
                            allowanceOfStEth:
                                perCollateralOnChainData[perCollateralOnChainData.length - 1] ||
                                BigNumber(0),
                            balanceOfWStEth: stBalanceOfInWstEth || BigNumber(0),
                        },
                    } as CollateralType;
                }
                return general;
            }

            return collateral;
        });

        if (collaterals.some((it) => !it.browserData.filled)) {
            return { collaterals: [] };
        }

        collaterals.sort((a, b) => {
            if (a.browserData.totalSupplyUsdFloat === b.browserData.totalSupplyUsdFloat) {
                return a.symbol.localeCompare(b.symbol);
            }

            return b.browserData.totalSupplyUsdFloat - a.browserData.totalSupplyUsdFloat;
        });
        return { collaterals };
    }, [
        chainId,
        pointsData,
        onChainDataGeneral,
        address,
        perCollateralOnChainData,
        collateralsWithTypes,
        stBalanceOfInWstEth,
    ]);

    return (
        <SymbioticDataContext.Provider value={symbioticData}>
            {children}
        </SymbioticDataContext.Provider>
    );
};
