import React from "react";
import tw from "twin.macro";

import { GetStarted } from "@/components/pages/root/widgets/get-started";
import { SectionTitle } from "@/components/shared/ui/section-title";

import { RestakeTable } from "./widgets/restake-table/restake-table";

export const RestakePage: React.FC = () => {
    return (
        <>
            <Root>
                <GetStarted />
                <SectionTitle title="Restake" subtitle="Select to view details" />
                <RestakeTable />
            </Root>
        </>
    );
};

const Root = tw.div`flex flex-col items-start gap-10 mobile:gap-6 xl:gap-7`;
