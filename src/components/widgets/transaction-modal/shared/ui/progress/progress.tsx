import React from "react";
import tw, { css, styled } from "twin.macro";

import ActiveLoaderIcon from "./assets/active-loader.svg?react";
import ChainImg from "./assets/chain.svg?react";
import DoneIcon from "./assets/done-icon.svg?react";
import SecondaryLoaderIcon from "./assets/secondary-loader.svg?react";
import WarningIcon from "./assets/warning.svg?react";

export type TransactionProgressStage = {
    title: string;
    description: string;
    progress?: boolean;
    error?: boolean;
    done?: boolean;
    link?: string;
};
type Props = {
    stages: TransactionProgressStage[];
};

export const Progress: React.FC<Props> = ({ stages }) => {
    return (
        <Container>
            {stages.map(
                ({ title, description, link, progress = false, done = false, error = false }) => (
                    <Stage key={title} $inProgress={progress}>
                        <StageLoader $inProgress={progress}>
                            {progress ? (
                                <ActiveLoaderIcon tw="animate-spin" />
                            ) : done ? (
                                <DoneIcon />
                            ) : error ? (
                                <WarningIcon />
                            ) : (
                                <SecondaryLoaderIcon />
                            )}
                            <StageChain data-testid="stage-chain" />
                        </StageLoader>

                        <div tw="grid gap-1">
                            <StageTitle>{title}</StageTitle>
                            <span>
                                <StageDescription>{description}</StageDescription>{" "}
                                {link && <StageDocsLink href={link}>docs →</StageDocsLink>}
                            </span>
                        </div>
                    </Stage>
                ),
            )}
        </Container>
    );
};

const Container = tw.section`grid border-b border-solid border-[var(--border-color)]`;

const Stage = styled.div<{ $inProgress: boolean }>(
    ({ $inProgress }) => css`
        ${$inProgress && tw`bg-[rgba(255, 255, 255, 0.05)]`}
        ${tw`flex gap-4 px-6 py-4 [&:last-child_[data-testid="stage-chain"]]:hidden`}
    `,
);
const StageLoader = styled.div<{ $inProgress: boolean }>(
    ({ $inProgress }) => css`
        ${tw`relative flex shrink-0 items-center justify-center`}
        ${tw`bg-[var(--light-black-color-10)] h-[3.125rem] w-[3.125rem]`}
        ${$inProgress && tw`bg-[rgba(182, 255, 62, 0.2)]`}
    `,
);
const StageTitle = tw.span`leading-6 text-[1.25rem]`;
const StageDescription = tw.span`text-14-16 leading-4 text-[var(--light-black-color-50)]`;
const StageDocsLink = tw.a`text-14-16 leading-4 text-[var(--accent)] hover:underline`;
const StageChain = tw(ChainImg)`absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full`;
