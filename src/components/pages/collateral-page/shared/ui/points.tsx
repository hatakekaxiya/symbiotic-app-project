import React from "react";
import tw from "twin.macro";

import { CollateralType } from "@/components/shared/hooks/web3/symbiotic-data-provider";
import { pointsFormatter } from "@/components/shared/lib/format-currency";
import { Card } from "@/components/shared/ui/card";

type Props = {
    collateral: CollateralType;
};

export const Points: React.FC<Props> = ({ collateral }) => {
    const {
        pointsEnabled,
        browserData: { points },
    } = collateral;
    return (
        <Card tw="flex items-center justify-between gap-2 p-[1.625rem]">
            <Header>
                <RandomLogo imageId={String(Math.random())} />

                <div tw="grid gap-2">
                    <Title>Points</Title>
                    <Status>{pointsEnabled ? "Enabled" : "Disabled"}</Status>
                </div>
            </Header>

            <Info>
                <Block tw="relative flex flex-col items-end desktop:items-start">
                    <BlockTitle>Total points</BlockTitle>
                    <Total>{pointsFormatter.format(points)}</Total>
                </Block>

                {/* <Block tw="pl-7 desktop:pl-7">
                    <BlockTitle>last 30D</BlockTitle>
                    <Last>{`+${last}`}</Last>
                </Block> */}
            </Info>
        </Card>
    );
};

const Header = tw.header`flex items-center gap-5 border-none p-0`;
const Title = tw.span`text-16-18 uppercase text-[var(--light-black-color-50)]`;
const Status = tw.span`text-[1.275rem] leading-[1.625rem]`;

const Info = tw.div`grid p-0 grid-cols-[repeat(2,auto)]`;
const Block = tw.div`grid gap-2 py-0`;
const BlockTitle = tw.span`text-16-18 uppercase text-[var(--light-black-color-50)]`;
const Total = tw.span`text-22-26`;
// const Last = tw(Total)`text-[var(--accent)]`;

const RandomLogo: React.FC<{ imageId: string }> = ({ imageId }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" fill={`url(#pattern${imageId})`} />
        <defs>
            <pattern
                id={`pattern${imageId}`}
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
            >
                <use xlinkHref={`#image${imageId}`} transform="scale(0.0151515)" />
            </pattern>
            <image
                id={`image${imageId}`}
                width="66"
                height="66"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAYAAADjVADoAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARzSURBVHgB7Zy/TxRBFMe/M7nEGE28wsTCwlV7xUobdWlM1ILzL/CoLMW/AOgsoUQL4C9ACjCxYdXCErRHltLE4kwkBgI7vrc/4Dh2uf0xc9zu8knIDixcbr733pu3b94gMAA+Ktuii63g3QWEpQBLAE1AWcd/U7h0r0P3XLpHX/Jzg8ZPhLMBwwgYgibPEx+jYRv+pAvhCghHQSw/E84HGECrEMEn772kT3UCxSefhC8KvfXpp8JxoQktQgQCqEkF1cYAIUEWdAlSSIglZTcvwJtEYAFnhg5BcguxquwWucE8zLlAVijQqunn4usCcpBZiGGxgiQkMPMPcvqFcDpZ/i6TEBwLPKglATWC4YYCqhzN4ioy7S9+UvYImd5aCURgKFfx1sL8JRWpLIJF2KcXxvDEg7R0GmQZaRKyvkKwqqTuOsonQkQqMU51jUAEVUZL6KZJ1rzUz00SLSJYHdT6yeeBckLp+cYexGjSapJoEcESWQ0RGA7yF4NlP+F+DGRGbRUkSxVEvoh7cDshxFFcqI419NDZhbzZ6yIxrqEq5RIxNONc5JhFhEvlFmoAZZ43uzPPxvHbahI5eSa+YNDcsZt4u3YH+fDnOh59d+gaYWxooybwXLtzi64Ykd8ayooHrx2ND12Dyms2NNGauI4HY1dhmkvNBopAAfI1XaZ47L/SqnrY0rlS3Bq5TP57BSWgyUVmCpqO7xoUQcdQU8g9Wnz1hdDpFmWD3OMlX+UK1RoqnkD1g93DaggcWLr3eXY6+/jl7mIQXLMuoCgeDmyxoh7NhNGzEGeRUDGr6hGKQqFhVtKewA3UHAqUllT1jg8+VLS5QTFCNH3j0MirmdvGEqpvy7/xbmITelGcmum3CM74dASxOC5fKZZNJmCl3teoOudChJwLEdLgdh3dccJkQrXz5wAGcBu0fHZ09w/NUVSf0x7ZTSI6nFC5qDm057HNCdU2ao7HriEhNxQPCzK/dR+DwERCRfUYh7MTBxowlUD1YiKh4l5OGdb2M7XZVAy/oTWqUC2ipgQ9m2FCRXHCSDdrGeBuXr76DsdVXCpwsHvkbgjZ3NjxEynT/Pz+Fxpxo53x7n2NWUqscm/yvH+ziR9OuUJN5BaMPBrIBdQOMR2NDoUIV4/aBE1uW+7eDT9vCwg59hjONzhWoOL0WgNzoh6xBzmFaidYbndsiDghRNBbJMdRUbiDP65HO7ZCxWtrFV2E55R0jCGxVMcuwk2aqA5u6PaxnFqcqlCrYd9jC32rdCXuzI+gUqS81+/sRt8qNj+icnc7yrmS+J35aQ6wpCrnsxisKspV33TTntVgUu9rsKqUiIyWQQwO8iKDCEymDR4WYxfi3jAvrfze+DhC1qOPubc0gg7+oerb9hPBvEemc2/5keILgauc/RMrWwF33Bc5N67tSDQ9tU4h7FAbFENzJLqXI0HEY4Mu0/F7nqiQNHSH5OMIj0y3NInCk1/kIjPXV2EAY0J0E2Sn/qFUm5vX0vwjDd6K5F04+qGj85NP4j8ZsMJ1jNvAMQAAAABJRU5ErkJggg=="
            />
        </defs>
    </svg>
);
