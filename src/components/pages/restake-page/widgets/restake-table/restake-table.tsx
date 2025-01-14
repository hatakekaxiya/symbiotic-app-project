import React, { MouseEvent, useMemo } from "react";

import { useConnectModalContext } from "@/components/shared/connect-modal-context";
import { OPERATIONS } from "@/components/shared/consts/operations";
import { useReducerAsState } from "@/components/shared/hooks/user-reducer-as-state";
import { CollateralType } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { SelectTransaction } from "@/components/widgets/select-transaction";

import { DesktopTable } from "./shared/ui/desktop-table";
import { MobileTable } from "./shared/ui/mobile-table";

export const RestakeTable: React.FC = () => {
    const [{ selectTransactionModal, transactionOperation, selectedCollateral }, setState] =
        useReducerAsState<{
            selectTransactionModal: boolean;
            transactionOperation: OPERATIONS | "";
            selectedCollateral: CollateralType | undefined;
        }>({
            selectedCollateral: undefined,
            selectTransactionModal: false,
            transactionOperation: "",
        });

    const { openConnectModal } = useConnectModalContext();

    const { handleDeposit, handleWithdraw, handleTransactionModalClose } = useMemo(
        () => ({
            handleDeposit: (e: MouseEvent<HTMLDivElement>, collateral: CollateralType) => {
                e.stopPropagation();
                setState({
                    transactionOperation: OPERATIONS.DEPOSIT,
                    selectTransactionModal: true,
                    selectedCollateral: collateral,
                });
            },
            handleWithdraw: (e: MouseEvent<HTMLDivElement>, collateral: CollateralType) => {
                e.stopPropagation();
                setState({
                    transactionOperation: OPERATIONS.WITHDRAW,
                    selectTransactionModal: true,
                    selectedCollateral: collateral,
                });
            },
            handleTransactionModalClose: () => setState({ selectTransactionModal: false }),
        }),
        [setState, openConnectModal],
    );

    return (
        <>
            <MobileTable onDeposit={handleDeposit} onWithdraw={handleWithdraw} />
            <DesktopTable onDeposit={handleDeposit} onWithdraw={handleWithdraw} />

            {selectTransactionModal && selectedCollateral && (
                <SelectTransaction
                    inModal
                    onModalClose={handleTransactionModalClose}
                    operation={transactionOperation as OPERATIONS}
                    collateral={selectedCollateral}
                />
            )}
        </>
    );
};
