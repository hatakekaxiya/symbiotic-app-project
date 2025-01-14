import tw, { css, styled } from "twin.macro";

export const Button = styled.button<{ $theme?: "regular" | "black" | "accent" }>(
    ({ $theme }) => css`
        ${$theme === "black"
            ? tw`bg-black`
            : $theme === "accent"
              ? tw`text-black bg-[var(--accent)]`
              : tw`bg-[var(--light-black-color-10)]`}
        ${tw`h-fit whitespace-nowrap border border-solid px-4 py-3 text-16-18 uppercase border-[var(--light-black-color-20)] desktop:p-4`}
    `,
);
