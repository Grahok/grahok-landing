import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBox } from "@tabler/icons-react";
import {
  LandingPageProductWithTypedFaqs,
  useLandingPage,
} from "../contexts/LandingPageContext";
import { Button } from "@/components/ui/button";
import { Image } from "@unpic/react";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { CarouselApi } from "@/components/ui/carousel";

export default function RelatedProducts({ api }: { api: CarouselApi }) {
  const { productsNotPresentInCart } = useLandingPage();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <h2 className="flex items-center gap-2">
            <IconBox className="h-5 w-5" />
            Related Products
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ItemGroup className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productsNotPresentInCart.map((item) => (
            <RelatedProductItem key={item.product.id} api={api} item={item} />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

function RelatedProductItem({
  item,
  api,
}: {
  item: LandingPageProductWithTypedFaqs;
  api: CarouselApi;
}) {
  const {
    landingPage: { landingPageProducts },
    addToCart,
  } = useLandingPage();

  function handleCarouselScroll() {
    const index = landingPageProducts.findIndex(
      (product) => product.product.id === item.product.id,
    );
    api?.scrollTo(index);
  }

  return (
    <Item variant="outline" onClick={handleCarouselScroll}>
      <Image
        className="rounded object-cover"
        src={item.product.images[0]}
        alt={item.product.name}
        loading="lazy"
        background="auto"
        width={400}
        height={400}
      />
      <ItemContent className="space-y-4">
        <div className="space-y-1">
          <ItemTitle className="md:text-xl text-sm">{item.product.name}</ItemTitle>
          <strong className="text-muted-foreground text-xl ">
            ৳{item.product.sellPrice}
          </strong>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* View button just navigates to # */}
          <a href={`#`} className="w-full md:w-1/2 px-2 py-1 border border-gray-300 text-primary dark:text-white rounded-lg flex items-center justify-center text-xl">
            view</a>
            {/* <Button
              className="w-full md:w-1/2"
              variant="outline"
            // onClick={(e) => {
            //   e.stopPropagation(); // prevent card click
            //   window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
            //   window.location.hash = "#";
            // }}
            >
              View
            </Button> */}
          
          {/* Add to Cart button adds item and scrolls to order section */}
          <Button
            className="w-full md:w-1/2"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item.product, 1);
              document.querySelector("#order-section")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Add to Cart
          </Button>
        </div>
      </ItemContent>
    </Item>
  );
}
