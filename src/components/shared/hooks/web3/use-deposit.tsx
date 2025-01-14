import * as Sentry from "@sentry/react";
import { Abi } from "abitype";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAccount, useReadContract } from "wagmi";

import IDefaultCollateral from "@/components/shared/assets/abi/IDefaultCollateral.json";
import IWstETH from "@/components/shared/assets/abi/IWstETH.json";
import { useForceUpdate } from "@/components/shared/hooks/use-force-update";
import { useReducerAsState } from "@/components/shared/hooks/user-reducer-as-state";
import {
    CollateralType,
    useMemoizeBigNumberContractRead,
} from "@/components/shared/hooks/web3/symbiotic-data-provider";
import {
    ContractState,
    initContractState,
    useWriteContractWrapper,
} from "@/components/shared/hooks/web3/use-web3-tools";

const IDefaultCollateralAbi = IDefaultCollateral as Abi;
const IWstETHAbi = IWstETH as Abi;

export const useDeposit = (collateral: CollateralType, amount: BigNumber) => {
    const { address } = useAccount();
    const forceUpdate = useForceUpdate();

    const [
        {
            approveContractState,
            depositContractState,
            approveStETHContractState,
            wrapStETHContractState,
        },
        setState,
    ] = useReducerAsState<{
        approveContractState: ContractState;
        depositContractState: ContractState;
        wrapStETHContractState: ContractState;
        approveStETHContractState: ContractState;
    }>({
        approveContractState: initContractState(),
        depositContractState: initContractState(),
        wrapStETHContractState: initContractState(),
        approveStETHContractState: initContractState(),
    });

    const browserDataRef = useRef(collateral.browserData);
    const browserData = browserDataRef.current;

    let wstEthAmountToGetAfterWrap = amount.minus(browserData.balanceOf || BigNumber(0));

    const needToWrapSTEth =
        collateral?.type === "wstEth" && wstEthAmountToGetAfterWrap.gt(BigNumber(0));

    // Dirty hack to prevent rebase rounding error
    if (needToWrapSTEth) {
        wstEthAmountToGetAfterWrap = wstEthAmountToGetAfterWrap.plus(1);
    }

    const resolves = useRef<((value: unknown) => void)[]>([]);

    const stEthAmountToWrap = useMemoizeBigNumberContractRead(
        useReadContract({
            query: { enabled: needToWrapSTEth },
            address: collateral.assetAddress,
            abi: IWstETHAbi,
            functionName: "getStETHByWstETH",
            args: [wstEthAmountToGetAfterWrap],
        }),
    );
    const correctedStEthAmountToWrap = useMemo(
        () => (typeof stEthAmountToWrap !== "undefined" ? stEthAmountToWrap : undefined),
        [stEthAmountToWrap],
    );

    useEffect(() => {
        if (typeof correctedStEthAmountToWrap !== "undefined" && resolves.current.length) {
            resolves.current.forEach((it) => it(undefined));
            resolves.current = [];
        }
    }, [correctedStEthAmountToWrap]);

    const needToApproveSTEth =
        needToWrapSTEth &&
        (collateral.wstEthData?.allowanceOfStEth || BigNumber(0)).lt(
            correctedStEthAmountToWrap || BigNumber(0),
        );

    const needToApproveAsset = useMemo(
        () => BigNumber(amount).gt((browserData.allowance || BigNumber(0)).toString(10)),
        [collateral, amount],
    );

    // Wrap STEth
    const doWrapSTEth = useWriteContractWrapper(
        (state) => setState({ wrapStETHContractState: state }),
        {
            address: collateral.assetAddress,
            abi: IWstETHAbi,
            functionName: "wrap",
            args: [correctedStEthAmountToWrap?.toString(10) || ""],
        },
    );

    // Approve spend STEth
    const doApproveSTEth = useWriteContractWrapper(
        (state) => setState({ approveStETHContractState: state }),
        {
            address:
                collateral?.type === "wstEth" ? collateral.wstEthData?.stEthAddress || "0x" : "0x",
            abi: IDefaultCollateralAbi,
            functionName: "approve",
            args: [collateral.assetAddress, correctedStEthAmountToWrap?.toString(10) || ""],
        },
    );

    // Approve
    const doApprove = useWriteContractWrapper(
        (state) => setState({ approveContractState: state }),
        {
            address: collateral.assetAddress,
            abi: IDefaultCollateralAbi,
            functionName: "approve",
            args: [collateral.address, amount.toString(10)],
        },
    );

    // Deposit
    const doDeposit = useWriteContractWrapper(
        (state) => setState({ depositContractState: state }),
        {
            address: collateral.address,
            abi: IDefaultCollateralAbi,
            functionName: "deposit",
            args: [address, amount.toString(10)], // Assuming 18 decimals, adjust if needed
        },
    );

    const deposit2 = useCallback(async () => {
        try {
            if (needToApproveSTEth && !approveStETHContractState.success) {
                await doApproveSTEth();
            }
            if (needToWrapSTEth && !wrapStETHContractState.success) {
                await doWrapSTEth();
            }
            if (needToApproveAsset && !approveContractState.success) {
                await doApprove();
            }
            await doDeposit();
        } catch (e) {
            console.error(e);
            Sentry.captureException(e);
        }
    }, [
        doApprove,
        needToApproveAsset,
        doDeposit,
        doApproveSTEth,
        doWrapSTEth,
        needToApproveSTEth,
        needToWrapSTEth,
    ]);

    const depositOnNextUpdate = useRef(false);
    useEffect(() => {
        if (depositOnNextUpdate.current) {
            depositOnNextUpdate.current = false;
            deposit2();
        }
    });

    const deposit = useCallback(async () => {
        if (
            collateral?.type === "wstEth" &&
            needToWrapSTEth &&
            typeof correctedStEthAmountToWrap === "undefined"
        ) {
            await new Promise((resolve) => (resolves.current = [...resolves.current, resolve]));
            depositOnNextUpdate.current = true;
            forceUpdate();
        } else {
            deposit2();
        }
    }, [needToWrapSTEth, forceUpdate, collateral, correctedStEthAmountToWrap, deposit2]);

    return {
        deposit,
        isSTETHApproveApprovalPending: approveStETHContractState.approvalPending,
        isSTETHApproveTxnPending: approveStETHContractState.txnPending,
        isSTETHApproveSuccess: approveStETHContractState.success,
        isSTETHWrapApprovalPending: wrapStETHContractState.approvalPending,
        isSTHETHWrapTxnPending: wrapStETHContractState.txnPending,
        isSTETHWrapSuccess: wrapStETHContractState.success,
        isApproveApprovalPending: approveContractState.approvalPending,
        isApproveTxnPending: approveContractState.txnPending,
        approveSuccess: approveContractState.success,
        isDepositApprovalPending: depositContractState.approvalPending,
        isDepositTxnPending: depositContractState.txnPending,
        depositSuccess: depositContractState.success,
        depositError:
            approveStETHContractState.error ||
            wrapStETHContractState.error ||
            approveContractState.error ||
            depositContractState.error,
        needToApproveAsset,
        needToApproveSTEth,
        needToWrapSTEth,
    };
};
