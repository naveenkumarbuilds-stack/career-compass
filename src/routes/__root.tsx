import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider, LocalizedMetadata, pageMeta, useI18n } from "@/i18n";
import { AuthProvider } from "@/lib/auth";
import { SiteHeader, BottomNav, SiteFooter } from "@/components/site/Navigation";
import { ReviewBadge } from "@/components/site/Brand";
import { Toaster } from "@/components/ui/sonner";
import { buttonVariants } from "@/components/ui/button";

function NotFoundComponent() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-7xl font-bold text-navy">{t("notFound.code")}</h1>
      <h2 className="mt-4 text-2xl font-bold">{t("notFound.title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("notFound.body")}</p>
      <Link to="/" className={buttonVariants({ className: "mt-6" })}>
        {t("common.backHome")}
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const { t } = useI18n();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">{t("errorPage.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("errorPage.body")}</p>
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className={buttonVariants()}
        >
          {t("common.tryAgain")}
        </button>
        <a href="/" className={buttonVariants({ variant: "outline" })}>
          {t("common.backHome")}
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const base = pageMeta("meta.homeTitle", "meta.homeDescription");
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        ...base.meta,
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Baloo+Tamma+2:wght@500;700;800&family=Noto+Sans+Kannada:wght@400;600;700&family=Nunito:wght@400;600;700;800&display=swap",
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <I18nProvider><LocalizedMetadata />{children}</I18nProvider>
        <Scripts />
      </body>
    </html>
  );
}

function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      {t("common.skipToContent")}
    </a>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SkipLink />
          <ReviewBadge />
          <SiteHeader />
          <main id="main" className="min-h-[70vh] pb-20 lg:pb-0">
            <Outlet />
          </main>
          <SiteFooter />
          <BottomNav />
          <Toaster position="top-center" />
        </AuthProvider>
    </QueryClientProvider>
  );
}

