import React from "react";
import tw from "twin.macro";

type Props = {
    title: string;
    subtitle: string;
};

export const SectionTitle: React.FC<Props> = ({ title, subtitle }) => {
    return (
        <Root>
            <Title>{title}</Title>
            <Spacer tw="mobile:hidden" />
            <Subtitle tw="mobile:hidden">{subtitle}</Subtitle>
        </Root>
    );
};

const Root = tw.div`flex flex-row items-center gap-6 h-[42px]`;
const Title = tw.div`text-24-26 uppercase`;
const Subtitle = tw.div`text-16-18 uppercase opacity-50`;
const Spacer = tw.div`h-full w-[1px] bg-[var(--light-gray-color-20)]`;
