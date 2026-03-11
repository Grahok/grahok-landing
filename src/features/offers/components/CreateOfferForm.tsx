import { useForm, useStore } from "@tanstack/react-form";
import { createOrEditOfferSchema, CreateOrEditOfferType } from "../types/offerTypes";
import { createOfferServer } from "../actions/server/createOfferServer";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getLandingPagesServer } from "@/features/landing-pages/actions/server/getLandingPagesServer";
import { useNavigate } from "@tanstack/react-router";

export default function CreateOfferForm() {
  const navigate = useNavigate();
  const { data: landingPages } = useSuspenseQuery({
    queryKey: ["landingPages"],
    queryFn: getLandingPagesServer,
  });
  const form = useForm({
    defaultValues: {
      name: "",
      bannerText: "",
      type: "FREE_SHIPPING" as const,
      threshold: null as number | null,
      isActive: true,
      landingPageIds: [] as number[],
    } as CreateOrEditOfferType,
    validators: {
      onSubmit: createOrEditOfferSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createOfferServer({
          data: value,
        });
        toast.success("Offer Created Successfully");
        navigate({ to: "/dashboard/offers/all" });
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create offer",
        );
      }
    },
  });

  const selectedLandingPageIds = useStore(
    form.store,
    (state) => state.values.landingPageIds,
  );

  return (
    <form
      id="create-offer-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Offer Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Free Shipping Offer"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
              );
            }}
        />

        <form.Field
          name="bannerText"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Banner Text</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Free shipping on orders above ৳500!"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This text will be displayed as a scrolling banner on the landing page
                </p>
              </Field>
            );
          }}
        />

        <form.Field
          name="type"
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Offer Type</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  disabled
                  className="bg-muted"
                />
              </Field>
            );
          }}
        />

        <form.Field
          name="threshold"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Minimum Order Amount (৳)
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  aria-invalid={isInvalid}
                  placeholder="500"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Free shipping will be applied when order total is above this
                  amount
                </p>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />

        <Field>
          <FieldLabel>Select Landing Pages</FieldLabel>
          <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
            {landingPages.length === 0 && (
              <p className="text-muted-foreground">No landing pages found</p>
            )}
            {landingPages.map((lp) => {
              const isSelected = selectedLandingPageIds.includes(lp.id);
              return (
                <div key={lp.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`lp-${lp.id}`}
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        form.setFieldValue("landingPageIds", [
                          ...selectedLandingPageIds,
                          lp.id,
                        ]);
                      } else {
                        form.setFieldValue(
                          "landingPageIds",
                          selectedLandingPageIds.filter((id) => id !== lp.id),
                        );
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`lp-${lp.id}`} className="cursor-pointer">
                    {lp.name}
                  </label>
                </div>
              );
            })}
          </div>
        </Field>

        <form.Field
          name="isActive"
          children={(field) => {
            return (
              <Field>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field.name}
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <FieldLabel htmlFor={field.name} className="!mb-0">
                    Active
                  </FieldLabel>
                </div>
              </Field>
            );
          }}
        />

        <Field orientation="horizontal">
          <Button
            type="reset"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <ActionButton
            type="submit"
            form="create-offer-form"
            action={() => form.handleSubmit()}
          >
            Submit
          </ActionButton>
        </Field>
      </FieldGroup>
    </form>
  );
}
