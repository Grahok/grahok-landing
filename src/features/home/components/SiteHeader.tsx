import { Image } from "@unpic/react";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto p-4 flex min-h-14 justify-center items-center gap-4">
        <Image
          className="rounded-xs"
          src="/logo.webp"
          alt="Logo"
          width={50}
          height={50}
          layout="constrained"
        />
      </div>
    </header>
  );
}
