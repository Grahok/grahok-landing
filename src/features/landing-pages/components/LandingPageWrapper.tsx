import CustomerInformation from "./CustomerInformation";
import LandingPageCart from "./LandingPageCart";
import OrderSummary from "./OrderSummary";
import OrderSuccessModal from "./OrderSuccessModal";
import ProductsCarousel from "./ProductsCarousel";
import RelatedProducts from "./RelatedProducts";
import { CarouselApi } from "@/components/ui/carousel";
import { useState } from "react";
import Footer from "./Footer";

export default function LandingPageWrapper() {
  const [api, setApi] = useState<CarouselApi>();
  return (
    <>
      <section className="p-4 space-y-12">
        <ProductsCarousel setApi={setApi} />
        <section
          className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <div className="space-y-12">
            <RelatedProducts api={api} />
            <LandingPageCart />
            <CustomerInformation />
          </div>
          <OrderSummary />
        </section>
      </section>
      <Footer />
      <OrderSuccessModal />
    </>
  );
}
