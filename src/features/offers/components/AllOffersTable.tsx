import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOffersServer } from "../actions/server/getOffersServer";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  IconTag,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { OfferModel } from "@/generated/prisma/models";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { deleteOfferServer } from "../actions/server/deleteOfferServer";
import { toast } from "sonner";

type OfferWithLandingPages = OfferModel & {
  landingPages: { id: number; name: string; slug: string }[];
};

export default function AllOffersTable() {
  const { data: offers } = useSuspenseQuery({
    queryKey: ["offers"],
    queryFn: getOffersServer,
  });
  const offersWithLandingPages = offers as unknown as OfferWithLandingPages[];
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sl</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Threshold</TableHead>
            <TableHead>Landing Pages</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <IconTag />
                    </EmptyMedia>
                    <EmptyTitle>No offers found</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
          {offersWithLandingPages.map((offer, index) => (
            <TableRow key={offer.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{offer.name}</TableCell>
              <TableCell>{offer.type}</TableCell>
              <TableCell>
                {offer.type === "FREE_SHIPPING" && offer.threshold
                  ? `৳${offer.threshold}`
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {offer.landingPages.slice(0, 2).map((lp) => (
                    <span
                      key={lp.id}
                      className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs"
                    >
                      {lp.name}
                    </span>
                  ))}
                  {offer.landingPages.length > 2 && (
                    <span className="text-muted-foreground text-xs">
                      +{offer.landingPages.length - 2} more
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    offer.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {offer.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>
                <OffersTableActions offer={offer as OfferWithLandingPages} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function OffersTableActions({ offer }: { offer: OfferWithLandingPages }) {
  const queryClient = useQueryClient();
  async function handleDeleteOffer(offerId: number) {
    try {
      await deleteOfferServer({ data: offerId });
      toast.success("Offer deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete offer"
      );
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["offers"] });
    }
  }
  return (
    <div className="flex items-center gap-2">
      <Button size="icon" asChild aria-label={`Edit offer ${offer.id}`}>
        <Link
          to="/dashboard/offers/edit/$offerId"
          params={{ offerId: offer.id }}
        >
          <IconPencil />
        </Link>
      </Button>
      <ActionButton
        action={async () => await handleDeleteOffer(offer.id)}
        requireAreYouSure
        variant="destructive"
        aria-label={`Delete offer ${offer.id}`}
      >
        <IconTrash />
      </ActionButton>
    </div>
  );
}
