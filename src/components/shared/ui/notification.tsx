import React from "react";
import tw, { styled } from "twin.macro";

type Action = { variant?: "primary" | "secondary"; title: string; onAction: () => void };

export type NotificationProps = {
    type?: "alert" | "notice";
    title?: string;
    actions?: Action[];
    description: string;
};

export const Notification: React.FC<NotificationProps> = ({
    type = "notice",
    title = "Alert",
    description,
    actions,
}) => {
    return (
        <Container $type={type}>
            <Header>
                <Title $type={type}>{title}</Title>
                <Description $type={type}>{description}</Description>
            </Header>

            <div tw="flex justify-end gap-4">
                {actions?.map(({ variant = "primary", title, onAction }, index, array) => {
                    const isSingleButton = index === 0 && array.length === 1;
                    return (
                        <ActionButton
                            css={isSingleButton && tw`w-full`}
                            key={title}
                            onClick={onAction}
                            $variant={variant}
                            $type={type}
                        >
                            <ActionText>{title}</ActionText>
                        </ActionButton>
                    );
                })}
            </div>
        </Container>
    );
};

const Container = styled.div<{ $type: "alert" | "notice" }>`
    ${tw`py-4 px-[1.125rem]`}
    ${tw`flex flex-col gap-[0.375rem]`}
    ${tw`h-fit w-[calc(100vw_-_3.25rem)] min-w-[16.5rem]`}
    ${tw`fixed bottom-0 left-0 z-20 mx-[1.625rem] mb-[2.875rem]`}
    ${tw`desktop:(static m-0 w-full flex-row justify-between gap-2 px-[1.375rem] min-w-[34.5rem])`}
    ${({ $type }) =>
        $type === "alert"
            ? tw`text-black bg-[var(--accent)] desktop:mb-[1.625rem]`
            : tw`text-white bg-[#2e2e2e] desktop:(fixed bottom-0 left-0 z-20 items-center mx-[1.625rem] mb-[2.875rem] w-[calc(100vw_-_3.25rem)])`};
`;

const Header = tw.div`grid gap-2`;
const Title = styled.span<{
    $type?: "alert" | "notice";
}>`
    ${({ $type = "notice" }) =>
        $type === "alert" ? tw`bg-[var(--accent)]` : tw`bg-[#2e2e2e] text-[rgba(255,255,255,0.4)]`}
    ${tw`sticky top-0 text-14-16 leading-4`}
`;

const Description = styled.span<{
    $type?: "alert" | "notice";
}>`
    ${tw`text-18-22`}
    ${({ $type = "notice" }) => ($type === "alert" ? tw`overflow-hidden overflow-ellipsis` : tw``)}
`;

const ActionButton = styled.button<{
    $type: "alert" | "notice";
    $variant?: "primary" | "secondary";
}>`
    ${({ $type, $variant }) => {
        if ($type === "alert") {
            return tw`bg-black text-white`;
        }

        if ($type === "notice") {
            if ($variant === "secondary") {
                return tw`border border-solid bg-transparent text-white border-[rgba(255,255,255,0.3)]`;
            }

            if ($variant === "primary") {
                return tw`bg-white text-black`;
            }
        }
    }}
    ${tw`mt-1 flex items-center justify-center py-3 px-[1.625rem] h-[2.75rem] desktop:mt-0`}
`;
const ActionText = tw.span`leading-5 text-[1rem] desktop:whitespace-nowrap`;
