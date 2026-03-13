"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    src: "/IMG_0946.PNG",
    mode: "Dashboard",
    label: "Everything due at a glance",
  },
  {
    src: "/IMG_0966.PNG",
    mode: "Speaking Mode",
    label: "Real-time AI conversation",
  },
  {
    src: "/IMG_0959.PNG",
    mode: "Listening Mode",
    label: "Comprehensible input, scored by AI",
  },
  {
    src: "/IMG_0965.PNG",
    mode: "Learn Mode",
    label: "AI-generated explanations and examples",
  },
  {
    src: "/IMG_0964.PNG",
    mode: "Hanzi Mode",
    label: "Character → pinyin recall",
  },
  {
    src: "/IMG_0963.PNG",
    mode: "Pinyin Mode",
    label: "Sentence construction with AI feedback",
  },
  {
    src: "/IMG_0961.PNG",
    mode: "Constructs Mode",
    label: "Grammar pattern drills, graded by AI",
  },
];

export function AppScreenshotCarousel() {
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent className="-ml-4">
        {slides.map(({ src, mode, label }) => (
          <CarouselItem key={src} className="pl-4 basis-[220px] sm:basis-[240px]">
            <div className="flex flex-col items-center gap-3">
              {/* Phone frame */}
              <div className="relative w-[200px] sm:w-[220px] rounded-[2.25rem] border border-border bg-black p-1.5 shadow-2xl shadow-black/60 ring-1 ring-white/5">
                {/* Dynamic island */}
                <div className="mx-auto mb-1 h-4 w-16 rounded-full bg-black border border-border" />
                {/* Screenshot */}
                <div className="relative overflow-hidden rounded-[1.75rem]" style={{ aspectRatio: "1242/2688" }}>
                  <Image
                    src={src}
                    alt={mode}
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                </div>
                {/* Home indicator */}
                <div className="mt-1 mx-auto h-1 w-16 rounded-full bg-border" />
              </div>

              {/* Label */}
              <div className="text-center">
                <p className="text-xs font-semibold text-foreground">{mode}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex items-center justify-center gap-3 mt-10">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}
