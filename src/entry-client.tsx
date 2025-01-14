import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import App from "@/_app.tsx";

// @ts-expect-error initialProps defined
const initialProps = window.__INITIAL_PROPS__;

// Hydration of the ids in `data-emotion-css` will automatically occur when the cache is created
const cache = createCache({ key: "next", speedy: false });

hydrateRoot(
    document.getElementById("root")!,
    <CacheProvider value={cache}>
        <HelmetProvider>
            <BrowserRouter>
                <App {...initialProps} />
            </BrowserRouter>
        </HelmetProvider>
    </CacheProvider>,
);
