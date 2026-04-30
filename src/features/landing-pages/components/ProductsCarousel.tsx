import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  LandingPageContextType,
  useLandingPage,
} from "../contexts/LandingPageContext";
import { Image } from "@unpic/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  IconBrandWhatsappFilled,
  IconChevronLeft,
  IconChevronRight,
  IconMinus,
  IconPlus,
  IconShoppingCart,

} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ButtonGroup } from "@/components/ui/button-group";
import React from "react";
import { PhoneCall } from "lucide-react";

export default function ProductsCarousel({
  setApi,
}: {
  setApi: (api: CarouselApi) => void;
}) {
  const { landingPage } = useLandingPage();
  const landingPageProducts = landingPage.landingPageProducts;

  return (
    <section className="container mx-auto scroll-mt-26">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {landingPageProducts.map((landingPageProduct) => (
            <CarouselItem key={landingPageProduct.id}>
              <ProductCard landingPageProduct={landingPageProduct} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          size="icon-lg"
          variant="default"
          className="left-2 top-1/2 -translate-y-1/2"
          aria-label="Previous product"
        >
          <IconChevronLeft />
        </CarouselPrevious>
        <CarouselNext
          size="icon-lg"
          variant="default"
          className="right-2 top-1/2 -translate-y-1/2"
          aria-label="Next product"
        >
          <IconChevronRight />
        </CarouselNext>
      </Carousel>
    </section>
  );
}

const ProductCard = React.memo(function ProductCard({
  landingPageProduct,
}: {
  landingPageProduct: LandingPageContextType["landingPage"]["landingPageProducts"][number];
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 99));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));
  const { addToCart, productPresentInCart } = useLandingPage();

  const isProductInCart = productPresentInCart(landingPageProduct.product.id);



  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-2 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Image Gallery Section */}
          <div className="space-y-6">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                className="w-full h-full object-cover"
                src={landingPageProduct.product.images[activeImageIndex]}
                alt={landingPageProduct.product.name}
                priority={true}
                background="auto"
                loading="lazy"
                width={800}
                height={800}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {landingPageProduct.product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`shrink-0 rounded-md border-2 transition-all ${index === activeImageIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                    }`}
                  aria-label={`View ${landingPageProduct.product.name} image ${index + 1}`}
                  aria-pressed={index === activeImageIndex}
                >
                  <Image
                    className="rounded-md"
                    src={image}
                    alt=""
                    width={60}
                    height={60}
                    loading="lazy"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                {landingPageProduct.product.name}
              </h1>
              <div className="prose prose-gray max-w-none">
                <p className="text-base leading-relaxed dark:text-gray-200 text-gray-700">
                  {landingPageProduct.description}
                </p>
              </div>
            </div>

            <Separator />

            {/* Price & Quantity Controls */}
            <div className="flex   items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row gap-2 justify-center items-center border rounded-md px-4 py-1 font-bold">
                <h3 className="text-xl md:text-lg font-medium text-nowrap">
                  Unit Price
                </h3>
                <p className="dark:text-gray-200 text-gray-700  font-bold text-xl">
                  ৳ {landingPageProduct.product.sellPrice}
                </p>
              </div>

              <div className="flex gap-2 justify-center items-center border rounded-md px-4 py-1 font-bold">
                <ButtonGroup aria-label="Quantity controls">
                  <Button
                    size="icon-lg"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1 || isProductInCart}
                    aria-label="Decrease quantity"
                  >
                    <IconMinus />
                  </Button>
                  <Input
                    id="quantity-input"
                    aria-label="Quantity"
                    className="text-center h-auto w-20"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.valueAsNumber || 1)}
                    min={1}
                    disabled={isProductInCart}
                  />
                  <Button
                    size="icon-lg"
                    onClick={incrementQuantity}
                    disabled={isProductInCart}
                    aria-label="Increase quantity"
                  >
                    <IconPlus />
                  </Button>
                </ButtonGroup>
              </div>

              <div className="flex flex-col md:flex-row gap-2 justify-center items-center border rounded-md px-4 py-1 font-bold">
                <h3 className="text-xl md:text-lg font-medium text-nowrap">
                  Total Price
                </h3>
                <p className="dark:text-gray-200 text-gray-700 font-bold text-xl">
                  ৳ {landingPageProduct.product.sellPrice * quantity}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex  gap-3">
              <Button
                size="lg"
                className="flex-1 min-h-3"
                onClick={() => {
                  addToCart(landingPageProduct.product, quantity);
                  setQuantity(1);
                  window.dataLayer.push({
                    event: "add_to_cart",
                    currency: "BDT",
                    value: landingPageProduct.product.sellPrice * quantity,
                    contents: [
                      {
                        item_id: landingPageProduct.product.id,
                        item_name: landingPageProduct.product.name,
                        price: landingPageProduct.product.sellPrice,
                        quantity: quantity,
                      },
                    ],
                  });
                }}
                disabled={
                  quantity <= 0 ||
                  productPresentInCart(landingPageProduct.product.id)
                }
                asChild
              >
                <a href="#order-section" >
                  <IconShoppingCart className="h-4 w-4 mr-2" />
                  {productPresentInCart(landingPageProduct.product.id)
                    ? "Added to Cart"
                    : "Buy Now"}
                </a>
              </Button>
            </div>

            <Separator />

            {/* Product Specification */}
            <div className=" flex flex-col md:flex-row gap-5 ">


              <div className="bg-gray-600  rounded-md px-4 py-2 font-medium md:w-1/2 w-full text-center text-white hover:text-gray-900 hover:bg-gray-300 transition-colors duration-200">

                <a href="tel:+8801973040204" className="flex items-center justify-center gap-5"><PhoneCall className="w-5 h-5" /> Call for Order</a>
              </div>
              <div className="bg-green-600  rounded-md px-4 py-2 font-medium md:w-1/2 w-full text-center text-white hover:text-gray-900 hover:bg-green-300 transition-colors duration-200">


                <a href={`https://wa.me/+8801973040204?text=I%20want%20to%20order%20this%20product%20${currentUrl}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-5 ">
                  <IconBrandWhatsappFilled className="w-5 h-5" />
                  WhatsApp Now
                </a>
              </div>

            </div>
            <Separator />
            {/* FAQs Section */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Product Details & FAQs</h2>
              <Accordion type="multiple" className="border rounded-lg">
                {landingPageProduct.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="border-b last:border-b-0"
                  >
                    <AccordionTrigger className="px-4 hover:no-underline text-xl">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-base dark:text-gray-200 text-gray-700 leading-relaxed">
                        {faq.answer.split(",").map((sentence, i, arr) => (
                          <React.Fragment key={i}>
                            {sentence.trim()}
                            {i < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {landingPageProduct.faqs.length === 0 && (
                  <div className="px-4 py-3 text-center text-sm dark:text-gray-200 text-gray-700">
                    No additional information available
                  </div>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});