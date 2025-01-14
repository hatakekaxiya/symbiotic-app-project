import React, { ReactNode, useEffect, useMemo } from "react";
import tw, { css, styled } from "twin.macro";

import { useReducerAsState } from "../hooks/user-reducer-as-state";

type TabType = { name: string; content: ReactNode };

type Props = {
    tabs: TabType[];
    defaultTabName?: string;
    inModal?: boolean;
    onTabClick: (tabName: string) => void;
};

const tabBarGap = 30; //px
const tabBarPx = 26; //px

export const Tabs: React.FC<React.PropsWithChildren<Props>> = ({
    tabs,
    defaultTabName,
    inModal,
    onTabClick,
}) => {
    const [{ selectedTab, tabsWidths }, setState] = useReducerAsState<{
        selectedTab: { name: string; position: number } | null;
        tabsWidths: number[];
    }>({
        selectedTab: {
            name: defaultTabName || tabs?.[0].name || "",
            position:
                tabs.findIndex((tab) => tab.name === defaultTabName) >= 0
                    ? tabs.findIndex((tab) => tab.name === defaultTabName) + 1
                    : 1,
        },
        tabsWidths: [],
    });

    const stalkerShift = useMemo(() => {
        if (selectedTab?.position) {
            const tabIndex = selectedTab.position - 1;

            return (
                tabBarPx +
                tabBarGap * tabIndex +
                tabsWidths.slice(0, tabIndex).reduce((acc, curr) => acc + curr, 0)
            );
        }
        return 0;
    }, [selectedTab?.position, tabsWidths]);

    useEffect(() => {
        const elements = document.querySelectorAll('[data-testid="modal-tab"]');
        const tabsWidths = Array.from(elements)
            .map((el) => (el as HTMLElement).offsetWidth)
            .filter(Boolean);
        setState({ tabsWidths });
    }, [setState]);

    return (
        <Content css={inModal && tw`bg-[#191919]`}>
            <TabBar>
                {tabs.map(({ name }, index) => (
                    <Tab
                        key={name}
                        data-testid="modal-tab"
                        onClick={() => {
                            setState({ selectedTab: { name, position: index + 1 } });
                            onTabClick(name);
                        }}
                    >
                        {name}
                    </Tab>
                ))}
                <TabStalker
                    $shift={stalkerShift}
                    $width={tabsWidths[selectedTab?.position ? selectedTab?.position - 1 : 0]}
                />
            </TabBar>

            <PaddingWrapper>
                {tabs.find(({ name }) => name === selectedTab?.name)?.content}
            </PaddingWrapper>
        </Content>
    );
};

const PaddingWrapper = tw.div`py-8 px-[1.625rem]`;

const Content = styled.div`
    --bg-color: #0d0d0d;
    ${tw`rounded-none p-0 desktop:min-w-[40.25rem]`}
`;
const TabBar = styled.div`
    ${tw`relative flex flex-nowrap gap-[1.875rem]`}
    ${tw`border-b h-[3.875rem] px-[1.625rem] border-[var(--border-color)]`}
`;
const Tab = tw.div`flex h-full cursor-pointer items-center`;
const TabStalker = styled.div<{ $width: number; $shift: number }>(
    ({ $width, $shift }) => css`
        width: ${$width}px;
        transform: translateX(${$shift}px);
        ${tw`h-px bg-[var(--accent)]`}
        ${tw`absolute left-0 -bottom-px cursor-pointer`}
        ${tw`duration-300 transition-[transform,width]`}
    `,
);
