import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLandingPage } from "../contexts/LandingPageContext";
import { createOrderServer } from "@/features/orders/actions/server/createOrderServer";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  IconUser,
  IconPhone,
  IconMapPin,
  IconShoppingBag,
  IconAlertCircle,
  IconCircleCheck,
} from "@tabler/icons-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { sendOrderSuccessMessageServer } from "../actions/server/sendOrderSuccessMessageServer";
import { ActionButton } from "@/components/ui/action-button";
import { sendOrderSuccessMessageAdminServer } from "../actions/server/sendOrderSuccessMessageAdminServer";
import { TShippingRegion } from "@/features/orders/types/orderTypes";
import { useLandingPageOffer } from "../hooks/useLandingPageOffer";

export default function CustomerInformation() {
  const {
    landingPage,
    customerDetails,
    setCustomerDetails,
    cartItems,
    setIsOrderSuccessModalOpen,
    setOrderDetails,
    shippingRegion,
    setShippingRegion,
    getShippingCharge,
  } = useLandingPage();

  const { offer, isThresholdMet } = useLandingPageOffer();

  const isFormValid =
    customerDetails.name &&
    customerDetails.mobileNumber &&
    customerDetails.address &&
    shippingRegion;
  const isCartEmpty = cartItems.length === 0;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.sellPrice,
    0,
  );
  const rawShippingCharge = getShippingCharge();
  const isFreeShipping =
    offer &&
    offer.type === "FREE_SHIPPING" &&
    offer.threshold &&
    isThresholdMet(subtotal);
  const shippingCharge = isFreeShipping ? 0 : rawShippingCharge;
  const totalPrice = subtotal;
  const finalTotal = subtotal + shippingCharge;

  async function handleCheckOut() {
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isCartEmpty) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const order = await createOrderServer({
        data: {
          customer: customerDetails,
          orderItems: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          orderStatus: "pending",
          totalPrice,
          shippingCharge,
          shippingRegion,
          landingPageId: landingPage.id,
        },
      });

      if (order) {
        setOrderDetails({
          orderId: order.id,
          cartItems,
          customerDetails,
          totalAmount: finalTotal,
        });

        toast.success("Order placed successfully");
        setIsOrderSuccessModalOpen(true);
        window.dataLayer.push({
          event: "purchase",
          transaction_id: order.id,
          value: order.totalPrice,
          shipping: order.shippingCharge,
          currency: "BDT",
          contents: order.orderItems.map((orderItem) => ({
            item_id: orderItem.product.id,
            item_name: orderItem.product.name,
            price: orderItem.product.sellPrice,
            quantity: orderItem.quantity,
          })),
        });
        try {
          const { success } = await sendOrderSuccessMessageServer({
            data: {
              orderId: order.id,
              mobileNumber: customerDetails.mobileNumber,
              customerName: customerDetails.name,
            },
          });

          if (!success) {
            toast.error("Failed to send order success message");
          }
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to send order success message",
          );
        }
        try {
          const { success } = await sendOrderSuccessMessageAdminServer({
            data: {
              orderId: order.id,
              mobileNumber: customerDetails.mobileNumber,
              customerName: customerDetails.name,
            },
          });

          if (!success) {
            console.error("Failed to send order success message to admin");
          }
        } catch (error) {
          console.error(
            error instanceof Error
              ? error.message
              : "Failed to send order success message",
          );
        }
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order",
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconUser className="h-5 w-5" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isCartEmpty && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-orange-200">
            <IconAlertCircle className="h-4 w-4 text-orange-600" />
            <p className="text-sm text-orange-600">
              Your cart is empty. Add items to proceed.
            </p>
          </div>
        )}

        <FieldGroup>
          <Field>
            <Label htmlFor="customer-name" className="flex items-center gap-2">
              <IconUser className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="customer-name"
              placeholder="Enter your full name"
              value={customerDetails.name}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, name: e.target.value })
              }
            />
          </Field>

          <Field>
            <Label
              htmlFor="customer-mobile-number"
              className="flex items-center gap-2"
            >
              <IconPhone className="h-4 w-4" />
              Mobile Number
            </Label>
            <Input
              id="customer-mobile-number"
              placeholder="Enter your mobile number"
              value={customerDetails.mobileNumber}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  mobileNumber: e.target.value,
                })
              }
            />
          </Field>

          <Field>
            <Label
              htmlFor="customer-address"
              className="flex items-center gap-2"
            >
              <IconMapPin className="h-4 w-4" />
              Delivery Address
            </Label>
            <Textarea
              id="customer-address"
              placeholder="Enter your complete delivery address"
              rows={3}
              value={customerDetails.address}
              onChange={(e) =>
                setCustomerDetails({
                  ...customerDetails,
                  address: e.target.value,
                })
              }
            />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <Label className="flex items-center gap-2">
              <IconMapPin className="h-4 w-4" />
              Shipping Location (Home Delivery)
            </Label>
            <RadioGroup
              value={shippingRegion}
              onValueChange={(value) =>
                setShippingRegion(value as TShippingRegion)
              }
              className="grid grid-cols-2"
            >
              <FieldLabel htmlFor="inside-dhaka">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Inside Dhaka</FieldTitle>
                    <FieldDescription className="text-base font-medium">
                      ৳{landingPage.shippingInsideDhaka}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="inside-dhaka" id="inside-dhaka" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="outside-dhaka">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Outside Dhaka</FieldTitle>
                    <FieldDescription className="text-base font-medium">
                      ৳{landingPage.shippingOutsideDhaka}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="outside-dhaka" id="outside-dhaka" />
                </Field>
              </FieldLabel>
            </RadioGroup>
          </Field>
        </FieldGroup>
        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            {isFormValid ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <IconCircleCheck className="h-4 w-4" />
                <span>All fields completed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <IconAlertCircle className="h-4 w-4" />
                <span>
                  Please complete all required fields including shipping region
                </span>
              </div>
            )}
          </div>

          <ActionButton
            className="w-full"
            size="lg"
            action={handleCheckOut}
            disabled={!isFormValid || isCartEmpty}
          >
            <IconShoppingBag className="h-4 w-4 mr-2" />
            Place Order • ৳{finalTotal}
          </ActionButton>
        </div>
      </CardContent>
    </Card>
  );
}
