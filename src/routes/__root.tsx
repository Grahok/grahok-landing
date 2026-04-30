import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles/global.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import RootProviders from "./-providers";
import { GTM_ID } from "@/features/gtm/constants";
import NotFound from "@/features/root/components/errors/NotFound";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    ...generateMetadata({
      charSet: "utf-8",
      viewport: {
        width: "device-width",
        initialScale: 1,
      },
    }),
    links: [
      // Preconnect to external domains
      {
        rel: "preconnect",
        href: "https://www.googletagmanager.com",
      },
      {
        rel: "preconnect",
        href: "https://www.google-analytics.com",
      },
      {
        rel: "dns-prefetch",
        href: "https://www.googletagmanager.com",
      },
      // Preload CSS for faster loading
      {
        rel: "preload",
        href: appCss,
        as: "style",
      },
      // Fallback for browsers without JavaScript
      {
        rel: "stylesheet",
        href: appCss,
        "data-noscript": "",
      },
    ],
    scripts: [
      {
        children: `
// Load CSS asynchronously
(function() {
  var links = document.querySelectorAll('link[rel="preload"][as="style"]');
  Array.prototype.forEach.call(links, function(link) {
    link.onload = function() {
      this.onload = null;
      this.rel = 'stylesheet';
    };
  });
  
  // Fallback for browsers that don't support onload on link elements
  setTimeout(function() {
    var links = document.querySelectorAll('link[rel="preload"][as="style"]');
    Array.prototype.forEach.call(links, function(link) {
      if (link.rel !== 'stylesheet') {
        link.rel = 'stylesheet';
      }
    });
  }, 3000);
})();

// Initialize GTM data layer early
window.dataLayer = window.dataLayer || [];

// Defer GTM loading until after page is interactive
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadGTM();
  });
} else {
  // Page already loaded
  setTimeout(loadGTM, 0);
}

function loadGTM() {
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
}
    `,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <Analytics />
        </RootProviders>
        <Scripts />
        <SpeedInsights />
      </body>
    </html>
  );
}
