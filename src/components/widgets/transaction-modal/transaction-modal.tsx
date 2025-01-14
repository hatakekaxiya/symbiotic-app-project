import BigNumber from "bignumber.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import tw from "twin.macro";

import { collateralIcons } from "@/components/shared/assets/icons/collaterals";
import { OPERATIONS } from "@/components/shared/consts/operations";
import {
    CollateralBrowserData,
    CollateralType,
    emptyBrowserData,
} from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { useDeposit } from "@/components/shared/hooks/web3/use-deposit";
import { useWithdraw } from "@/components/shared/hooks/web3/use-withdraw";
import { usdNumberFormatter } from "@/components/shared/lib/format-currency";
import { assetToFloat, floatToAsset } from "@/components/shared/lib/utils";
import { Label } from "@/components/shared/ui/label";
import { Modal } from "@/components/shared/ui/modal";

import ArrowIcon from "./shared/assets/arrow.svg?react";
import { Footer } from "./shared/ui/footer/footer";
import { Progress, TransactionProgressStage } from "./shared/ui/progress/progress";

type Props = {
    inModal?: boolean;
    operation: OPERATIONS;
    collateral: CollateralType;
    amount: string;
    onClose: (succeed?: boolean) => void;
};

type OperationModalProps = Props & {
    modalPositionData: { newAmount: BigNumber; browserData: CollateralBrowserData };
    onAccept: () => void;
    onRequestResend: () => void;
    onTryAgain: () => void;
};

type ActionModalProps = OperationModalProps & {
    tryAgains: number;
    handleTransactionStart: (isDeposit: boolean, func: () => void) => void;
};

type TransactionModalViewProps = OperationModalProps & {
    title: string;
    subtitle: string;
    stages: TransactionProgressStage[];
    error: boolean;
    success: boolean;
};

