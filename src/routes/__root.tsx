import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { SpeedInsights } from "@vercel/speed-insights/react";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles/global.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { checkIsAuthenticatedServer } from "@/features/auth/actions/server";
import RootProviders from "./-providers";
import { GTM_ID } from "@/features/gtm/constants";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ["isAuthenticated"],
      queryFn: checkIsAuthenticatedServer,
    });
  },
  head: () => ({
    ...generateMetadata({
      charSet: "utf-8",
      viewport: {
        width: "device-width",
        initialScale: 1,
      },
    }),
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        children: `
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),
      dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');

window.dataLayer = window.dataLayer || [];
    `,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <RootProviders>
          {children}
          {process.env.NODE_ENV === "development" && (
            <TanStackDevtools
              config={{
                position: "bottom-right",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          )}
          <Toaster richColors closeButton />
        </RootProviders>
        <Scripts />
        <SpeedInsights />
      </body>
    </html>
  );
}
