import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconCreditCard,
  IconDownload,
  IconMapPin,
  IconPhone,
  IconShoppingCart,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderPDF from "./OrderPDF";
import { Image } from "@unpic/react";
import { toast } from "sonner";

const statusConfig: Record<
  string,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
    color: string;
  }
> = {
  pending: { variant: "secondary", label: "Pending", color: "bg-yellow-500" },
  confirmed: { variant: "outline", label: "Confirmed", color: "bg-blue-500" },
  shipped: { variant: "outline", label: "Shipped", color: "bg-purple-500" },
  delivered: { variant: "default", label: "Delivered", color: "bg-green-500" },
  cancelled: {
    variant: "destructive",
    label: "Cancelled",
    color: "bg-red-500",
  },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function OrderDetails({
  order,
}: {
  order: {
    customer: {
      name: string;
      mobileNumber: string;
      address: string;
    };
    orderItems: ({
      product: {
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        images: string[];
        purchasePrice: number;
        sellPrice: number;
      };
    } & {
      name: string;
      id: number;
      orderId: number;
      productId: number;
      quantity: number;
      price: number;
    })[];
    id: number;
    landingPageId: number | null;
    totalPrice: number;
    shippingRegion: string;
    shippingCharge: number;
    orderStatus: string;
    createdAt: Date;
    updatedAt: Date;
  };
}) {
  const subtotal = order.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const status = statusConfig[order.orderStatus] || {
    variant: "outline" as const,
    label: order.orderStatus,
    color: "bg-gray-500",
  };

  return (
    <section className="max-w-4xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <IconShoppingCart className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Order #{order.id}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.color}/10 border border-${status.color.replace("bg-", "")}/20`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${status.color} animate-pulse`}
                />
                <span className="font-medium text-sm">{status.label}</span>
              </div>
              <PDFDownloadLink
                document={<OrderPDF order={order} />}
                fileName={`order-${order.id}.pdf`}
              >
                {({ loading, error }) => (
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    disabled={loading}
                    onClick={() => {
                      error && toast.error(error.message);
                    }}
                  >
                    <IconDownload className="w-4 h-4 mr-2" />
                    {loading ? "Loading document..." : "Save as PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Items
              </p>
              <p className="text-xl font-bold mt-1">
                {order.orderItems.length}
              </p>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Subtotal
              </p>
              <p className="text-xl font-bold mt-1">
                {formatCurrency(subtotal)}
              </p>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Shipping
              </p>
              <p className="text-xl font-bold mt-1">
                {order.shippingCharge > 0
                  ? formatCurrency(order.shippingCharge)
                  : "Free"}
              </p>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total
              </p>
              <p className="text-xl font-bold text-primary mt-1">
                {formatCurrency(order.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden py-0">
            <CardHeader className="bg-muted/30 py-4 gap-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IconShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {order.orderItems.length}{" "}
                    {order.orderItems.length === 1 ? "product" : "products"} in
                    this order
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 pb-6">
              <div className="divide-y">
                {order.orderItems.map((orderItem) => (
                  <div
                    key={orderItem.name}
                    className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <Image
                        className="rounded-lg object-cover"
                        src={orderItem.product.images[0]}
                        alt={orderItem.product.name}
                        width={72}
                        height={72}
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {orderItem.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {orderItem.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {formatCurrency(orderItem.price)} each
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-lg">
                        {formatCurrency(orderItem.price * orderItem.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="overflow-hidden py-0">
              <CardHeader className="bg-muted/30 py-4 gap-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <IconTruck className="w-5 h-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-lg">Shipping To</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                <div className="flex items-start gap-3">
                  <IconUser className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{order.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconPhone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{order.customer.mobileNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconMapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{order.customer.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden py-0">
              <CardHeader className="bg-muted/30 py-4 gap-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <IconCreditCard className="w-5 h-5 text-green-500" />
                  </div>
                  <CardTitle className="text-lg">Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Method</span>
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="text-sm text-muted-foreground">
                    Total Amount
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
