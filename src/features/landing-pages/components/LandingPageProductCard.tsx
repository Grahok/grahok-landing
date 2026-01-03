import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Item, ItemContent } from "@/components/ui/item";
import { LandingPageGetPayload } from "@/generated/prisma/models";
import { Image } from "@unpic/react";

export default function LandingPageProductCard({
  landingPage,
}: {
  landingPage: LandingPageGetPayload<{
    include: {
      landingPageProducts: {
        include: {
          product: true;
        };
      };
    };
  }>;
}) {
  const tempLandingPageProduct = landingPage.landingPageProducts[0];
  return (
    <section className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-12">
      <div className="space-y-4">
        <Image
          src={tempLandingPageProduct.product.images[0]}
          alt={tempLandingPageProduct.product.name}
          className="rounded-lg"
          layout="fullWidth"
        />
        <div className="flex gap-x-2">
          {tempLandingPageProduct.product.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={tempLandingPageProduct.product.name}
              className="rounded"
              height={75}
              width={75}
              layout="constrained"
            />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-5xl font-black">
          {tempLandingPageProduct.product.name}
        </h1>
        <h2 className="text-3xl font-bold">
          ৳{tempLandingPageProduct.product.sellPrice}
        </h2>
        <Item variant="outline">
          <ItemContent>{tempLandingPageProduct.description}</ItemContent>
        </Item>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">FAQs</h2>
          <Accordion
            className="rounded-md border px-4"
            type="multiple"
          >
            {tempLandingPageProduct.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
