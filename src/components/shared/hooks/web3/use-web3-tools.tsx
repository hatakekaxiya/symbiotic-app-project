import { WaitForTransactionReceiptErrorType, WriteContractErrorType } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Address } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const initContractState = () => ({
    error: null as WriteContractErrorType | WaitForTransactionReceiptErrorType | null,
    approvalPending: false,
    txnPending: false,
    success: false,
});

export type ContractState = ReturnType<typeof initContractState>;

export const useWriteContractWrapper = (
    setContractState: (state: ContractState) => void,
    ...options: Parameters<ReturnType<typeof useWriteContract>["writeContract"]>
) => {
    const [hash, setHash] = useState<Address | undefined>(undefined);
    const { isSuccess, error } = useWaitForTransactionReceipt({ hash });

    const resolves = useRef<((value: unknown) => void)[]>([]);
    const rejects = useRef<((reason?: never) => void)[]>([]);

    const successNotified = useRef(false);
    useEffect(() => {
        if (isSuccess && !successNotified.current) {
            successNotified.current = true;
            resolves.current.forEach((it) => it(undefined));
            resolves.current = [];
            rejects.current = [];
            setContractState({
                error: null,
                approvalPending: false,
                txnPending: false,
                success: true,
            });
        }
    }, [setContractState, isSuccess]);

    const errorNotified = useRef(false);
    useEffect(() => {
        if (error && !errorNotified.current) {
            errorNotified.current = true;
            //  @ts-expect-error error
            rejects.current.forEach((it) => it(error));
            resolves.current = [];
            rejects.current = [];
            setContractState({
                error: error,
                approvalPending: false,
                txnPending: false,
                success: false,
            });
        }
    }, [setContractState, error]);

    const { writeContract } = useWriteContract({
        mutation: {
            onMutate: () => {
                setContractState({
                    error: null,
                    approvalPending: true,
                    txnPending: false,
                    success: false,
                });
            },
            onSuccess: (data) => {
                setHash(data);
                setContractState({
                    error: null,
                    approvalPending: false,
                    txnPending: true,
                    success: false,
                });
            },
            onError: (e) => {
                setContractState({
                    error: e,
                    approvalPending: false,
                    txnPending: false,
                    success: false,
                });
            },
        },
    });

    return useCallback(async () => {
        return new Promise((resolve, reject) => {
            resolves.current = [...resolves.current, resolve];
            rejects.current = [...rejects.current, reject];
            writeContract(...options);
        });
    }, [writeContract, options]);
};
