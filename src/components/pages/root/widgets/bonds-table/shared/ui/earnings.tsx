import React from "react";
import tw, { styled } from "twin.macro";

import LogoCircle from "@/components/shared/assets/icons/middle-logo-circle.svg?react";
import { pointsFormatter } from "@/components/shared/lib/format-currency";

import { TextsContainer, TopTextAccent } from ".";

type Props = {
    hasData: boolean;
    deposited: {
        earnings: number;
        earningsLast: number;
    };
    className?: string;
};

export const Earnings: React.FC<Props> = ({ hasData, deposited, className }) => {
    return (
        <TextsContainer className={className}>
            <TopTextAccent $noData={!hasData}>
                <span>{`${pointsFormatter.format(deposited.earnings)}`}</span>
                <ImageWrapper disabled={!hasData}>
                    <LogoCircle width={20} height={20} viewBox="0 0 33 33" />
                </ImageWrapper>
            </TopTextAccent>

            {/* <BottomText>
                {hasData ? (
                    <>
                        <span tw="text-white">{`+${deposited.earningsLast} `}</span>
                        <span>last 30d</span>
                    </>
                ) : (
                    <NoData>-</NoData>
                )}
            </BottomText> */}
        </TextsContainer>
    );
};

// const NoData = tw.span`text-[var(--light-black-color-50)]`;

const ImageWrapper = styled.div<{ disabled: boolean }>`
    ${(props) => props.disabled && tw`opacity-50`}
    ${(props) => props.disabled && `filter: grayscale(100%);`}
`;
