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
          <IconBox className="h-5 w-5" />
          Related Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ItemGroup className="grid grid-cols-2 2xl:grid-cols-3 gap-4">
          {productsNotPresentInCart.map((item, index) => (
            <RelatedProductItem
              index={index}
              key={item.product.id}
              api={api}
              item={item}
            />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

function RelatedProductItem({
  index,
  item,
  api,
}: {
  index: number;
  item: LandingPageProductWithTypedFaqs;
  api: CarouselApi;
}) {
  const { addToCart } = useLandingPage();
  return (
    <Item variant="outline">
      <Image
        className="rounded"
        src={item.product.images[0]}
        alt={item.product.name}
        layout="fullWidth"
      />
      <ItemContent className="space-y-4">
        <div className="space-y-1">
          <ItemTitle className="text-base">{item.product.name}</ItemTitle>
          <strong className="text-muted-foreground text-xl">
            ৳{item.product.sellPrice}
          </strong>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => api?.scrollTo(index)}
            asChild
          >
            <a href="#">View</a>
          </Button>
          <Button
            onClick={() => addToCart(item.product, 1)}
            asChild
          >
            <a href="#order-section">Add to Cart</a>
          </Button>
        </div>
      </ItemContent>
    </Item>
  );
}
