import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LandingPageModel } from "@/generated/prisma/models";
import { useForm } from "@tanstack/react-form";
import {
  duplicateLandingPageSchema,
  DuplicateLandingPageType,
} from "../types/landingPageTypes";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createLandingPageServer } from "../actions/server/createLandingPageServer";
import { getLandingPageBySlugServer } from "../actions/server/getLandingPageBySlugServer";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { ActionButton } from "@/components/ui/action-button";
import { useState } from "react";

export default function LandingPageDuplicationDialog({
  landingPageSlug,
  children,
}: {
  landingPageSlug: LandingPageModel["slug"];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: landingPage } = useSuspenseQuery({
    queryKey: ["landingPage", landingPageSlug],
    queryFn: async () =>
      await getLandingPageBySlugServer({ data: { slug: landingPageSlug } }),
  });

  if (!landingPage) {
    router.invalidate();
    return null;
  }

  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: landingPage.name,
      slug: landingPage.slug,
    } satisfies DuplicateLandingPageType,
    validators: {
      onChange: duplicateLandingPageSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createLandingPageServer({
          data: {
            name: value.name,
            slug: value.slug,
            landingPageProducts: landingPage.landingPageProducts.map((lpp) => ({
              productId: lpp.productId,
              description: lpp.description,
              faqs: lpp.faqs,
            })),
            shippingInsideDhaka: landingPage.shippingInsideDhaka,
            shippingOutsideDhaka: landingPage.shippingOutsideDhaka,
          },
        });
        toast.success("Landing page duplicated successfully");
        queryClient.invalidateQueries({ queryKey: ["landingPages"] });
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to duplicate landing page",
        );
      } finally {
        setOpen(false);
      }
      console.log({
        name: value.name,
        slug: value.slug,
        landingPageProducts: landingPage.landingPageProducts,
        shippingInsideDhaka: landingPage.shippingInsideDhaka,
        shippingOutsideDhaka: landingPage.shippingOutsideDhaka,
      });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate {landingPage.name}</DialogTitle>
        </DialogHeader>
        <form
          id="duplicate-landing-page-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(nameField) => {
                const isInvalid =
                  nameField.state.meta.isTouched &&
                  !nameField.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={nameField.name}>Name</FieldLabel>
                    <Input
                      id={nameField.name}
                      name={nameField.name}
                      value={nameField.state.value}
                      onBlur={nameField.handleBlur}
                      onChange={(e) => nameField.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Amon Full Fiber"
                    />
                    {isInvalid && (
                      <FieldError errors={nameField.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="slug">
              {(slugField) => {
                const isInvalid =
                  slugField.state.meta.isTouched &&
                  !slugField.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={slugField.name}>Slug</FieldLabel>
                    <Input
                      id={slugField.name}
                      name={slugField.name}
                      value={slugField.state.value}
                      onBlur={slugField.handleBlur}
                      onChange={(e) => slugField.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="amon-full-fiber"
                    />
                    {isInvalid && (
                      <FieldError errors={slugField.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <ActionButton
              action={() => form.handleSubmit()}
              type="submit"
              form="duplicate-landing-page-form"
            >
              Duplicate
            </ActionButton>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
