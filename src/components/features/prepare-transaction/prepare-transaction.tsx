import { FiAlertCircle } from "@react-icons/all-files/fi/FiAlertCircle";
import BigNumber from "bignumber.js";
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef } from "react";
import tw, { css, styled } from "twin.macro";
import { useAccount, useConfig, useSwitchChain } from "wagmi";

import { collateralIcons } from "@/components/shared/assets/icons/collaterals";
import { useConnectModalContext } from "@/components/shared/connect-modal-context";
import { OPERATIONS } from "@/components/shared/consts/operations";
import { useReducerAsState } from "@/components/shared/hooks/user-reducer-as-state";
import { CollateralType } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { tokenNumberFormatter, usdNumberFormatter } from "@/components/shared/lib/format-currency";
import { assetToFloat, assetToString } from "@/components/shared/lib/utils";
import { CircleProgress } from "@/components/shared/ui/circle-progress-bar";

import { ERRORS, errors } from "./consts";

type Props = {
    operation: OPERATIONS;
    amount: string;
    collateral: CollateralType;
    onAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAmountSet: (amount: string) => void;
    onAccept: () => void;
    inModal?: boolean;
};

export const PrepareTransaction: React.FC<Props> = ({
    operation,
    amount,
    collateral,
    onAmountChange,
    onAmountSet,
    onAccept,
    inModal,
}) => {
    const {
        browserData: { supplyPercent, totalSupplyFloat, limitFloat, totalSupplyUsdFloat },
    } = collateral;

    const { chains } = useConfig();
    const { switchChain } = useSwitchChain();
    const { address, chainId } = useAccount();
    const { openConnectModal } = useConnectModalContext();

    const [{ error, warning }, setState] = useReducerAsState<{
        error: string | null;
        warning: string | null;
    }>({
        error: null,
        warning: null,
    });

    const isProperlyConnected = useMemo(() => {
        return address && chains.some((chain) => chain.id === chainId);
    }, [address, chainId, chains]);

    const amountInputRef = useRef<HTMLInputElement | null>(null);

    const getBalance = useCallback(
        () =>
            assetToString(
                operation === OPERATIONS.DEPOSIT
                    ? collateral.browserData.balanceOf || BigNumber(0)
                    : collateral.browserData.deposit || BigNumber(0),
                collateral.assetDecimals,
            ),
        [collateral, operation],
    );

    const getWstEthMaxBalance = useCallback(
        () =>
            assetToString(
                collateral?.type === "wstEth"
                    ? (collateral.browserData.balanceOf || BigNumber(0)).plus(
                          collateral.wstEthData?.balanceOfWStEth || BigNumber(0),
                      )
                    : BigNumber(0),
                collateral.assetDecimals,
            ),
        [collateral],
    );

    const isWstEthDeposit = useMemo(() => {
        return collateral?.type === "wstEth" && operation === OPERATIONS.DEPOSIT;
    }, [collateral, operation]);

    const balance = useMemo(() => {
        return tokenNumberFormatter.format(Number(getBalance()));
    }, [getBalance]);

    const maxBalance = useMemo(() => {
        let maxBalance_ = balance;

        if (isWstEthDeposit) {
            maxBalance_ = tokenNumberFormatter.format(Number(getWstEthMaxBalance()));
        }

        return maxBalance_;
    }, [balance, isWstEthDeposit, getWstEthMaxBalance]);

    const maximizeAmount = (onlyBalance = false) => {
        let maxAmount = getBalance();

        if (!onlyBalance && isWstEthDeposit) {
            maxAmount = getWstEthMaxBalance();
        }
        onAmountSet(maxAmount);
    };

    useEffect(() => {
        if (!address) {
            return;
        }

        if (operation === OPERATIONS.DEPOSIT) {
            const totalBalance = (collateral.browserData.balanceOf || BigNumber(0)).plus(
                collateral?.type === "wstEth"
                    ? collateral.wstEthData?.balanceOfWStEth || BigNumber(0)
                    : BigNumber(0),
            );
            if (
                BigNumber(amount)
                    .multipliedBy(BigNumber(10).pow(collateral.assetDecimals))
                    .gt(totalBalance)
            ) {
                setState({ warning: null, error: errors[ERRORS.DEPOSIT_MAX_AMOUNT] });
                return;
            }

            if (
                BigNumber(amount)
                    .multipliedBy(BigNumber(10).pow(collateral.assetDecimals))
                    .plus(collateral.browserData.totalSupply)
                    .gt(collateral.browserData.limit)
            ) {
                setState({ warning: null, error: errors[ERRORS.DEPOSIT_LIMIT] });
                return;
            }
        } else {
            if (
                BigNumber(amount)
                    .multipliedBy(BigNumber(10).pow(collateral.assetDecimals))
                    .gt((collateral.browserData.deposit || BigNumber(0)).toString(10))
            ) {
                setState({ warning: null, error: errors[ERRORS.WITHDRAW_MAX_AMOUNT] });
                return;
            }
        }

        if (
            collateral?.type === "wstEth" &&
            operation == OPERATIONS.DEPOSIT &&
            BigNumber(amount)
                .multipliedBy(BigNumber(10).pow(collateral.assetDecimals))
                .gt((collateral.browserData.balanceOf || BigNumber(0)).toString(10))
        ) {
            const wholeWstEth = collateral.browserData.balanceOf || BigNumber(0);
            const wstEthToBeWrapped = BigNumber(amount)
                .multipliedBy(BigNumber(10).pow(collateral.assetDecimals))
                .minus((collateral.browserData.balanceOf || BigNumber(0)).toString(10));
            const wrappedStEth = wstEthToBeWrapped
                .multipliedBy((collateral.wstEthData?.balanceOfStEth || BigNumber(0)).toString(10))
                .dividedBy((collateral.wstEthData?.balanceOfWStEth || BigNumber(0)).toString(10));

            setState({
                warning: `Deposit will use ${
                    wholeWstEth.gt("0")
                        ? `${tokenNumberFormatter.format(
                              assetToFloat(wholeWstEth, collateral.assetDecimals),
                          )} wstETH + `
                        : ""
                }${tokenNumberFormatter.format(
                    assetToFloat(wrappedStEth, collateral.assetDecimals),
                )} stETH (that will be wrapped to wstETH).`,
                error: null,
            });

            return;
        }

        setState({ warning: null, error: null });
    }, [collateral, amount, setState, operation, address, isProperlyConnected]);

    const hasDeposit = (collateral.browserData.deposit || BigNumber(0)).gt(BigNumber(0));

    const isDisabled: boolean = useMemo(() => {
        if (!address) {
            return false;
        }

        if (!isProperlyConnected) {
            return false;
        }

        return (
            !amount.length ||
            Boolean(error) ||
            amount.endsWith(".") ||
            /^0*$/.test(amount.replace(/\./g, "")) // contains only zeros despite dot
        );
    }, [amount, error, address, chains, chainId, isProperlyConnected]);

    const onAcceptButtonClick = () => {
        if (!address && openConnectModal) {
            openConnectModal();
            return;
        }

        if (!isProperlyConnected) {
            switchChain({
                chainId: chains[0].id,
            });
            return;
        }

        onAccept();
    };

    const acceptButtonText = useMemo(() => {
        if (!address) {
            return "CONNECT WALLET";
        }

        if (!isProperlyConnected) {
            return "SWITCH NETWORK";
        }

        return operation === OPERATIONS.DEPOSIT ? "DEPOSIT" : "WITHDRAW";
    }, [address, chains, chainId, operation, isProperlyConnected]);

    const Icon = collateralIcons[collateral.symbol];

    return (
        <Container>
            {inModal && (
                <Header>
                    <Label>
                        {Icon ? (
                            <div tw="shrink-0 h-[1.875rem] w-[1.875rem] desktop:(h-[2.375rem] w-[2.375rem])">
                                <Icon />
                            </div>
                        ) : (
                            <NoImage />
                        )}
                        <div tw="flex items-start gap-[0.75rem] desktop:(flex-col gap-[0.375rem]) mobile:(flex-wrap items-center)">
                            <Collateral>{collateral.symbol}</Collateral>
                            <CollateralDescription>{collateral.description}</CollateralDescription>
                        </div>
                    </Label>

                    <Summary>
                        <CircleProgress progress={supplyPercent} diameter={32} strokeWidth={3.7} />
                        <div tw="flex flex-nowrap">
                            <SummaryItem $position="start">
                                <SummaryItemTitle>Supply</SummaryItemTitle>
                                <SummaryValue>
                                    {usdNumberFormatter.format(totalSupplyFloat)}
                                </SummaryValue>
                            </SummaryItem>

                            <SummaryItem $position="center">
                                <SummaryItemTitle>Limit</SummaryItemTitle>
                                <SummaryValue $secondary>
                                    {usdNumberFormatter.format(limitFloat)}
                                </SummaryValue>
                            </SummaryItem>

                            <SummaryItem $position="end">
                                <SummaryItemTitle>Value Locked</SummaryItemTitle>
                                <SummaryValue>
                                    ${usdNumberFormatter.format(totalSupplyUsdFloat)}
                                </SummaryValue>
                            </SummaryItem>
                        </div>
                    </Summary>

                    <Divider />
                </Header>
            )}

            <span tw="mt-1 text-14-16 uppercase text-[var(--light-black-color-50)] desktop:hidden">
                enter amount
            </span>

            <Opration>
                {collateral.symbol === "wstETH" && operation == OPERATIONS.DEPOSIT && (
                    <OperationRecord tw="flex h-min w-full flex-row items-center justify-center py-3 px-7 gap-[0.75rem]">
                        <FiAlertCircle size={20} tw="w-fit min-w-fit" />
                        <span>
                            {
                                "If you don't have enough wstETH, your stETH will be wrapped automatically."
                            }
                        </span>
                    </OperationRecord>
                )}
                {hasDeposit && (
                    <OperationRecord $accent>
                        <PositionHeader>
                            <OperationRecordTitle>
                                <span tw="whitespace-nowrap uppercase mobile:hidden">
                                    Your position
                                </span>
                                <span tw="uppercase text-[var(--light-black-color-50)] desktop:hidden">
                                    Your Position
                                </span>
                            </OperationRecordTitle>

                            <OperationCollateral tw="mobile:hidden">
                                {collateral.symbol}
                            </OperationCollateral>
                        </PositionHeader>

                        <div tw="flex w-full flex-col items-end justify-end gap-[0.375rem] mobile:hidden">
                            <span tw="leading-8 text-[1.75rem] desktop:text-32-36">{`${usdNumberFormatter.format(collateral.browserData.depositFloat)}`}</span>
                            <span tw="text-18-20 text-[var(--light-black-color-50)]">{`$${usdNumberFormatter.format(collateral.browserData.depositUsdFloat)}`}</span>
                        </div>
                        <div tw="flex w-full items-center justify-between gap-[1.625rem] desktop:hidden">
                            <span tw="leading-8 text-[1.75rem] desktop:text-32-36">{`$${usdNumberFormatter.format(collateral.browserData.depositUsdFloat)}`}</span>
                            <span tw="justify-end text-18-20 text-end text-[var(--light-black-color-50)]">{`${usdNumberFormatter.format(collateral.browserData.depositFloat)} ${collateral.symbol}`}</span>
                        </div>
                    </OperationRecord>
                )}

                <OperationRecord
                    $error={Boolean(error)}
                    className="focus-within:border-white"
                    onClick={() => amountInputRef.current?.focus()}
                >
                    <AmountHeader>
                        <div tw="flex items-center gap-3">
                            <OperationRecordTitle>
                                <span tw="whitespace-nowrap uppercase mobile:hidden">Amount</span>
                                <span tw="uppercase text-[var(--light-black-color-50)] desktop:hidden">
                                    Amount
                                </span>
                            </OperationRecordTitle>
                            <DesktopMAXLAbel
                                onClick={() => maximizeAmount(false)}
                                className={isWstEthDeposit ? `tooltip` : ""}
                                data-tip={
                                    isWstEthDeposit
                                        ? `${maxBalance} wstETH (including stETH balance)`
                                        : ""
                                }
                            >
                                MAX
                            </DesktopMAXLAbel>
                        </div>

                        <OperationCollateral tw="mobile:hidden">
                            <div
                                tw="flex w-fit cursor-pointer flex-row gap-2 transition-opacity hover:opacity-75"
                                onClick={() => maximizeAmount(true)}
                            >
                                <div>{balance}</div>
                                <div>{collateral.symbol}</div>
                            </div>
                        </OperationCollateral>

                        <MobileMAXLabel
                            onClick={() => maximizeAmount(false)}
                            className={isWstEthDeposit ? `tooltip` : ""}
                            data-tip={
                                isWstEthDeposit
                                    ? `${maxBalance} wstETH (including stETH balance)`
                                    : ""
                            }
                            tw="before:(max-w-[7rem] content-[attr(data-tip)])"
                        >
                            MAX
                        </MobileMAXLabel>
                    </AmountHeader>

                    <div tw="flex w-full flex-row items-center">
                        <input
                            ref={amountInputRef}
                            placeholder="0.000"
                            value={amount}
                            onChange={onAmountChange}
                            css={[
                                css`
                                    all: unset;

                                    &::-webkit-outer-spin-button,
                                    &::-webkit-inner-spin-button {
                                        -webkit-appearance: none;
                                        margin: 0;
                                    }

                                    &::placeholder {
                                        user-select: none;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                    }
                                `,
                                amount ? tw`text-white` : tw`text-[var(--light-black-color-50)]`,
                                tw`leading-8 text-[1.75rem] desktop:(text-[2.125rem] leading-[2.625rem])`,
                                tw`!w-full text-ellipsis whitespace-nowrap placeholder:opacity-50`,
                                tw`text-start desktop:text-end`,
                            ]}
                        />

                        <OperationCollateral tw="desktop:hidden">
                            <div
                                tw="flex w-fit cursor-pointer flex-row gap-2 transition-opacity hover:opacity-75"
                                onClick={() => maximizeAmount(true)}
                            >
                                <div>{balance}</div>
                                <div>{collateral.symbol}</div>
                            </div>
                        </OperationCollateral>
                    </div>
                </OperationRecord>
            </Opration>

            <ErrorPlate
                $error={Boolean(error)}
                $warning={Boolean(warning)}
                data-error={error}
                data-warning={warning}
            >
                {Boolean(error) ? error : warning}
            </ErrorPlate>

            <AcceptButton
                onClick={onAcceptButtonClick}
                css={!(Boolean(error) || Boolean(warning)) && tw`-mt-[1.125rem]`}
                disabled={isDisabled}
            >
                {acceptButtonText}
            </AcceptButton>
        </Container>
    );
};

