import { drizzle } from "drizzle-orm/neon-serverless";
import * as authSchema from "./schemas/auth-schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Please configure your environment variable.");
}
export const db = drizzle(databaseUrl, {
  schema: { ...authSchema },
});