const TransactionModalView: React.FC<TransactionModalViewProps> = ({
    title,
    subtitle,
    onClose,
    collateral,
    stages,
    error,
    modalPositionData,
    success,
    inModal,
    onAccept,
    onRequestResend,
    onTryAgain,
}) => {
    const {
        browserData: { totalSupplyUsdFloat, totalSupplyFloat },
        symbol,
    } = collateral;
    const closeOnClickOutside = useMemo(() => !Boolean(stages.find((it) => it.progress)), [stages]);

    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const handleClose = (succeed?: boolean) => {
        if (dialogRef.current) {
            dialogRef.current.close();
            setTimeout(() => onClose(succeed), 300);
            return;
        }

        onClose();
    };

    const handleAccept = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
            setTimeout(onAccept, 300);
            return;
        }
        onAccept();
    };

    const Icon = collateralIcons[collateral.symbol];

    return (
        <Modal
            outerRef={dialogRef}
            animationOnOpen={!inModal}
            tw="relative max-h-[calc(100vh_-_4rem)] desktop:!min-w-[31.375rem]"
            onClose={handleClose}
            closeOnClickOutside={closeOnClickOutside}
        >
            <div
                tw="absolute top-2 right-2 h-4 w-4 scale-x-125 scale-y-90 cursor-pointer text-20-22 transition-opacity duration-300 hover:opacity-75 md:hidden"
                onClick={() => handleClose(false)}
            >
                x
            </div>

            <Details>
                <div tw="grid gap-2">
                    <Title>{title}</Title>
                    <SubTitle>{subtitle}</SubTitle>
                </div>

                <Block>
                    <Topic>Collateral</Topic>
                    <CollateralView>
                        <div tw="flex items-center gap-[0.625rem]">
                            {Icon ? (
                                <div tw="shrink-0 h-[1.875rem] w-[1.875rem] desktop:(h-[2.375rem] w-[2.375rem])">
                                    <Icon />
                                </div>
                            ) : (
                                <NoImage />
                            )}
                            <div tw="grid gap-[0.375rem]">
                                <Collateral>{collateral.symbol}</Collateral>
                                <CollateralDescription>
                                    {collateral.description}
                                </CollateralDescription>
                            </div>
                        </div>

                        <div tw="grid items-center justify-items-end gap-[0.375rem]">
                            <div tw="flex items-center justify-end gap-[0.625rem]">
                                <Label>TVL</Label>
                                <LockedDollars>
                                    ${usdNumberFormatter.format(totalSupplyUsdFloat)}
                                </LockedDollars>
                            </div>
                            <LockedCrypto>
                                {usdNumberFormatter.format(totalSupplyFloat) + " " + symbol}
                            </LockedCrypto>
                        </div>
                    </CollateralView>
                </Block>

                <div tw="grid justify-items-center grid-cols-[minmax(12.375rem,1fr),auto,minmax(12.375rem,1fr)] gap-[0.875rem] mobile:(grid-cols-1 grid-rows-[repeat(3,auto)])">
                    <Block>
                        <Topic>Old</Topic>
                        <Old>
                            <TransactionCrypto>
                                {/* TODO: add condition for tooltip */}
                                <TransactionCryptoAmountTooltip
                                    data-tip={modalPositionData.browserData.depositFloat || 0}
                                >
                                    <TransactionCryptoAmount>
                                        {modalPositionData.browserData.depositFloat || 0}{" "}
                                    </TransactionCryptoAmount>
                                </TransactionCryptoAmountTooltip>

                                <TransactionCryptoCollateral>
                                    {collateral.symbol}
                                </TransactionCryptoCollateral>
                            </TransactionCrypto>

                            <TransactionDollars>
                                <span>
                                    {modalPositionData.browserData.hasDeposit
                                        ? "$" +
                                          usdNumberFormatter.format(
                                              modalPositionData.browserData.depositUsdFloat,
                                          )
                                        : "No position"}
                                </span>
                            </TransactionDollars>
                        </Old>
                    </Block>

                    <ArrowIcon tw="mobile:(-mb-2 rotate-90) desktop:translate-y-14" />

                    <Block>
                        <Topic>New</Topic>
                        <New>
                            <TransactionCrypto tw="text-[var(--accent)]">
                                {/* TODO: add condition for tooltip */}
                                <TransactionCryptoAmountTooltip
                                    data-tip={assetToFloat(
                                        modalPositionData.newAmount,
                                        collateral.assetDecimals,
                                    )}
                                >
                                    <TransactionCryptoAmount>
                                        {assetToFloat(
                                            modalPositionData.newAmount,
                                            collateral.assetDecimals,
                                        )}{" "}
                                    </TransactionCryptoAmount>
                                </TransactionCryptoAmountTooltip>

                                <TransactionCryptoCollateral tw="text-[var(--accent-50)]">
                                    {collateral.symbol}
                                </TransactionCryptoCollateral>
                            </TransactionCrypto>

                            <TransactionDollars>
                                {modalPositionData.newAmount.eq(0) ? (
                                    <span>No position</span>
                                ) : (
                                    `$${usdNumberFormatter.format(
                                        assetToFloat(
                                            modalPositionData.newAmount.multipliedBy(
                                                collateral.usdPrice,
                                            ),
                                            collateral.assetDecimals,
                                        ),
                                    )}`
                                )}
                            </TransactionDollars>
                        </New>
                    </Block>
                </div>
            </Details>

            <Progress stages={stages} />

            <Footer
                succeed={success}
                hasError={error}
                onAccept={handleAccept}
                onTryAgain={onTryAgain}
                onRequestResend={onRequestResend}
                onCancel={handleClose}
            />
        </Modal>
    );
};

