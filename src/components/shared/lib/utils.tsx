import BigNumber from "bignumber.js";

export const ellipsisAddress = (
    address: string,
    startSymbols: number = 4,
    endSymbols: number = 4,
) =>
    address.substring(0, 2 + startSymbols) + "..." + address.substring(address.length - endSymbols);

export const assetToFloat = (amount: BigNumber, decimals: number) =>
    amount.dividedBy(BigNumber(10).pow(decimals)).toNumber();

export const assetToString = (amount: BigNumber, decimals: number) =>
    amount.dividedBy(BigNumber(10).pow(decimals)).toString(10);

export const floatToAsset = (amount: number | string, decimals: number) =>
    BigNumber(amount).multipliedBy(BigNumber(10).pow(decimals));

export function isAbsoluteURL(url: string) {
    try {
        // Try to create a new URL object
        new URL(url);
        return true; // If it succeeds, the URL is absolute
    } catch (e) {
        return false; // If it throws, the URL is relative
    }
}
