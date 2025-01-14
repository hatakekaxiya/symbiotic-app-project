import React from "react";
import tw from "twin.macro";

type Props = {
    succeed: boolean;
    hasError: boolean;
    onAccept: () => void;
    onRequestResend: () => void;
    onTryAgain: () => void;
    onCancel: (succeed?: boolean) => void;
};

export const Footer: React.FC<Props> = ({ succeed, hasError, onAccept, onTryAgain, onCancel }) => {
    return (
        <Container css={hasError && tw`py-[0.875rem]`}>
            {succeed && <AcceptButton onClick={onAccept}>Finish</AcceptButton>}

            {hasError && (
                <div tw="grid gap-4">
                    <ErrorBlock>Failed: request rejected by wallet</ErrorBlock>
                    <TryAgainButton onClick={onTryAgain}>Try again</TryAgainButton>
                </div>
            )}

            {!succeed && !hasError && (
                <>
                    {/*<ResendRequest onClick={onRequestResend}>*/}
                    {/*    <ResendIcon />*/}
                    {/*    <Text>RESEND REQUEST</Text>*/}
                    {/*</ResendRequest>*/}
                    <div className="invisible" />

                    <Text
                        onClick={() => onCancel(succeed)}
                        tw="text-red-500 transition-colors hover:text-red-800"
                    >
                        CLOSE
                    </Text>
                </>
            )}
        </Container>
    );
};

const Container = tw.footer`flex items-center justify-between gap-2 p-6`;
const AcceptButton = tw.button`w-full cursor-pointer text-black leading-6 h-[3.625rem] bg-[var(--accent)] text-[1.25rem]`;
const TryAgainButton = tw.button`w-full cursor-pointer bg-[rgba(255, 255, 255, 0.2)] text-white leading-6 h-[3.625rem] text-[1.25rem]`;
// const ResendRequest = tw.div`flex items-center gap-2`;
const Text = tw.button`text-14-16 leading-4`;
const ErrorBlock = tw.div`bg-[rgba(255, 70, 70, 0.1)] py-4 px-6 text-[rgba(255, 70, 70, 1)] leading-6 text-[1.25rem] mobile:text-center`;
