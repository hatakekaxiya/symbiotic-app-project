import "@/components/shared/globals.css";
import "@/components/shared/assets/font/BerkeleyMono.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Global } from "@emotion/react";
import {
    Chain,
    connectorsForWallets,
    darkTheme,
    getDefaultWallets,
    RainbowKitProvider,
    Theme,
} from "@rainbow-me/rainbowkit";
import { ledgerWallet, trustWallet } from "@rainbow-me/rainbowkit/wallets";
import * as Sentry from "@sentry/react";
import { wrapUseRoutes } from "@sentry/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import merge from "lodash.merge";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
    createRoutesFromChildren,
    matchRoutes,
    RouteObject,
    useLocation,
    useNavigationType,
    useRoutes,
} from "react-router-dom";
import tw, { css, GlobalStyles } from "twin.macro";
import { createClient, fallback } from "viem";
import { createConfig, http, WagmiProvider } from "wagmi";
import * as allChains from "wagmi/chains";

import { ErrorComponent } from "@/_error.tsx";
import { AcceptCookies } from "@/components/features/accept-cookies.tsx";
import { CollateralPage } from "@/components/pages/collateral-page/collateral-page.tsx";
import { RestakePage } from "@/components/pages/restake-page/restake-page.tsx";
import { RootPage } from "@/components/pages/root/root-page.tsx";
import {
    ConnectModalContainer,
    ConnectModalProvider,
} from "@/components/shared/connect-modal-context.tsx";
import {
    SymbioticDataProvider,
    SymbioticServerData,
} from "@/components/shared/hooks/web3/symbiotic-data-provider.tsx";
import {
    NotificationContainer,
    NotificationProvider,
} from "@/components/shared/notification-context.tsx";
import { Header } from "@/components/shared/ui/header/header.tsx";
import { RegionModalContainer } from "@/components/widgets/region-modal.tsx";

const customStyles = css();

const appName = Symbiotic.WAGMI_APP_NAME;
const projectId = Symbiotic.WAGMI_PROJECT_ID;
const chainId = Number(Symbiotic.WAGMI_CHAIN_ID);
const rpc1 = Symbiotic.WAGMI_RPC_1;
const rpc2 = Symbiotic.WAGMI_RPC_2;

const chains: [Chain, ...Chain[]] = [
    Object.values(allChains).find((x) => x.id === chainId) as Chain,
];

const defaultWallets = getDefaultWallets().wallets[0];

const connectors = connectorsForWallets(
    [
        defaultWallets,
        {
            groupName: "More",
            wallets: [trustWallet, ledgerWallet],
        },
    ],
    { appName, projectId },
);

const rainbowkitTheme = merge(
    darkTheme({
        borderRadius: "none",
    }),
    {
        colors: {
            accentColor: "#b6ff3e",
            accentColorForeground: "black",
            modalBackground: "#191919",
        },
        fonts: {
            body: "var(--font-berkeley)",
        },
    } as Theme,
);

export const wagmiConfig = createConfig({
    connectors,
    chains,
    ssr: true,
    client({ chain }) {
        if (chain.id === chainId) {
            const rpcs = [];
            if (rpc1) {
                rpcs.push(http(rpc1));
            }
            if (rpc2) {
                rpcs.push(http(rpc2));
            }
            rpcs.push(http());
            return createClient({ chain, transport: fallback(rpcs) });
        }
        return createClient({ chain, transport: http() });
    },
});
const queryClient = new QueryClient();

Sentry.init({
    dsn: Symbiotic.SENTRY_DSN,
    integrations: [
        Sentry.reactRouterV6BrowserTracingIntegration({
            useEffect: React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        }),
    ],
    tracesSampleRate: 1.0,
});

export type AppProps = {
    symbioticData: SymbioticServerData;
};

export const symbioticRoutes: RouteObject[] = [
    { path: "restake", element: <RestakePage /> },
    { path: "dashboard", element: <RootPage /> },
    { path: "restake/:collateral", element: <CollateralPage /> },
    { path: "*", element: <ErrorComponent /> },
];

const useSentryRoutes = wrapUseRoutes(useRoutes);

const App: React.FC<AppProps> = (appProps) => {
    // TODO: remove when https://github.com/MetaMask/metamask-extension/issues/25097 is fixed
    useEffect(() => {
        window?.ethereum?.on("chainChanged", async (chainId: number) => {
            window?.ethereum?.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId }],
            });
        });
    }, []);

    const routes = useSentryRoutes(symbioticRoutes);

    return (
        <Sentry.ErrorBoundary>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <SymbioticDataProvider appProps={appProps}>
                        <NotificationProvider show={false}>
                            <RainbowKitProvider theme={rainbowkitTheme} locale={"en"}>
                                <ConnectModalProvider show={false}>
                                    {/*<GoogleTagManager gtmId="GTM-KV246C3L" />*/}
                                    <Helmet>
                                        <meta charSet="UTF-8" />
                                        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                                        <meta
                                            name="viewport"
                                            content="width=device-width, initial-scale=1, minimum-scale=1"
                                        />
                                        <title>Symbiotic - App</title>
                                        <meta name="title" content="Symbiotic - App" />
                                        <meta
                                            name="description"
                                            content="Symbiotic is a generalized shared security system enabling decentralized networks to bootstrap powerful, fully sovereign ecosystems."
                                        />

                                        <meta property="og:type" content="website" />
                                        <meta
                                            property="og:url"
                                            content="https://app.symbiotic.fi/"
                                        />
                                        <meta property="og:title" content="Symbiotic - App" />
                                        <meta
                                            property="og:description"
                                            content="Symbiotic is a generalized shared security system enabling decentralized networks to bootstrap powerful, fully sovereign ecosystems."
                                        />
                                        <meta
                                            property="og:image"
                                            content="https://app.symbiotic.fi/lines.png"
                                        />

                                        <meta
                                            property="twitter:card"
                                            content="summary_large_image"
                                        />
                                        <meta
                                            property="twitter:url"
                                            content="https://app.symbiotic.fi/"
                                        />
                                        <meta property="twitter:title" content="Symbiotic - App" />
                                        <meta
                                            property="twitter:description"
                                            content="Symbiotic is a generalized shared security system enabling decentralized networks to bootstrap powerful, fully sovereign ecosystems."
                                        />
                                        <meta
                                            property="twitter:image"
                                            content="https://app.symbiotic.fi/lines.png"
                                        />
                                    </Helmet>
                                    <main>
                                        <Global styles={customStyles} />
                                        <GlobalStyles />
                                        <Header />
                                        <ComponentWrapper>
                                            <RegionModalContainer />
                                            <ConnectModalContainer />
                                            <NotificationContainer />
                                            {routes}
                                            <AcceptCookies />
                                        </ComponentWrapper>
                                    </main>
                                </ConnectModalProvider>
                            </RainbowKitProvider>
                        </NotificationProvider>
                    </SymbioticDataProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </Sentry.ErrorBoundary>
    );
};

const ComponentWrapper = tw.div`py-4 px-4 desktop:(py-[2.5rem] px-[4.375rem])`;

export default App;
