import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLandingPagesServer } from "../actions/server/getLandingPagesServer";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  IconCopy,
  IconEye,
  IconPackages,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { LandingPageModel } from "@/generated/prisma/models";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { deleteLandingPageServer } from "../actions/server/deleteLandingPageServer";
import { toast } from "sonner";
import LandingPageDuplicationDialog from "./LandingPageDuplicationDialog";

export default function AllLandingPagesTable() {
  const { data: landingPages } = useSuspenseQuery({
    queryKey: ["landingPages"],
    queryFn: getLandingPagesServer,
  });
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sl</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {landingPages.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <IconPackages />
                    </EmptyMedia>
                    <EmptyTitle>No landing pages found</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
          {landingPages.map((landingPage, index) => (
            <TableRow key={landingPage.name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{landingPage.name}</TableCell>
              <TableCell>
                <LandingPagesTableActions landingPage={landingPage} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LandingPagesTableActions({
  landingPage,
}: {
  landingPage: LandingPageModel;
}) {
  const queryClient = useQueryClient();
  async function handleDeleteLandingPage(
    landingPageId: LandingPageModel["id"]
  ) {
    try {
      await deleteLandingPageServer({
        data: { landingPageId },
      });
      toast.success("Landing page deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete landing page"
      );
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["landingPages"] });
    }
  }
  return (
    <div className="flex items-center gap-2">
      <Button size="icon" asChild aria-label="View landing page">
        <Link
          to={`/landing-page/$landingPageSlug`}
          params={{ landingPageSlug: landingPage.slug }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconEye />
        </Link>
      </Button>
      <Button size="icon" asChild aria-label="Edit landing page">
        <Link
          to={`/dashboard/landing-pages/edit/$landingPageSlug`}
          params={{ landingPageSlug: landingPage.slug }}
        >
          <IconPencil />
        </Link>
      </Button>
      <LandingPageDuplicationDialog landingPageSlug={landingPage.slug}>
        <Button size="icon" aria-label="Duplicate landing page">
          <IconCopy />
        </Button>
      </LandingPageDuplicationDialog>

      <ActionButton
        action={async () => await handleDeleteLandingPage(landingPage.id)}
        requireAreYouSure
        variant="destructive"
      >
        <IconTrash />
      </ActionButton>
    </div>
  );
}
