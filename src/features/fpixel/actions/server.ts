import { createServerFn } from "@tanstack/react-start";

export const trackServerEvent = createServerFn({ method: "POST" })
  .inputValidator((d: { eventName: string; userData: any }) => d)
  .handler(async ({ data }) => {
    // You would call the Meta Conversions API here
    // Example: fetch(`https://graph.facebook.com/v17.0/${PIXEL_ID}/events`, ...)
    console.log(`Server-side tracking: ${data.eventName}`);
    return { success: true };
  });
