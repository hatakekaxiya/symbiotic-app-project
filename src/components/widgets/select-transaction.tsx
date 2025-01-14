import "twin.macro";

import React, { ChangeEvent, useCallback, useMemo, useRef } from "react";

import { PrepareTransaction } from "@/components/features/prepare-transaction/prepare-transaction";
import { OPERATIONS } from "@/components/shared/consts/operations";
import { useReducerAsState } from "@/components/shared/hooks/user-reducer-as-state";
import { CollateralType } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { Tabs } from "@/components/shared/ui/tabs";
import { TransactionModal } from "@/components/widgets/transaction-modal/transaction-modal";

import { Card } from "../shared/ui/card";
import { Modal } from "../shared/ui/modal";

type SelectorProps = {
    inModal?: boolean;
    operation?: OPERATIONS;
    collateral: CollateralType;
    onModalClose?: () => void;
};

export const SelectTransaction: React.FC<SelectorProps> = ({
    inModal,
    operation = OPERATIONS.DEPOSIT,
    collateral,
    onModalClose,
}) => {
    const [{ amount, selectedOperation, showTransactionModal }, setState] = useReducerAsState({
        amount: "",
        selectedOperation: operation,
        showTransactionModal: false,
    });

    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const handleModalClose = useCallback(
        (beforeTransactionModal: boolean) => {
            if (!beforeTransactionModal) {
                dialogRef.current?.close();

                setTimeout(() => {
                    setState({ showTransactionModal: false });
                    onModalClose && onModalClose();
                }, 300);

                return;
            } else {
                setState({ showTransactionModal: true });
            }
        },
        [dialogRef, onModalClose],
    );

    const { handleAmountChange, handeAmountSet, handleDeposit, handleTabClick, handleWithdraw } =
        useMemo(
            () => ({
                handleAmountChange: (e: ChangeEvent<HTMLInputElement>) => {
                    setState(() => ({
                        amount: (() => {
                            const input = e?.target;
                            let validInput = input.value.replace(/[^0-9+.]/g, "");

                            // Ensure only one dot in the entire string
                            const dotCount = (validInput.match(/\./g) || []).length;
                            if (dotCount > 1) {
                                validInput = validInput.replace(/\./g, (_, offset) =>
                                    offset === validInput.indexOf(".") ? "." : "",
                                );
                            }

                            // Ensure no commas after a dot
                            const dotIndex = validInput.indexOf(".");
                            if (dotIndex !== -1) {
                                validInput =
                                    validInput.slice(0, dotIndex + 1) +
                                    validInput
                                        .slice(dotIndex + 1)
                                        .replace(/,/g, "")
                                        .slice(0, 18);
                            }

                            // Remove all spaces and +
                            validInput = validInput.replace(/\s+/g, "").replace("+", "");

                            // Update the state
                            setState(() => ({
                                amount: validInput,
                            }));

                            return validInput;
                        })(),
                    }));
                },
                handeAmountSet: (amount: string) => {
                    setState({ amount });
                },
                handleTabClick: (tabName: string) => {
                    const operation = tabName as OPERATIONS;
                    setState({ selectedOperation: operation });
                },
                handleDeposit: () => {
                    handleModalClose(true);
                },
                handleWithdraw: () => {
                    handleModalClose(true);
                },
            }),
            [handleModalClose, setState],
        );

    return (
        <>
            {!showTransactionModal && inModal && handleModalClose && (
                <Modal
                    tw="relative"
                    outerRef={dialogRef}
                    onClose={() => handleModalClose(false)}
                    closeOnClickOutside={true}
                    animationOnOpen
                >
                    <div
                        tw="absolute top-2 right-2 z-10 h-4 w-4 scale-x-125 scale-y-90 cursor-pointer text-20-22 transition-opacity duration-300 hover:opacity-75 md:hidden"
                        onClick={() => handleModalClose(false)}
                    >
                        x
                    </div>
                    <OperationTabs
                        inModal
                        operation={selectedOperation}
                        amount={amount}
                        collateral={collateral}
                        onTabClick={handleTabClick}
                        handleDeposit={handleDeposit}
                        handleWithdraw={handleWithdraw}
                        onAmountChange={handleAmountChange}
                        onAmountSet={handeAmountSet}
                    />
                </Modal>
            )}

            {!inModal && (
                <Card>
                    <OperationTabs
                        operation={selectedOperation}
                        amount={amount}
                        collateral={collateral}
                        onTabClick={handleTabClick}
                        handleDeposit={handleDeposit}
                        handleWithdraw={handleWithdraw}
                        onAmountChange={handleAmountChange}
                        onAmountSet={handeAmountSet}
                    />
                </Card>
            )}

            {showTransactionModal && (
                <TransactionModal
                    inModal={inModal}
                    operation={selectedOperation}
                    collateral={collateral}
                    amount={amount}
                    onClose={() => {
                        setState({ showTransactionModal: false });
                        onModalClose && onModalClose();
                    }}
                />
            )}
        </>
    );
};

type TabsProps = {
    operation: string;
    amount: string;
    collateral: SelectorProps["collateral"];
    onTabClick: (tabName: string) => void;
    handleDeposit: () => void;
    handleWithdraw: () => void;
    onAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAmountSet: (amount: string) => void;
    inModal?: boolean;
};

const OperationTabs: React.FC<TabsProps> = ({
    inModal,
    operation,
    amount,
    collateral,
    onTabClick,
    handleDeposit,
    handleWithdraw,
    onAmountChange,
    onAmountSet,
}) => {
    return (
        <Tabs
            inModal={inModal}
            defaultTabName={operation}
            onTabClick={onTabClick}
            tabs={[
                {
                    name: OPERATIONS.DEPOSIT,
                    content: (
                        <PrepareTransaction
                            operation={OPERATIONS.DEPOSIT}
                            amount={amount}
                            collateral={collateral}
                            onAmountChange={onAmountChange}
                            onAmountSet={onAmountSet}
                            onAccept={handleDeposit}
                            inModal={inModal}
                        />
                    ),
                },
                {
                    name: OPERATIONS.WITHDRAW,
                    content: (
                        <PrepareTransaction
                            operation={OPERATIONS.WITHDRAW}
                            amount={amount}
                            collateral={collateral}
                            onAmountChange={onAmountChange}
                            onAmountSet={onAmountSet}
                            onAccept={handleWithdraw}
                            inModal={inModal}
                        />
                    ),
                },
            ]}
        />
    );
};
