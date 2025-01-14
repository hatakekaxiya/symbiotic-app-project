import * as Sentry from "@sentry/react";
import { Abi } from "abitype";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useAccount } from "wagmi";

import IDefaultCollateral from "@/components/shared/assets/abi/IDefaultCollateral.json";
import { useReducerAsState } from "@/components/shared/hooks/user-reducer-as-state";
import { CollateralType } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import {
    ContractState,
    initContractState,
    useWriteContractWrapper,
} from "@/components/shared/hooks/web3/use-web3-tools";

const IDefaultCollateralAbi = IDefaultCollateral as Abi;

export const useWithdraw = (collateral: CollateralType, amount: BigNumber) => {
    const { address } = useAccount();

    const [{ withdrawContractState }, setState] = useReducerAsState<{
        withdrawContractState: ContractState;
    }>({
        withdrawContractState: initContractState(),
    });

    // Approve
    const doWithdraw = useWriteContractWrapper(
        (state) => setState({ withdrawContractState: state }),
        {
            address: collateral.address,
            abi: IDefaultCollateralAbi,
            functionName: "withdraw",
            args: [address, amount.toString(10)],
        },
    );

    const withdraw = useCallback(async () => {
        try {
            await doWithdraw();
        } catch (e) {
            console.error(e);
            Sentry.captureException(e);
        }
    }, [doWithdraw]);

    return {
        withdraw,
        isWithdrawApprovalPending: withdrawContractState.approvalPending,
        isWithdrawTxnPending: withdrawContractState.txnPending,
        withdrawSuccess: withdrawContractState.success,
        withdrawError: withdrawContractState.error,
    };
};