const Container = tw.section`flex flex-col gap-[1.125rem]`;

const Header = tw.header`relative flex flex-col gap-4 pb-[1.875rem] desktop:(flex-row justify-between gap-3 pb-[1.125rem])`;
const Divider = tw.div`absolute bottom-0 h-px -left-[1.625rem] w-[calc(100%_+_(1.625rem_*_2))] bg-[var(--light-black-color-25)] desktop:hidden`;
const Label = tw.div`flex items-center gap-4`;
const NoImage = tw.div`rounded-full bg-[var(--light-black-color-25)] h-[1.875rem] w-[1.875rem] desktop:(h-[2.375rem] w-[2.375rem])`;
const Collateral = tw.span`leading-6 text-[1.25rem]`;
const CollateralDescription = tw.span`text-14-16 leading-4 text-[var(--light-black-color-50)]`;

const Summary = tw.div`flex items-center gap-[0.875rem]`;
const SummaryItem = styled.div<{ $position: "start" | "center" | "end" }>(({ $position }) => [
    $position === "start" && tw`pr-4`,
    $position === "center" && tw`border-x border-solid px-4 border-[var(--light-black-color-50)]`,
    $position === "end" && tw`pl-4`,
    tw`flex flex-col gap-[0.375rem]`,
]);
const SummaryItemTitle = tw.span`whitespace-nowrap text-[var(--light-black-color-50)] text-[0.75rem] leading-[0.875rem] desktop:(text-14-16 leading-4)`;
const SummaryValue = styled.span<{ $secondary?: boolean }>(({ $secondary }) => [
    $secondary && tw`text-[var(--light-black-color-50)]`,
    tw`text-[1.125rem] leading-[1.375rem] desktop:(leading-6 text-[1.25])`,
]);

