import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrdersServer } from "../actions/server/getOrdersServer.ts";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  IconEye,
  IconPackages,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { OrderModel } from "@/generated/prisma/models";
import { Button } from "@/components/ui/button.tsx";
import { ActionButton } from "@/components/ui/action-button.tsx";
import { deleteOrderServer } from "../actions/server/deleteOrderServer.ts";
import { toast } from "sonner";
import { formatDate } from "../utils";

export default function AllOrdersTable() {
  const { data: orders } = useSuspenseQuery({
    queryKey: ["orders"],
    queryFn: getOrdersServer,
  });
  return (
    <div className="border rounded-md">
      <Table className="table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Sl</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Customer Mobile Number</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Shipping Charge</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={8}>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <IconPackages />
                    </EmptyMedia>
                    <EmptyTitle>No orders found</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
          {orders.map((order, index) => (
            <TableRow key={order.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>{order.customer.mobileNumber}</TableCell>
              <TableCell>{order.totalPrice}</TableCell>
              <TableCell>{order.shippingCharge}</TableCell>
              <TableCell>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</TableCell>
              <TableCell>
                <OrdersTableActions order={order} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function OrdersTableActions({ order }: { order: OrderModel }) {
  const queryClient = useQueryClient();
  async function handleDeleteOrder(orderId: OrderModel["id"]) {
    try {
      await deleteOrderServer({
        data: { orderId },
      });
      toast.success("Order deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete order"
      );
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  }
  return (
    <div className="flex items-center gap-2">
      <Button size="icon" asChild aria-label={`View order ${order.id}`}>
        <Link
          to={`/dashboard/orders/view/$orderId`}
          params={{ orderId: order.id }}
        >
          <IconEye />
        </Link>
      </Button>
      <Button size="icon" asChild aria-label={`Edit order ${order.id}`}>
        <Link
          to={`/dashboard/orders/edit/$orderId`}
          params={{ orderId: order.id }}
        >
          <IconPencil />
        </Link>
      </Button>
      <ActionButton
        action={async () => await handleDeleteOrder(order.id)}
        requireAreYouSure
        variant="destructive"
        aria-label={`Delete order ${order.id}`}
      >
        <IconTrash />
      </ActionButton>
    </div>
  );
}
