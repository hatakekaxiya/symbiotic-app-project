import React from "react";
import tw, { css, styled } from "twin.macro";

import { Card } from "@/components/shared/ui/card";

type Props = {
    text: string;
};

export const Description: React.FC<Props> = ({ text }) => {
    return (
        <div tw="relative">
            <Card tw="overflow-auto max-h-[34.125rem]" css={customScrollbar}>
                <Header tw="pt-[1.125rem]">
                    <Title>DESCRIPTION</Title>
                </Header>

                <Content>
                    <Text>{text}</Text>
                </Content>
            </Card>

            <Gradient />
        </div>
    );
};

const customScrollbar = css`
    & {
        scrollbar-color: auto;
    }
`;

const Header = tw.header`sticky top-0 border-b border-solid px-5 pb-3 bg-[#0D0D0D] border-[var(--border-color)]`;
const Title = tw.span`text-14-16 leading-4`;
const Content = tw.div`p-[1.125rem]`;
const Text = tw.span`whitespace-pre-line text-16-18`;
const Gradient = styled.div`
    ${tw`absolute left-1/2 bottom-0 -translate-x-1/2 w-[calc(100%_-_2px)] h-[2.5rem]`}
    ${tw`pointer-events-none border-b border-solid border-[var(--border-color)]`}
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
`;