const Opration = tw.div`flex flex-col gap-[1.125rem]`;
const OperationRecord = styled.article<{ $accent?: boolean; $error?: boolean }>`
    ${tw`border border-solid transition-colors duration-300`}
    ${tw`w-full px-7 h-[6.5rem] py-[1.375rem]`}
    ${tw`flex flex-col items-start justify-between desktop:(flex-row items-center) mobile:gap-[0.875rem]`}
    ${({ $accent }) =>
        $accent
            ? tw`border-[rgba(182, 255, 62, 0.5)] bg-[rgba(182, 255, 62, 0.05)]`
            : tw`border-[var(--light-black-color-25)]`}
    ${({ $error }) => $error && tw`!border-[var(--warning)]`}
`;
const OperationRecordTitle = tw.span`text-14-16 leading-[1rem] desktop:(text-[1.125rem] leading-[1.375rem])`;

const OperationRecordHeader = tw.div`flex h-full flex-col justify-between mobile:(flex-row items-center gap-3)`;
const PositionHeader = tw(OperationRecordHeader)``;
const AmountHeader = tw(OperationRecordHeader)`w-full desktop:(w-fit pr-4) mobile:justify-start`;

const OperationCollateral = tw.span`text-18-22 text-[var(--light-black-color-50)]`;

const MobileMAXLabel = tw.span`ml-auto cursor-pointer text-14-16 transition-colors text-[var(--accent)] desktop:hidden hover:text-[var(--accent-75)]`;
const DesktopMAXLAbel = tw.span`cursor-pointer text-18-20 transition-colors text-[var(--accent)] mobile:hidden hover:text-[var(--accent-75)]`;

const ErrorPlate = styled.div<{ $error?: boolean; $warning: boolean }>`
    ${tw`w-full`}
    ${tw`flex items-center justify-center`}
    ${tw`scale-y-0 p-0 transition-[padding,transform] data-[error]:p-[0.875rem] data-[error]:scale-y-100 data-[warning]:p-[0.875rem] data-[warning]:scale-y-100`}
    ${({ $error }) => $error && tw`text-[var(--warning)] bg-[var(--warning-10)]`}
    ${({ $warning }) => $warning && tw`bg-[rgba(182, 255, 62, 0.05)] text-[white]`}
`;

const AcceptButton = tw.button`w-full text-black transition-opacity duration-300 h-[3.125rem] bg-[var(--accent)] disabled:(opacity-20 bg-[var(--disabled)])`;