const DepositModal: React.FC<ActionModalProps> = (props) => {
    const { collateral, amount, modalPositionData, tryAgains, handleTransactionStart, onClose } =
        props;
    const bigNumAmount = useMemo(() => floatToAsset(amount, collateral.assetDecimals), [amount]);
    const {
        deposit,
        isDepositApprovalPending,
        isDepositTxnPending,
        isApproveApprovalPending,
        isApproveTxnPending,
        depositSuccess,
        depositError,
        needToApproveAsset,
        approveSuccess,
        isSTETHWrapSuccess,
        isSTETHApproveApprovalPending,
        isSTETHApproveTxnPending,
        needToApproveSTEth,
        isSTETHApproveSuccess,
        isSTETHWrapApprovalPending,
        isSTHETHWrapTxnPending,
        needToWrapSTEth,
    } = useDeposit(collateral, bigNumAmount);

    const navigate = useNavigate();

    useEffect(() => {
        if (depositError) {
            // console.error(depositError.cause);
            console.error(depositError.message);
            console.error(depositError.stack);
        }
    }, [depositError]);

    useEffect(() => {
        handleTransactionStart(true, deposit);
    }, [deposit]);

    useEffect(() => {
        if (tryAgains > 0) {
            deposit();
        }
    }, [tryAgains]);

    const { title, subtitle } = useMemo(
        () => ({
            title: "Deposit",
            subtitle: (() => {
                if (depositSuccess) return "Your deposit was completed successfully.";
                if (depositError) return "Your deposit could not be processed.";
                return "Below is a preview of your deposit.";
            })(),
        }),
        [depositSuccess, depositError],
    );

    const stages: TransactionProgressStage[] = useMemo(() => {
        return [
            ...(needToApproveSTEth
                ? [
                      {
                          title: "Approve stETH",
                          description: "This will allow stETH to wrap",
                          link: "",
                          progress: isSTETHApproveApprovalPending || isSTETHApproveTxnPending,
                          done: isSTETHApproveSuccess,
                      },
                  ]
                : []),
            ...(needToWrapSTEth
                ? [
                      {
                          title: "Wrap stETH",
                          description: "This will wrap stETH",
                          link: "",
                          progress: isSTETHWrapApprovalPending || isSTHETHWrapTxnPending,
                          done: isSTETHWrapSuccess,
                      },
                  ]
                : []),
            ...(needToApproveAsset
                ? [
                      {
                          title: "Grant permissions",
                          description: `This will allow us to stake your ${collateral.symbol}`,
                          link: "",
                          progress: isApproveApprovalPending || isApproveTxnPending,
                          done: approveSuccess,
                      },
                  ]
                : []),
            {
                title: "Finalize deposit",
                description: "This will complete the restaking process",
                link: "",
                progress: isDepositApprovalPending || isDepositTxnPending,
                done: depositSuccess,
            },
        ];
    }, [
        needToApproveSTEth,
        isSTETHApproveApprovalPending,
        isSTETHApproveTxnPending,
        isSTETHApproveSuccess,
        needToWrapSTEth,
        isSTETHWrapApprovalPending,
        isSTHETHWrapTxnPending,
        isSTETHWrapSuccess,
        needToApproveAsset,
        isApproveApprovalPending,
        isApproveTxnPending,
        approveSuccess,
        isDepositApprovalPending,
        isDepositTxnPending,
        depositSuccess,
        collateral,
    ]);

    const handleClose = () => {
        onClose();
        if (needToApproveSTEth) {
            if (isSTETHApproveSuccess || isSTETHApproveTxnPending) {
                navigate(0);
            }
            return;
        }
        if (needToWrapSTEth) {
            if (isSTETHWrapSuccess || isSTHETHWrapTxnPending) {
                navigate(0);
            }
            return;
        }
        if (needToApproveAsset) {
            if (approveSuccess || isApproveTxnPending) {
                navigate(0);
            }
            return;
        }
        if (isDepositTxnPending) {
            navigate(0);
        }
    };

    return (
        <TransactionModalView
            {...props}
            onClose={handleClose}
            title={title}
            subtitle={subtitle}
            stages={stages}
            error={Boolean(depositError)}
            success={depositSuccess}
            modalPositionData={modalPositionData}
        />
    );
};

const WithdrawModal: React.FC<ActionModalProps> = (props) => {
    const { collateral, amount, modalPositionData, tryAgains, handleTransactionStart, onClose } =
        props;
    const bigNumAmount = useMemo(() => floatToAsset(amount, collateral.assetDecimals), [amount]);
    const {
        isWithdrawApprovalPending,
        isWithdrawTxnPending,
        withdrawSuccess,
        withdrawError,
        withdraw,
    } = useWithdraw(collateral, bigNumAmount);

    const navigate = useNavigate();

    useEffect(() => {
        if (withdrawError) {
            // console.error(withdrawError.cause);
            console.error(withdrawError.message);
            console.error(withdrawError.stack);
        }
    }, [withdrawError]);

    useEffect(() => {
        handleTransactionStart(false, withdraw);
    }, [withdraw]);

    useEffect(() => {
        if (tryAgains > 0) {
            withdraw();
        }
    }, [tryAgains]);

    const { title, subtitle } = useMemo(
        () => ({
            title: "Withdraw",
            subtitle: (() => {
                if (withdrawSuccess) return "Your withdrawal completed successfully.";
                if (withdrawError) return "Your withdrawal could not be processed.";
                return "Below is a preview of your withdrawal.";
            })(),
        }),
        [withdrawSuccess, withdrawError],
    );

    const stages: TransactionProgressStage[] = useMemo(() => {
        return [
            {
                title: "Finalize withdrawal",
                description: "This will complete the withdrawal process",
                link: "",
                progress: isWithdrawApprovalPending || isWithdrawTxnPending,
                done: withdrawSuccess,
            },
        ];
    }, [isWithdrawApprovalPending, isWithdrawTxnPending, withdrawSuccess]);

    const handleClose = () => {
        onClose();

        if (isWithdrawTxnPending) {
            navigate(0);
        }
    };

    return (
        <TransactionModalView
            {...props}
            onClose={handleClose}
            title={title}
            subtitle={subtitle}
            stages={stages}
            error={Boolean(withdrawError)}
            success={withdrawSuccess}
            modalPositionData={modalPositionData}
        />
    );
};

