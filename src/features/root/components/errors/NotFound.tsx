import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col items-center justify-center overflow-x-hidden relative selection:bg-primary/30">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
           .text-glow {
            text-shadow: 0 0 30px color-mix(in srgb, var(--primary), transparent 75%);
        }
        `}
      </style>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full p-4 lg:p-0">
        {/* 404 Text */}
        <h1 className="animate-float text-[140px] md:text-[200px] leading-[0.85] font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-primary via-primary/80 to-primary/50 select-none pb-4 drop-shadow-[0_0_30px_color-mix(in_srgb,var(--primary),transparent_75%)]">
          404
        </h1>

        {/* Title & Description */}
        <div className="mt-8 space-y-4 max-w-lg mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-foreground">
            আপনি যে পেজটি খুঁজছেন তা পাওয়া যায়নি
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            সম্ভবত পেজটি মুছে ফেলা হয়েছে বা ঠিকানা পরিবর্তন করা হয়েছে।
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-10">
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="size-4" />
            আগের পেজে ফিরে যান
          </Button>
        </div>
      </main>
    </div>
  );
}
