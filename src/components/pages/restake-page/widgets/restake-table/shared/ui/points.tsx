import "twin.macro";

import React from "react";

import LogoCircle from "@/components/shared/assets/icons/middle-logo-circle.svg?react";

import { TextsContainer, TopText } from ".";

type Props = {
    pointsEnabled: boolean;
    className?: string;
};

export const Points: React.FC<Props> = ({ pointsEnabled, className }) => {
    return (
        <TextsContainer className={className}>
            <TopText>
                {pointsEnabled ? (
                    <>
                        <LogoCircle width={20} height={20} viewBox="0 0 33 33" />
                        <span tw="text-white">Enabled</span>
                    </>
                ) : (
                    "-"
                )}
            </TopText>

            {/* <BottomText tw="hidden xl:block">
                {collaterals.filter((it) => it !== "symbiotic").join(", ")}
            </BottomText> */}
        </TextsContainer>
    );
};