export const TransactionModal: React.FC<Props> = (props) => {
    const { operation, onClose, collateral } = props;
    const [tryAgains, setTryAgains] = useState(0);

    const [modalPositionData, setModalPositionData] = useState<{
        newAmount: BigNumber;
        browserData: CollateralBrowserData;
    }>({ newAmount: BigNumber(0), browserData: emptyBrowserData() });

    const navigate = useNavigate();

    const { handleAcceptAction, handleTryAgainAction, handleResendAction, handleClose } = useMemo(
        () => ({
            handleAcceptAction: () => {
                // setState({ hasError: false, succeed: false });
                onClose();
                navigate(0);
            },
            handleTryAgainAction: () => {
                setTryAgains(tryAgains + 1);
            },
            handleResendAction: () => {
                // setState({ hasError: false, succeed: true });
            },
            handleClose: (succeed?: boolean) => {
                onClose();
                succeed && navigate(0);
            },
        }),
        [onClose, navigate, tryAgains],
    );

    const operationModalProps: OperationModalProps = {
        ...props,
        modalPositionData,
        onClose: handleClose,
        onAccept: handleAcceptAction,
        onRequestResend: handleResendAction,
        onTryAgain: handleTryAgainAction,
    };

    const started = useRef(false);

    const handleTransactionStart = (isDeposit: boolean, func: () => void) => {
        if (!started.current) {
            started.current = true;
            setModalPositionData({
                browserData: collateral.browserData,
                newAmount: isDeposit
                    ? collateral.browserData.deposit.plus(
                          floatToAsset(props.amount, collateral.assetDecimals),
                      )
                    : collateral.browserData.deposit.minus(
                          floatToAsset(props.amount, collateral.assetDecimals),
                      ),
            });

            func();
        }
    };

    return operation === OPERATIONS.DEPOSIT ? (
        <DepositModal
            {...operationModalProps}
            key={operation}
            tryAgains={tryAgains}
            handleTransactionStart={handleTransactionStart}
        />
    ) : (
        <WithdrawModal
            {...operationModalProps}
            key={operation}
            tryAgains={tryAgains}
            handleTransactionStart={handleTransactionStart}
        />
    );
};

const Details = tw.section`grid border-b border-solid p-6 border-[var(--border-color)] gap-[1.375rem]`;
const Title = tw.span`uppercase text-[1.5rem] leading-[1.875rem]`;
const SubTitle = tw.span`text-18-22 text-[var(--light-black-color-50)]`;

const Block = tw.div`grid w-full gap-[0.625rem]`;
const Topic = tw.span`text-14-16 uppercase leading-4`;
const Plate = tw.div`w-full bg-[var(--light-black-color-10)] p-[0.625rem] desktop:h-[4.25rem]`;
const NoImage = tw.div`shrink-0 rounded-full bg-[var(--light-black-color-25)] w-[2.375rem] h-[2.375rem]`;

const CollateralView = tw(Plate)`flex justify-between gap-2`;
const Collateral = tw.span`leading-6 text-[1.25rem]`;
const CollateralDescription = tw.span`text-14-16 leading-4 text-[var(--light-black-color-50)]`;
const LockedDollars = tw.span`leading-6 text-[1.25rem]`;
const LockedCrypto = tw.span`text-14-16 leading-4 text-[var(--light-black-color-50)]`;

const Old = tw(Plate)`grid items-center gap-[0.375rem]`;
const New = tw(Old)`border border-solid bg-[rgba(182, 255, 62, 0.05)] border-[var(--accent-50)]`;

const TransactionCrypto = tw.span`flex gap-4 whitespace-nowrap leading-6 text-[1.25rem] mobile:place-content-between`;
const TransactionCryptoAmountTooltip = tw.div`tooltip grid mobile:(grow justify-start)`;
const TransactionCryptoAmount = tw.span`block overflow-hidden text-ellipsis whitespace-nowrap max-w-[10ch] mobile:max-w-none`;
const TransactionCryptoCollateral = tw.span`text-[var(--light-black-color-50)] mobile:ml-auto`;
const TransactionDollars = tw.span`text-14-16 leading-4 text-[var(--light-black-color-50)]`;
