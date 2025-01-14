// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as Sentry from "@sentry/react";
import React, { useEffect, useLayoutEffect } from "react";
import tw, { styled } from "twin.macro";

import { useReducerAsState } from "@/components/shared/hooks/user-reducer-as-state";
import { Button } from "@/components/shared/ui/button";
import { Modal } from "@/components/shared/ui/modal";

const HOME_LINK = "https://symbiotic.fi";
const UNSUPPORTED_COUNTRIES = ["CU", "IR", "KP", "SY", "UA", "US", "CA"];

export const RegionModalContainer: React.FC = () => {
    const [{ forbid, termsOfUse }, setState] = useReducerAsState<{ forbid: string | boolean }>({
        forbid: "unset",
        termsOfUse: "https://app.gprptest.net/terms_of_use.pdf",
    });

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
                const data = await response.text();

                // Convert the response to a key-value pair object
                const result = data.split("\n").reduce((acc, line) => {
                    const [key, value] = line.split("=");
                    acc[key] = value;
                    return acc;
                }, {});

                if (UNSUPPORTED_COUNTRIES.includes(result.loc)) {
                    setState({ forbid: true });
                }
            } catch (error: { message?: string }) {
                console.error("Error fetching country:", error);
                if (error?.message !== "Failed to fetch") {
                    Sentry.captureException(error);
                }
            }
        };

        fetchCountry();
    }, [setState]);

    useLayoutEffect(() => {
        if (!window.location.host.includes("localhost")) {
            setState({
                termsOfUse: `https://${window.location.host}/terms_of_use.pdf`,
            });
        }
    }, [setState]);

    if (!forbid || forbid === "unset") return;

    return (
        <Dialog>
            <Title>UNSUPPORTED REGION</Title>

            <Content>
                <span tw="flex flex-col gap-3">
                    <Description>
                        Unfortunately, you are visiting Symbiotic from a country or region that is
                        not supported.
                    </Description>

                    <Description>
                        You can try again when traveling to or located in a supported region based
                        on our{" "}
                        <TermsLink href={termsOfUse} target="_blank">
                            Terms of Use
                        </TermsLink>
                        .
                    </Description>
                </span>
                <Button as="a" $theme="accent" href={HOME_LINK} tw="text-center">
                    RETURN HOME
                </Button>
            </Content>
        </Dialog>
    );
};

const Dialog = styled(Modal)`
    ${tw`overflow-visible !max-w-[23.625rem] py-[1.375rem]`}
    ${tw`!min-w-[23.625rem] mobile:(fixed bottom-0 mb-2 !max-w-fit w-[calc(100%_-_1rem)])`}
`;
const Title = tw.header`flex items-center border-b border-solid text-18-20 pb-[1.375rem] px-[1.625rem] border-[var(--border-color)]`;
const Content = tw.div`flex flex-col gap-5 pt-[1.375rem] px-[1.625rem]`;
const Description = tw.span`text-16-20 text-[var(--light-black-color-50)]`;

const TermsLink = styled.a`
    all: unset;
    ${tw`cursor-pointer underline text-[var(--accent)]`}
`;
