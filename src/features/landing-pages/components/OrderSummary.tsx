import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem, useLandingPage } from "../contexts/LandingPageContext";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  IconPackage,
  IconUser,
  IconPhone,
  IconMapPin,
  IconTruck,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { useLandingPageOffer } from "../hooks/useLandingPageOffer";
import { Item, ItemContent } from "@/components/ui/item";
import {
  MIN_ORDER_TOTAL,
  MIN_ORDER_TOTAL_MESSAGE,
  getMinOrderRemainingMessage,
} from "@/features/orders/constants";
import React from "react";

export default function OrderSummary() {
  const { cartItems, customerDetails, getShippingCharge } = useLandingPage();
  const { offer, isThresholdMet } = useLandingPageOffer();
  const subtotal = React.useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + item.quantity * item.product.sellPrice,
        0,
      ),
    [cartItems],
  );
  const shippingCharge = getShippingCharge();
  const isFreeShipping = React.useMemo(
    () => isThresholdMet(subtotal),
    [isThresholdMet, subtotal],
  );
  const finalShippingCharge = isFreeShipping ? 0 : shippingCharge;
  const total = subtotal + finalShippingCharge;
  const isBelowMinimumOrder = total < MIN_ORDER_TOTAL;

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {cartItems.length === 0 ? (
            <Empty className="border rounded-lg p-8">
              <EmptyHeader>
                <EmptyMedia>
                  <IconPackage className="h-12 w-12 text-muted-foreground" />
                </EmptyMedia>
              </EmptyHeader>
              <EmptyContent>
                <EmptyTitle className="text-lg">No Items Added</EmptyTitle>
                <EmptyDescription>
                  Add items to your cart to view order summary.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-muted-foreground">
                Order Items{" "}
                {cartItems.length > 0 && (
                  <Badge variant="secondary">{cartItems.length} item(s)</Badge>
                )}
              </h3>
              {cartItems.map((item) => (
                <OrderSummaryItem key={item.product.id} cartItem={item} />
              ))}
            </div>
          )}

          <Separator />

          {customerDetails && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-muted-foreground tracking-wide">
                Customer Information
              </h3>
              <div className="space-y-2 rounded-lg bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {customerDetails.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IconPhone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {customerDetails.mobileNumber || "N/A"}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <IconMapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="font-medium">
                    {customerDetails.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3" role="region" aria-label="Order breakdown">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium" aria-label={`Subtotal: ${subtotal} Bangladeshi Taka`}>
                <span aria-hidden="true">৳{subtotal}</span>
              </span>
            </div>
            {offer && offer.type === "FREE_SHIPPING" && offer.threshold && (
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted-foreground">Shipping</span>
                <div className="flex items-center gap-2">
                  {isFreeShipping ? (
                    <Badge variant="secondary" className="gap-1" aria-label="Free shipping applied">
                      <IconTruck className="h-3 w-3" aria-hidden="true" />
                      <span aria-hidden="true">Free</span>
                      <span className="sr-only">Free shipping</span>
                    </Badge>
                  ) : (
                    <span className="font-medium" aria-label={`Shipping charge: ${shippingCharge} Bangladeshi Taka`}>
                      <span aria-hidden="true">৳{shippingCharge}</span>
                    </span>
                  )}
                </div>
              </div>
            )}
            {!isFreeShipping &&
              offer &&
              offer.type === "FREE_SHIPPING" &&
              offer.threshold && (
                <Item variant="muted" className="bg-green-700" role="status" aria-live="polite">
                  <ItemContent className="font-semibold">
                    <span aria-hidden="true">Add ৳{offer.threshold - subtotal} more for free shipping!</span>
                    <span className="sr-only">
                      Add {offer.threshold - subtotal} Bangladeshi Taka more to qualify for free shipping
                    </span>
                  </ItemContent>
                </Item>
              )}
            {(!offer || offer.type !== "FREE_SHIPPING") && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium" aria-label={`Shipping charge: ${shippingCharge} Bangladeshi Taka`}>
                  <span aria-hidden="true">৳{shippingCharge}</span>
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary" aria-label={`Total amount: ${total} Bangladeshi Taka`}>
                <span aria-hidden="true">৳{total}</span>
              </span>
            </div>
            {isBelowMinimumOrder && (
              <Item variant="muted" className="bg-orange-100" role="status" aria-live="polite">
                <ItemContent className="font-semibold text-orange-700">
                  <span aria-hidden="true">
                    {MIN_ORDER_TOTAL_MESSAGE}. {getMinOrderRemainingMessage(total)}
                  </span>
                  <span className="sr-only">
                    Minimum order total is {MIN_ORDER_TOTAL} Bangladeshi Taka.
                    Add {MIN_ORDER_TOTAL - total} Bangladeshi Taka more to proceed.
                  </span>
                </ItemContent>
              </Item>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

const OrderSummaryItem = React.memo(function OrderSummaryItem({
  cartItem,
}: {
  cartItem: CartItem;
}) {
  const { landingPage } = useLandingPage();
  const landingPageProduct = landingPage.landingPageProducts.find(
    (item) => item.product.id === cartItem.product.id,
  );
  if (!landingPageProduct) return null;

  const itemTotal = cartItem.quantity * landingPageProduct.product.sellPrice;

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex-1">
        <div className="font-medium text-sm">
          {landingPageProduct.product.name}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            {cartItem.quantity}x
          </Badge>
          <span>৳{landingPageProduct.product.sellPrice}</span>
        </div>
      </div>
      <div className="text-right">
        <span className="font-semibold text-lg">৳{itemTotal}</span>
      </div>
    </div>
  );
});
