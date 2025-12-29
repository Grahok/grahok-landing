import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createMetadataGenerator } from "tanstack-meta";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateMetadata = createMetadataGenerator({
  titleTemplate: {
    default: "Grahok Landing",
    template: "%s | Grahok Landing",
  },
});
