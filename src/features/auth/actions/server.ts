import { signInSchema, signUpSchema } from "@/features/types/authTypes";
import { auth } from "@/lib/better-auth/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const signUpServer = createServerFn()
  .inputValidator(signUpSchema)
  .handler(async ({ data }) => {
    const { user } = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      },
    });
    return { user };
  });

export const signInServer = createServerFn()
  .inputValidator(signInSchema)
  .handler(async ({ data }) => {
    const { user } = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      },
    });
    return { user };
  });

export const signOutServer = createServerFn().handler(async () => {
  const { success } = await auth.api.signOut({
    headers: getRequestHeaders(),
  });
  return { success };
});

export const checkIsAuthenticatedServer = createServerFn().handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });
  return { isAuthenticated: !!session };
});

export const getUserServer = createServerFn().handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });
  return { user: session?.user || null };
});
