import { CarouselApi } from "@/components/ui/carousel";
import { useState, lazy, Suspense } from "react";
import Footer from "./Footer";
import { useLandingPage } from "../contexts/LandingPageContext";
import { useLandingPageOffer } from "../hooks/useLandingPageOffer";
import { Marquee } from "@/components/ui/saw/marquee";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load components that are not needed immediately
const ProductsCarousel = lazy(() => import("./ProductsCarousel"));
const CustomerInformation = lazy(() => import("./CustomerInformation"));
const LandingPageCart = lazy(() => import("./LandingPageCart"));
const OrderSummary = lazy(() => import("./OrderSummary"));
const RelatedProducts = lazy(() => import("./RelatedProducts"));
const OrderSuccessModal = lazy(() => import("./OrderSuccessModal"));

// Skeleton loaders for each component
function ProductsCarouselSkeleton() {
  return (
    <div className="container mx-auto scroll-mt-26 space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="flex gap-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

function CustomerInformationSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-3/4" />
    </div>
  );
}

function LandingPageCartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function OrderSummarySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export default function LandingPageWrapper() {
  const [api, setApi] = useState<CarouselApi>();
  const { productsNotPresentInCart } = useLandingPage();
  const { offer } = useLandingPageOffer();

  return (
    <>
      {offer?.bannerText && (
        <div className="bg-primary text-primary-foreground overflow-hidden py-2">
          <Marquee className="[--duration:20s] [--gap:360px]" pauseOnHover>
            {offer?.bannerText}
          </Marquee>
        </div>
      )}
      <section className="py-4 md:p-4 space-y-12">
        <Suspense fallback={<ProductsCarouselSkeleton />}>
          <ProductsCarousel setApi={setApi} />
        </Suspense>
        <section className="container mx-auto grid grid-cols-1">
          <div className="space-y-12">
            {productsNotPresentInCart.length > 0 && (
              <Suspense fallback={<RelatedProductsSkeleton />}>
                <RelatedProducts api={api} />
              </Suspense>
            )}
            <div className="space-y-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Suspense fallback={<LandingPageCartSkeleton />}>
                <LandingPageCart />
              </Suspense>
              <Suspense fallback={<CustomerInformationSkeleton />}>
                <CustomerInformation />
              </Suspense>
              <Suspense fallback={<OrderSummarySkeleton />}>
                <OrderSummary />
              </Suspense>
            </div>
          </div>
        </section>
      </section>
      <Footer />
      <Suspense fallback={null}>
        <OrderSuccessModal />
      </Suspense>
    </>
  );
}
