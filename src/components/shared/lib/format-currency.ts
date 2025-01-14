export const usdNumberFormatter = {
    format: (value: number) => {
        const formattedValue = new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
            maximumSignificantDigits: 4,
            minimumSignificantDigits: 2,
        }).format(value);

        return formattedValue.replace(/(\.\d+?)0*$/, "$1");
    },
};

export const tokenNumberFormatter = {
    format: (value: number) => {
        if (value < 0.00005) {
            value = 0;
        }

        return new Intl.NumberFormat("en-US", {
            maximumSignificantDigits: 4,
            minimumSignificantDigits: 2,
            maximumFractionDigits: 4,
            minimumFractionDigits: 1,
        }).format(value);
    },
};

export const pointsFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumSignificantDigits: 4,
    minimumSignificantDigits: 2,
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
});
