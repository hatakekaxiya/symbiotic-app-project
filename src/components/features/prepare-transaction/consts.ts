export enum ERRORS {
    DEPOSIT_MAX_AMOUNT = "DEPOSIT_MAX_AMOUNT",
    WITHDRAW_MAX_AMOUNT = "WITHDRAW_MAX_AMOUNT",
    DEPOSIT_LIMIT = "DEPOSIT_LIMIT",
    WITHDRAW_LIMIT = "WITHDRAW_LIMIT",
}

export const errors = {
    [ERRORS.DEPOSIT_MAX_AMOUNT]: "Deposit amount exceeds balance.",
    [ERRORS.WITHDRAW_MAX_AMOUNT]: "Withdraw amount exceeds deposit.",
    [ERRORS.DEPOSIT_LIMIT]: "Deposit amount exceeds limit.",
    [ERRORS.WITHDRAW_LIMIT]: "Withdraw amount exceeds limit.",
};
